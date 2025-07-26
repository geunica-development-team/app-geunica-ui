import { Component, ElementRef, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-delete-classroom',
  imports: [],
  templateUrl: './modal-delete-classroom.component.html',
  styleUrl: './modal-delete-classroom.component.css'
})
export class ModalDeleteClassroomComponent {
  @Input() rowId!: number;
  @Output() classroomDeleted = new EventEmitter<void>();

  private modalService = inject(NgbModal);
  private notifycation = inject(ToastrService);
  
  
  deleteCampus() {
    if (this.rowId) {
      console.log('HOLIIIIIIIIIIIIIII')
    } else {
      this.notifycation.error('ID de producto no válido', 'Error');
    }
  }

  @ViewChild('modalDeleteClassroom') modalDeleteClassroom!: TemplateRef<ElementRef>;
  openModal() {
    this.modalService.open(this.modalDeleteClassroom, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
  }

  onCancel() {
    this.modalService.dismissAll();
  }
}

