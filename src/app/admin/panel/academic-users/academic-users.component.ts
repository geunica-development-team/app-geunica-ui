import { Component, ViewChild } from '@angular/core';
import { PanelHeaderComponent } from "../../../components/dashboard/shared-components/panel-header/panel-header.component";
import { TableComponent } from '../../../components/table/table.component';
import { ModalAddAcademicUserComponentComponent } from './modal-add-academic-user-component/modal-add-academic-user-component.component';
import { ModalEditAcademicUserComponentComponent } from "./modal-edit-academic-user-component/modal-edit-academic-user-component.component";
import { ModalDeleteAcademicUserComponentComponent } from "./modal-delete-academic-user-component/modal-delete-academic-user-component.component";
import { environment } from '../../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-internal-users',
  imports: [PanelHeaderComponent, TableComponent, ModalAddAcademicUserComponentComponent, ModalEditAcademicUserComponentComponent, ModalDeleteAcademicUserComponentComponent],
  templateUrl: './academic-users.component.html',
  styleUrl: './academic-users.component.css'
})
export class AcademicUsersComponent {
  private baseUrl = environment.apiBase;

  @ViewChild('employeeTable') employeeTable?: TableComponent;

  constructor(private http: HttpClient) {}
    // columnas
  columns = [
    'Nombre',
    'Usuario',
    'Rol',
    'Sede',
    'Correo',
    'Documento',
    'Estado'
  ];
  columnMappings = {
    'Nombre':        'full_name_employee',
    'Usuario':       'user_employee',
    'Rol':           'role_employee',
    'Sede':          'campus_employee',
    'Correo':        'email_employee',
    'Documento':     'document_employee',
    'Estado':        'user_state_employee'
  };
  rows: any[] = [];

    ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.http
      .get<any[]>(`${this.baseUrl}/user/employee`)
      .subscribe(data => {
        this.rows = data.map(u => ({
          ...u,
          // Texto para mostrar en la columna “Estado”
          stateText: u.user_state_employee === 'Active' ? 'Activo' : 'Inactivo',
          // Clase CSS para el badge
          stateClass: u.user_state_employee === 'Active'
            ? 'badge bg-success-subtle text-success fw-semibold'
            : 'badge bg-danger-subtle text-danger fw-semibold'
        }));
        this.employeeTable?.updateTable();
      }, err => console.error('Error cargando empleados', err));
  }



  applyFilter(){}
  /*applyFilter(event: Event) {
    const v = (event.target as HTMLInputElement).value;
    if (this.classroomTable) {
      this.classroomTable.filterValue = v;
      this.classroomTable.updateTable();
    }
  }*/

  openModalAdd(): void {}
    /** Abrir modal “Agregar” 
  openModalAdd(): void {
    this.modalAddClassroom.openModal();
  }*/

  openModalEdit(row: any) {}
  /** Abrir modal “Editar” 
  openModalEdit(row: any) {
    if (!isNaN(+row.id)) {
      this.modalEdit.rowId = +row.id;
      this.modalEdit.openModal();
    }
  }*/

  openModalDelete(row: any): void {}
  /** Abrir modal “Eliminar” 
  openModalDelete(row: any): void {
    if (!isNaN(+row.id)) {
      this.modalDelete.rowId = +row.id;
      this.modalDelete.openModal();
    }
  }*/

  onCreatedOrEditedOrDeleted() {}
}
