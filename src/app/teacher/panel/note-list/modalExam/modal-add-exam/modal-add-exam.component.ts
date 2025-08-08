import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from '../../../../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    private route: ActivatedRoute
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
      modal.hide();
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
    // ...tus validaciones...

    const caId = Number(this.route.snapshot.paramMap.get('assignmentId'));
    if (!caId) { alert('ID de asignación inválido'); return; }

    // Aquí creamos el objeto payload exactamente como el DTO del backend espera:
    const payload = {
      classAssignmentId: caId,
      name: this.examData.name.trim(),
      date: this.examData.date,           // formato "YYYY-MM-DD"
      weight: this.examData.weight,
      state: this.examData.state,
      typeExam: this.examData.typeExam,
      periodType: this.examData.periodType,     // ya es "BIMESTRE"
      periodNumber: this.examData.periodNumber, // ya es 1
    };

    this.isSubmitting = true;
    this.http.post(
      `${this.baseUrl}/teacher/assignment/${caId}/exams`,
      payload
    ).subscribe({
      next: () => {
        alert('✅ Examen creado');
        this.added.emit();
        this.closeModal();
        this.resetForm();
      },
      error: err => {
        console.error(err);
        alert('❌ Error creando examen');
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }


}
