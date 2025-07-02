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
//INYECCIONES
  private modalService = inject(NgbModal);

  @Output() groupAssigned = new EventEmitter<AssignGroupData>();

// Datos del estudiante seleccionado
  currentStudent: any = null;
  selectedLevel: string = 'Primaria';
  selectedGrade: string = '2do';
  selectedGroupId: string = '';

  @ViewChild('modalDeleteEnrollment') modalDeleteEnrollment!: TemplateRef<ElementRef>;

  openModal(studentData: any) {
    console.log('Abriendo modal para:', studentData); // Para debug
    
    this.modalService.open(this.modalDeleteEnrollment, { 
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
  }

  onConfirm() {
    console.log('Datos a enviar: wi');
    this.modalService.dismissAll();
  }

  onCancel() {
    this.modalService.dismissAll();
  }
}
