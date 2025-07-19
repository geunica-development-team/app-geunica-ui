import { Component, ElementRef, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CampusService, dataCampus } from '../../../../services/campus.service';
import { dataLevel, dataLevelAll, LevelService } from '../../../../services/level.service';
import { dataGrade, dataGradeAll, GradeService } from '../../../../services/grade.service';
import { dataSection, SectionService } from '../../../../services/section.service';
import { error } from 'console';

@Component({
  selector: 'app-modal-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-edit.component.html',
  styleUrl: './modal-edit.component.css'
})
export class ModalEditComponent {
  @Input({required : true}) activeTab: string = 'sedes';
  @Input() rowId!: number;
  @Output() updated = new EventEmitter<void>();

  private modalService = inject(NgbModal);
  private toolsForm = inject(FormBuilder);
  private notifycation = inject(ToastrService);
  private campusService = inject(CampusService);
  private levelService = inject(LevelService);
  private gradeService = inject(GradeService);
  private sectionService = inject(SectionService);


  ngOnInit(): void {
    if (this.rowId) {
      this.loadGradeDetails();
    }
  }

  getTitle(): string {
    switch (this.activeTab) {
      case 'sedes': return 'Editar sede';
      case 'niveles': return 'Editar nivel/programa';
      case 'grados': return 'Editar grado';
      case 'secciones': return 'Editar sección';
      default: return 'Editar';
    }
  }

  //PARA EDITAR SEDE
  formEditCampus = this.toolsForm.group({
    'name': ['', [Validators.required]],
    'location': ['', [Validators.required]]
  })

  loadCampusDetails() {
    if (this.rowId && !isNaN(this.rowId)) {
      this.campusService.getCampusById(this.rowId).subscribe({
        next: (campus) => {
          this.formEditCampus.patchValue({
            name: campus.name,
            location: campus.location
          });
        },
        error: (error) => {
          this.notifycation.error('Error al cargar los detalles del campus', 'Error');
        }
      })
    } else {
      this.notifycation.error('ID del campus inválido', 'Error');
    }
  }

  updateCampus() {
    if (this.formEditCampus.valid && this.rowId) {
      const updatedCampus: dataCampus = {
        name: this.formEditCampus.get('name')?.value ?? '',
        location: this.formEditCampus.get('location')?.value ?? ''
      }
      this.campusService.updateCampus(this.rowId, updatedCampus).subscribe({
        next: (value: any) => {
          this.notifycation.success(`Sede actualizada con éxito.`, 'Éxito');
          this.updated.emit();
          this.modalService.dismissAll();
          this.formEditCampus.reset();
        },
        error: (error: Error) => {
          this.notifycation.error(error.message, 'Error');
        }
      })
    } else {
      this.notifycation.error('Debes completar todos los campos correctamente', 'Error');
    }
  }

  //PARA EDITAR NIVEL/PROGRAMA
  formEditLevel = this.toolsForm.group({
    'name': ['', [Validators.required]],
    'cost': ['', [Validators.required]],
    'state': ['', [Validators.required]]
  })

  loadLevelDetails() {
    if (this.rowId && !isNaN(this.rowId)) {
      this.levelService.getLevelById(this.rowId).subscribe({
        next: (level) => {
          this.formEditLevel.patchValue({
            name: level.name,
            cost: String(level.cost),
            state: level.state
          });
        },
        error: (error) => {
          this.notifycation.error('Error al cargar los detalles del nivel/programa', 'Error');
        }
      })
    } else {
      this.notifycation.error('ID del nivel inválido', 'Error');
    }
  }

  updateLevel() {
    if (this.formEditLevel.valid && this.rowId) {
      const updatedLevel: dataLevel = {
        name: this.formEditLevel.get('name')?.value ?? '',
        cost: Number(this.formEditLevel.get('cost')?.value) ?? 0,
        state: this.formEditLevel.get('state')?.value ?? '',
      }
      this.levelService.updateLevel(this.rowId, updatedLevel).subscribe({
        next: (value: any) => {
          this.notifycation.success(`Nivel/programa actualizado con éxito.`, 'Éxito');
          this.updated.emit();
          this.modalService.dismissAll();
          this.formEditLevel.reset();
        },
        error: (error: Error) => {
          this.notifycation.error(error.message, 'Error');
        }
      })
    } else {
      this.notifycation.error('Debes completar todos los campos correctamente', 'Error');
    }
  }

