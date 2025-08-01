import { Component, ElementRef, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modal-delete-classroom',
  imports: [],
  templateUrl: './modal-delete-classroom.component.html',
  styleUrl: './modal-delete-classroom.component.css'
})
export class ModalDeleteClassroomComponent {
  @Input() rowId!: number;
  @Output() classroomDeleted = new EventEmitter<void>();

  private http        = inject(HttpClient);
  private modalService = inject(NgbModal);
  private notification = inject(ToastrService);
  private baseUrl      = environment.apiBase;

  @ViewChild('modalDeleteClassroom') modalDelete!: TemplateRef<any>;

  /** Abre el modal */
  openModal() {
    this.modalService.open(this.modalDelete, {
      centered: true,
      size: 'xm',
      backdrop: 'static'
    });
  }

  /** Cierra el modal */
  onCancel() {
    this.rowId = 0;
    this.modalService.dismissAll();
  }

  /** Llama al DELETE y notifica */
  deleteClassroom() {
    if (!this.rowId) {
      this.notification.error('ID de aula no válido', 'Error');
      return;
    }

    this.http
      .delete(`${this.baseUrl}/classrooms/${this.rowId}`)
      .subscribe({
        next: () => {
          this.notification.success('Aula eliminada', 'Éxito');
          this.classroomDeleted.emit();      // avisa al padre
          this.modalService.dismissAll();    // cierra el modal
        },
        error: err => {
          this.notification.error(
            err.error?.message || 'Error al eliminar',
            'Error'
          );
        }
      });
  }
}

