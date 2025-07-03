import { Component, ViewChild } from '@angular/core';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { TableEnrollmentComponent } from '../admin-component/table-enrollment/table-enrollment.component';
import { AssignGroupData, Enrollment } from '../../services/enrollment.service';
import { ModalContinueRegistrationComponent } from './modal-continue-registration/modal-continue-registration.component';
import { ModalMarkPaymentComponent } from './modal-mark-payment/modal-mark-payment.component';
import { ModalCreateCredentialsComponent } from './modal-create-credentials/modal-create-credentials.component';
import { ModalDeleteEnrollmentComponent } from './modal-delete-enrollment/modal-delete-enrollment.component';
import { ModalAddEnrollmentComponent } from './modal-add-enrollment/modal-add-enrollment.component';
import { ModalReadEnrollmentComponent } from './modal-read-enrollment/modal-read-enrollment.component';

@Component({
  selector: 'app-enrollment',
  imports: [PanelHeaderComponent, TableEnrollmentComponent, ModalContinueRegistrationComponent, ModalMarkPaymentComponent, ModalCreateCredentialsComponent, ModalDeleteEnrollmentComponent, ModalAddEnrollmentComponent, ModalReadEnrollmentComponent],
  templateUrl: './enrollment.component.html',
  styleUrl: './enrollment.component.css'
})
export class EnrollmentComponent {

  @ViewChild('modalContinueRegistration') modalContinueRegistration?: ModalContinueRegistrationComponent;
  @ViewChild('modalMarkPayment') modalMarkPayment?: ModalMarkPaymentComponent;
  @ViewChild('modalCreateCredentials') modalCreateCredentials?: ModalCreateCredentialsComponent;
  @ViewChild('modalDeleteEnrollment') modalDeleteEnrollment?: ModalDeleteEnrollmentComponent;
  @ViewChild('modalReadEnrollment') modalReadEnrollment?: ModalReadEnrollmentComponent;

  
  // COLUMNAS DE LA TABLA
  columns = [
    'ID',
    'Estudiante',
    'Nivel Postulación',
    'Fecha',
    'Estado Inscripción',
    'Evaluación Resultado',
    'Ticket'
  ];

  // MAPEO PARA COLUMNAS Y FILAS
  columnMappings = {
    'ID': 'id',
    'Estudiante': 'student',
    'Nivel Postulación': 'application_level',
    'Fecha': 'date',
    'Estado Inscripción': 'state',
    'Evaluación Resultado': 'eval_result',
    'Ticket': 'ticket'
  };

  rows: Enrollment[] = [
    {
      id: 1,
      student: "Lucía Fernández",
      application_level: "Primaria",
      date: "2025-05-14",
      state: "Pendiente",
      eval_result: "-",
      ticket: "-"
    },
    {
      id: 2,
      student: "Carlos Pérez",
      application_level: "Primaria",
      date: "2025-05-20",
      state: "Evaluado",
      eval_result: "Con condición",
      ticket: "-"
    },
    {
      id: 3,
      student: "María González",
      application_level: "Primaria",
      date: "2025-06-01",
      state: "Evaluado",
      eval_result: "Sin condición",
      ticket: "-"
    },
    {
      id: 4,
      student: "José Ramírez",
      application_level: "Primaria",
      date: "2025-06-10",
      state: "Pendiente",
      eval_result: "-",
      ticket: "-"
    },
    {
      id: 5,
      student: "Ana López",
      application_level: "Primaria",
      date: "2025-06-15",
      state: "Pendiente",
      eval_result: "-",
      ticket: "-"
    },
    {
      id: 6,
      student: "Luis Torres",
      application_level: "Primaria",
      date: "2025-06-18",
      state: "Rechazado",
      eval_result: "Con condición",
      ticket: "-"
    },
    {
      id: 7,
      student: "Camila Rojas",
      application_level: "Primaria",
      date: "2025-06-22",
      state: "Ticket generado",
      eval_result: "Con condición",
      ticket: "Pendiente"
    },
    {
      id: 8,
      student: "Miguel Castro",
      application_level: "Primaria",
      date: "2025-06-25",
      state: "Aprobado",
      eval_result: "Sin condición",
      ticket: "Pagado"
    },
    {
      id: 9,
      student: "Valentina Mendoza",
      application_level: "Primaria",
      date: "2025-06-26",
      state: "Pendiente",
      eval_result: "-",
      ticket: "-"
    },
    {
      id: 10,
      student: "Diego Silva",
      application_level: "Primaria",
      date: "2025-06-27",
      state: "Pendiente",
      eval_result: "-",
      ticket: "-"
    }
  ];

