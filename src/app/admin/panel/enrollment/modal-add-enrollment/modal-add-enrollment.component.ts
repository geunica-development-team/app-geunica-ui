import { Component, ElementRef, EventEmitter, inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AcademicData, AssignGroupData, GuardianData, StudentData } from '../../../services/enrollment.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ESTADOS, GRADO, NIVEL, SEXO, TIPO_DOCUMENTO, TURNO } from '../../../utility/personal-data';
import { ToastrService } from 'ngx-toastr';
import { dataLevelAll, LevelService } from '../../../services/level.service';
import { dataGradeAll, GradeService } from '../../../services/grade.service';
import { InscriptionService } from '../../../services/inscription.service';

@Component({
  selector: 'app-modal-add-enrollment',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-add-enrollment.component.html',
  styleUrl: './modal-add-enrollment.component.css'
})
export class ModalAddEnrollmentComponent {
  @Output() enrollmentAdded = new EventEmitter<any>();

  //INYECCIONES
  private modalService = inject(NgbModal);
  private toolsForm = inject(FormBuilder);
  private notifycation = inject(ToastrService);
  private inscriptionService = inject(InscriptionService);
  private levelService = inject(LevelService);
  private gradeService = inject(GradeService);

  ngOnInit() {
    this.loadLevels();
    this.loadGrades();
  }

  //FILTRAR LOS GRADOS POR NIVEL
  selectedLevelId: number | null = null;

  get filteredGrades() {
    if (!this.selectedLevelId) return this.grades;
    return this.grades.filter(grade => grade.level.id === this.selectedLevelId);
  }

  levels: dataLevelAll[] = []
  loadLevels() {
    this.levelService.getAllLevels().subscribe({
      next: (value) => {
        this.levels = value;
      },
      error: (error: Error) => {
        console.error('Error al cargar los niveles/programas', error);
      }
    })
  }

  grades: dataGradeAll[] = []
  loadGrades() {
    this.gradeService.getAllGrades().subscribe({
      next: (value) => {
        this.grades = value;
      },
      error: (error: Error) => {
        console.error('Error al cargar los grados', error);
      }
    })
  }

  @ViewChild('modalAddEnrollment') modalAddEnrollment!: TemplateRef<ElementRef>;  

    formAddEnrollment = this.toolsForm.group({
      // DATOS DEL ESTUDIANTE
      studentNames: ['', Validators.required],
      studentPaternalSurname: ['', Validators.required],
      studentMaternalSurname: ['', Validators.required],
      studentTypeOfDocument: ['', Validators.required],
      studentDocumentNumber: ['', Validators.required],
      studentBirthDate: ['', Validators.required],
      studentGender: ['', Validators.required],
      studentPhoneNumber: [''],
      studentAdress: [''],
      studentEmail: ['', [Validators.email]],

      // NIVEL ACADÉMICO
      grade: ['', Validators.required],

      // DATOS DEL APODERADO
      tutorNames: ['', Validators.required],
      tutorPaternalSurname: ['', Validators.required],
      tutorMaternalSurname: ['', Validators.required],
      tutorTypeOfDocument: ['', Validators.required],
      tutorDocumentNumber: ['', Validators.required],
      tutorBirthDate: ['', Validators.required],
      tutorGender: [''],
      tutorPhoneNumber: ['', Validators.required],
      tutorAdress: ['', Validators.required],
      tutorEmail: ['', [Validators.required, Validators.email]],
    })

    
    
    addEnrollment() {
      if (this.formAddEnrollment.invalid) {
        this.notifycation.error('Debes completar todos los campos correctamente', 'Error');
        return;
      }
      this.inscriptionService.addInscription({
        student: {
          person: {
            names: this.formAddEnrollment.get('studentNames')?.value ?? '',
            paternalSurname: this.formAddEnrollment.get('studentPaternalSurname')?.value ?? '',
            maternalSurname: this.formAddEnrollment.get('studentMaternalSurname')?.value ?? '',
            typeOfIdentityDocument: this.formAddEnrollment.get('studentTypeOfDocument')?.value ?? '',
            documentNumber: this.formAddEnrollment.get('studentDocumentNumber')?.value ?? '',
            birthDate: this.formAddEnrollment.get('studentBirthDate')?.value ?? '',
            gender: this.formAddEnrollment.get('studentGender')?.value ?? '',
            address: this.formAddEnrollment.get('studentAdress')?.value ?? '',
            phoneNumber: this.formAddEnrollment.get('studentPhoneNumber')?.value ?? '',
            email: this.formAddEnrollment.get('studentEmail')?.value ?? ''
          },
        },
        tutor: {
          person: {
            names: this.formAddEnrollment.get('tutorNames')?.value ?? '',
            paternalSurname: this.formAddEnrollment.get('tutorPaternalSurname')?.value ?? '',
            maternalSurname: this.formAddEnrollment.get('tutorMaternalSurname')?.value ?? '',
            typeOfIdentityDocument: this.formAddEnrollment.get('tutorTypeOfDocument')?.value ?? '',
            documentNumber: this.formAddEnrollment.get('tutorDocumentNumber')?.value ?? '',
            birthDate: this.formAddEnrollment.get('tutorBirthDate')?.value ?? '',
            gender: this.formAddEnrollment.get('tutorGender')?.value ?? '',
            address: this.formAddEnrollment.get('tutorAdress')?.value ?? '',
            phoneNumber: this.formAddEnrollment.get('tutorPhoneNumber')?.value ?? '',
            email: this.formAddEnrollment.get('tutorEmail')?.value ?? ''
          },
          relation: 'Tutor', // ejemplo: padre, madre, tutor legal
        },
        inscription: {
          idGrade: Number(this.formAddEnrollment.get('grade')?.value) ?? 0,
        },
      }).subscribe({
        next: () => {
          this.notifycation.success('Inscripción agregada correctamente', 'Éxito');
          this.enrollmentAdded.emit();
          this.modalService.dismissAll();
          this.formAddEnrollment.reset();
        },
        error: (error: Error) => {
          this.notifycation.error(error.message, 'Error');
        }
      });
    }
    
    openModal() {
    this.modalService.open(this.modalAddEnrollment, { 
      centered: true,
      size: 'xl',
      backdrop: 'static'
    });
  }

  onCancel() {
    this.modalService.dismissAll();
    this.formAddEnrollment.reset();
  }
}
