import { Component, inject, ViewChild } from '@angular/core';
import { PanelHeaderComponent } from "../../../components/dashboard/shared-components/panel-header/panel-header.component";
import { MenuTabsComponent, TabItem } from "../../../components/dashboard/menu-tabs/menu-tabs.component";
import { TableComponent } from "../../../components/table/table.component";
import { ModalAddComponent } from "../academic-setting/modals/modal-add/modal-add.component";
import { ModalEditComponent } from "../academic-setting/modals/modal-edit/modal-edit.component";
import { ModalDeleteComponent } from "../academic-setting/modals/modal-delete/modal-delete.component";
import { CampusService, dataCampusAll } from '../../services/campus.service';
import { ActivatedRoute, Router } from '@angular/router';
import { dataRoleAll, RoleService } from '../../services/role.service';

@Component({
  selector: 'app-system-setting',
  imports: [PanelHeaderComponent, MenuTabsComponent, TableComponent, ModalAddComponent, ModalEditComponent, ModalDeleteComponent],
  templateUrl: './system-setting.component.html',
  styleUrl: './system-setting.component.css'
})
export class SystemSettingComponent {
  private campusService = inject(CampusService);
  private roleService = inject(RoleService);  
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  tabs: TabItem[] = [
    { id: "sedes", label: "Sedes", icon: "fa-solid fa-tents"},
    { id: "roles", label: "Roles", icon: "fa-solid fa-users" }
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
    this.route.queryParams.subscribe(params => {
      const tabParam = params['tab'];
      if (tabParam && this.tabs.some(tab => tab.id === tabParam)) {
        this.activeTab = tabParam;
      }
    });
    this.loadCampus();
    this.loadRoles();
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

  //PARA TABLA ROLES:
  // COLUMNAS DE LA TABLA
  columnsRoles = [
  'ID',
  'Rol',
  'Descripción'
  ];
  
  // MAPEO PARA COLUMNAS Y FILAS
  columnMappingsRoles = {
  'ID': 'id',
  'Rol': 'role',
  'Descripción': 'description'
  };

  rowsRoles: dataRoleAll[] = [];

  @ViewChild('rolesTable') rolesTable?: TableComponent;

  loadRoles() {
    this.roleService.getAllRoles().subscribe({
      next:(role) => {
        this.rowsRoles = role.map((role: any): dataRoleAll => ({
          id: role.id,
          role: this.getRoleText(role.role),
          description: role.description
        }));
        if (this.rolesTable) {
          this.rolesTable.updateTable();
        }
      },
        error: (error) => {
          console.error('Error al cargar la lista de roles: ', error);
        }
    });
  }

  getRoleText(role: string): string {
    switch (role) {
      case "admin":
        return "Administrador"
      case "student":
        return "Estudiante"
      case "teacher":
        return "Docente"
      case "psychologist":
        return "Psicólogo/a"
      default:
        return role
    }
  }

  //PARA EL FILTRO DE LA TABLA (BUSCADOR)
  applyFilter(event: Event) {
    if (this.campusTable) {
      this.campusTable.filterValue = (
        event.target as HTMLInputElement
      ).value;
      this.campusTable.updateTable();
    }
    else if (this.rolesTable) {
      this.rolesTable.filterValue = (
        event.target as HTMLInputElement
      ).value;
      this.rolesTable.updateTable();
    }
  }

  onCreatedOrEditedOrDeleted() {
    switch (this.activeTab) {
      case 'sedes':
        this.loadCampus();
        break;
      case 'roles':
        this.loadRoles();
        break;
    }
  }
}
