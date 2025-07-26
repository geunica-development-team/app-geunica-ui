import { Component, ElementRef, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CampusService } from '../../../../services/campus.service';
import { dataLevelAll, LevelService } from '../../../../services/level.service';
import { GradeService } from '../../../../services/grade.service';
import { SectionService } from '../../../../services/section.service';
import { PeriodService } from '../../../../services/period.service';

@Component({
  selector: 'app-modal-add',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-add.component.html',
  styleUrl: './modal-add.component.css'
})
export class ModalAddComponent {
  @Input({required : true}) activeTab: string = 'sedes';
  @Output() added = new EventEmitter<any>();

  private modalService = inject(NgbModal);
  private toolsForm = inject(FormBuilder);
  private notifycation = inject(ToastrService);
  private campusService = inject(CampusService);
  private levelService = inject(LevelService);
  private gradeService = inject(GradeService);
  private sectionService = inject(SectionService);
  private periodService = inject(PeriodService);

  ngOnInit() {
    this.loadLevels();
  }

  getTitle(): string {
    switch (this.activeTab) {
      case 'sedes': return 'Registrar nueva sede';
      case 'niveles': return 'Registrar nuevo nivel/programa';
      case 'grados': return 'Registrar nuevo grado';
      case 'secciones': return 'Registrar nueva sección';
      default: return 'Registrar';
    }
  }

  //PARA AGREGAR SEDE
  formAddCampus = this.toolsForm.group({
    'name': ['', [Validators.required]],
    'location': ['', [Validators.required]]
  })

  addCampus() {
    if (this.formAddCampus.invalid) {
      this.notifycation.error('Debes completar todos los campos correctamente', 'Error');
      return;
    }
    this.campusService.addCampus({
      name: this.formAddCampus.get('name')?.value ?? '',
      location: this.formAddCampus.get('location')?.value ?? ''
    }).subscribe({
      next: (value: any) => {
        this.notifycation.success('Sede agregada', 'Éxito')
        this.added.emit();
        this.modalService.dismissAll();
        this.formAddCampus.reset();
      },
      error: (error: Error) => {
        this.notifycation.error(error.message, 'Error');
      }
    })
  }

  //PARA AGREGAR NIVEL/PROGRAMA
  formAddLevel = this.toolsForm.group({
    'name': ['', [Validators.required]],
    'cost': ['', [Validators.required]]
  })

  addLevel() {
    if (this.formAddLevel.invalid) {
      this.notifycation.error('Debes completar todos los campos correctamente', 'Error');
      return;
    }
    this.levelService.addLevel({
      name: this.formAddLevel.get('name')?.value ?? '',
      cost: Number(this.formAddLevel.get('cost')?.value) ?? 0
    }).subscribe({
      next: (value: any) => {
        this.notifycation.success('Nivel/programa agregado', 'Éxito')
        this.added.emit();
        this.modalService.dismissAll();
        this.formAddLevel.reset();
      },
      error: (error: Error) => {
        this.notifycation.error(error.message, 'Error');
      }
    })
  }

  //PARA AGREGAR GRADO
  formAddGrade = this.toolsForm.group({
    'name': ['', [Validators.required]],
    'level': ['', [Validators.required]]
  })

  levels: dataLevelAll[] = []

  loadLevels() {
    this.levelService.getAllLevels().subscribe({
      next: (value) => {
        this.levels = value;
      },
      error: (error: Error) => {
        console.error('Error al cargar los niveles', error);
      }
    })
  }

  addGrade() {
    if (this.formAddGrade.invalid) {
      this.notifycation.error('Debes completar todos los campos correctamente', 'Error');
      return;
    }
    this.gradeService.addGrade({
      name: this.formAddGrade.get('name')?.value ?? '',
      idLevel: Number(this.formAddGrade.get('level')?.value) ?? 0
    }).subscribe({
      next: (value: any) => {
        this.notifycation.success('Grado agregado', 'Éxito')
        this.added.emit();
        this.modalService.dismissAll();
        this.formAddGrade.reset();
      },
      error: (error: Error) => {
        this.notifycation.error(error.message, 'Error');
      }
    })
  }

  //PARA AGREGAR SECCION
  formAddSection = this.toolsForm.group({
    'name': ['', [Validators.required]]
  })

  addSection() {
    if (this.formAddSection.invalid) {
      this.notifycation.error('Debes completar todos los campos correctamente', 'Error');
      return;
    }
    this.sectionService.addSection({
      name: this.formAddSection.get('name')?.value ?? ''
    }).subscribe({
      next: (value: any) => {
        this.notifycation.success('Sección agregada', 'Éxito')
        this.added.emit();
        this.modalService.dismissAll();
        this.formAddSection.reset();
      },
      error: (error: Error) => {
        this.notifycation.error(error.message, 'Error');
      }
    })
  }

  //PARA AGREGAR PERIODO
  formAddPeriod = this.toolsForm.group({
    'name': ['', [Validators.required]],
    'startDate': ['', [Validators.required]],
    'endDate': ['', [Validators.required]],
    'state': [null, [Validators.required]]
  })

  addPeriod() {
    if (this.formAddPeriod.invalid) {
      this.notifycation.error('Debes completar todos los campos correctamente', 'Error');
      return;
    }
    this.periodService.addPeriod({
      name: this.formAddPeriod.get('name')?.value ?? '',
      startDate: this.formAddPeriod.get('startDate')?.value ?? '',
      endDate: this.formAddPeriod.get('endDate')?.value ?? '',
      state: this.formAddPeriod.get('state')?.value ?? false,
    }).subscribe({
      next: (value: any) => {
        this.notifycation.success('Periodo agregado', 'Éxito')
        this.added.emit();
        this.modalService.dismissAll();
        this.formAddPeriod.reset({
          state: null
        });
      },
      error: (error: Error) => {
        this.notifycation.error(error.message, 'Error');
      }
    })
  }

  @ViewChild('modalAdd') modalAdd!: TemplateRef<ElementRef>;  

  openModal() {
    this.loadLevels();
    this.modalService.open(this.modalAdd, { 
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
  }

  onCancel() {
    switch (this.activeTab) {
      case 'sedes':
        this.formAddCampus.reset();
        break;
      case 'niveles':
        this.formAddLevel.reset();
        break;
      case 'grados':
        this.formAddGrade.reset({
          level: ''
        });
        break;
      case 'secciones':
        this.formAddSection.reset();
        break;
      case 'periodos':
        this.formAddPeriod.reset();
        break;
    }
    this.modalService.dismissAll();
  }
}
