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

@Component({
  selector: 'app-academic-setting',
  imports: [PanelHeaderComponent, MenuTabsComponent, TableComponent, ModalAddComponent, ModalEditComponent, ModalDeleteComponent],
  templateUrl: './academic-setting.component.html',
  styleUrl: './academic-setting.component.css'
})
export class AcademicSettingComponent {
  private campusService = inject(CampusService);
  private levelService = inject(LevelService);
  private gradeService = inject(GradeService);
  private sectionService = inject(SectionService);
  private periodService = inject(PeriodService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

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

  //PARA TABLA SEDES:
  // COLUMNAS DE LA TABLA
  columnsCampus = [
  'ID',
  'Nombre',
  'Localización'
  ];
  
  // MAPEO PARA COLUMNAS Y FILAS
  columnMappingsCampus = {
  'ID': 'id',
  'Nombre': 'name',
  'Localización': 'location'
  };

  rowsCampus: dataCampusAll[] = [];

  @ViewChild('campusTable') campusTable?: TableComponent;

  loadCampus() {
    this.campusService.getAllCampus().subscribe({
      next:(campus) => {
        this.rowsCampus = campus.map((campus: any): dataCampusAll => ({
          id: campus.id,
          name: campus.name,
          location: campus.location
        }));
        if (this.campusTable) {
          this.campusTable.updateTable();
        }
      },
        error: (error) => {
          console.error('Error al cargar la lista de sedes: ', error);
        }
    });
  }

  //PARA TABLA NIVELES:
  // COLUMNAS DE LA TABLA
  columnsLevels = [
  'ID',
  'Nombre del nivel/programa',
  'Costo'
  ];
  
  // MAPEO PARA COLUMNAS Y FILAS
  columnMappingsLevels = {
  'ID': 'id',
  'Nombre del nivel/programa': 'name',
  'Costo': 'cost'
  };

  rowsLevels: dataLevelAll[] = [];

  @ViewChild('levelsTable') levelsTable?: TableComponent;

  loadLevels() {
    this.levelService.getAllLevels().subscribe({
      next:(level) => {
        this.rowsLevels = level.map((level: any): dataLevelAll => ({
          id: level.id,
          name: level.name,
          cost: level.cost
        }));
        if (this.levelsTable) {
          this.levelsTable.updateTable();
        }
      },
        error: (error) => {
          console.error('Error al cargar la lista de niveles/programas: ', error);
        }
    });
  }

  //PARA TABLA GRADOS:
  // COLUMNAS DE LA TABLA
  columnsGrades = [
  'ID',
  'Grado',
  'Nivel'
  ];
  
  // MAPEO PARA COLUMNAS Y FILAS
  columnMappingsGrades = {
  'ID': 'id',
  'Grado': 'name',
  'Nivel': 'level'
  };

  rowsGrades: dataGradeAll[] = [];

  @ViewChild('gradesTable') gradesTable?: TableComponent;

  loadGrades() {
    this.gradeService.getAllGrades().subscribe({
      next:(grade) => {
        this.rowsGrades = grade.map((grade: any): dataGradeAll => ({
          id: grade.id,
          name: grade.name,
          level: grade.level.name
        }));
        if (this.gradesTable) {
          this.gradesTable.updateTable();
        }
      },
        error: (error) => {
          console.error('Error al cargar la lista de niveles/programas: ', error);
        }
    });
  }

  //PARA TABLA SECCIONES:
  // COLUMNAS DE LA TABLA
  columnsSections = [
  'ID',
  'Nombre'
  ];
  
  // MAPEO PARA COLUMNAS Y FILAS
  columnMappingsSections = {
  'ID': 'id',
  'Nombre': 'name'
  };

  rowsSections: dataSectionAll[] = [];

  @ViewChild('sectionsTable') sectionsTable?: TableComponent;

  loadSections() {
    this.sectionService.getAllSections().subscribe({
      next:(section) => {
        this.rowsSections = section.map((section: any): dataSectionAll => ({
          id: section.id,
          name: section.name
        }));
        if (this.sectionsTable) {
          this.sectionsTable.updateTable();
        }
      },
        error: (error) => {
          console.error('Error al cargar la lista de niveles/programas: ', error);
        }
    });
  }

  //PARA TABLA PERIODOS:
  // COLUMNAS DE LA TABLA
  columnsPeriods = [
  'ID',
  'Nombre',
  'Fecha Inicio',
  'Fecha Fin',
  'Estado'
  ];
  
  // MAPEO PARA COLUMNAS Y FILAS
  columnMappingsPeriods = {
  'ID': 'id',
  'Nombre': 'name',
  'Fecha Inicio': 'startDate',
  'Fecha Fin': 'endDate',
  'Estado': 'stateText'
  };

  rowsPeriods: dataSectionAll[] = [];

  @ViewChild('periodsTable') periodsTable?: TableComponent;

  loadPeriods() {
    this.periodService.getAllPeriods().subscribe({
      next:(period) => {
        this.rowsPeriods = period.map((period: any): dataPeriodAll & { stateText: string, stateClass: string } => ({
          id: period.id,
          name: period.name,
          startDate: period.startDate,
          endDate: period.endDate,
          state: period.state === true,
          stateText: period.state === true ? 'En curso': 'Finalizado',
          stateClass: period.state === true ? 'badge bg-success-subtle text-success fw-semibold' : 'badge bg-danger-subtle text-danger fw-semibold'
        }));
        if (this.periodsTable) {
          this.periodsTable.updateTable();
        }
      },
        error: (error) => {
          console.error('Error al cargar la lista de niveles/programas: ', error);
        }
    });
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
