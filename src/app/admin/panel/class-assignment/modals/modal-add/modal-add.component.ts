import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../../enviroments/environment';
import { CommonModule } from '@angular/common';

interface Course { id: number; name: string; }
interface Teacher {
  id: number;
  person: {
    id: number;
    names: string;
    paternalSurname: string;
    maternalSurname: string;
    // y cualquier otro campo que traiga…
  };
  specialty: string;

}

@Component({
  selector: 'app-modal-add',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modal-add.component.html',
  styleUrl: './modal-add.component.css'
})
export class ModalAddComponent {

  private modalService = inject(NgbModal);
  private formBuilder           = inject(FormBuilder);
  private notification       = inject(ToastrService);
  private http         = inject(HttpClient);
  private route        = inject(ActivatedRoute);
  private baseUrl      = environment.apiBase;

  @Input({ required: true }) activeTab!: string;
  @Output() added = new EventEmitter<void>();

  @ViewChild('modalAddTpl', { static: true }) modalAddTpl!: TemplateRef<any>;

  form!: FormGroup;
  courses: Course[] = [];
  teachers: Array<{ id: number; name: string; specialty: string;}> = [];
  selectedSpecialty = '';
  isLoading = false;

  ngOnInit() {
    // construir form
    this.form = this.formBuilder.group({
      courseId:    ['0', Validators.required],
      teacherId:   ['0', Validators.required],
      startTime:   ['', [Validators.required, Validators.pattern(/^([0-1]\d|2[0-3]):[0-5]\d$/)]],
      endTime:     ['', [Validators.required, Validators.pattern(/^([0-1]\d|2[0-3]):[0-5]\d$/)]],
    });

    // Cargar dropdowns
    this.http.get<Course[]>(`${this.baseUrl}/course`)
      .subscribe(data => this.courses = data);

    this.http.get<Teacher[]>(`${this.baseUrl}/teacher`)
      .subscribe(data => {
        this.teachers = data.map(t => ({
          id:        t.id,
          name:      `${t.person.names} ${t.person.paternalSurname} ${t.person.maternalSurname}`,
          specialty: t.specialty
        }));
      })
        // Escuchar cambios en la selección de docente
    this.form.get('teacherId')!.valueChanges.subscribe((id: number) => {
      const sel = this.teachers.find(t => t.id === +id);
      this.selectedSpecialty = sel ? sel.specialty : '';
    });
  }

  getTitle() {
    // capitalizar primera letra
    const day = this.activeTab.charAt(0).toUpperCase() + this.activeTab.slice(1);
    return `Agregar al bloque de: ${day}`;
  }

  openModal() {
    this.modalService.open(this.modalAddTpl, {
      centered: true,
      size: 'lm',
      backdrop: 'static'
    });
  }

  onCancel() {
    this.modalService.dismissAll();
    this.form.reset();
    this.selectedSpecialty = '';

  }
  capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

  onSubmit() {
    if (this.form.invalid) {
      this.notification.error('Completa todos los campos correctamente', 'Error');
      return;
    }
    const classroomId = +this.route.snapshot.paramMap.get('id')!;
    const payload = {
      courseId:   this.form.value.courseId,
      teacherId:  this.form.value.teacherId,
      day: this.capitalize(this.activeTab),
      startTime:  this.form.value.startTime,
      endTime:    this.form.value.endTime
    };
    this.isLoading = true;
    this.http.post(`${this.baseUrl}/aula/${classroomId}/schedule`, payload)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.notification.success('Bloque agregado', 'Éxito');
          this.modalService.dismissAll();
          this.added.emit();
          this.form.reset();
          this.selectedSpecialty = '';
        },
        error: err => {
          this.isLoading = false;
          this.notification.error(err.error?.message || err.message, 'Error');
        }
      });
  }
  
}
