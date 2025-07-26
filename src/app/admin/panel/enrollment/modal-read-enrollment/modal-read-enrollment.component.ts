import { Component, ElementRef, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssignGroupData, EnrollmentData, GroupOption } from '../../../services/enrollment.service';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { dataLevelAll, LevelService } from '../../../services/level.service';
import { dataGradeAll, GradeService } from '../../../services/grade.service';
import { InscriptionService } from '../../../services/inscription.service';

@Component({
  selector: 'app-modal-read-enrollment',
  imports: [FormsModule],
  templateUrl: './modal-read-enrollment.component.html',
  styleUrl: './modal-read-enrollment.component.css'
})
export class ModalReadEnrollmentComponent {
  private modalService = inject(NgbModal);
  private toolsForm = inject(FormBuilder);
  private notifycation = inject(ToastrService);
  private enrollmentService = inject(InscriptionService);
  private levelService = inject(LevelService);
  private gradeService = inject(GradeService);
  
  @Output() enrollmentUpdated = new EventEmitter<EnrollmentData>();
  @Input() rowId!: number;


  // Estado del modal
  isEditMode: boolean = false;
  originalData: EnrollmentData | null = null;
  currentData: EnrollmentData | null = null;

  enrollmentStatuses = [
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Evaluado', label: 'Evaluado' },
    { value: 'Aprobado', label: 'Aprobado' },
    { value: 'Inscrito', label: 'Inscrito' },
    { value: 'Rechazado', label: 'Rechazado' }
  ];

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

  formEditEnrollment = this.toolsForm.group({
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
    level: [0, Validators.required],
    grade: [0, Validators.required],
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

  @ViewChild('modalReadEnrollment') modalReadEnrollment!: TemplateRef<ElementRef>;

  loadEnrollmentDetails() {
    if (this.rowId && !isNaN(this.rowId)) {
      this.enrollmentService.getInscriptionById(this.rowId).subscribe({
        next: (enrollment) => {
          this.selectedLevelId = enrollment.grade.level.id;
          this.formEditEnrollment.patchValue({
            name: classroom.name,
            campus: classroom.campus?.id,
            grade: classroom.grade?.id,
            section: classroom.section?.id,
            level: classroom.grade?.level?.id,
            period: classroom.period?.id,
            shift: classroom.shift,
            capacity: classroom.capacity,
            specialCapacity: classroom.specialCapacity,
          });
        },
        error: (error) => {
          this.notifycation.error('Error al cargar los detalles del grado', 'Error');
        }
      })
    } else {
      this.notifycation.error('ID del grado inválido', 'Error');
    }
  }

  openModal(enrollmentData: any) {
    // Mapear los datos recibidos al formato interno
    this.originalData = {
      studentName: enrollmentData.student || 'Carlos Zuñiga',
      enrollmentDate: enrollmentData.date || '12/05/2025',
      level: enrollmentData.application_level || 'Primaria',
      grade: '4to',
      shift: 'Mañana',
      student: {
        firstName: 'Gabriel',
        paternalLastName: 'Echevarria',
        maternalLastName: 'Gutierrez',
        documentType: 'DNI',
        documentNumber: '76251458',
        birthDate: '2005-01-16',
        gender: 'M',
        phone: '987123654',
        address: 'Cal. Amazonas 345',
        email: 'correo@example.com'
      },
      guardian: {
        firstName: 'Gabriel',
        paternalLastName: 'Echevarria',
        maternalLastName: 'Gutierrez',
        documentType: 'DNI',
        documentNumber: '76251458',
        birthDate: '2005-01-16',
        gender: 'M',
        phone: '987123654',
        address: 'Cal. Amazonas 345',
        email: 'correo@example.com'
      },
      enrollmentStatus: 'Inscrito'
    };

    // Crear una copia para edición
    this.currentData = JSON.parse(JSON.stringify(this.originalData));
    this.isEditMode = false;

    this.modalService.open(this.modalReadEnrollment, { 
      centered: true,
      size: 'xl',
      backdrop: 'static'
    });
  }

  enableEditMode() {
    this.isEditMode = true;
  }

  cancelEdit() {
    // Restaurar datos originales
    this.currentData = JSON.parse(JSON.stringify(this.originalData));
    this.isEditMode = false;
  }

  saveChanges() {
    if (this.currentData) {
      // Actualizar los datos originales
      this.originalData = JSON.parse(JSON.stringify(this.currentData));
      this.isEditMode = false;
      
      // Emitir evento con los datos actualizados
      this.enrollmentUpdated.emit(this.currentData);
      
      // Mostrar mensaje de éxito
      alert('Cambios guardados exitosamente');
    }
  }

  onCancel() {
    if (this.isEditMode) {
      // Si está en modo edición, preguntar si quiere descartar cambios
      if (confirm('¿Estás seguro de que quieres descartar los cambios?')) {
        this.cancelEdit();
        this.modalService.dismissAll();
      }
    } else {
      this.modalService.dismissAll();
    }
  }
}
