import { Component, ElementRef, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { InscriptionService } from '../../../admin/services/inscription.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EvaluationService } from '../../services/evaluation.service';

@Component({
  selector: 'app-modal-add-evaluation',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-add-evaluation.component.html',
  styleUrl: './modal-add-evaluation.component.css'
})
export class ModalAddEvaluationComponent {
  @Output() evaluationAdded = new EventEmitter<any>();
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
        },
        error: (error) => {
          this.notifycation.error('Error al cargar los detalles de la inscripción', 'Error')
        }
      })
    } else {
      this.notifycation.error('ID de la inscripción inválido', 'Error');
    }
  }

  @ViewChild('modalAddEvaluation') modalAddEvaluation!: TemplateRef<ElementRef>; 
  
  formAddEvaluation = this.toolsForm.group({
    'result': [null, [Validators.required]],
    'observation': ['', [Validators.required]]
  })

  addEvaluation() {
    if (this.formAddEvaluation.invalid) {
      this.notifycation.error('Debes completar todos los campos correctamente', 'Error');
      return;
    }
    this.evaluationService.addEvaluation({
      idInscription: this.rowId,
      result: this.formAddEvaluation.get('result')?.value ?? false,
      observation: this.formAddEvaluation.get('observation')?.value ?? ''
    }).subscribe({
      next: (value: any) => {
        this.notifycation.success('Evaluación agregada correctamente', 'Exito')
        this.evaluationAdded.emit();
        this.modalService.dismissAll();
        this.formAddEvaluation.reset({
          result: null
        })
      },
      error: (error: Error) => {
        this.notifycation.error(error.message, 'Error');
      }
    })
  }

  openModal() {
    this.loadEnrollmentDetails();
    this.modalService.open(this.modalAddEvaluation, { 
      centered: true,
      size: 'xl',
      backdrop: 'static'
    });
  }

  onCancel() {
    this.formAddEvaluation.reset(
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
