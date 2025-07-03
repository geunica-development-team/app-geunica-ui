import { Component, ElementRef, EventEmitter, inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssignGroupData, GroupOption, PaymentData } from '../../../services/enrollment.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-mark-payment',
  imports: [FormsModule],
  templateUrl: './modal-mark-payment.component.html',
  styleUrl: './modal-mark-payment.component.css'
})
export class ModalMarkPaymentComponent {
  private modalService = inject(NgbModal);
  
  @Output() paymentMarked = new EventEmitter<PaymentData>();

  // Datos del estudiante (solo lectura)
  currentStudent: any = null;

  // Datos del pago
  paymentData = {
    amount: 350,
    paymentDate: '',
    paymentMethod: 'Transferencia',
    observations: '',
    generateCredentials: 'automatic',
    notifyGuardianBy: 'whatsapp'
  };

  // Opciones para dropdowns
  paymentMethods = [
    { value: 'Transferencia', label: 'Transferencia' },
    { value: 'Efectivo', label: 'Efectivo' },
    { value: 'Tarjeta', label: 'Tarjeta de crédito/débito' },
    { value: 'Deposito', label: 'Depósito bancario' },
    { value: 'Cheque', label: 'Cheque' }
  ];

  @ViewChild('modalMarkPayment') modalMarkPayment!: TemplateRef<ElementRef>;

  openModal(studentData: any) {
    console.log('Abriendo modal de pago para:', studentData);
    
    this.currentStudent = studentData;
    
    // Inicializar datos del pago
    this.paymentData = {
      amount: 350,
      paymentDate: this.getCurrentDate(),
      paymentMethod: 'Transferencia',
      observations: '',
      generateCredentials: 'automatic',
      notifyGuardianBy: 'whatsapp'
    };

    this.modalService.open(this.modalMarkPayment, { 
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onConfirm() {
    // Validaciones básicas
    if (!this.paymentData.amount || this.paymentData.amount <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }

    if (!this.paymentData.paymentDate) {
      alert('Por favor selecciona una fecha de pago');
      return;
    }

    if (!this.paymentData.paymentMethod) {
      alert('Por favor selecciona un método de pago');
      return;
    }

    const paymentInfo: PaymentData = {
      studentId: this.currentStudent.id,
      studentName: this.currentStudent.student,
      level: this.currentStudent.application_level,
      grade: '2do A', // Esto debería venir de los datos del estudiante
      amount: this.paymentData.amount,
      paymentDate: this.paymentData.paymentDate,
      paymentMethod: this.paymentData.paymentMethod,
      observations: this.paymentData.observations,
      generateCredentials: this.paymentData.generateCredentials,
      notifyGuardianBy: this.paymentData.notifyGuardianBy
    };

    console.log('Datos del pago:', paymentInfo);
    this.paymentMarked.emit(paymentInfo);
    this.modalService.dismissAll();

    // Mostrar mensaje de confirmación
    alert('Pago marcado exitosamente. Se procederá con la generación de credenciales.');
  }

  onCancel() {
    this.modalService.dismissAll();
  }
}
