import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { MenuTabsComponent, TabItem } from '../../../components/dashboard/menu-tabs/menu-tabs.component';
import { environment } from '../../../../enviroments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TableComponent } from '../../../components/table/table.component';
import { ModalAddComponent } from './modals/modal-add/modal-add.component';
import { ModalDeleteComponent } from './modals/modal-delete/modal-delete.component';
import { ModalEditComponent } from './modals/modal-edit/modal-edit.component';

export interface ScheduleRow {
  classroom_id: number;
  classroom_name: string;
  day_of_week: string;
  course_name: string;
  teacher_name: string;
  teacher_specialty: string;
  start_time: string;
  end_time: string;
}

@Component({
  selector: 'app-class-assignment',
  imports: [PanelHeaderComponent, MenuTabsComponent,  ModalDeleteComponent, TableComponent, ModalAddComponent, ModalEditComponent],
  templateUrl: './class-assignment.component.html',
  styleUrl: './class-assignment.component.css'
})
export class ClassAssignmentComponent implements OnInit {
  private http     = inject(HttpClient);
  private route    = inject(ActivatedRoute);
  private router   = inject(Router);
  private baseUrl  = environment.apiBase;

  tabs: TabItem[] = [
    { id: "lunes", label: "Lunes", icon: "fa-solid fa-calendar"},
    { id: "martes", label: "Martes", icon: "fa-solid fa-calendar"},
    { id: "miercoles", label: "Miercoles", icon: "fa-solid fa-calendar" },
    { id: "jueves", label: "Jueves", icon: "fa-solid fa-calendar" },
    { id: "viernes", label: "Viernes", icon: "fa-solid fa-calendar" },
    { id: "sabado", label: "Sabado", icon: "fa-solid fa-calendar" },
    //{ id: "domingo", label: "Domingo", icon: "fa-solid fa-calendar" },
    { id: "alumnos asignados", label: "alumnos asignados", icon: "fa-solid fa-calendar" }
  ];

  activeTab = "lunes";


  @ViewChild('lunesTable')      lunesTable?: TableComponent;
  @ViewChild('martesTable')     martesTable?: TableComponent;
  @ViewChild('miercolesTable')  miercolesTable?: TableComponent;
  @ViewChild('juevesTable')     juevesTable?: TableComponent;
  @ViewChild('viernesTable')    viernesTable?: TableComponent;
  @ViewChild('sabadoTable')    sabadoTable?: TableComponent;

  columns = ['ID','Curso','Docente','Inicio','Fin'];
  columnMappings = {
    'ID':        'schedule_id',
    'Curso':     'course_name',
    'Docente':   'teacher_name',
    'Inicio':    'start_time',
    'Fin':       'end_time'
  };

  rowsByDay: Record<string, ScheduleRow[]> = {};

  // rows para binding
  rowsLunes: ScheduleRow[] = [];
  rowsMartes: ScheduleRow[] = [];
  rowsMiercoles: ScheduleRow[] = [];
  rowsJueves: ScheduleRow[] = [];
  rowsViernes: ScheduleRow[] = [];
  rowsSabado: ScheduleRow[] = [];


  ngOnInit() {
    const classroomId = +this.route.snapshot.paramMap.get('id')!;
    this.http
      .get<ScheduleRow[]>(`${this.baseUrl}/aula/${classroomId}/schedule`)
      .subscribe(rows => {
        //console.log('👀 Schedule rows recibidos:', rows);
        this.groupByDay(rows);
        // ¡Aquí recargamos la pestaña que está activa!
        this.refreshActiveTab();
      }, err => console.error(err));

    this.loadSchedule();
  }

    /** Centraliza la petición, el groupBy y el refresh */
  private loadSchedule() {
    const classroomId = +this.route.snapshot.paramMap.get('id')!;
    this.http
      .get<ScheduleRow[]>(`${this.baseUrl}/aula/${classroomId}/schedule`)
      .subscribe({
        next: rows => {
          this.groupByDay(rows);
          this.refreshActiveTab();
        },
        error: err => console.error(err)
      });
  }

