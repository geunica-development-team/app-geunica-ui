import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
declare const bootstrap: any;
@Component({
  selector: 'app-edit-activity-score-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-activity-score-modal.component.html',
  styleUrl: './edit-activity-score-modal.component.css'
})
export class EditActivityScoreModalComponent {

   @Output() updated = new EventEmitter<any>();

  activityForm: FormGroup;
  activityScore: any = null;
  loading = false;
  private modal: any;
  private baseUrl = environment.apiBase;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {
    this.activityForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      score: [null, [Validators.required, Validators.min(0), Validators.max(20)]],
      state: ['pendiente', Validators.required],
      observations: ['']
    });
  }

  open(activityScore: any): void {
    this.activityScore = activityScore ?? null;
    this.populateForm();

    console.log('ActivityModal.open() activityScore=', this.activityScore);
    this.cd.detectChanges();

    const modalElement = document.getElementById('editActivityModal');
    if (modalElement) {
      this.modal = new bootstrap.Modal(modalElement);
      setTimeout(() => {
        this.modal.show();
        setTimeout(() => {
          const input = modalElement.querySelector('#score') as HTMLInputElement | null;
          if (input) input.focus();
        }, 50);
      }, 0);
    }
  }

  private populateForm(): void {
    if (!this.activityForm) this.activityForm = this.createForm();

    if (this.activityScore) {
      this.activityForm.patchValue({
        score: this.activityScore.score ?? null,
        state: this.activityScore.state ?? 'pendiente',
        observations: this.activityScore.observations ?? ''
      });
    } else {
      this.activityForm.reset({ score: null, state: 'pendiente', observations: '' });
    }
  }

  getStudentName(): string {
    const s = this.activityScore?.enrollment?.inscription?.student;
    if (s) return `${s.names ?? s.name ?? ''} ${s.paternalSurname ?? ''} ${s.maternalSurname ?? ''}`.trim();
    return 'Estudiante no identificado';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Sin fecha';
    return new Date(dateString).toLocaleDateString('es-PE');
  }

  onSubmit(): void {
    if (this.activityForm.valid && this.activityScore) {
      this.loading = true;

      const updateData = {
        score: this.activityForm.value.score,
        state: this.activityForm.value.state,
        observations: this.activityForm.value.observations,
        registrationDate: new Date().toISOString()
      };

      const url = `${this.baseUrl}/teacher/activity-scores/${this.activityScore.id}`;

      this.http.put(url, updateData).subscribe({
        next: (response) => {
          //console.log('Activity score updated:', response);
          this.loading = false;
          this.updated.emit(response);
          this.closeModal();
          alert('Nota de actividad actualizada correctamente');
        },
        error: (err) => {
          //console.error('Error updating activity score:', err);
          this.loading = false;
          alert(err?.error?.message || 'Error al actualizar la nota de actividad');
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private closeModal(): void {
    if (this.modal) this.modal.hide();
    this.resetForm();
  }

  private resetForm(): void {
    this.activityForm.reset();
    this.activityScore = null;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.activityForm.controls).forEach(k => {
      const c = this.activityForm.get(k);
      if (c) c.markAsTouched();
    });
  }

  get scoreControl() {
    return this.activityForm.get('score');
  }

}
