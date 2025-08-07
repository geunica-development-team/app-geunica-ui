import { Component, ElementRef, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { ClassroomService, dataClassroomById } from '../../../../services/classroom.service';
import { ToastrService } from 'ngx-toastr';
import { dataTeacherAll, TeacherService } from '../../../../services/teacher.service';
import { CourseService, dataCourseAll } from '../../../../services/course.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AssignClassroomService, dataAssignClassroom, dataScheduleClassroom } from '../../../../services/class-assignment.service';

interface ScheduleItem {
  day: string
  startTime: string
  endTime: string
}

@Component({
  selector: 'app-modal-class-assignment',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './modal-class-assignment.component.html',
  styleUrl: './modal-class-assignment.component.css'
})
export class ModalClassAssignmentComponent {
  @Output() assigned = new EventEmitter<any>();
  @Input() classroomId!: number;

  private modalService = inject(NgbModal);
  private toolsForm = inject(FormBuilder);
  private notifycation = inject(ToastrService);
  private classroomService = inject(ClassroomService);
  private courseService = inject(CourseService);
  private teacherService = inject(TeacherService);
  private assignService = inject(AssignClassroomService);

  ngOnInit() {
    this.formClassAssignment.get('course')?.valueChanges.subscribe((value) => {
      this.selectedCourseId = Number(value);
    });

    this.formClassAssignment.get('teacher')?.valueChanges.subscribe((value) => {
      this.selectedTeacherId = Number(value);
    });
  }

  courses: dataCourseAll[] = []
  loadCourses() {
    this.courseService.getAllCourses().subscribe({
      next: (value) => {
        this.courses = value;
      },
      error: (error: Error) => {
        console.error('Error al cargar los cursos', error);
      }
    })
  }

  teachers: dataTeacherAll[] = []
  loadTeachers() {
    this.teacherService.getAllTeachers().subscribe({
      next: (value) => {
        this.teachers = value;
      },
      error: (error: Error) => {
        console.error('Error al cargar los docentes', error);
      }
    })
  }

  formClassAssignment = this.toolsForm.group({
    'course': [null, [Validators.required]],
    'teacher': [null, [Validators.required]]
  })

  dataClassroom: dataClassroomById | null = null;
  selectedClassroomId : number | null = null;

  selectedTeacherId: number | undefined = undefined;
  selectedCourseId: number | undefined = undefined;

  schedules: ScheduleItem[] = [];

  loadClassroomDetails() {
    if (this.classroomId && !isNaN(this.classroomId)) {
      this.classroomService.getClassroomById(this.classroomId).subscribe({
        next: (classroom) => {
          this.dataClassroom = classroom;
          
          this.selectedClassroomId = classroom.id
        },
        error: (error) => {
          this.notifycation.error('Error al cargar los detalles del aula', 'Error');
        }
      })
    } else {
      this.notifycation.error('ID del grado inválido', 'Error');
    }
  }

  addSchedule() {
    this.schedules.push({
      day: '',
      startTime: '',
      endTime: ''
    });
  }

  removeScheduleRow(index: number) {
    if (this.schedules.length > 1) {
      this.schedules.splice(index, 1)
    }
  }

  getSelectedCourseInfo(): string {
    const course = this.courses.find((c) => c.id === this.selectedCourseId)
    return course ? `${course.name}` : ""
  }

  getSelectedCourseDescription(): string {
    const course = this.courses.find((c) => c.id === this.selectedCourseId)
    return course ? `Nivel: ${course.area || "N/A"}` : ""
  }

  getSelectedTeacherInfo(): string {
    const teacher = this.teachers.find((t) => t.id === this.selectedTeacherId)
    return teacher ? `${teacher.person?.names} ${teacher.person?.paternalSurname} ${teacher.person?.maternalSurname}` : ""
  }

  getSelectedTeacherSpecialty(): string {
    const teacher = this.teachers.find((t) => t.id === this.selectedTeacherId)
    return teacher?.specialty || "N/A"
  }

  // Métodos de validación
  isInvalidTimeRange(schedule: ScheduleItem): boolean {
    if (!schedule.startTime || !schedule.endTime) return false
    return schedule.startTime >= schedule.endTime
  }

  hasTimeConflict(schedule: ScheduleItem, currentIndex: number): boolean {
    if (!schedule.day || !schedule.startTime || !schedule.endTime) return false

    return this.schedules.some((otherSchedule, index) => {
      if (index === currentIndex) return false
      if (otherSchedule.day !== schedule.day) return false
      if (!otherSchedule.startTime || !otherSchedule.endTime) return false

      // Verificar solapamiento de horarios
      const start1 = schedule.startTime
      const end1 = schedule.endTime
      const start2 = otherSchedule.startTime
      const end2 = otherSchedule.endTime

      return start1 < end2 && end1 > start2
    })
  }

  hasOverlappingSchedules(): boolean {
    return this.schedules.some((schedule, index) => this.hasTimeConflict(schedule, index))
  }

  areAllSchedulesValid(): boolean {
    return this.schedules.every(
      (schedule) => schedule.day && schedule.startTime && schedule.endTime && !this.isInvalidTimeRange(schedule),
    )
  }

  getTotalScheduleHours(): number {
    return this.schedules.reduce((total, schedule) => {
      if (!schedule.startTime || !schedule.endTime) return total

      const start = new Date(`2000-01-01T${schedule.startTime}`)
      const end = new Date(`2000-01-01T${schedule.endTime}`)
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

      return total + (hours > 0 ? hours : 0)
    }, 0)
  }

  canSaveAssignment(): boolean {
    return !!(
      this.selectedClassroomId &&
      this.selectedCourseId &&
      this.selectedTeacherId &&
      this.schedules.length > 0 &&
      this.areAllSchedulesValid() &&
      !this.hasOverlappingSchedules()
    )
  }

  onSaveAssignment() {
    if (!this.canSaveAssignment()) return;

    const payloadAssign: dataAssignClassroom = {
      idClassroom: this.selectedClassroomId!,
      idCourse: this.selectedCourseId!,
      idTeacher: this.selectedTeacherId!
    };

    this.assignService.addAssignClassroom(payloadAssign).subscribe({
      next: (data: any) => {
        const classAssignmentId = data.id;

        const scheduleRequests = this.schedules.map(schedule => {
          const schedulePayload: dataScheduleClassroom = {
            idClassAssignment: classAssignmentId,
            day: schedule.day,
            startTime: schedule.startTime,
            endTime: schedule.endTime
          };
          return this.assignService.addScheduleClassroom(schedulePayload);
        });

        forkJoin(scheduleRequests).subscribe({
          next: () => {
            this.notifycation.success('Asignación y horarios creados con éxito', 'Éxito');
            this.assigned.emit(); // si quieres que el padre refresque la lista
            this.modalService.dismissAll();
          },
          error: (error) => {
            console.error(error);
            this.notifycation.error('Error al guardar los horarios', 'Error');
          }
        });
      },
      error: (error) => {
        console.error(error);
        this.notifycation.error('Error al guardar la asignación', 'Error');
      }
    })
  }

  @ViewChild('modalClassAssignment') modalClassAssignment!: TemplateRef<ElementRef>;  

  openModal() {
    // Inicializar con un horario vacío
    this.schedules = [
      {
        day: "",
        startTime: "",
        endTime: "",
      },
    ]

    this.loadClassroomDetails();
    this.loadTeachers();
    this.loadCourses();
    this.modalService.open(this.modalClassAssignment, { 
      centered: true,
      size: 'xl',
      backdrop: 'static'
    });
  }

  onCancel() {
    this.formClassAssignment.reset();
    this.modalService.dismissAll();
  }
}
