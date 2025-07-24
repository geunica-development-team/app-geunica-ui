import { Component, inject, ViewChild } from '@angular/core';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { TableEnrollmentComponent } from '../admin-component/table-enrollment/table-enrollment.component';
import { AssignGroupData, Enrollment } from '../../services/enrollment.service';
import { ModalContinueRegistrationComponent } from './modal-continue-registration/modal-continue-registration.component';
import { ModalMarkPaymentComponent } from './modal-mark-payment/modal-mark-payment.component';
import { ModalDeleteEnrollmentComponent } from './modal-delete-enrollment/modal-delete-enrollment.component';
import { ModalAddEnrollmentComponent } from './modal-add-enrollment/modal-add-enrollment.component';
import { ModalReadEnrollmentComponent } from './modal-read-enrollment/modal-read-enrollment.component';
import { FormsModule } from '@angular/forms';
import { dataInscriptionAll, InscriptionService } from '../../services/inscription.service';

@Component({
  selector: 'app-enrollment',
  imports: [PanelHeaderComponent, TableEnrollmentComponent, ModalContinueRegistrationComponent, ModalMarkPaymentComponent, ModalDeleteEnrollmentComponent, ModalAddEnrollmentComponent, ModalReadEnrollmentComponent, FormsModule],
  templateUrl: './enrollment.component.html',
  styleUrl: './enrollment.component.css'
})
export class EnrollmentComponent {
  private inscriptionService = inject(InscriptionService)

  ngOnInit() {
    this.loadEnrollments();
  }

  @ViewChild("modalContinueRegistration") modalContinueRegistration?: ModalContinueRegistrationComponent
  @ViewChild("modalMarkPayment") modalMarkPayment?: ModalMarkPaymentComponent
  @ViewChild("modalDeleteEnrollment") modalDeleteEnrollment?: ModalDeleteEnrollmentComponent
  @ViewChild("modalReadEnrollment") modalReadEnrollment?: ModalReadEnrollmentComponent
  
    // FILTROS
    selectedStatus = ""
    searchValue = ""

  // COLUMNAS DE LA TABLA
  columns = [
    "ID",
    "Estudiante",
    "DNI",
    "Apoderado",
    "Grado y Sección",
    "Fecha",
    "Estado Inscripción",
    "Evaluación Resultado"
  ]

  // MAPEO PARA COLUMNAS Y FILAS
  columnMappings = {
    ID: "id",
    Estudiante: "studentFullName",
    "DNI": "documentNumber",
    Apoderado: "tutorFullName",
    "Grado y Sección": "gradeAndSection",
    Fecha: "registrationDate",
    "Estado Inscripción": "state",
    "Evaluación Resultado": "eval_result",
  }
  
  // ESTADOS DISPONIBLES
  enrollmentStatuses = [
    { value: "Pendiente", label: "Pendiente" },
    { value: "Evaluación en proceso", label: "Evaluación en proceso" },
    { value: "Evaluado", label: "Evaluado" },
    { value: "Rechazado", label: "Rechazado" },
    { value: "Pago pendiente", label: "Pago pendiente" },
    { value: "Matriculado", label: "Matriculado" },
  ]
    
  rows: dataInscriptionAll[] = [];
  
  @ViewChild("enrollmentTable") enrollmentTable?: TableEnrollmentComponent

  loadEnrollments() {
    this.inscriptionService.getAllInscriptions().subscribe({
      next:(inscription) => {
        this.rows = inscription.map((inscription: any): dataInscriptionAll & { studentFullName: string, tutorFullName: string, gradeAndSection: string, documentNumber: string } => ({
          id: inscription.id,
          registrationDate: this.formatDate(inscription.registrationDate),
          state: inscription.state,
          student: {
            person: {
              names: inscription.student?.person?.names,
              paternalSurname: inscription.student?.person?.paternalSurname,
              maternalSurname: inscription.student?.person?.maternalSurname,
              documentNumber: inscription.student?.person?.documentNumber
            }
          },
          tutor: {
            person: {
              names: inscription.tutor?.person?.names,
              paternalSurname: inscription.tutor?.person?.paternalSurname,
              maternalSurname: inscription.tutor?.person?.maternalSurname,
            }
          },
          grade: {
            id: inscription.grade.id,
            name: inscription.grade.name,
            level: {
              id: inscription.grade.level.id,
              name: inscription.grade.level.name
            }
          },
          documentNumber: `${inscription.student?.person?.documentNumber}`,
          studentFullName: `${inscription.student?.person?.names} ${inscription.student?.person?.paternalSurname} ${inscription.student?.person?.maternalSurname}`,
          tutorFullName: `${inscription.tutor?.person?.names} ${inscription.tutor?.person?.paternalSurname} ${inscription.tutor?.person?.maternalSurname}`,
          gradeAndSection: `${inscription.grade?.level?.name} - ${inscription.grade?.name}`
        }));
        if (this.enrollmentTable) {
          this.enrollmentTable.updateTable();
        }
      },
      error: (error) => {
        console.error('Error al cargar la lista de inscripciones', error)
      }
    })
  }

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
      if (this.enrollmentTable) {
        this.enrollmentTable.updateTable()
      }
    }

    alert(
      `Ticket generado para ${data.studentName} en el grupo ${data.selectedGroup?.name}. Estado actualizado a "Pago pendiente"`,
    )
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 porque enero es 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  onCreatedOrEditedOrDeleted() {
    this.loadEnrollments();
  }
}