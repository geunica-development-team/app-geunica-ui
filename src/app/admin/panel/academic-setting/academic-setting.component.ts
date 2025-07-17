import { Component, inject, ViewChild } from '@angular/core';
import { PanelHeaderComponent } from "../../../components/dashboard/shared-components/panel-header/panel-header.component";
import { TabItem, MenuTabsComponent } from '../../../components/dashboard/menu-tabs/menu-tabs.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TableComponent } from "../../../components/table/table.component";
import { CampusService, dataCampusAll } from '../../services/campus.service';
import { error } from 'console';
import { ModalAddComponent } from "./modals/modal-add/modal-add.component";

@Component({
  selector: 'app-academic-setting',
  imports: [PanelHeaderComponent, MenuTabsComponent, TableComponent, ModalAddComponent],
  templateUrl: './academic-setting.component.html',
  styleUrl: './academic-setting.component.css'
})
export class AcademicSettingComponent {
  private campusService = inject(CampusService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  tabs: TabItem[] = [
    { id: "sedes", label: "Sedes", icon: "fa-solid fa-tents"},
    { id: "niveles", label: "Niveles/Programas", icon: "fa-solid fa-layer-group"},
    { id: "grados", label: "Grados", icon: "fa-solid fa-chart-simple" },
    { id: "secciones", label: "Secciones", icon: "fa-solid fa-users-rectangle" }
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

  //PARA EL FILTRO DE LA TABLA (BUSCADOR)
  applyFilter(event: Event) {
    if (this.campusTable) {
      this.campusTable.filterValue = (
        event.target as HTMLInputElement
      ).value;
      this.campusTable.updateTable();
    }
  }

  onCreatedOrEditedOrDeleted() {
    this.loadCampus();
  }
}