  //PARA EDITAR GRADO
  formEditGrade = this.toolsForm.group({
    'name': ['', [Validators.required]],
    'level': [0, [Validators.required]]
  })

  levels: dataLevelAll[] = []
  
  loadLevels() {
  this.levelService.getAllLevels().subscribe({
    next: (levels) => {
      this.levels = levels;
    },
    error: (err) => {
      this.notifycation.error('Error al cargar los niveles', 'Error');
    }
  });
}


  loadGradeDetails() {
    if (this.rowId && !isNaN(this.rowId)) {
      this.gradeService.getGradeById(this.rowId).subscribe({
        next: (grade) => {
          this.loadLevels()
          this.formEditGrade.patchValue({
            name: grade.name,
            level: grade.level?.id
          });
        },
        error: (error) => {
          this.notifycation.error('Error al cargar los detalles del grado', 'Error');
        }
      })
    } else {
      this.notifycation.error('ID del grado inválido', 'Error');
    }
  }

  updateGrade() {
    if (this.formEditGrade.valid && this.rowId) {
      const updatedGrade: dataGrade = {
        name: this.formEditGrade.get('name')?.value ?? '',
        idLevel: this.formEditGrade.get('level')?.value ?? 0,
      }
      this.gradeService.updateGrade(this.rowId, updatedGrade).subscribe({
        next: (value: any) => {
          this.notifycation.success(`Grado actualizado con éxito.`, 'Éxito');
          this.updated.emit();
          this.modalService.dismissAll();
          this.formEditGrade.reset();
        },
        error: (error: Error) => {
          this.notifycation.error(error.message, 'Error');
        }
      })
    } else {
      this.notifycation.error('Debes completar todos los campos correctamente', 'Error');
    }
  }

//PARA EDITAR SECCION
  formEditSection = this.toolsForm.group({
    'name': ['', [Validators.required]]
  })

  loadSectionDetails() {
    if (this.rowId && !isNaN(this.rowId)) {
      this.sectionService.getSectionById(this.rowId).subscribe({
        next: (section) => {
          this.formEditSection.patchValue({
            name: section.name
          });
        },
        error: (error) => {
          this.notifycation.error('Error al cargar los detalles de la seccion', 'Error');
        }
      })
    } else {
      this.notifycation.error('ID de la seccion inválido', 'Error');
    }
  }

  updateSection() {
    if (this.formEditSection.valid && this.rowId) {
      const updatedSection: dataSection = {
        name: this.formEditSection.get('name')?.value ?? ''
      }
      this.sectionService.updateSection(this.rowId, updatedSection).subscribe({
        next: (value: any) => {
          this.notifycation.success(`Sección actualizada con éxito.`, 'Éxito');
          this.updated.emit();
          this.modalService.dismissAll();
          this.formEditSection.reset();
        },
        error: (error: Error) => {
          this.notifycation.error(error.message, 'Error');
        }
      })
    } else {
      this.notifycation.error('Debes completar todos los campos correctamente', 'Error');
    }
  }

  @ViewChild('modalEdit') modalEdit!: TemplateRef<ElementRef>;  

  openModal() {
    this.modalService.open(this.modalEdit, { 
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
    switch (this.activeTab) {
      case 'sedes':
        this.loadCampusDetails();
        break;
      case 'niveles':
        this.loadLevelDetails();
        break;
      case 'grados':
        this.levelService.getAllLevels().subscribe({
        next: (levels) => {
          this.levels = levels;
          this.loadGradeDetails();
        },
        error: (err) => {
          this.notifycation.error('Error al cargar niveles', 'Error');
        }
      });
      break;
      case 'secciones':
        this.loadSectionDetails();
        break;
    }
  }

  onCancel() {
    switch (this.activeTab) {
      case 'sedes':
        this.formEditCampus.reset();
        break;
      case 'niveles':
        this.formEditLevel.reset();
        break;
      case 'grados':
      this.formEditGrade.reset();
      break;
      case 'secciones':
      this.formEditSection.reset();
      break;
    }
    this.modalService.dismissAll();
  }
}
