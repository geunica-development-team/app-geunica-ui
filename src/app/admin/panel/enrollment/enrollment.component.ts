import { Component, ViewChild } from '@angular/core';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { TableEnrollmentComponent } from '../admin-component/table-enrollment/table-enrollment.component';
import { AssignGroupData, Enrollment } from '../../services/enrollment.service';
import { AddEnrollmentComponent } from './add-enrollment/add-enrollment.component';
import { ReadEnrollmentComponent } from './read-enrollment/read-enrollment.component';
import { ModalContinueRegistrationComponent } from './modal-continue-registration/modal-continue-registration.component';
import { ModalMarkPaymentComponent } from './modal-mark-payment/modal-mark-payment.component';
import { ModalCreateCredentialsComponent } from './modal-create-credentials/modal-create-credentials.component';
import { ModalDeleteEnrollmentComponent } from './modal-delete-enrollment/modal-delete-enrollment.component';

@Component({
  selector: 'app-enrollment',
  imports: [PanelHeaderComponent, TableEnrollmentComponent, AddEnrollmentComponent, ReadEnrollmentComponent, ModalContinueRegistrationComponent, ModalMarkPaymentComponent, ModalCreateCredentialsComponent, ModalDeleteEnrollmentComponent],
  templateUrl: './enrollment.component.html',
  styleUrl: './enrollment.component.css'
})
export class EnrollmentComponent {
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
  @ViewChild('modalContinueRegistration') modalContinueRegistration?: ModalContinueRegistrationComponent;
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
  @ViewChild('modalMarkPayment') modalMarkPayment?: ModalMarkPaymentComponent;
  openModalMarkPayment(row: any) {
    
  }

  //MODAL PARA CREAR CREDENCIALES
  @ViewChild('modalCreateCredentials') modalCreateCredentials?: ModalCreateCredentialsComponent;
  openModalCreateCredentials(row: any) {
    
  }

  //MODAL PARA ELIMINAR INSCRIPCION
  @ViewChild('modalDeleteEnrollment') modalDeleteEnrollment?: ModalDeleteEnrollmentComponent;
  openModalDeleteEnrollment(row: any) {
    
  }
  
  // MÉTODOS PARA LAS ACCIONES
  onVer = (row: Enrollment) => {
    console.log('Ver detalles de:', row);
    // Implementar lógica para ver detalles
  }
  
  onEnviarEvaluacion = (row: Enrollment) => {
    console.log('Enviar a evaluación:', row);
    // Implementar lógica para enviar a evaluación
    // Aquí podrías abrir un modal de confirmación o hacer la llamada al API
  }
  
  
  
  onMarcarPago = (row: Enrollment) => {
    console.log('Marcar pago:', row);
    // Implementar lógica para marcar como pagado
  }
  
  onCrearCredenciales = (row: Enrollment) => {
    console.log('Crear credenciales:', row);
    // Implementar lógica para crear credenciales de usuario
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