import { Component, ViewChild } from '@angular/core';
import { PanelHeaderComponent } from '../../../../components/dashboard/shared-components/panel-header/panel-header.component';

import { MenuTabsComponent, TabItem } from '../../../../components/dashboard/menu-tabs/menu-tabs.component';
import { environment } from '../../../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { TableComponent } from '../../../../components/table/table.component';

@Component({
  selector: 'app-academic-detail',
  imports: [PanelHeaderComponent, MenuTabsComponent, TableComponent],
  templateUrl: './academic-detail.component.html',
  styleUrl: './academic-detail.component.css'
})
export class AcademicDetailComponent {
private baseUrl = environment.apiBase;
constructor(
  private http: HttpClient,
  private route: ActivatedRoute, 
  private router: Router) {}
  userId!: number;
  user!: any;  // reemplace con interfaz si la tienes

  tabs: TabItem[] = [
    { id: "aulas", label: "Aulas", icon: "fas fa-user" },
    { id: "cursos", label: "Cursos", icon: "fas fa-book" },
    { id: "notas", label: "Notas", icon: "fas fa-credit-card" }
  ];
  
  activeTab = "aulas" // Tab activo por defecto
  // Cambiar tab activo
  setActiveTab(tabId: string) {
    this.activeTab = tabId
    // Actualizar URL con query param
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tabId },
      queryParamsHandling: "merge",
    })
  }

    //––– AULAS –––
  @ViewChild('classroomTable') classroomTable?: TableComponent;
  // columnas
  columns = [
    'ID','Nombre','Periodo','Estado',
    'Sede','Nivel','Grado y Sección',
    'Turno','Capacidad'
  ];
  columnMappings = {
    'ID':'id','Nombre':'name','Periodo':'period',
    'Estado':'state','Sede':'campus','Nivel':'level',
    'Grado y Sección':'gradeAndSection','Turno':'shift',
    'Capacidad':'capacityDisplay'
  };

  rows: any[] = [];


  loadClassrooms() {
    this.http.get<any[]>(`${this.baseUrl}/classrooms`)
      .subscribe(aulas => {
        this.rows = aulas.map(a => ({
          id:               a.id,
          name:             a.name,
          period:           a.period?.name ?? '—',
          state:            a.state ?? '—',
          stateClass:       a.state === 'En curso' ? 'badge bg-success-subtle text-success fw-semibold'
                            : a.state === 'Finalizado' ? 'badge bg-danger-subtle text-danger fw-semibold'
                            : 'badge bg-secondary-subtle text-secondary fw-semibold',
          campus:           a.campus?.name ?? '—',
          level:            a.grade?.level?.name ?? '—',
          gradeAndSection:  `${a.grade?.name ?? ''} - ${a.section?.name ?? ''}`.trim(),
          shift:            a.shift,
          capacityDisplay:  `0/${a.capacity} | 0/${a.specialCapacity}`
        }));
        this.classroomTable?.updateTable();
      }, err => console.error('Error cargando aulas', err));
  }

  applyFilter(event: Event) {
    const v = (event.target as HTMLInputElement).value;
    if (this.classroomTable) {
      this.classroomTable.filterValue = v;
      this.classroomTable.updateTable();
    }
  }

  /** Abrir modal “Agregar” */
  openModalAdd(): void {
    //this.modalAddClassroom.openModal();
  }

  /** Abrir modal “Editar” */
  openModalEdit(row: any) {
    if (!isNaN(+row.id)) {
      //this.modalEdit.rowId = +row.id;
      //this.modalEdit.openModal();
    }
  }

  /** Abrir modal “Eliminar” */
  openModalDelete(row: any): void {
    if (!isNaN(+row.id)) {
      //this.modalDelete.rowId = +row.id;
      //this.modalDelete.openModal();
    }
  }

  onCreatedOrEditedOrDeleted() {
    this.loadClassrooms();
  }
  
  // Datos procesados para pagos
  //rows: any[] = []
  totalPaid = 0
  totalPending = 0
  hasDebt = false


  ngOnInit() {
    this.userId = +this.route.snapshot.paramMap.get('id')!;
    this.loadUserView();
    this.loadClassrooms();
  }

  loadUserView() {
    // Asumimos endpoint nuevo que devuelve un solo registro
    this.http
      .get<any>(`${this.baseUrl}/user/employee/${this.userId}`)
      .subscribe(u => this.user = u, 
                 err => console.error('Error cargando usuario', err));
  }



}

