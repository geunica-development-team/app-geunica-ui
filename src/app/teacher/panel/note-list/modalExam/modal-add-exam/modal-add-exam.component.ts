import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from '../../../../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

// DTO coincidente con el backend
interface CreateExamDto {
  name: string;
  date: string;           // ISO 8601 ("YYYY-MM-DD")
  weight: number;         // ej. 50.00
  state: string;          // p.ej. "Publicado"
  typeExam: string;       // p.ej. "Parcial"
  periodType: string;     // "BIMESTRE" etc
  periodNumber: number;   // ej. 1
}

@Component({
  selector: 'app-modal-add-exam',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-add-exam.component.html',
  styleUrl: './modal-add-exam.component.css'
})
export class ModalAddExamComponent implements OnInit {

  @Output() added = new EventEmitter<void>();

   // Datos que alimentan el DTO
  examData: CreateExamDto = {
    name: '',
    date: '',
    weight: 1,
    state: 'Publicado',
    typeExam: 'Parcial',
    periodType: 'BIMESTRE',
    periodNumber: 1
  };

  isSubmitting = false;
  minDate = '';
  private baseUrl = environment.apiBase;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.minDate = now.toISOString().slice(0, 16);  // para datetime-local
  }

  openModal(): void {
    this.resetForm();
    const modalEl = document.getElementById('modalAddExam');
    if (modalEl) {
      const modal = new (window as any).bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  closeModal(): void {
    const modalEl = document.getElementById('modalAddExam');
    if (modalEl) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
  }

  resetForm(): void {
    this.examData = {
      name: '', date: '', weight: 1,
      state: 'Publicado', typeExam: 'Parcial',
      periodType: 'BIMESTRE', periodNumber: 1
    };
    this.isSubmitting = false;
  }

  onSubmit(): void {
   if (this.isSubmitting) return;

    // validaciones básicas
    if (!this.examData.name || !this.examData.name.trim()) {
      this.toastr.warning('El nombre del examen es obligatorio', 'Validación');
      return;
    }
    if (!this.examData.date) {
      this.toastr.warning('La fecha del examen es obligatoria', 'Validación');
      return;
    }
    if (!this.examData.weight || this.examData.weight <= 0) {
      this.toastr.warning('El peso debe ser mayor que 0', 'Validación');
      return;
    }

    const caId = Number(this.route.snapshot.paramMap.get('assignmentId'));
    if (!caId) {
      this.toastr.error('ID de asignación inválido', 'Error');
      return;
    }

    const payload = {
      classAssignmentId: caId,
      name: this.examData.name.trim(),
      date: this.examData.date,
      weight: this.examData.weight,
      state: this.examData.state,
      typeExam: this.examData.typeExam,
      periodType: this.examData.periodType,
      periodNumber: this.examData.periodNumber
    };

    this.isSubmitting = true;

    this.http.post(`${this.baseUrl}/teacher/assignment/${caId}/exams`, payload).pipe(
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: (response: any) => {
        // éxito
        this.toastr.success('Examen creado correctamente', 'Éxito');

        // emitir evento para que el padre recargue o actualice la lista
        this.added.emit();

        // cerrar modal y resetear
        this.closeModal();
        this.resetForm();

        // Opcional: si quieres que el padre reciba el exam creado, cambia @Output() added = new EventEmitter<any>();
        // y usa: this.added.emit(response);
      },
      error: (err) => {
        console.error('Error creando examen', err);
        const msg = err?.error?.message || err?.message || 'Error creando examen';
        this.toastr.error(msg, 'Error');
      }
    });
  }


}
