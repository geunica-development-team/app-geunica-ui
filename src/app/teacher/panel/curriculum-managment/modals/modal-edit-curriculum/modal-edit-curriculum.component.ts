import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { environment } from '../../../../../../enviroments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthStorageService } from '../../../../../services/auth-storage.service';

@Component({
  selector: 'app-modal-edit-curriculum',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-edit-curriculum.component.html',
  styleUrl: './modal-edit-curriculum.component.css'
})
export class ModalEditCurriculumComponent {

    @Output() updated = new EventEmitter<void>();

  isOpen = false;
  saving = false;
  curriculumId = 0;
  itemData: any = {};

  formData = {
    title: '',
    description: '',
    position: 1,
    scheduledDate: ''
  };

  private baseUrl = environment.apiBase;

  constructor(private http: HttpClient, 
    private authStorage: AuthStorageService
  ) {}

  openModal(): void {
    this.loadFormData();
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
    this.http.put<any>(`${this.baseUrl}/teacher/me/curriculum/${this.curriculumId}`, payload, headers)
      .subscribe({
        next: () => {
          this.updated.emit();
          this.closeModal();
          this.showSuccess('Tema actualizado exitosamente');
        },
        error: err => {
          console.error('Error updating tema →', err);
          alert('Error al actualizar el tema');
        },
        complete: () => {
          this.saving = false;
        }
      });
  }

  private loadFormData(): void {
    this.formData = {
      title: this.itemData.title || '',
      description: this.itemData.description || '',
      position: this.itemData.position || 1,
      scheduledDate: this.itemData.scheduledDate || ''
    };
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
