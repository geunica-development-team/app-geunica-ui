import { Component, ElementRef, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { InscriptionService } from '../../../admin/services/inscription.service';
import { dataEvaluation, EvaluationService } from '../../services/evaluation.service';

@Component({
  selector: 'app-modal-edit-evaluation',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-edit-evaluation.component.html',
  styleUrl: './modal-edit-evaluation.component.css'
})
export class ModalEditEvaluationComponent {
  @Output() evaluationEdited = new EventEmitter<any>();
  @Input() rowId!: number;

  private modalService = inject(NgbModal);
  private toolsForm = inject(FormBuilder);
  private notifycation = inject(ToastrService);
  private inscriptionService = inject(InscriptionService);
  private evaluationService = inject(EvaluationService);

  studentFullName: string = '';
  typeOfDocument: string = '';
  documentNumber: string = '';
  dateBirthDate: string = '';
  studentGender: string = '';

  registrationDate: string = '';
  levelAndGrade: string = '';

  tutorFullName: string = '';
  tutorTypeOfDocument: string = '';
  tutorDocumentNumber: string = '';
  tutorDateBirthDate: string = '';
  tutorGender: string = '';
  tutorAddress: string = '';
  tutorEmail: string = '';
  tutorPhoneNumber: string = '';

  hasPsychology: boolean = false;
  psyEvaluationDate: string = '';
  psyEvaluationResult: string = '';
  psyEvaluationObservation: string = '';


  loadEnrollmentDetails() {
    if (this.rowId && !isNaN(this.rowId)) {
      this.inscriptionService.getInscriptionById(this.rowId).subscribe({
        next: (enrollment) => {
          //STUDENT
          const names = enrollment.student?.person?.names ?? '';
          const paternal = enrollment.student?.person?.paternalSurname ?? '';
          const maternal = enrollment.student?.person?.maternalSurname ?? '';
          this.studentFullName = `${names} ${paternal} ${maternal}`;

          this.typeOfDocument = enrollment.student?.person?.typeOfIdentityDocument ?? '';
          this.documentNumber = enrollment.student?.person?.documentNumber ?? '';
          const birthDate = enrollment.student?.person?.birthDate ?? '';
          this.dateBirthDate = this.formatDate(birthDate);
          this.studentGender = enrollment.student?.person?.gender ?? '';

          //INSCRIPTION
          const enrollmentDate = enrollment.registrationDate ?? '';
          this.registrationDate = this.formatDate(enrollmentDate)

          const level = enrollment.grade?.level?.name ?? '';
          const grade = enrollment.grade?.name ?? '';
          this.levelAndGrade = `${level} ${grade}`;

          //TUTOR
          const tutorNames = enrollment.tutor?.person?.names ?? '';
          const tutorPaternal = enrollment.tutor?.person?.paternalSurname ?? '';
          const tutorMaternal = enrollment.tutor?.person?.maternalSurname ?? '';
          this.tutorFullName = `${tutorNames} ${tutorPaternal} ${tutorMaternal}`;

          this.tutorTypeOfDocument = enrollment.tutor?.person?.typeOfIdentityDocument ?? '';
          this.tutorDocumentNumber = enrollment.tutor?.person?.documentNumber ?? '';
          const tutorBirthDate = enrollment.tutor?.person?.birthDate ?? '';
          this.tutorDateBirthDate = this.formatDate(tutorBirthDate);
          this.tutorGender = enrollment.tutor?.person?.gender ?? '';
          this.tutorAddress = enrollment.tutor?.person?.address ?? '';
          this.tutorEmail = enrollment.tutor?.person?.email ?? '';
          this.tutorPhoneNumber = enrollment.tutor?.person?.phoneNumber ?? '';

          this.hasPsychology = enrollment.psychology != null;
          
          if (this.hasPsychology) {
            const evaluationDate = enrollment.psychology?.evaluationDate;
            this.psyEvaluationDate = `${evaluationDate}`;
  
            const evaluationResult = enrollment.psychology?.result === true ? 'Con condición' : 'Sin condición';
            this.psyEvaluationResult = `${evaluationResult}`;
  
            const evaluationObservation = enrollment.psychology?.observation;
            this.psyEvaluationObservation = `${evaluationObservation}`;
          } else {
            this.psyEvaluationDate = '';
            this.psyEvaluationResult = '';
            this.psyEvaluationObservation = '';
          }

          this.formEditEvaluation.patchValue({
            result: enrollment.psychology?.result,
            observation: enrollment.psychology?.observation
          })
        },
        error: (error) => {
          this.notifycation.error('Error al cargar los detalles de la inscripción', 'Error')
        }
      })
    } else {
      this.notifycation.error('ID de la inscripción inválido', 'Error');
    }
  }

  @ViewChild('modalEditEvaluation') modalEditEvaluation!: TemplateRef<ElementRef>; 
  
  formEditEvaluation = this.toolsForm.group({
    'result': [true, [Validators.required]],
    'observation': ['', [Validators.required]]
  })

  editEvaluation() {
    if (this.formEditEvaluation.valid && this.rowId) {
      const updatedEvaluation: dataEvaluation = {
        idInscription: this.rowId,
        result: this.formEditEvaluation.get('result')?.value ?? false,
        observation: this.formEditEvaluation.get('observation')?.value ?? '',
      }
      this.evaluationService.updateEvaluation(updatedEvaluation).subscribe({
        next: (value: any) => {
          this.notifycation.success(`Aula actualizada con éxito.`, 'Éxito');
          this.evaluationEdited.emit();
          this.modalService.dismissAll();
          this.formEditEvaluation.reset();
        },

        error: (error: Error) => {
          this.notifycation.error(error.message, 'Error');
        }
      })
    } else {
      this.notifycation.error('Debes completar todos los campos correctamente', 'Error');
    }
  }

  openModal() {
    this.loadEnrollmentDetails();
    this.modalService.open(this.modalEditEvaluation, { 
      centered: true,
      size: 'xl',
      backdrop: 'static'
    });
  }

  onCancel() {
    this.formEditEvaluation.reset(
      {
        result: null
      }
    );
    this.modalService.dismissAll();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 porque enero es 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
}
