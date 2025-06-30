import { Component, ViewChild } from '@angular/core';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { TableComponent } from '../../../components/table/table.component';
import { User } from '../../services/users.service';

@Component({
  selector: 'app-users',
  imports: [PanelHeaderComponent, TableComponent],
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
  'ID': 'id',
  'Nombre': 'name',
  'Rol': 'rol',
  'DNI': 'dni',
  'Teléfono': 'phone',
  'Correo': 'email',
  'Último acceso': 'last_login',
  'Estado': 'state'
  };

  rows: User[] = [
  { id: '01', name: 'Ana Lucía Quispe', rol: 'Estudiante', dni: '74639201', phone: '987654321', email: 'ana.quispe@gmail.com', last_login: '26/06/2025', state: 'Activo' },
  { id: '02', name: 'Carlos Gómez', rol: 'Docente', dni: '70582913', phone: '956123789', email: 'cgomez@colegio.edu.pe', last_login: '-', state: 'Activo' },
  { id: '03', name: 'María Fernanda Rojas', rol: 'Estudiante', dni: '72154678', phone: '951236487', email: 'maria.rojas@hotmail.com', last_login: '-', state: 'Activo' },
  { id: '04', name: 'Luis Alberto Huamán', rol: 'Administrador', dni: '73091452', phone: '998745632', email: 'lhuaman@colegio.edu.pe', last_login: '-', state: 'Activo' },
  { id: '05', name: 'Daniela Paredes', rol: 'Estudiante', dni: '74839015', phone: '964532178', email: 'daniparedes@gmail.com', last_login: '-', state: 'Activo' },
  { id: '06', name: 'Javier Salazar', rol: 'Docente', dni: '70987634', phone: '989213546', email: 'jsalazar@colegio.edu.pe', last_login: '-', state: 'Activo' },
  { id: '07', name: 'Luciana Torres', rol: 'Estudiante', dni: '71563489', phone: '977654123', email: 'lucitorres@yahoo.com', last_login: '-', state: 'Activo' },
  { id: '08', name: 'Renzo Vilchez', rol: 'Estudiante', dni: '73829471', phone: '945216783', email: 'renzovil@gmail.com', last_login: '-', state: 'Activo' },
  { id: '09', name: 'Carmen Flores', rol: 'Administradora', dni: '70012839', phone: '912345678', email: 'cflores@colegio.edu.pe', last_login: '-', state: 'Activo' },
  { id: '10', name: 'Mateo Lévano', rol: 'Estudiante', dni: '72813465', phone: '956234871', email: 'mateo.levano@gmail.com', last_login: '-', state: 'Activo' },
  { id: '11', name: 'Fiorella Chávez', rol: 'Docente', dni: '73428905', phone: '981236745', email: 'fchavez@colegio.edu.pe', last_login: '-', state: 'Activo' },
  { id: '12', name: 'Sofía Ñaupari', rol: 'Estudiante', dni: '74738291', phone: '987321654', email: 'sofi.na@outlook.com', last_login: '-', state: 'Activo' },
  { id: '13', name: 'José Luis Aquino', rol: 'Docente', dni: '70384921', phone: '943217856', email: 'jlaquino@colegio.edu.pe', last_login: '-', state: 'Activo' },
  { id: '14', name: 'Valeria Ramos', rol: 'Estudiante', dni: '71920487', phone: '974563218', email: 'valramos@gmail.com', last_login: '-', state: 'Activo' },
  { id: '15', name: 'Andrea Maldonado', rol: 'Estudiante', dni: '72301847', phone: '982134765', email: 'andreamal@hotmail.com', last_login: '-', state: 'Activo' }
];

  //APLICAR FILTRO EN LA TABLA
  @ViewChild('assignmentsTable') assignmentsTable?: TableComponent;

  applyFilter(event: Event) {
    if (this.assignmentsTable) {
      this.assignmentsTable.filterValue = (
        event.target as HTMLInputElement
      ).value;
      this.assignmentsTable.updateTable();
    }
  }
}
