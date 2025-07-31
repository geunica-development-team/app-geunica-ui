import { Component, inject, ViewChild } from '@angular/core';
import { PanelHeaderComponent } from "../../../components/dashboard/shared-components/panel-header/panel-header.component";
import { TabItem, MenuTabsComponent } from '../../../components/dashboard/menu-tabs/menu-tabs.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TableComponent } from "../../../components/table/table.component";
import { CampusService, dataCampusAll } from '../../services/campus.service';
import { ModalAddComponent } from "./modals/modal-add/modal-add.component";
import { dataLevelAll, LevelService } from '../../services/level.service';
import { dataGradeAll, GradeService } from '../../services/grade.service';
import { dataSectionAll, SectionService } from '../../services/section.service';
import { ModalEditComponent } from "./modals/modal-edit/modal-edit.component";
import { ModalDeleteComponent } from './modals/modal-delete/modal-delete.component';
import { dataPeriodAll, PeriodService } from '../../services/period.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../enviroments/environment';

@Component({
  selector: 'app-academic-setting',
  imports: [PanelHeaderComponent, MenuTabsComponent, TableComponent, ModalAddComponent, ModalEditComponent, ModalDeleteComponent],
  templateUrl: './academic-setting.component.html',
  styleUrl: './academic-setting.component.css'
})
export class AcademicSettingComponent {
  private http     = inject(HttpClient);
  private route    = inject(ActivatedRoute);
  private router   = inject(Router);
  private baseUrl  = environment.apiBase;

  tabs: TabItem[] = [
    { id: "sedes", label: "Sedes", icon: "fa-solid fa-tents"},
    { id: "niveles", label: "Niveles/Programas", icon: "fa-solid fa-layer-group"},
    { id: "grados", label: "Grados", icon: "fa-solid fa-chart-simple" },
    { id: "secciones", label: "Secciones", icon: "fa-solid fa-users-rectangle" },
    { id: "periodos", label: "Periodos", icon: "fa-solid fa-calendar" }
  ];

  activeTab = "sedes";

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

  ngOnInit() {
    this.loadCampus();
    this.loadLevels();
    this.loadGrades();
    this.loadSections();
    this.loadPeriods();
  }

  @ViewChild('modalEdit') modalEdit!: ModalEditComponent;

  openModalEdit(row: any) {
    if (row && row.id && !isNaN(row.id)) {
      this.modalEdit.rowId = Number(row.id);
      this.modalEdit.openModal();
    } else {
      console.error('ID inválido:', row.id);
    }
  }

  @ViewChild('modalDelete') modalDelete!: ModalDeleteComponent;

  openModalDelete(row: any) {
    if (row && row.id && !isNaN(row.id)) {
      this.modalDelete.rowId = Number(row.id);
      this.modalDelete.openModal();
    } else {
      console.error('ID inválido:', row.id);
    }
  }



  
  //––– SEDES –––
  @ViewChild('campusTable') campusTable?: TableComponent;
  columnsCampus = ['ID','Nombre','Localización'];
  
  // MAPEO PARA COLUMNAS Y FILAS
  columnMappingsCampus = {'ID': 'id','Nombre': 'name','Localización': 'location'};
  rowsCampus: any[] = [];
  loadCampus() {
    this.http.get<any[]>(`${this.baseUrl}/campus`)
      .subscribe(data => {
        this.rowsCampus = data.map(c=>({
          id:       c.id,
          name:     c.name,
          location: c.location
        }));
        this.campusTable?.updateTable();
      }, e=> console.error(e));
  }

  //––– NIVELES –––
  @ViewChild('levelsTable') levelsTable?: TableComponent;
  columnsLevels = ['ID','Nombre del nivel/programa','Costo'];
  // MAPEO PARA COLUMNAS Y FILAS
  columnMappingsLevels = {'ID': 'id','Nombre del nivel/programa': 'name','Costo': 'cost'};
  rowsLevels: any[] = [];
  loadLevels() {
    this.http.get<any[]>(`${this.baseUrl}/level`)
      .subscribe(data => {
        this.rowsLevels = data.map(l=>({
          id:   l.id,
          name: l.name,
          cost: l.cost
        }));
        this.levelsTable?.updateTable();
      }, e=> console.error(e));
  }

