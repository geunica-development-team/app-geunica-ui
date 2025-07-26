import { Component, ElementRef, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { dataLevelAll, LevelService } from '../../../services/level.service';
import { dataGradeAll, GradeService } from '../../../services/grade.service';
import { dataInscription, InscriptionService } from '../../../services/inscription.service';

@Component({
  selector: 'app-modal-read-enrollment',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-read-enrollment.component.html',
  styleUrl: './modal-read-enrollment.component.css'
})
export class ModalReadEnrollmentComponent {
  @Output() enrollmentUpdated = new EventEmitter<any>();
  @Input() rowId!: number;

  isLoading = false;

  private modalService = inject(NgbModal);
  private toolsForm = inject(FormBuilder);
  private notifycation = inject(ToastrService);
  private enrollmentService = inject(InscriptionService);
  private levelService = inject(LevelService);
  private gradeService = inject(GradeService);

  enrollmentStatuses = [
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Evaluado', label: 'Evaluado' },
    { value: 'Aprobado', label: 'Aprobado' },
    { value: 'Inscrito', label: 'Inscrito' },
    { value: 'Rechazado', label: 'Rechazado' }
  ];

  selectedLevelId: number | null = null;

  get filteredGrades() {
    if (!this.selectedLevelId) return this.grades;
    return this.grades.filter(grade => grade.level.id === this.selectedLevelId);
  }

  levels: dataLevelAll[] = [];
  grades: dataGradeAll[] = [];

  loadLevels() {
    this.levelService.getAllLevels().subscribe({
      next: (value) => this.levels = value,
      error: (error: Error) => console.error('Error al cargar los niveles/programas', error)
    });
  }

  loadGrades() {
    this.gradeService.getAllGrades().subscribe({
      next: (value) => this.grades = value,
      error: (error: Error) => console.error('Error al cargar los grados', error)
    });
  }

  formEditEnrollment = this.toolsForm.group({
    // DATOS DEL ESTUDIANTE
    'studentNames': ['', Validators.required],
    'studentPaternalSurname': ['', Validators.required],
    'studentMaternalSurname': ['', Validators.required],
    'studentTypeOfDocument': ['', Validators.required],
    'studentDocumentNumber': ['', Validators.required],
    'studentBirthDate': ['', Validators.required],
    'studentGender': ['', Validators.required],
    'studentPhoneNumber': [''],
    'studentAddress': [''],
    'studentEmail': [''],
    // NIVEL ACADÉMICO
    'grade': [0, Validators.required],
    'level': [0, Validators.required],
    // DATOS DEL APODERADO
    'tutorNames': ['', Validators.required],
    'tutorPaternalSurname': ['', Validators.required],
    'tutorMaternalSurname': ['', Validators.required],
    'tutorTypeOfDocument': ['', Validators.required],
    'tutorDocumentNumber': ['', Validators.required],
    'tutorBirthDate': ['', Validators.required],
    'tutorGender': ['', Validators.required],
    'tutorPhoneNumber': ['', Validators.required],
    'tutorAddress': ['', Validators.required],
    'tutorEmail': ['', [Validators.required, Validators.email]],
  })

  studentFullName: string = '';
  registrationDate: string = '';
  levelAndGrade: string = '';

  hasPsychology: boolean = false;
  psyEvaluationDate: string = '';
  psyEvaluationResult: string = '';
  psyEvaluationObservation: string = '';

  loadEnrollmentDetails() {
    if (this.rowId && !isNaN(this.rowId)) {
      this.enrollmentService.getInscriptionById(this.rowId).subscribe({
        next: (enrollment) => {
          this.selectedLevelId = enrollment.grade.level.id;

          const names = enrollment.student?.person?.names ?? '';
          const paternal = enrollment.student?.person?.paternalSurname ?? '';
          const maternal = enrollment.student?.person?.maternalSurname ?? '';
          this.studentFullName = `${names} ${paternal} ${maternal}`;

          const enrollmentDate = enrollment.registrationDate ?? '';
          this.registrationDate = this.formatDate(enrollmentDate)

          const level = enrollment.grade?.level?.name ?? '';
          const grade = enrollment.grade?.name ?? '';
          this.levelAndGrade = `${level} ${grade}`;

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


          this.formEditEnrollment.patchValue({
            studentNames: enrollment.student?.person?.names,
            studentPaternalSurname: enrollment.student?.person?.paternalSurname,
            studentMaternalSurname: enrollment.student?.person?.maternalSurname,
            studentTypeOfDocument: enrollment.student?.person?.typeOfIdentityDocument,
            studentDocumentNumber: enrollment.student?.person?.documentNumber,
            studentBirthDate: enrollment.student?.person?.birthDate,
            studentGender: enrollment.student?.person?.gender,
            studentAddress: enrollment.student?.person?.address,
            studentEmail: enrollment.student?.person?.email,
            studentPhoneNumber: enrollment.student?.person?.phoneNumber,

            grade: enrollment.grade?.id,
            level: enrollment.grade?.level?.id,

            tutorNames: enrollment.tutor?.person?.names,
            tutorPaternalSurname: enrollment.tutor?.person?.paternalSurname,
            tutorMaternalSurname: enrollment.tutor?.person?.maternalSurname,
            tutorTypeOfDocument: enrollment.tutor?.person?.typeOfIdentityDocument,
            tutorDocumentNumber: enrollment.tutor?.person?.documentNumber,
            tutorBirthDate: enrollment.tutor?.person?.birthDate,
            tutorGender: enrollment.tutor?.person?.gender,
            tutorAddress: enrollment.tutor?.person?.address,
            tutorEmail: enrollment.tutor?.person?.email,
            tutorPhoneNumber: enrollment.tutor?.person?.phoneNumber,
          });
        },
        error: (error) => {
          this.notifycation.error('Error al cargar los detalles de la inscripción', 'Error')
        }
      })
    } else {
      this.notifycation.error('ID de la inscripción inválido', 'Error');
    }
  }

  updateEnrollment() {
    if(this.formEditEnrollment.valid && this.rowId) {
      const updatedEnrollment: dataInscription = {
        student: {
          person: {
            names: this.formEditEnrollment.get('studentNames')?.value ?? '',
            paternalSurname: this.formEditEnrollment.get('studentPaternalSurname')?.value ?? '',
            maternalSurname: this.formEditEnrollment.get('studentMaternalSurname')?.value ?? '',
            typeOfIdentityDocument: this.formEditEnrollment.get('studentTypeOfDocument')?.value ?? '',
            documentNumber: this.formEditEnrollment.get('studentDocumentNumber')?.value ?? '',
            birthDate: this.formEditEnrollment.get('studentBirthDate')?.value ?? '',
            gender: this.formEditEnrollment.get('studentGender')?.value ?? '',
            address: this.formEditEnrollment.get('studentAddress')?.value ?? '',
            phoneNumber: this.formEditEnrollment.get('studentPhoneNumber')?.value ?? '',
            email: this.formEditEnrollment.get('studentEmail')?.value ?? '',
          }
        },
        tutor: {
          person: {
            names: this.formEditEnrollment.get('tutorNames')?.value ?? '',
            paternalSurname: this.formEditEnrollment.get('tutorPaternalSurname')?.value ?? '',
            maternalSurname: this.formEditEnrollment.get('tutorMaternalSurname')?.value ?? '',
            typeOfIdentityDocument: this.formEditEnrollment.get('tutorTypeOfDocument')?.value ?? '',
            documentNumber: this.formEditEnrollment.get('tutorDocumentNumber')?.value ?? '',
            birthDate: this.formEditEnrollment.get('tutorBirthDate')?.value ?? '',
            gender: this.formEditEnrollment.get('tutorGender')?.value ?? '',
            address: this.formEditEnrollment.get('tutorAddress')?.value ?? '',
            phoneNumber: this.formEditEnrollment.get('tutorPhoneNumber')?.value ?? '',
            email: this.formEditEnrollment.get('tutorEmail')?.value ?? '',
          }
        },
        idGrade: Number(this.formEditEnrollment.get('grade')?.value) ?? 0,
      }
      this.enrollmentService.updateInscription(this.rowId, updatedEnrollment).subscribe({
        next: (value: any) => {
          this.notifycation.success(`Inscripción actualizada con éxito.`, 'Éxito');
          this.enrollmentUpdated.emit();
          this.modalService.dismissAll();
          this.formEditEnrollment.reset();
        },
        error: (error: Error) => {
          this.notifycation.error(error.message, 'Error')
        }
      })
    } else {
      this.notifycation.error('Debes completar todos los campos correctamente', 'Error');
    }
  }
  
  @ViewChild('modalReadEnrollment') modalReadEnrollment!: TemplateRef<ElementRef>;

  openModal() {
    this.loadLevels();
    this.loadGrades();
    this.loadEnrollmentDetails();
    this.modalService.open(this.modalReadEnrollment, {
      centered: true,
      size: 'xl',
      backdrop: 'static'
    });
  }

  onLevelChange() {
    const selected = this.formEditEnrollment.get('level')?.value;
    this.selectedLevelId = selected ? +selected : 0;

    // 🔥 IMPORTANTE: Limpiar el grado seleccionado si cambia el nivel
    this.formEditEnrollment.get('grade')?.setValue(0);
  }

  onCancel() {
    this.formEditEnrollment.reset();
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
