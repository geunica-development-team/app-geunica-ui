import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from '../../../../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// DTO coincidente con el backend
interface CreateActivityDto {
  classAssignmentId: number;
  name: string;
  date: string;           // formato "YYYY-MM-DD"
  weight: number;         // ej. 20.00
  state: string;          // "Publicado" | "Borrador"
  typeActivity: string;   // "Tarea" | "Proyecto" | etc
  periodType: string;     // "BIMESTRE"
  periodNumber: number;   // 1
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
    periodType: 'BIMESTRE',
    periodNumber: 1
  };

  isSubmitting = false;
  minDate = '';
  private baseUrl = environment.apiBase;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
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
      periodType: 'BIMESTRE', periodNumber: 1
    };
    this.isSubmitting = false;
  }

  onSubmit(): void {
    if (this.isSubmitting) return;
    if (!this.activityData.name.trim()) { alert('El nombre es obligatorio'); return; }
    if (!this.activityData.date)        { alert('La fecha es obligatoria'); return; }
    if (this.activityData.weight <= 0)  { alert('El peso debe ser mayor a 0'); return; }

    this.isSubmitting = true;
    this.http.post(
      `${this.baseUrl}/teacher/assignment/${this.activityData.classAssignmentId}/activities`,
      this.activityData
    ).subscribe({
      next: () => {
        alert('✅ Actividad creada');
        this.added.emit();
        this.closeModal();
        this.resetForm();
      },
      error: err => {
        console.error(err);
        alert('❌ Error creando actividad');
      },
      complete: () => this.isSubmitting = false
    });
  }

}