  // Llama al método de carga correspondiente
  private refreshActiveTab() {
    switch (this.activeTab) {
      case 'lunes':      this.loadLunes();      break;
      case 'martes':     this.loadMartes();     break;
      case 'miercoles':  this.loadMiercoles();  break;
      case 'jueves':     this.loadJueves();     break;
      case 'viernes':    this.loadViernes();    break;
      case 'sabado':    this.loadSabado();    break;
      // … si añades Sábado/Domingo...
    }
  }


  private groupByDay(rows: ScheduleRow[]) {
    this.rowsByDay = {
      'lunes': [], 'martes': [], 'miercoles': [],
      'jueves': [], 'viernes':[], 'sabado': [], 'domingo': []
    };
    for (const r of rows) {
      const key = r.day_of_week.toLowerCase();  // convierte "Lunes" → "lunes"
      if (this.rowsByDay[key]) {
        this.rowsByDay[key].push(r);
      }
    }
    // refresca tablas
    this.lunesTable?.updateTable();
    this.martesTable?.updateTable();
    this.miercolesTable?.updateTable();
    this.juevesTable?.updateTable();
    this.viernesTable?.updateTable();
    this.sabadoTable?.updateTable();
  }


  // Métodos de carga vacíos, ya no hacen HTTP
  loadLunes()     { this.rowsLunes      = this.rowsByDay['lunes']; }
  loadMartes()    { this.rowsMartes     = this.rowsByDay['martes']; }
  loadMiercoles() { this.rowsMiercoles  = this.rowsByDay['miercoles']; }
  loadJueves()    { this.rowsJueves     = this.rowsByDay['jueves']; }
  loadViernes()   { this.rowsViernes    = this.rowsByDay['viernes']; }
  loadSabado()   { this.rowsSabado    = this.rowsByDay['sabado']; }

  // … idem Sabado, Domingo


 

  //Alumnos asignados
  @ViewChild('AlumnosAsignadosTable') alumnosAsignadosTable?: TableComponent;
  columnsAlumnosAsignados = ['ID','Nombre','Apellidos','Codigo'];
  // MAPEO PARA COLUMNAS Y FILAS
  columnMappingsAlumnosAsignados = {'ID': 'id','Nombre': 'name','Apellidos': 'Surnames'
    ,'Codigo Estudiante': 'code' };
  rowsAlumnosAsignados: any[] = [];
  loadAlumnosAsignados() {}


  // Cambiar tab activo

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
    this.refreshActiveTab();
  }

  //PARA EL FILTRO DE LA TABLA (BUSCADOR)
  applyFilter(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    const tableMap: Record<string, TableComponent | undefined> = {
      'Lunes': this.lunesTable,
      'Martes': this.martesTable,
      'Miercoles': this.miercolesTable,
      'Jueves': this.juevesTable,
      'Viernes': this.viernesTable,
      'Sabado': this.sabadoTable
    };
    const tbl = tableMap[this.activeTab];
    if (tbl) {
      tbl.filterValue = val;
      tbl.updateTable();
    }
  }

    //––– Acciones editar / borrar (idénticas para todas)
  @ViewChild('modalEdit') modalEdit!: ModalEditComponent;
  @ViewChild('modalDelete') modalDelete!: ModalDeleteComponent;
  // en ClassAssignmentComponent
  openModalEdit(row: any) {
    console.log('⚡ openModalEdit disparado con row:', row);
    const scheduleId = +row.schedule_id;
    if (isNaN(scheduleId)) return;
    this.modalEdit.data      = row;
    this.modalEdit.activeTab = this.activeTab;
    this.modalEdit.openModal();
  }

    testOpenEdit() {
    // Borra cualquier dato previo
    this.modalEdit.data = {
      schedule_id:    0,
      course_id:      0,
      teacher_id:     0,
      start_time:     '',
      end_time:       '',
      teacher_specialty: ''
    };
    this.modalEdit.openModal();
  }

  openModalDelete(row: any) {
    const scheduleId = +row.schedule_id;
    if (isNaN(scheduleId)) return;
    this.modalDelete.rowId     = scheduleId;
    this.modalDelete.activeTab = this.activeTab;
    this.modalDelete.openModal();
  }

  onCreatedOrEditedOrDeleted() {
    console.log("Evento de recarga ejecutado");
    this.loadSchedule();
  }

}
