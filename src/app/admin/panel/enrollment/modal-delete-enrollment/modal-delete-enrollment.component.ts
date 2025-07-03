import { Component, ElementRef, EventEmitter, inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssignGroupData, GroupOption } from '../../../services/enrollment.service';

@Component({
  selector: 'app-modal-delete-enrollment',
  imports: [],
  templateUrl: './modal-delete-enrollment.component.html',
  styleUrl: './modal-delete-enrollment.component.css'
})
export class ModalDeleteEnrollmentComponent {
  private modalService = inject(NgbModal);
  
  @Output() enrollmentDeleted = new EventEmitter<any>();

  // Datos del estudiante a eliminar
  currentStudent: any = null;

  @ViewChild('modalDeleteEnrollment') modalDeleteEnrollment!: TemplateRef<ElementRef>;

  openModal(studentData: any) {
    console.log('Abriendo modal de eliminar inscripción para:', studentData);
    
    this.currentStudent = studentData;

    this.modalService.open(this.modalDeleteEnrollment, { 
      centered: true,
      size: 'md',
      backdrop: 'static'
    });
  }

  onConfirmDelete() {
    console.log('Eliminando inscripción de:', this.currentStudent);
    
    // Emitir evento con los datos del estudiante eliminado
    this.enrollmentDeleted.emit(this.currentStudent);
    
    // Cerrar modal
    this.modalService.dismissAll();
    
    // Mostrar mensaje de confirmación
    alert('Inscripción eliminada exitosamente');
  }

  onCancel() {
    this.modalService.dismissAll();
  }
}
