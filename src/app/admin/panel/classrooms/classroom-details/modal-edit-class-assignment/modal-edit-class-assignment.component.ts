import { Component, ElementRef, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { AssignClassroomService, dataAssignClassroom, dataScheduleClassroom, ScheduleItem } from '../../../../services/class-assignment.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseService, dataCourseAll } from '../../../../services/course.service';
import { dataTeacherAll, TeacherService } from '../../../../services/teacher.service';

@Component({
  selector: 'app-modal-edit-class-assignment',
  imports: [ReactiveFormsModule ,FormsModule],
  templateUrl: './modal-edit-class-assignment.component.html',
  styleUrl: './modal-edit-class-assignment.component.css'
})

export class ModalEditClassAssignmentComponent {
  @Output() edited = new EventEmitter<any>();
  @Input() assignmentId!: number;

  private assignService = inject(AssignClassroomService);
  private toolsForm = inject(FormBuilder);
  private modalService = inject(NgbModal);
  private notifycation = inject(ToastrService);
  private courseService = inject(CourseService);
  private teacherService = inject(TeacherService);

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
  
  formEditClassAssignment = this.toolsForm.group({
    'course': [0, [Validators.required]],
    'teacher': [0, [Validators.required]]
  })

  classroomId!: number;
  teacherId!: number;
  courseId!: number;

  existingSchedules: any[] = [];
  newSchedules: dataScheduleClassroom[] = [];

  loadAssignmentDetails() {
    if (this.assignmentId && !isNaN(this.assignmentId)) {
      this.assignService.getAssignClassroomById(this.assignmentId).subscribe({
        next: (assignment) => {
          this.classroomId = assignment.classroom.id;
          
          this.formEditClassAssignment.patchValue({
            course: assignment.course.id,
            teacher: assignment.teacher.id
          });
        },
        error: (error) => {
          this.notifycation.error('Error al cargar los detalles de asignación', 'Error');
        }
      })
    } else {
      this.notifycation.error('ID de la asignación inválido', 'Error');
    }
    
  }
  
  saveChanges(): void {
    const formValue = this.formEditClassAssignment.value;
    
    if (!formValue.course || !formValue.teacher) {
      this.notifycation.error('Completa todos los campos', 'Error')
      return;
    }
    
    const updatedData: dataAssignClassroom = {
      idClassroom: this.classroomId,
      idCourse: Number(formValue.course),
      idTeacher: Number(formValue.teacher)
    };
    
    this.assignService.updateAssignClassroom(this.assignmentId, updatedData).subscribe({
      next: () => {
        if (this.newSchedules.length === 0) {
          this.notifycation.success('Asignación actualizada');
          this.newSchedules = [];
          this.edited.emit();
          this.modalService.dismissAll();
        } else {
          const scheduleRequests = this.newSchedules.map(schedule =>
            this.assignService.addScheduleClassroom(schedule)
          );
          
          forkJoin(scheduleRequests).subscribe({
            next: () => {
              this.notifycation.success('Asignación y nuevos horarios actualizados');
              this.newSchedules = [];
              this.edited.emit();
              this.modalService.dismissAll();
            },
            error: () => this.notifycation.error('Error al agregar horarios')
          });
        }
      },
      error: () => this.notifycation.error('Error al actualizar asignación')
    });
  }

  @ViewChild('modalEditClassAssignment') modalEditClassAssignment!: TemplateRef<ElementRef>;  
  
  openModal() {
    this.newSchedules = [];

    this.loadAssignmentDetails();
    this.loadCourses();
    this.loadTeachers();
    
    this.assignService.getScheduleByAssigmentId(this.assignmentId).subscribe({
      next: (data: any) => (this.existingSchedules = data),
      error: () => this.notifycation.error('Error al cargar horarios')
    });
    
    this.modalService.open(this.modalEditClassAssignment, { 
      centered: true,
      size: 'xl',
      backdrop: 'static'
    });
  }
  
  addSchedule(): void {
    this.newSchedules.push({ idClassAssignment: this.assignmentId, day: '', startTime: '', endTime: '' });
  }

  removeNewSchedule(index: number): void {
    this.newSchedules.splice(index, 1);
  }

  removeExistingSchedule(scheduleId: number): void {
    this.assignService.deleteScheduleClassroom(scheduleId).subscribe({
      next: () => {
        this.notifycation.success('Horario eliminado');
        this.existingSchedules = this.existingSchedules.filter(s => s.id !== scheduleId);
      },
      error: () => this.notifycation.error('Error al eliminar horario')
    });
  }

  // Métodos de validación
  isInvalidTimeRange(schedule: ScheduleItem): boolean {
    if (!schedule.startTime || !schedule.endTime) return false
    return schedule.startTime >= schedule.endTime
  }

  hasTimeConflict(schedule: ScheduleItem, currentIndex: number): boolean {
    if (!schedule.day || !schedule.startTime || !schedule.endTime) return false;

    const start1 = schedule.startTime;
    const end1 = schedule.endTime;

    // Verificar conflicto con otros NUEVOS horarios
    const conflictWithNewSchedules = this.newSchedules.some((otherSchedule, index) => {
      if (index === currentIndex) return false;
      if (otherSchedule.day !== schedule.day) return false;
      if (!otherSchedule.startTime || !otherSchedule.endTime) return false;

      const start2 = otherSchedule.startTime;
      const end2 = otherSchedule.endTime;

      return start1 < end2 && end1 > start2;
    });

    // Verificar conflicto con EXISTING horarios
    const conflictWithExistingSchedules = this.existingSchedules.some((existing) => {
      if (existing.day !== schedule.day) return false;
      if (!existing.startTime || !existing.endTime) return false;

      const start2 = existing.startTime;
      const end2 = existing.endTime;

      return start1 < end2 && end1 > start2;
    });

    return conflictWithNewSchedules || conflictWithExistingSchedules;
  }

  onCancel() {
    this.newSchedules = [];
    this.modalService.dismissAll();
  }
}
