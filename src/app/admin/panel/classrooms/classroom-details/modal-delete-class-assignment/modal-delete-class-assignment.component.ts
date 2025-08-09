import { Component, ElementRef, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssignClassroomService } from '../../../../services/class-assignment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-delete-class-assignment',
  imports: [],
  templateUrl: './modal-delete-class-assignment.component.html',
  styleUrl: './modal-delete-class-assignment.component.css'
})
export class ModalDeleteClassAssignmentComponent {
  @Output() deleted = new EventEmitter<any>();
  @Input() assignmentId!: number;

  private modalService = inject(NgbModal);
  private assignService = inject(AssignClassroomService);
  private notifycation = inject(ToastrService);

  deleteAssignment() {
    if (this.assignmentId && !isNaN(this.assignmentId)) {
      this.assignService.deleteAssignmentClassroom(this.assignmentId).subscribe({
        next: () => {
          this.notifycation.success('Asignación eliminada');
          this.deleted.emit();
          this.modalService.dismissAll();
        },
        error: (error) => {
          this.notifycation.error('Error al eliminar la asignación')
        }
      })
    } else {
      this.notifycation.error('ID de la asignación inválido', 'Error')
    }
  }

  @ViewChild('modalDeleteClassAssignment') modalDeleteClassAssignment!: TemplateRef<ElementRef>;  
  openModal() {
    console.log(this.assignmentId)
    this.modalService.open(this.modalDeleteClassAssignment, { 
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
  }

  onCancel() {
    this.modalService.dismissAll();
  }
}
