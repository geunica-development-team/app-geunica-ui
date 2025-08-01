import { Component, ElementRef, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modal-edit-classroom',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-edit-classroom.component.html',
  styleUrl: './modal-edit-classroom.component.css'
})
export class ModalEditClassroomComponent {
  @Input() rowId!: number;
  @Output() classroomEdited = new EventEmitter<void>();

  private http = inject(HttpClient);
  private toolsForm = inject(FormBuilder);
  private notification = inject(ToastrService);
  private modalService = inject(NgbModal);
  private baseUrl = environment.apiBase;

  // Dropdown data
  campusList: any[] = [];
  levelList: any[] = [];
  gradeList: any[] = [];
  sectionList: any[] = [];
  periodList: any[] = [];

  formEditClassroom: FormGroup = this.toolsForm.group({
    name: ['', Validators.required],
    campus: [0, Validators.required],
    level: [0, Validators.required],
    grade: [0, Validators.required],
    section: [0, Validators.required],
    period: [0, Validators.required],
    state: [null, Validators.required],
    shift: ['', Validators.required],
    capacity: [0, Validators.required],
    specialCapacity: [0, Validators.required]
  });

  //@ViewChild('modalEdit')   modalEdit!:   ModalEditClassroomComponent;
@ViewChild('modalEditClassroom') modalEdit!: TemplateRef<any>;
  ngOnInit() {
    // preload dropdowns
    this.http.get<any[]>(`${this.baseUrl}/campus`).subscribe(v => this.campusList = v);
    this.http.get<any[]>(`${this.baseUrl}/level`).subscribe(v => this.levelList = v);
    this.http.get<any[]>(`${this.baseUrl}/section`).subscribe(v => this.sectionList = v);
    this.http.get<any[]>(`${this.baseUrl}/period`)
    //.subscribe(v => this.periodList = v);
    .subscribe(v => {
      // Mapeamos para añadirles la clase CSS según el estado
      this.periodList = v.map(p => ({
        ...p,
        cssClass: p.state === 'En curso'
                  ? 'text-success fw-semibold'
                  : 'text-danger fw-semibold'
      }));
    });
  }

  openModal() {
    this.loadDetails();
    this.modalService.open(this.modalEdit, { centered: true, size: 'lg', backdrop: 'static' });
  }

  loadDetails() {
    this.http.get<any>(`${this.baseUrl}/classrooms/${this.rowId}`)
      .subscribe({
        next: data => {
          // after fetching, set dependent grade list
          if (data.grade?.level?.id) {
            this.loadGrades(data.grade.level.id);
          }
          this.formEditClassroom.patchValue({
            name: data.name,
            campus: data.campus.id ,
            level: data.grade.level.id ,
            grade: data.grade.id ,
            section: data.section.id ,
            period: data.period.id ?? null, 

            state: data.state as any,
            shift: data.shift,
            capacity: data.capacity,
            specialCapacity: data.specialCapacity
          });
        },
        error: () => this.notification.error('Error cargando detalles del aula', 'Error')
      });
  }

  onLevelChange() {
    const lvl = this.formEditClassroom.value.level;
    this.loadGrades(lvl);
    this.formEditClassroom.patchValue({ grade: 0 });
  }

  loadGrades(levelId: number) {
    this.http.get<any[]>(`${this.baseUrl}/grade?levelId=${levelId}`)
      .subscribe(v => this.gradeList = v);
  }

  save() {
    if (this.formEditClassroom.invalid || !this.rowId) {
      this.notification.error('Corrige los campos', 'Error');
      return;
    }    
    const f = this.formEditClassroom.value;   
    const body = {
      name:            f.name,
      shift:           f.shift,
      capacity:        +f.capacity,
      specialCapacity: +f.specialCapacity,
      idCampus:        +f.campus,
      idGrade:         +f.grade,
      idSection:       +f.section,
      // ojo: el DTO define `id_period?`
      idPeriod:        f.period != null ? +f.period : undefined,
      state:           f.state
      
    };
    console.log('Payload to backend:', body);
    this.http
      .patch(`${this.baseUrl}/classrooms/${this.rowId}`, body)
      .subscribe({
        next: () => {
          this.notification.success('Aula actualizada', 'Éxito');
          this.classroomEdited.emit();
          this.modalService.dismissAll();
        },
        error: err => this.notification.error(err.error?.message || err.message, 'Error')
      });
  }


  cancel() {
    this.formEditClassroom.reset();
    this.modalService.dismissAll();
  }
}