  //––– GRADOS (vista grados) –––
  @ViewChild('gradesTable') gradesTable?: TableComponent;
  // COLUMNAS DE LA TABLA
  columnsGrades = ['ID','Grado','Nivel'];
  // MAPEO PARA COLUMNAS Y FILAS
  columnMappingsGrades = {'ID':'id','Grado':'grado','Nivel':'nivel'};
  rowsGrades: any[] = [];
  loadGrades() {
    this.http.get<any[]>(`${this.baseUrl}/grade/grados`)
      .subscribe(data => {
        this.rowsGrades = data.map(g=>({
          id:     g.id,
          grado:  g.grado,
          nivel:  g.nivel
        }));
        this.gradesTable?.updateTable();
      }, e=> console.error(e));
  }

  //––– SECCIONES –––
  @ViewChild('sectionsTable') sectionsTable?: TableComponent;
  // COLUMNAS DE LA TABLA
  columnsSections = ['ID','Nombre'];
  // MAPEO PARA COLUMNAS Y FILAS
  columnMappingsSections = {'ID': 'id','Nombre': 'name'};
  rowsSections: any[] = [];
  loadSections() {
    this.http.get<any[]>(`${this.baseUrl}/section`)
      .subscribe(data => {
        this.rowsSections = data.map(s=>({
          id:   s.id,
          name: s.name
        }));
        this.sectionsTable?.updateTable();
      }, e=> console.error(e));
  }

  //––– PERIODOS –––
  @ViewChild('periodsTable') periodsTable?: TableComponent;
  // COLUMNAS DE LA TABLA
  columnsPeriods = ['ID','Nombre','Fecha Inicio','Fecha Fin','Estado'];
  // MAPEO PARA COLUMNAS Y FILAS
  columnMappingsPeriods = {'ID': 'id','Nombre': 'name','Fecha Inicio': 
    'start_date','Fecha Fin': 'end_date','Estado': 'stateText'};
  rowsPeriods: any[] = [];
  loadPeriods() {
    this.http.get<any[]>(`${this.baseUrl}/period`)
      .subscribe(data => {
        this.rowsPeriods = data.map(p=>({
          id:         p.id,
          name:       p.name,
          start_date:  p.start_date,
          end_date:    p.end_date,
          state:      p.state,
          stateText:  p.state === 'active' ? 'activo' : 'inactivo',//'En curso' : 'Finalizado'
          stateClass: p.state === 'active' 
                        ? 'badge bg-success-subtle text-success fw-semibold' 
                        : 'badge bg-danger-subtle text-danger fw-semibold'        }));
        this.periodsTable?.updateTable();
      }, e=> console.error(e));
  }


  //PARA EL FILTRO DE LA TABLA (BUSCADOR)
  applyFilter(event: Event) {
    if (this.campusTable) {
      this.campusTable.filterValue = (
        event.target as HTMLInputElement
      ).value;
      this.campusTable.updateTable();
    }
    else if (this.levelsTable) {
      this.levelsTable.filterValue = (
        event.target as HTMLInputElement
      ).value;
      this.levelsTable.updateTable();
    }
    else if (this.gradesTable) {
      this.gradesTable.filterValue = (
        event.target as HTMLInputElement
      ).value;
      this.gradesTable.updateTable();
    }
    else if (this.sectionsTable) {
      this.sectionsTable.filterValue = (
        event.target as HTMLInputElement
      ).value;
      this.sectionsTable.updateTable();
    }
    else if (this.periodsTable) {
      this.periodsTable.filterValue = (
        event.target as HTMLInputElement
      ).value;
      this.periodsTable.updateTable();
    }
  }

  onCreatedOrEditedOrDeleted() {
    switch (this.activeTab) {
      case 'sedes':
        this.loadCampus();
        break;
      case 'niveles':
        this.loadLevels();
        break;
      case 'grados':
        this.loadGrades();
        break;
      case 'secciones':
        this.loadSections();
        break;
      case 'periodos':
        this.loadPeriods();
        break;
    }
  }
}
