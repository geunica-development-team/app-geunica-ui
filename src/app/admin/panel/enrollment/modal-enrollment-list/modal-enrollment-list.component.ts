import { Component, ElementRef, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { dataEnrollmentList, InscriptionService } from '../../../services/inscription.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClassroomService, dataClassroomAll } from '../../../services/classroom.service';
import { dataRegistration, EnrollmentService } from '../../../services/registration.service';
import { CampusService, dataCampusAll } from '../../../services/campus.service';
import { dataLevelAll, LevelService } from '../../../services/level.service';
import { dataGradeAll, GradeService } from '../../../services/grade.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
  selector: 'app-modal-enrollment-list',
  imports: [FormsModule],
  templateUrl: './modal-enrollment-list.component.html',
  styleUrl: './modal-enrollment-list.component.css'
})
export class ModalEnrollmentListComponent {
  @Output() registrationUpdatedOrDelete = new EventEmitter<any>();
  @Input() rowId!: number;

  private modalService = inject(NgbModal);
  private notifycation = inject(ToastrService);
  private inscriptionService = inject(InscriptionService);
  private classroomService = inject(ClassroomService);
  private enrollmentService = inject(EnrollmentService);
  private campusService = inject(CampusService);
  private levelService = inject(LevelService);
  private gradeService = inject(GradeService);

  enrollments: dataEnrollmentList['enrollments'] = [];

  isLoadingGroups = true;
  psyEvaluationResult: string = '';

  loadEnrollments() {
    this.inscriptionService.getEnrollmentsById(this.rowId).subscribe({
      next: (data) => {
        this.enrollments = data.enrollments ?? [];

        const currentEnrollment = this.enrollments[0];
        this.selectedClassroomId = currentEnrollment?.classroom?.id ?? null;
      },
      error: (error) => {
        console.error('Error al cargar matrículas', error)
        this.enrollments = [];
      }
    })
  }

    //ID DEL AULA SELECCIONADA
  selectedClassroomId: number | null = null;

  //PARA APLICAR LOS FILTROS
  selectedCampus: string = '';
  selectedLevel: string = '';
  selectedGrade: string = '';

  //PARA LISTAR LOS SALONES
  classrooms: dataClassroomAll[] = []
  availableGroups: dataClassroomAdapted[] = []
  
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

  editEnrollment() {
    if (!this.enrollments.length || !this.selectedClassroomId) {
      this.notifycation.error('No hay matrícula seleccionada', 'Error');
      return;
    }

    const enrollmentId = this.enrollments[0].id;

    const payload: dataRegistration = {
      idInscription: this.rowId, // o usa this.enrollments[0].inscription.id si lo tienes
      idClassroom: this.selectedClassroomId
    };

    this.enrollmentService.updateEnrollment(enrollmentId, payload).subscribe({
      next: () => {
        this.notifycation.success('Aula actualizada con éxito', 'Éxito');
        this.registrationUpdatedOrDelete.emit();
        this.loadEnrollments(); // refrescar si gustas
        this.loadClassrooms();
      },
      error: (err) => {
        this.notifycation.error('Hubo un error al actualizar el aula');
        console.error(err);
      }
    });
  }

  deleteEnrollment() {
     if (!this.enrollments.length || !this.selectedClassroomId) {
      this.notifycation.error('No hay matrícula seleccionada', 'Error');
      return;
    }

    const enrollmentId = this.enrollments[0].id;
    
    this.enrollmentService.deleteEnrollment(enrollmentId).subscribe({
      next: () => {
        const newState = { state: 'Evaluado' };

        this.inscriptionService.changeState(this.rowId, newState).subscribe({
          next: () => {
            this.notifycation.success('Matrícula eliminada correctamente', 'Éxito')
            this.modalService.dismissAll();
            this.registrationUpdatedOrDelete.emit();
          }
        })
      }
    })
  }

  @ViewChild('modalEnrollmentList') modalEnrollmentList!: TemplateRef<ElementRef>;

  openModal() {
    this.loadEnrollments();
    this.loadClassrooms();
    this.loadCampus();
    this.loadGrades();
    this.loadLevels();

    this.modalService.open(this.modalEnrollmentList, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
  }

  onCancel() {
    this.modalService.dismissAll();
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'Sin registro';

     try {
      const date = new Date(dateString);

      // Ajustar explícitamente a la zona horaria de Lima
      const formatter = new Intl.DateTimeFormat('es-PE', {
        timeZone: 'America/Lima',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      const parts = formatter.formatToParts(date).reduce((acc, part) => {
        if (part.type !== 'literal') acc[part.type] = part.value;
        return acc;
      }, {} as Record<string, string>);

      return `${parts['day']}/${parts['month']}/${parts['year']} ${parts['hour']}:${parts['minute']}`;
    } catch {
      return 'Fecha inválida';
    }
  }

  clearFilters(): void {
    this.selectedCampus = '';
    this.selectedLevel = '';
    this.selectedGrade = '';
    this.selectedClassroomId = null;

    this.filteredGroups; // vuelve a aplicar filtros sin nada seleccionado
  }
}
