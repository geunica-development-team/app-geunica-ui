import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { environment } from '../../../../../../enviroments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-delet-curriculum',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-delet-curriculum.component.html',
  styleUrl: './modal-delet-curriculum.component.css'
})
export class ModalDeletCurriculumComponent {

    @Output() deleted = new EventEmitter<void>();

  isOpen = false;
  deleting = false;
  curriculumId = 0;
  itemData: any = {};

  private baseUrl = environment.apiBase;

  constructor(private http: HttpClient) {}

  openModal(): void {
    this.isOpen = true;
    document.body.classList.add('modal-open');
  }

  closeModal(): void {
    this.isOpen = false;
    document.body.classList.remove('modal-open');
  }

  onConfirmDelete(): void {
    this.deleting = true;

    this.http.delete(`${this.baseUrl}/teacher/me/curriculum/${this.curriculumId}`)
      .subscribe({
        next: () => {
          this.deleted.emit();
          this.closeModal();
          this.showSuccess('Tema eliminado exitosamente');
        },
        error: err => {
          console.error('Error deleting tema →', err);
          alert('Error al eliminar el tema');
        },
        complete: () => {
          this.deleting = false;
        }
      });
  }

  private showSuccess(message: string): void {
    console.log('SUCCESS:', message);
    // Implementar toast notification
  }

}
