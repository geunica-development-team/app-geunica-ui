import { Component, inject, ViewChild } from '@angular/core';
import { PanelHeaderComponent } from "../../../components/dashboard/shared-components/panel-header/panel-header.component";
import { TableComponent } from "../../../components/table/table.component";
import { dataUserAll, UserService } from '../../services/user.service';
import { ModalAddUserComponent } from "./modal-add-user/modal-add-user.component";
import { ModalEditUserComponent } from './modal-edit-user/modal-edit-user.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-internal-users',
  imports: [FormsModule, PanelHeaderComponent, TableComponent, ModalAddUserComponent, ModalEditUserComponent],
  templateUrl: './internal-users.component.html',
  styleUrl: './internal-users.component.css'
})
export class InternalUsersComponent {
  private userService = inject(UserService)
  
  ngOnInit() {
    this.loadInternalUsers();
  }

  @ViewChild('modalEditInternalUser') modalEditInternalUser!: ModalEditUserComponent;
  openModalEditInternalUser(row: any) {
    if (row && row.id && !isNaN(row.id)) {
      this.modalEditInternalUser.rowId = Number(row.id);
      this.modalEditInternalUser.openModal();
    } else {
      console.error('ID inválido:', row.id);
    }
  }

  // COLUMNAS DE LA TABLA
  columns = [
  'ID',
  'Nombre',
  'Rol',
  'Usuario',
  'Sede',
  'Correo',
  'Estado Cuenta',
  'Último acceso'
  ];
  
  // MAPEO PARA COLUMNAS Y FILAS
  columnMappings = {
  'ID': 'id',
  'Nombre': 'fullName',
  'Rol': 'role',
  'Usuario': 'user',
  'Sede': 'campus',
  'Correo': 'email',
  'Estado Cuenta': 'state',
  'Último acceso': 'lastLogin'
  };

  rows: dataUserAll[] = [];

  @ViewChild('internalUsersTable') internalUsersTable?: TableComponent;

  loadInternalUsers() {
    this.userService.getAllUsers().subscribe({
      next:(user) => {
        //ESTO SOLO DEBE MOSTRAR LOS USUARIOS INTERNOS, PERO DE MOMENTO SERÁN TODOS LOS USUARIOS
        this.rows = user.filter((users: any) =>
          ['admin', 'psychologist', 'teacher', 'student'].includes(users.role?.role)
        )
        .map((user: any): dataUserAll & {
          statusClass: string
        } => ({
          id: user.id,
          fullName: `${user.person?.names} ${user.person?.paternalSurname} ${user.person?.maternalSurname}`,
          role: this.getRoleText(user.role?.role),
          user: user.user,
          campus: user.campus?.name,
          email: user.person?.email,
          state: this.getStateText(user.state),
          statusClass: this.getStateClass(user.state),
          lastLogin: this.formatDate(user.lastLogin)
        }));

        if (this.internalUsersTable) {
          this.internalUsersTable.updateTable();
        }
      },
      error: (error) => {
        console.error('Error al cargar la lista de usuarios internos', error)
      }
    })
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

  getStateText(status: string): string {
    switch (status) {
      case "active":
        return "Activo"
      case "inactive":
        return "Inactivo"
      default:
        return status
    }
  }

  getStateClass(status: string): string {
    switch (status) {
      case "active":
        return "badge bg-success"
      case "inactive":
        return "badge bg-secondary"
      default:
        return "badge bg-light text-dark"
    }
  }

  //FILTROS
  userStatus = 'state';

  selectedUserStatus = ""
  selectedRole = ""
  searchValue = ""
  
  // ESTADOS DE ESTUDIANTE DISPONIBLES
  userStatusOptions = [
    { value: "Activo", label: "Activo" },
    { value: "Inactivo", label: "Inactivo" }
  ]

  roleOptions = [
    { value: "Administrador", label: "Administrador" },
    { value: "Estudiante", label: "Estudiante" },
    { value: "Docente", label: "Docente" },
    { value: "Psicólogo/a", label: "Psicólogo/a" }
  ]

  
  applyFilters() {
    if (this.internalUsersTable) {
      this.internalUsersTable.updateTable()
    }
  }

  applySearchFilter(event: Event) {
    this.searchValue = (event.target as HTMLInputElement).value
    this.applyFilters()
  }

  clearFilters() {
    this.selectedUserStatus = ""
    this.selectedRole = ""
    this.searchValue = ""
    this.applyFilters()
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'Sin registro';

     try {
      const date = new Date(dateString);

      // Ajustar explícitamente a la zona horaria de Lima
      const formatter = new Intl.DateTimeFormat('es-PE', {
        timeZone: 'America/Lima',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      const parts = formatter.formatToParts(date).reduce((acc, part) => {
        if (part.type !== 'literal') acc[part.type] = part.value;
        return acc;
      }, {} as Record<string, string>);

      return `${parts['day']}/${parts['month']}/${parts['year']} ${parts['hour']}:${parts['minute']}`;
    } catch {
      return 'Fecha inválida';
    }
  }

  onCreatedOrEditedOrDeleted() {
    this.loadInternalUsers();
  }
}
