import { Component, ElementRef, inject, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-add-user',
  imports: [],
  templateUrl: './modal-add-user.component.html',
  styleUrl: './modal-add-user.component.css'
})
export class ModalAddUserComponent {
  //INYECCIONES
  private modalService = inject(NgbModal);

  @ViewChild('modalAddUser') modalAddUser!: TemplateRef<ElementRef>;

  openModal() {
    console.log('Abriendo modal para:'); // Para debug
    
    this.modalService.open(this.modalAddUser, { 
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
