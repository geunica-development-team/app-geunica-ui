import { Component, ElementRef, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms';
import { ClassroomService, dataClassroomAll } from '../../../services/classroom.service';
import { InscriptionService } from '../../../services/inscription.service';
import { ToastrService } from 'ngx-toastr';
import { CampusService, dataCampusAll } from '../../../services/campus.service';
import { dataLevelAll, LevelService } from '../../../services/level.service';
import { dataGradeAll, GradeService } from '../../../services/grade.service';
import { EnrollmentService } from '../../../services/registration.service';

export interface dataClassroomAdapted {
  id: number;
  shift: string;
  capacity: number;
  special_capacity: number;
  total_students: number;
  total_special_students: number;
  campus: string;
  level: string;
  period: string;
  periodState: string;
  grade: string;
  section: string;
  status: string;
}

@Component({
  selector: 'app-modal-continue-registration',
  imports: [FormsModule],
  templateUrl: './modal-continue-registration.component.html',
  styleUrl: './modal-continue-registration.component.css'
})
export class ModalContinueRegistrationComponent {
  @Output() classroomAssigned = new EventEmitter<any>();
  @Input() rowId!: number;

  //INYECCIONES
  private modalService = inject(NgbModal);
  private notifycation = inject(ToastrService);
  private classroomService = inject(ClassroomService);
  private inscriptionService = inject(InscriptionService);
  private enrollmentService = inject(EnrollmentService);
  private campusService = inject(CampusService);
  private levelService = inject(LevelService);
  private gradeService = inject(GradeService);
  
  isLoadingGroups = true;
  
  //PARA IMPRIMIR LOS DATOS EN LA VISTA
  studentFullName: string = '';

  registrationDate: string = '';
  levelAndGrade: string = '';

  hasPsychology: boolean = false;
  psyEvaluationDate: string = '';
  psyEvaluationResult: string = '';

  loadStudentDetails() {
    if (this.rowId && !isNaN(this.rowId)) {
      this.inscriptionService.getInscriptionById(this.rowId).subscribe({
        next: (enrollment) => {
          //STUDENT
          const names = enrollment.student?.person?.names ?? '';
          const paternal = enrollment.student?.person?.paternalSurname ?? '';
          const maternal = enrollment.student?.person?.maternalSurname ?? '';
          this.studentFullName = `${names} ${paternal} ${maternal}`;

          //INSCRIPTION
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
          } else {
            this.psyEvaluationDate = '';
            this.psyEvaluationResult = '';
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

  //PARA LISTAR LOS SALONES
  classrooms: dataClassroomAll[] = []
  availableGroups: dataClassroomAdapted[] = []

  @ViewChild('modalContinueRegistration') modalContinueRegistration!: TemplateRef<ElementRef>;

  loadClassrooms() {
    this.isLoadingGroups = true;

    this.classroomService.getAllClassrooms().subscribe({
      next:(classrooms) => {
        this.classrooms = classrooms;
        
        this.isLoadingGroups = false;

        this.availableGroups = classrooms.map(classroom => ({
          id: classroom.id,
          shift: classroom.shift,
          capacity: classroom.capacity,
          special_capacity: classroom.specialCapacity,
          total_students: classroom.totalStudents,
          total_special_students: classroom.totalSpecialStudents,
          campus: classroom.campus?.name,
          level: classroom.grade?.level?.name,
          period: classroom.period?.name,
          periodState: classroom.period?.state ? 'En curso' : 'Finalizado',
          grade: classroom.grade?.name,
          section: classroom.section?.name,
          status: ''
        }));
        this.updateGroupAvailability();
      },
      error: (error) => {
        this.isLoadingGroups = false;
        console.error('Error al cargar salones', error);
      }
    })
  }

  openModal() {
    this.loadClassrooms();
    this.loadStudentDetails();
    this.loadCampus();
    this.loadLevels();
    this.loadGrades();
    this.clearFilters();
    
    this.modalService.open(this.modalContinueRegistration, { 
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
  }

  //ID DEL AULA SELECCIONADA
  selectedClassroomId: number | null = null;

  //PARA APLICAR LOS FILTROS
  selectedCampus: string = '';
  selectedLevel: string = '';
  selectedGrade: string = '';

  
  campus: dataCampusAll[] = []
  loadCampus() {
    this.campusService.getAllCampus().subscribe({
      next: (value) => {
        this.campus = value;
      },
      error: (error: Error) => {
        console.error('Error al cargar las sedes', error);
      }
    })
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
  
  //FILTRAR GRADO POR NIVEL
  selectedLevelId: number | null = null;

  onLevelChange() {
   const selected = this.levels.find(level => level.id === this.selectedLevelId);
    this.selectedLevel = selected?.name ?? '';
    this.selectedGrade = '';
  }

  get filteredGrades() {
    if (!this.selectedLevelId) return this.grades;
    return this.grades.filter(grade => grade.level.id === this.selectedLevelId);
  }
  
  //FILTRAR SALONES
  get filteredGroups(): dataClassroomAdapted[] {
    return this.availableGroups.filter(group => {
      const levelMatch = !this.selectedLevel || group.level?.toLowerCase() === this.selectedLevel.toLowerCase();
      const gradeMatch = !this.selectedGrade || group.grade?.toLowerCase() === this.selectedGrade.toLowerCase();
      const campusMatch = !this.selectedCampus || group.campus?.toLowerCase() === this.selectedCampus.toLowerCase();
    
      return levelMatch && gradeMatch && campusMatch;
    })
  }
  
  updateGroupAvailability() {
    this.availableGroups.forEach(group => {
      // Verificar si el grupo está completo
      const isFull = group.total_students >= group.capacity;      
      // Determinar el estado del grupo
      if (isFull) {
        group.status = 'Completo';
      } else {
        group.status = 'Disponible';
      }
    });
  }
  
  getGroupStatusClass(classroom: dataClassroomAdapted): string {
    switch (classroom.status) {
      case 'Disponible':
        return 'badge badge-success';
      case 'Saturado':
        return 'badge badge-warning';
      case 'Completo':
        return 'badge badge-danger';
      default:
        return 'badge badge-secondary';
    }
  }

  // Método para verificar si un grupo debe estar deshabilitado
  isGroupDisabled(classroom: dataClassroomAdapted): boolean {
    const studentHasCondition = this.psyEvaluationResult === 'Con condición';

    const isGroupFull = classroom.total_students >= classroom.capacity;
    const specialCapacityFull = classroom.total_special_students >= classroom.special_capacity;
  
    if (isGroupFull) {
      return true;
    }
    if (studentHasCondition && specialCapacityFull) {
      return true;
    }
    return false;
  }

  // Método para obtener información detallada sobre la disponibilidad
  getGroupAvailabilityInfo(classroom: dataClassroomAdapted): string {
    const studentHasCondition = this.psyEvaluationResult === 'Con condición';
    const availableSpots = classroom.capacity - classroom.total_students;
    const availableSpecialSpots = classroom.special_capacity - classroom.total_special_students;
    
    if (classroom.total_students >= classroom.capacity) {
      return 'Grupo completo';
    }
    
    if (studentHasCondition && classroom.total_special_students >= classroom.special_capacity) {
      return 'Sin cupo para estudiantes con condición especial';
    }
    
    if (studentHasCondition) {
      return `${availableSpots} cupos disponibles (${availableSpecialSpots} para condición especial)`;
    }
    
    return `${availableSpots} cupos disponibles`;
  }

  get isSelectedGroupDisabled(): boolean {
    if (!this.selectedClassroomId) return true;
    const group = this.availableGroups.find(g => g.id === this.selectedClassroomId);
    return group ? this.isGroupDisabled(group) : true;
  }

  onConfirm() {
    if (!this.selectedClassroomId) {
      this.notifycation.warning('Debes seleccionar un aula', 'Grupo no seleccionado');
      return;
    }
    
    const selectedGroup = this.availableGroups.find(g => g.id === this.selectedClassroomId);
    
    if (!selectedGroup) {
      this.notifycation.error('El grupo seleccionado no existe', 'Error');
      return;
    }

    if (this.isGroupDisabled(selectedGroup)) {
      this.notifycation.warning('El grupo seleccionado no tiene cupos disponibles', 'Sin cupos');
      return;
    }

    const dataClassroomSelected = {
      idInscription: this.rowId,
      idClassroom: this.selectedClassroomId
    };

    this.enrollmentService.addEnrollment(dataClassroomSelected).subscribe({
      next: () => {

        const newState = { state: 'Salón asignado' };

        this.inscriptionService.changeState(this.rowId, newState).subscribe({
          next: () => {
            this.notifycation.success('Matrícula creada y salón asignado exitosamente', 'Éxito');
            this.classroomAssigned.emit();
            this.modalService.dismissAll();
          },
          error: (error) => {
            this.notifycation.warning('Matrícula creada pero error en el cambio de estado', 'Advertencia');
            this.modalService.dismissAll();
          }
        });
      },
      error: (error) => {
        this.notifycation.error(error.message, 'Error al crear matrícula');
      }
    })

  }

  rejectInscription() {
    const confirmReject = confirm('¿Estás seguro de rechazar esta inscripción?');

    if (!confirmReject) return;

    const newState = { state: 'Rechazado' };

    this.inscriptionService.changeState(this.rowId, newState).subscribe({
      next: () => {
        this.notifycation.success('Inscripción rechazada correctamente', 'Rechazo exitoso');
        this.classroomAssigned.emit();
        this.modalService.dismissAll();
      },
      error: (error) => {
        this.notifycation.error('Error al rechazar la inscripción', 'Error');
      }
    });
  }

  onCancel() {
    this.selectedClassroomId = null;
    this.availableGroups = [];
    this.modalService.dismissAll();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 porque enero es 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  clearFilters(): void {
    this.selectedCampus = '';
    this.selectedLevel = '';
    this.selectedGrade = '';
    this.selectedClassroomId = null;

    this.filteredGroups; // vuelve a aplicar filtros sin nada seleccionado
  }
}
