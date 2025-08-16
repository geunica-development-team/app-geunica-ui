import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from '../../../../../../enviroments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { AuthStorageService } from '../../../../../services/auth-storage.service';

// DTO coincidente con el backend
interface CreateActivityDto {
  classAssignmentId: number;
  name: string;
  date: string;           // formato "YYYY-MM-DD"
  weight: number;         // ej. 20.00
  state: string;          // "Publicado" | "Borrador"
  typeActivity: string;   // "Tarea" | "Proyecto" | etc

}

@Component({
  selector: 'app-modal-add-activity',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-add-activity.component.html',
  styleUrl: './modal-add-activity.component.css'
})
export class ModalAddActivityComponent implements OnInit {

  @Output() added = new EventEmitter<void>();

  activityData: CreateActivityDto = {
    classAssignmentId: 0,
    name: '',
    date: '',
    weight: 10,
    state: 'Publicado',
    typeActivity: 'Tarea',

  };

  isSubmitting = false;
  minDate = '';
  private baseUrl = environment.apiBase;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private authStorage: AuthStorageService
  ) {}

  ngOnInit(): void {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.minDate = now.toISOString().slice(0, 16);
  }

  openModal(): void {
    this.resetForm();
    const modalEl = document.getElementById('modalAddActivity');
    if (modalEl) {
      const modal = new (window as any).bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  closeModal(): void {
    const modalEl = document.getElementById('modalAddActivity');
    if (modalEl) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
      modal.hide();
    }
  }

  resetForm(): void {
    const caId = Number(this.route.snapshot.paramMap.get('assignmentId'));
    this.activityData = {
      classAssignmentId: caId,
      name: '', date: '', weight: 10,
      state: 'Publicado', typeActivity: 'Tarea',
    };
    this.isSubmitting = false;
  }

onSubmit(): void {
    if (this.isSubmitting) return;

    // validación simple
    if (!this.activityData.name.trim()) {
      this.toastr.warning('El nombre es obligatorio', 'Validación');
      return;
    }
    if (!this.activityData.date) {
      this.toastr.warning('La fecha es obligatoria', 'Validación');
      return;
    }
    if (this.activityData.weight <= 0) {
      this.toastr.warning('El peso debe ser mayor a 0', 'Validación');
      return;
    }

    this.isSubmitting = true;
    const token = this.authStorage.getToken();
    const headers = token ? { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) } : {};
    this.http.post(`${this.baseUrl}/activity/assignment/${this.activityData.classAssignmentId}`,this.activityData, headers)
    .pipe(finalize(() => this.isSubmitting = false)
      ).subscribe({
        next: (res) => {
          this.toastr.success('Actividad creada correctamente', 'Éxito');
          this.added.emit();
          this.closeModal();
          this.resetForm();
        },
        error: (err) => {
          console.error('Error creando actividad', err);
          const msg = err?.error?.message || err?.message || 'Error creando actividad';
          this.toastr.error(msg, 'Error');
        }
      });
  }

}
