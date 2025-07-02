import { Component, ElementRef, EventEmitter, inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssignGroupData } from '../../../services/enrollment.service';

@Component({
  selector: 'app-modal-add-enrollment',
  imports: [],
  templateUrl: './modal-add-enrollment.component.html',
  styleUrl: './modal-add-enrollment.component.css'
})
export class ModalAddEnrollmentComponent {
  //INYECCIONES
  private modalService = inject(NgbModal);

  @ViewChild('modalAddEnrollment') modalAddEnrollment!: TemplateRef<ElementRef>;

  openModal() {
    console.log('Abriendo modal para:'); // Para debug
    
    this.modalService.open(this.modalAddEnrollment, { 
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
