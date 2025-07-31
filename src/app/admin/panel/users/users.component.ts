import { Component, ViewChild } from '@angular/core';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { TableComponent } from '../../../components/table/table.component';
import { User } from '../../services/users.service';
import { ModalAddUserComponent } from './modal-add-user/modal-add-user.component';
import { ModalEditUserComponent } from "./modal-edit-user/modal-edit-user.component";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../enviroments/environment';

interface UserView {
  id:             number;
  nombre:         string;
  rol:            string;
  dni:            string;
  telefono:       string;
  correo:         string;
  ultimo_acceso:  string;
  estado:         string;
}

@Component({
  selector: 'app-users',
  imports: [PanelHeaderComponent, TableComponent, ModalAddUserComponent, ModalEditUserComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  //TAREAS EN TABLA
  // COLUMNAS DE LA TABLA
  columns = [
  'ID',
  'Nombre',
  'Rol',
  'DNI',
  'Teléfono',
  'Correo',
  'Último acceso',
  'Estado'
  ];
  
  // MAPEO PARA COLUMNAS Y FILAS
  columnMappings = {
  'ID':            'id',
  'Nombre':        'nombre',
  'Rol':           'rol',
  'DNI':           'dni',
  'Teléfono':      'telefono',
  'Correo':        'correo',
  'Último acceso': 'ultimo_acceso',
  'Estado':        'estado'
};

  constructor(private http: HttpClient) {}

  rows: UserView[] = [];

  @ViewChild('usersTable') usersTable?: TableComponent;
  
  //MODAL EDITAR USUARIO
  @ViewChild('modalEditUser') modalEditUser!: ModalEditUserComponent;

  ngOnInit() {
    // 1) fetch directo al backend
    this.http
      .get<UserView[]>(`${environment.apiBase}/user/usuarios`)
      .subscribe({
        next: data => {
          this.rows = data;
          // 2) refresca la tabla si implementa filtrado interno
          this.usersTable?.updateTable();
        },
        error: err => {
          console.error('Error cargando usuarios', err);
        }
      });
  }

  openModalEditUser(row: any) {
    if (this.modalEditUser) {
        this.modalEditUser.openModal(row);
    }
  }
  onEditUser = (row: User) => {
    console.log('Crear credenciales:', row);
    this.openModalEditUser(row);
  }

  //APLICAR FILTRO EN LA TABLA

  applyFilter(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    if (this.usersTable) {
      this.usersTable.filterValue = val;
      this.usersTable.updateTable();
    }
  }
}