  @ViewChild('enrollmentTable') enrollmentTable?: TableEnrollmentComponent;
  
  //MODAL PARA CONTINUAR CON MATRICULA
  openModalContinueRegistration(row: any) {
    if (this.modalContinueRegistration) {
      this.modalContinueRegistration.openModal(row);
    }
  }
  onContinueRegistration = (row: Enrollment) => {
    console.log('Continuar con matrícula:', row);
    this.openModalContinueRegistration(row);
  }

  //MODAL PARA MARCAR PAGO
  openModalMarkPayment(row: any) {
    if (this.modalMarkPayment) {
      this.modalMarkPayment.openModal(row);
    }
  }
  onMarkPayment = (row: Enrollment) => {
    console.log('Marcar pago:', row);
    this.openModalMarkPayment(row);
  }


  //MODAL PARA CREAR CREDENCIALES

  openModalCreateCredentials(row: any) {
    if (this.modalCreateCredentials) {
      this.modalCreateCredentials.openModal(row);
    }
  }
  onCreateCredentials = (row: Enrollment) => {
    console.log('Crear credenciales:', row);
    this.openModalCreateCredentials(row);
  }

  //MODAL PARA ELIMINAR INSCRIPCION
  openModalDeleteEnrollment(row: any) {
    if (this.modalDeleteEnrollment) {
      this.modalDeleteEnrollment.openModal(row);
    }
  }
  onDeleteEnrollment = (row: Enrollment) => {
    console.log('Eliminar credenciales:', row);
    this.openModalDeleteEnrollment(row);
  }
  
  //MODAL PARA LEER LA INSCRIPCION
  openModalReadEnrollment(row: any) {
    if (this.modalReadEnrollment) {
      this.modalReadEnrollment.openModal(row);
    }
  }
  onReadEnrollment = (row: Enrollment) => {
    console.log('Leer inscripción:', row);
    this.openModalReadEnrollment(row);
  }

  onEnviarEvaluacion = (row: Enrollment) => {
    console.log('Enviar a evaluación:', row);
    // Implementar lógica para enviar a evaluación
    // Aquí podrías abrir un modal de confirmación o hacer la llamada al API
  }

  ongroupAssigned(data: AssignGroupData) {
    console.log('Grupo asignado:', data);
    // Aquí implementarías la lógica para:
    // 1. Actualizar el estado del estudiante
    // 2. Generar el ticket
    // 3. Actualizar la tabla
    
    // Ejemplo de actualización del estado:
    const studentIndex = this.rows.findIndex(row => row.id === data.studentId);
    if (studentIndex !== -1) {
      this.rows[studentIndex].state = 'Ticket generado';
      this.rows[studentIndex].ticket = 'Pendiente';
      // Actualizar la tabla
      if (this.enrollmentTable) {
        this.enrollmentTable.updateTable();
      }
    }
    
    alert(`Ticket generado para ${data.studentName} en el grupo ${data.selectedGroup?.name}`);
  }

  //PARA APLICAR FILTROS
  applyFilter(event: Event) {
    if (this.enrollmentTable) {
      this.enrollmentTable.filterValue = (
        event.target as HTMLInputElement
      ).value;
      this.enrollmentTable.updateTable();
    }
  }
}