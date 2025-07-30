import { Component, ElementRef, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-delete-evaluation',
  imports: [],
  templateUrl: './modal-delete-evaluation.component.html',
  styleUrl: './modal-delete-evaluation.component.css'
})
export class ModalDeleteEvaluationComponent {
  @Input() rowId!: number;
  @Output() evaluationDeleted = new EventEmitter<void>();

  private modalService = inject(NgbModal);
  private notifycation = inject(ToastrService);

  deleteEvaluation() {
    if (this.rowId) {
      console.log('HOLIIIIIIIIIIIIIII')
      this.evaluationDeleted.emit;
    } else {
      this.notifycation.error('ID de evaluación no válido', 'Error');
    }
  }

  @ViewChild('modalDeleteEvaluation') modalDeleteEvaluation!: TemplateRef<ElementRef>;
  openModal() {
    this.modalService.open(this.modalDeleteEvaluation, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
  }

  onCancel() {
    this.modalService.dismissAll();
  }
}
