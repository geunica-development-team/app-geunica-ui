import { Component, ElementRef, EventEmitter, inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CampusService, dataCampusAll } from '../../../services/campus.service';
import { dataLevelAll, LevelService } from '../../../services/level.service';
import { dataGradeAll, GradeService } from '../../../services/grade.service';
import { dataSectionAll, SectionService } from '../../../services/section.service';
import { ClassroomService } from '../../../services/classroom.service';
import { dataPeriodAll, PeriodService } from '../../../services/period.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../enviroments/environment';

@Component({
  selector: 'app-modal-add-classroom',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-add-classroom.component.html',
  styleUrl: './modal-add-classroom.component.css'
})
export class ModalAddClassroomComponent {
  @Output() classroomAdded = new EventEmitter<void>();

  private http = inject(HttpClient);
  private formBuilder = inject(FormBuilder);
  private notification = inject(ToastrService);
  private modal = inject(NgbModal);
  private BaseUrl = environment.apiBase;

  // Dropdown lists
  campusList: any[]   = [];
  levelList: any[]    = [];
  gradeList: any[]    = [];
  sectionList: any[]  = [];
  periodList: any[]   = [];
  selectedLevelId = 0;

  // Form
  form = this.formBuilder.group({
    name:           ['', Validators.required],
    campus:         [0, [Validators.required, Validators.min(1)]],
    level:          [0, [Validators.required, Validators.min(1)]],
    grade:          [0, [Validators.required, Validators.min(1)]],
    section:        [0, [Validators.required, Validators.min(1)]],
    period:         [0, [Validators.required, Validators.min(1)]],
    shift:          ['', Validators.required],
    capacity:       [0, [Validators.required, Validators.min(1)]],
    specialCapacity:[0, [Validators.required, Validators.min(1)]],
  });

  @ViewChild('modalAddClassroom') modalAddClassroom!: TemplateRef<ElementRef>;

  ngOnInit() {
    // Carga inicial de listas
    this.http.get<any[]>(`${this.BaseUrl}/campus`).subscribe(v => this.campusList = v);
    this.http.get<any[]>(`${this.BaseUrl}/level`).subscribe(v => this.levelList = v);
    this.http.get<any[]>(`${this.BaseUrl}/section`).subscribe(v => this.sectionList = v);
    this.http.get<any[]>(`${this.BaseUrl}/period`)
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

  // Cuando cambia el nivel, recarga grados
  onLevelChange() {
  const lvl = this.form.value.level;
  console.log('onLevelChange(): nivel seleccionado =', lvl);//mañana revisar esto por consola
  this.http.get<any[]>(`${this.BaseUrl}/grade?levelId=${lvl}`)
    .subscribe(v => {
      console.log('grados recibidos:', v);
      this.gradeList = v;
    });
  this.form.patchValue({ grade: 0 });
  }

  

  loadGrades(levelId: number) {
  this.gradeList = [];              // limpia la lista vieja
  this.form.patchValue({ grade: 0 });// resetea el control
  this.http.get<any[]>(`${this.BaseUrl}/grade?levelId=${levelId}`)
    .subscribe(v => this.gradeList = v);
  }


  openModal() {
    this.modal.open(this.modalAddClassroom, { centered: true, size: 'lg', backdrop: 'static' });
  }

  addClassroom() {
    if (this.form.invalid) {
      this.notification.error('Debes completar todos los campos correctamente', 'Error');
      return;
    }
    // Prepara el body con los nombres de la propiedad tal como el backend espera
    const f = this.form.value;
    const body = {
      name:            f.name,                    // ya es string
      shift:           f.shift,                   // ya es string
      capacity:        +f.capacity!,               // number
      specialCapacity: +f.specialCapacity!,        // number
      idCampus:        +f.campus!,                 // number
      idGrade:         +f.grade!,                  // number
      idSection:       +f.section!,                // number
      idPeriod:        f.period ? +f.period : undefined,  // number | undefined
    };
    console.log('Payload a crear aula:', body);

    this.http.post(`${this.BaseUrl}/classrooms`, body)
      .subscribe({
        next: () => {
          this.notification.success('Aula agregada', 'Éxito');
          this.classroomAdded.emit();
          this.modal.dismissAll();
          this.form.reset({ campus: 0, level: 0, grade: 0, section: 0, period: 0, shift: '' });
        },
        error: err => {
          this.notification.error(err.error?.message || err.message, 'Error');
        }
      });
  }

  onCancel() {
    this.gradeList = [];
    this.form.reset({ campus: 0, level: 0, grade: 0, section: 0, period: 0, shift: '' });
    this.modal.dismissAll();
  }
}
