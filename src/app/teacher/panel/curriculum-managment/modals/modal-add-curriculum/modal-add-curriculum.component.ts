import { Component, EventEmitter, Output } from '@angular/core';
import { environment } from '../../../../../../enviroments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthStorageService } from '../../../../../services/auth-storage.service';

@Component({
  selector: 'app-modal-add-curriculum',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-add-curriculum.component.html',
  styleUrl: './modal-add-curriculum.component.css'
})
export class ModalAddCurriculumComponent {

   @Output() added = new EventEmitter<void>();

  isOpen = false;
  saving = false;
  caId = 0;
  nextPosition = 1;

  formData = {
    title: '',
    description: '',
    position: 1,
    scheduledDate: ''
  };

  private baseUrl = environment.apiBase;

  constructor(private http: HttpClient, private authStorage: AuthStorageService) {}

  openModal(): void {
    this.resetForm();
    this.formData.position = this.nextPosition;
    this.isOpen = true;
    document.body.classList.add('modal-open');
  }

  closeModal(): void {
    this.isOpen = false;
    document.body.classList.remove('modal-open');
    this.resetForm();
  }

  onSubmit(): void {
    if (!this.formData.title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    this.saving = true;

    const payload = {
      title: this.formData.title,
      description: this.formData.description || null,
      position: this.formData.position,
      scheduledDate: this.formData.scheduledDate || null
    };
    const token = this.authStorage.getToken();
    const headers = token ? { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) } : {};
    this.http.post<any>(`${this.baseUrl}/teacher/me/assignment/${this.caId}/curriculum`, payload, headers)
      .subscribe({
        next: () => {
          this.added.emit();
          this.closeModal();
          this.showSuccess('Tema creado exitosamente');
        },
        error: err => {
          console.error('Error creating tema →', err);
          alert('Error al crear el tema');
        },
        complete: () => {
          this.saving = false;
        }
      });
  }

  private resetForm(): void {
    this.formData = {
      title: '',
      description: '',
      position: 1,
      scheduledDate: ''
    };
  }

  private showSuccess(message: string): void {
    console.log('SUCCESS:', message);
    // Implementar toast notification
  }

}
