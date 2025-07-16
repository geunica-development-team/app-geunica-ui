import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-session-expired',
  imports: [],
  templateUrl: './modal-session-expired.component.html',
  styleUrl: './modal-session-expired.component.css'
})
export class ModalSessionExpiredComponent {
  private modalService = inject(NgbModal)


  onCancel() {
    this.modalService.dismissAll()
  }
}
