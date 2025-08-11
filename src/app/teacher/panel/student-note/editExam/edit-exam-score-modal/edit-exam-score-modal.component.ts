import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder,  FormGroup,  FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
declare var bootstrap: any;
@Component({
  selector: 'app-edit-exam-score-modal',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-exam-score-modal.component.html',
  styleUrl: './edit-exam-score-modal.component.css'
})
export class EditExamScoreModalComponent {

 @Output() updated = new EventEmitter<any>();

  examForm: FormGroup;
  examScore: any = null;
  loading = false;
  private modal: any;

  private baseUrl = environment.apiBase;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) {
    this.examForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      score: [null, [Validators.required, Validators.min(0), Validators.max(20)]],
      state: ['pendiente', Validators.required],
      observations: ['']
    });
  }

  // Abrir modal con los datos del examen
  open(examScore: any): void {
    this.examScore = examScore;
    this.populateForm();
    
    // Inicializar modal de Bootstrap
    const modalElement = document.getElementById('editExamModal');
    if (modalElement) {
      this.modal = new bootstrap.Modal(modalElement);
      this.modal.show();
    }
  }

  // Poblar formulario con datos existentes
  private populateForm(): void {
    if (this.examScore) {
      this.examForm.patchValue({
        score: this.examScore.score || null,
        state: this.examScore.state || 'pendiente',
        observations: this.examScore.observations || ''
      });
    }
  }

  // Obtener nombre del estudiante
  getStudentName(): string {
    if (this.examScore?.enrollment?.inscription?.student) {
      const student = this.examScore.enrollment.inscription.student;
      return `${student.names} ${student.paternalSurname} ${student.maternalSurname}`.trim();
    }
    return 'Estudiante no identificado';
  }

  // Formatear fecha
  formatDate(dateString: string): string {
    if (!dateString) return 'Sin fecha';
    return new Date(dateString).toLocaleDateString('es-PE');
  }

  // Enviar formulario
  onSubmit(): void {
    if (this.examForm.valid && this.examScore) {
        this.loading = true;

        const updateData = {
          score: this.examForm.value.score,
          state: this.examForm.value.state,
          observations: this.examForm.value.observations,
          registrationDate: new Date().toISOString()
        };

        const url = `${this.baseUrl}/teacher/exam-scores/${this.examScore.id}`;

        this.http.put(url, updateData).subscribe({
          next: (response) => {
            this.loading = false;
            this.updated.emit(response);

            // Usamos toastr en lugar de alert
            this.toastr.success('Nota actualizada correctamente', 'Éxito');

            this.closeModal();
          },
          error: (error) => {
            this.loading = false;
            const message = error?.error?.message || 'Error al actualizar la nota';
            this.toastr.error(message, 'Error');
          }
        });
      } else {
        this.markFormGroupTouched();
      }
  }

  // Cerrar modal
  private closeModal(): void {
    if (this.modal) {
      this.modal.hide();
    }
    this.resetForm();
  }

  // Resetear formulario
  private resetForm(): void {
    this.examForm.reset();
    this.examScore = null;
  }

  // Marcar todos los campos como touched
  private markFormGroupTouched(): void {
    Object.keys(this.examForm.controls).forEach(key => {
      const control = this.examForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Mostrar mensaje de éxito
  private showSuccessMessage(): void {
    // Puedes usar una librería como toastr o crear tu propio sistema de notificaciones
    this.toastr.success('Nota actualizada correctamente', 'Éxito');
  }

  // Mostrar mensaje de error
  private showErrorMessage(error: any): void {
    const message = error?.error?.message || 'Error al actualizar la nota';
    this.toastr.error(message, 'Error');
  }

  // Getter para facilitar validación en template
  get scoreControl() {
    return this.examForm.get('score');
  }

  get stateControl() {
    return this.examForm.get('state');
  }

}
