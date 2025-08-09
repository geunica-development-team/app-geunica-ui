import { Component, inject, ViewChild } from '@angular/core';
import { TableComponent } from '../../../components/table/table.component';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ModalDebtDetailsComponent } from './modal-debt-details/modal-debt-details.component';
import { acceptedInscription, InscriptionService } from '../../services/inscription.service';

@Component({
  selector: 'app-student-users',
  imports: [TableComponent, PanelHeaderComponent, FormsModule, ModalDebtDetailsComponent],
  templateUrl: './student-users.component.html',
  styleUrl: './student-users.component.css'
})
export class StudentUsersComponent {
  private inscriptionService = inject(InscriptionService)
  private router = inject(Router)
  
  ngOnInit() {
    this.loadAcceptedInscriptions();
  }

  @ViewChild("modalDebtDetails") modalDebtDetails?: ModalDebtDetailsComponent

  // FILTROS
  selectedStudentStatus = ""
  selectedDebtStatus = ""
  searchValue = ""

  // ESTADOS DE ESTUDIANTE DISPONIBLES
  studentStatusOptions = [
    { value: "Matriculado", label: "Matriculado" },
    { value: "Condicional", label: "Condicional" },
    { value: "Retirado", label: "Retirado" },
  ]

  // OPCIONES DE FILTRO DE DEUDA
  debtStatusOptions = [
    { value: "con-deuda", label: "Con deuda" },
    { value: "sin-deuda", label: "Sin deuda" },
  ]

  // Columnas de la tabla
  columns = [
    "ID",
    "Estado Estudiante",
    "Estudiante",
    "DNI",
    "Estado Cuenta",
    "Deuda",
    "Último Acceso",
  ]

  // Mapeo para columnas y filas
  columnMappings = {
    ID: "id",
    "Estado Estudiante": "inscriptionState",
    "Estudiante": "fullName",
    DNI: "documentNumber",
    "Estado Cuenta": "status",
    Deuda: "debtStatus",
    "Último Acceso": "lastLoginFormatted",
  }

  rows: any[] = [];
  
  loadAcceptedInscriptions() {
    this.inscriptionService.getAcceptedInscriptions().subscribe({
      next: (inscriptions) => {
        this.rows = inscriptions.map((inscription) => {
          const studentPerson = inscription.student.person;
          const user = studentPerson.user || null; // Primer usuario o null
          
          return {
            id: inscription.id, // ID inscripción
            inscriptionState: inscription.state, // Estado inscripción
            fullName: `${studentPerson.names} ${studentPerson.paternalSurname} ${studentPerson.maternalSurname}`,
            documentNumber: inscription.student.studentCode,
            status: user ? this.getStatusText(user.state) : "-", // Estado de usuario o "-"
            debtStatus: "-", // Aquí pondrías tu lógica de deuda si aplica
            lastLoginFormatted: user && user.lastLogin 
            ? this.formatDate(user.lastLogin) 
            : "-",

            statusClass: this.getStatusClass(user.state),
            studentStatusClass: this.getStudentStatusClass(inscription.state || ""),
            //debtClass: this.getDebtClass(user.student?.levels || []),
            // Información de deuda para filtrado y template
            //hasDebt: this.hasDebt(user.student?.levels || []),
            
            originalData: inscription // por si luego lo necesitas para modal o navegación
          };
        });
      },
      error: (err) => {
        console.error("Error cargando inscripciones aceptadas:", err);
      }
    });
  }
  
  @ViewChild("studentUsersTable") studentUsersTable?: TableComponent
  
  // MÉTODOS DE FILTRADO
  applyFilters() {
    if (this.studentUsersTable) {
      this.studentUsersTable.updateTable()
    }
  }

  applySearchFilter(event: Event) {
    this.searchValue = (event.target as HTMLInputElement).value
    this.applyFilters()
  }
  
  clearFilters() {
    this.selectedStudentStatus = ""
    this.selectedDebtStatus = ""
    this.searchValue = ""
    this.applyFilters()
  }
  
  // LÓGICA DE DEUDA
  hasDebt(levels: any[]): boolean {
    const today = new Date()
    for (const level of levels) {
      if (level.isCurrent && level.payments) {
        for (const payment of level.payments) {
          if (!payment.paid) {
            const dueDate = new Date(payment.dueDate.split("/").reverse().join("-"))
            if (today > dueDate) {
              return true
            }
          }
        }
      }
    }
    return false
  }
  
  getDebtClass(levels: any[]): string {
    return this.hasDebt(levels) ? "debt-status debt-overdue" : "debt-status debt-none"
  }
  
  // MÉTODOS DE FORMATO Y ESTADO
  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }
  
  getStatusText(status: string): string {
    switch (status) {
      case "active":
        return "Activo"
      case "inactive":
        return "Inactivo"
        case "suspended":
          return "Suspendido"
          default:
            return status
          }
        }
        
  getStudentStatusText(status: string): string {
    switch (status) {
      case "enrolled":
        return "Matriculado"
      case "conditional":
        return "Condicional"
      case "graduated":
        return "Graduado"
      case "withdrawn":
        return "Retirado"
      default:
        return status || "-"
    }
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case "active":
        return "badge bg-success"
        case "inactive":
          return "badge bg-secondary"
          case "suspended":
            return "badge bg-danger"
            default:
        return "badge bg-light text-dark"
    }
  }

  getStudentStatusClass(status: string): string {
    switch (status) {
      case "Admitido":
        return "badge bg-success-subtle text-success fw-semibold"
      case "conditional":
        return "badge bg-warning text-dark"
      case "graduated":
        return "badge bg-info"
      case "withdrawn":
        return "badge bg-danger"
      default:
        return "badge bg-light text-dark"
      }
    }
    
    // ACCIONES
    onVerFicha = (row: any) => {
      this.router.navigate(["/admin/panel/estudiantes-matriculados", row.id])
    }
    
    onVerPagos = (row: any) => {
      console.log("Ver pagos del estudiante:", row)
      this.router.navigate(["/admin/panel/estudiantes-matriculados", row.userId], {
        queryParams: { tab: "pagos" },
      })
    }
    
    onVerDeuda = (row: any) => {
      console.log("Ver deuda/pagos del estudiante:", row)
      if (this.modalDebtDetails) {
        this.modalDebtDetails.openModal(row.originalData)
      }
    }
    
  }
  
  //// Filtrar solo usuarios con rol 'student' y procesar los datos
  //get rows() {
  //  return USERS.filter((user) => user.role === "student").map((user) => ({
  //    userId: user.userId,
  //    studentCode: user.student?.studentCode || "-",
  //    fullName: `${user.person.firstName} ${user.person.lastName} ${user.person.middleName}`.trim(),
  //    documentNumber: user.person.documentNumber,
  //    status: this.getStatusText(user.status),
  //    studentStatus: this.getStudentStatusText(user.student?.studentStatus || ""),
  //    debtStatus: "",
  //    lastLoginFormatted: this.formatDate(user.lastLogin),
  //    // Clases CSS para los badges
  //    statusClass: this.getStatusClass(user.status),
  //    studentStatusClass: this.getStudentStatusClass(user.student?.studentStatus || ""),
  //    debtClass: this.getDebtClass(user.student?.levels || []),
  //    // Información de deuda para filtrado y template
  //    hasDebt: this.hasDebt(user.student?.levels || []),
  //    // Mantener referencia al objeto original para el modal
  //    originalData: user,
  //  }))
  //}