import { Component, ElementRef, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CampusService } from '../../../../services/campus.service';
import { dataLevelAll, LevelService } from '../../../../services/level.service';
import { GradeService } from '../../../../services/grade.service';
import { SectionService } from '../../../../services/section.service';
import { PeriodService } from '../../../../services/period.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../enviroments/environment';

@Component({
  selector: 'app-modal-add',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-add.component.html',
  styleUrl: './modal-add.component.css'
})
export class ModalAddComponent {
  //@Input({required : true}) activeTab: string = 'sedes'; 
   @Input({ required: true })
  activeTab!: string;
  @Output() added = new EventEmitter<any>();

  private http = inject(HttpClient);
  private fb   = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private modal = inject(NgbModal);
  private baseUrl = environment.apiBase;

  levels: any[] = [];

  // Forms
  formCampus   = this.fb.group({ name: ['', Validators.required], location: ['', Validators.required] });
  formLevel    = this.fb.group({ name: ['', Validators.required], cost: ['', Validators.required] });
  formGrade    = this.fb.group({ name: ['', Validators.required], levelName: ['', Validators.required] });
  formSection  = this.fb.group({ name: ['', Validators.required] });
  formPeriod   = this.fb.group({
    name: ['', Validators.required],
    start_date: ['', Validators.required],
    end_date:   ['', Validators.required],
    state:     [null, Validators.required],
  });

  @ViewChild('modalAdd') modalAdd!: TemplateRef<ElementRef>; 

  ngOnInit() {
    this.http.get<any[]>(`${this.baseUrl}/level`)
      .subscribe(data => this.levels = data);
  }

  openModal() {
    this.modal.open(this.modalAdd, { centered: true, size: 'lg', backdrop: 'static' })
  }

  onCancel() {
    this.modal.dismissAll();
    this.resetForms();
  }

    resetForms() {
    this.formCampus.reset();
    this.formLevel.reset();
    this.formGrade.reset();
    this.formSection.reset();
    this.formPeriod.reset({ state: null });
  }

  getTitle() {
    return {
      sedes:     'Registrar nueva sede',
      niveles:   'Registrar nuevo nivel',
      grados:    'Registrar nuevo grado',
      secciones: 'Registrar nueva sección',
      periodos:  'Registrar nuevo periodo'
    }[this.activeTab]!;
  }

  addCampus() {
    if (this.formCampus.invalid) return this.errorForm();
    const body = this.formCampus.value;
    this.http.post(`${this.baseUrl}/campus`, body)
      .subscribe(() => this.onSuccess('Sede creada'));
  }

  addLevel() {
    if (this.formLevel.invalid) return this.errorForm();
    const body = { 
      name: this.formLevel.value.name!, 
      cost: parseFloat(this.formLevel.value.cost!) 
    };
    this.http.post(`${this.baseUrl}/level`, body)
      .subscribe(() => this.onSuccess('Nivel/programa creado'));
  }


  addGrade() {
  if (this.formGrade.invalid) {
    this.toastr.error('Debes completar todos los campos correctamente', 'Error');
    return;
  }
  const { name, levelName } = this.formGrade.value;
  this.http.post(`${this.baseUrl}/grade`, { name, levelName })
    .subscribe({
      next: () => this.onSuccess('Grado creado'),
      error: err => this.toastr.error(err.error?.message || err.message, 'Error')
    });
  }

  addSection() {
    if (this.formSection.invalid) return this.errorForm();
    const body = this.formSection.value;
    this.http.post(`${this.baseUrl}/section`, body)
      .subscribe(() => this.onSuccess('Sección creada'));
  }

  addPeriod() {
    if (this.formPeriod.invalid) return this.errorForm();
    const { name, start_date, end_date, state } = this.formPeriod.value;
    // state viene como boolean, lo convertimos a string
    const stateStr = state ? 'active' : 'inactive';
    this.http.post(`${this.baseUrl}/period`, { name, start_date, end_date, state: stateStr })
      .subscribe(() => this.onSuccess('Periodo creado'));
  }

    private errorForm() {
    this.toastr.error('Debes completar todos los campos correctamente', 'Error');
  }

  private onSuccess(msg: string) {
    this.toastr.success(msg, 'Éxito');
    this.modal.dismissAll();
    this.added.emit();
    this.resetForms();
  }
   


}
