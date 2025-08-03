import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../../enviroments/environment';
import { CommonModule } from '@angular/common';

interface Course  { id: number; name: string; }
interface Teacher { 
  id: number; 
  person: { names: string; paternalSurname: 
    string; maternalSurname: string; }; 
    specialty: string; }

export interface ScheduleRow {
  schedule_id:      number;  // el PK de class_schedule
  classroom_id:     number;
  classroom_name:   string;
  day_of_week:      string;
  course_id:        number;  // <-- nuevo
  course_name:      string;
  teacher_id:       number;  // <-- nuevo
  teacher_name:     string;
  teacher_specialty:string;
  start_time:       string;
  end_time:         string;
}


@Component({
  selector: 'app-modal-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-edit.component.html',
  styleUrl: './modal-edit.component.css'
})
export class ModalEditComponent {

   private modalService = inject(NgbModal);
  private fb           = inject(FormBuilder);
  private http         = inject(HttpClient);
  private route        = inject(ActivatedRoute);
  private notify       = inject(ToastrService);
  private baseUrl      = environment.apiBase;

  @Input() data!: any;
  @Input() activeTab!: string;
  @Output() updated = new EventEmitter<void>();

  @ViewChild('modalEditTpl', { static: true }) modalEditTpl!: TemplateRef<any>;

  form: FormGroup = this.fb.group({
    courseId:  ['0', Validators.required],
    teacherId: ['0', Validators.required],
    startTime: ['', Validators.required],
    endTime:   ['', Validators.required]
  });

  courses: Course[] = [];
  teachers: { id: number; name: string; specialty: string }[] = [];
  selectedSpecialty = '';
  isLoading = false;

  ngOnInit() {
    // Carga de dropdowns
    this.http.get<Course[]>(`${this.baseUrl}/course`).subscribe(c => this.courses = c);
    this.http.get<Teacher[]>(`${this.baseUrl}/teacher`).subscribe(list => {
      this.teachers = list.map(x => ({
        id: x.id,
        name: `${x.person.names} ${x.person.paternalSurname} ${x.person.maternalSurname}`,
        specialty: x.specialty
      }));
    });

    // Al cambiar docente, actualizar especialidad
    this.form.get('teacherId')!.valueChanges.subscribe(val => {
      const t = this.teachers.find(x => x.id === +val);
      this.selectedSpecialty = t ? t.specialty : '';
    });
  }

  getTitle(): string {
    return 'Editar bloque fdadsf';
  }

  openModal() {
    // Parchea valores desde `data`
    this.form.patchValue({
      courseId:  String(this.data.course_id),
      teacherId: String(this.data.teacher_id),
      startTime: this.data.start_time,
      endTime:   this.data.end_time
    });
    this.selectedSpecialty = this.data.teacher_specialty;
    this.modalService.open(this.modalEditTpl, { centered: true, size: 'lg', backdrop: 'static' });
  }

  onSave() {
    if (this.form.invalid) {
      this.notify.error('Completa todos los campos', 'Error');
      return;
    }
    const raw = this.route.snapshot.paramMap.get('id');
    if (!raw) {
      this.notify.error('ID de aula inválido','Error');
      return;
    }
    const classroomId = +raw;
    const scheduleId  = this.data.schedule_id;

    // Obtener campos del formulario
    const courseId  = +this.form.get('courseId')!.value;
    const teacherId = +this.form.get('teacherId')!.value;
    const startTime = this.form.get('startTime')!.value;
    const endTime   = this.form.get('endTime')!.value;

    const payload = {
      courseId,
      teacherId,
      day: this.capitalize(this.activeTab),
      startTime,
      endTime
    };

    this.isLoading = true;
    this.http.patch(
      `${this.baseUrl}/aula/${classroomId}/schedule/${scheduleId}`,
      payload
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.notify.success('Bloque actualizado','Éxito');
        this.modalService.dismissAll();
        this.updated.emit();
      },
      error: e => {
        this.isLoading = false;
        this.notify.error(e.error?.message || e.message,'Error');
      }
    });
  }

  private capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }

  onCancel() {
    this.modalService.dismissAll();
    this.form.reset();
    this.selectedSpecialty = '';
  }
}
