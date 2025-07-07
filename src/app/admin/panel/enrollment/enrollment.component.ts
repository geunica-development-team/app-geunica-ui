import { Component, ViewChild } from '@angular/core';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { TableEnrollmentComponent } from '../admin-component/table-enrollment/table-enrollment.component';
import { AssignGroupData, Enrollment } from '../../services/enrollment.service';
import { ModalContinueRegistrationComponent } from './modal-continue-registration/modal-continue-registration.component';
import { ModalMarkPaymentComponent } from './modal-mark-payment/modal-mark-payment.component';
import { ModalDeleteEnrollmentComponent } from './modal-delete-enrollment/modal-delete-enrollment.component';
import { ModalAddEnrollmentComponent } from './modal-add-enrollment/modal-add-enrollment.component';
import { ModalReadEnrollmentComponent } from './modal-read-enrollment/modal-read-enrollment.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-enrollment',
  imports: [PanelHeaderComponent, TableEnrollmentComponent, ModalContinueRegistrationComponent, ModalMarkPaymentComponent, ModalDeleteEnrollmentComponent, ModalAddEnrollmentComponent, ModalReadEnrollmentComponent, FormsModule],
  templateUrl: './enrollment.component.html',
  styleUrl: './enrollment.component.css'
})
export class EnrollmentComponent {
  @ViewChild("modalContinueRegistration") modalContinueRegistration?: ModalContinueRegistrationComponent
  @ViewChild("modalMarkPayment") modalMarkPayment?: ModalMarkPaymentComponent
  @ViewChild("modalDeleteEnrollment") modalDeleteEnrollment?: ModalDeleteEnrollmentComponent
  @ViewChild("modalReadEnrollment") modalReadEnrollment?: ModalReadEnrollmentComponent

  // COLUMNAS DE LA TABLA
  columns = ["ID", "Estudiante", "Nivel Postulación", "Fecha", "Estado Inscripción", "Evaluación Resultado", "Ticket"]

  // MAPEO PARA COLUMNAS Y FILAS
  columnMappings = {
    ID: "id",
    Estudiante: "student",
    "Nivel Postulación": "application_level",
    Fecha: "date",
    "Estado Inscripción": "state",
    "Evaluación Resultado": "eval_result",
    Ticket: "ticket",
  }

  // FILTROS
  selectedStatus = ""
  searchValue = ""

  // ESTADOS DISPONIBLES
  enrollmentStatuses = [
    { value: "Pendiente", label: "Pendiente" },
    { value: "Evaluación en proceso", label: "Evaluación en proceso" },
    { value: "Evaluado", label: "Evaluado" },
    { value: "Rechazado", label: "Rechazado" },
    { value: "Pago pendiente", label: "Pago pendiente" },
    { value: "Matriculado", label: "Matriculado" },
  ]

  rows: Enrollment[] = [
    {
      id: 1,
      student: "Lucía Fernández",
      application_level: "Primaria",
      date: "2025-05-14",
      state: "Pendiente",
      eval_result: "-",
      ticket: "-",
    },
    {
      id: 2,
      student: "Carlos Pérez",
      application_level: "Primaria",
      date: "2025-05-20",
      state: "Evaluación en proceso",
      eval_result: "-",
      ticket: "-",
    },
    {
      id: 3,
      student: "María González",
      application_level: "Primaria",
      date: "2025-06-01",
      state: "Evaluado",
      eval_result: "Sin condición",
      ticket: "-",
    },
    {
      id: 4,
      student: "José Ramírez",
      application_level: "Primaria",
      date: "2025-06-10",
      state: "Evaluado",
      eval_result: "Con condición",
      ticket: "-",
    },
    {
      id: 5,
      student: "Ana López",
      application_level: "Primaria",
      date: "2025-06-15",
      state: "Pendiente",
      eval_result: "-",
      ticket: "-",
    },
    {
      id: 6,
      student: "Luis Torres",
      application_level: "Primaria",
      date: "2025-06-18",
      state: "Rechazado",
      eval_result: "Con condición",
      ticket: "-",
    },
    {
      id: 7,
      student: "Camila Rojas",
      application_level: "Primaria",
      date: "2025-06-22",
      state: "Pago pendiente",
      eval_result: "Con condición",
      ticket: "Pendiente",
    },
    {
      id: 8,
      student: "Miguel Castro",
      application_level: "Primaria",
      date: "2025-06-25",
      state: "Matriculado",
      eval_result: "Sin condición",
      ticket: "Pagado",
    },
    {
      id: 9,
      student: "Valentina Mendoza",
      application_level: "Primaria",
      date: "2025-06-26",
      state: "Evaluación en proceso",
      eval_result: "-",
      ticket: "-",
    },
    {
      id: 10,
      student: "Diego Silva",
      application_level: "Primaria",
      date: "2025-06-27",
      state: "Pendiente",
      eval_result: "-",
      ticket: "-",
    },
  ]

  @ViewChild("enrollmentTable") enrollmentTable?: TableEnrollmentComponent

  // FILTROS
  applyFilters() {
    if (this.enrollmentTable) {
      this.enrollmentTable.updateTable()
    }
  }

  applySearchFilter(event: Event) {
    this.searchValue = (event.target as HTMLInputElement).value
    this.applyFilters()
  }

  clearFilters() {
    this.selectedStatus = ""
    this.searchValue = ""
    this.applyFilters()
  }

  // MODALES
  openModalContinueRegistration(row: any) {
    if (this.modalContinueRegistration) {
      this.modalContinueRegistration.openModal(row)
    }
  }

  onContinueRegistration = (row: Enrollment) => {
    console.log("Continuar con matrícula:", row)
    this.openModalContinueRegistration(row)
  }

  openModalMarkPayment(row: any) {
    if (this.modalMarkPayment) {
      this.modalMarkPayment.openModal(row)
    }
  }

  onMarkPayment = (row: Enrollment) => {
    console.log("Marcar pago:", row)
    this.openModalMarkPayment(row)
  }

  openModalDeleteEnrollment(row: any) {
    if (this.modalDeleteEnrollment) {
      this.modalDeleteEnrollment.openModal(row)
    }
  }

  onDeleteEnrollment = (row: Enrollment) => {
    console.log("Eliminar inscripción:", row)
    this.openModalDeleteEnrollment(row)
  }

  openModalReadEnrollment(row: any) {
    if (this.modalReadEnrollment) {
      this.modalReadEnrollment.openModal(row)
    }
  }

  onReadEnrollment = (row: Enrollment) => {
    console.log("Leer inscripción:", row)
    this.openModalReadEnrollment(row)
  }

  onEnviarEvaluacion = (row: Enrollment) => {
    console.log("Enviar a evaluación:", row)

    const studentIndex = this.rows.findIndex((r) => r.id === row.id)
    if (studentIndex !== -1) {
      this.rows[studentIndex].state = "Evaluación en proceso"
      if (this.enrollmentTable) {
        this.enrollmentTable.updateTable()
      }
    }

    alert(`${row.student} ha sido enviado a evaluación`)
  }

  ongroupAssigned(data: AssignGroupData) {
    console.log("Grupo asignado:", data)

    const studentIndex = this.rows.findIndex((row) => row.id === data.studentId)
    if (studentIndex !== -1) {
      this.rows[studentIndex].state = "Pago pendiente"
      this.rows[studentIndex].ticket = "Pendiente"
      if (this.enrollmentTable) {
        this.enrollmentTable.updateTable()
      }
    }

    alert(
      `Ticket generado para ${data.studentName} en el grupo ${data.selectedGroup?.name}. Estado actualizado a "Pago pendiente"`,
    )
  }
}