import { Component, ElementRef, inject, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-change-password',
  imports: [],
  templateUrl: './modal-change-password.component.html',
  styleUrl: './modal-change-password.component.css'
})
export class ModalChangePasswordComponent {
  //INYECCIONES
  private modalService = inject(NgbModal);

  @ViewChild('modalChangePassword') modalChangePassword!: TemplateRef<ElementRef>;  

  openModal() {
    console.log('Abriendo modal para:'); // Para debug
    
    this.modalService.open(this.modalChangePassword, { 
      centered: true,
      size: 'md',
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
