import { Component, ElementRef, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ClassroomService, dataClassroom } from '../../../services/classroom.service';
import { CampusService, dataCampusAll } from '../../../services/campus.service';
import { dataLevelAll, LevelService } from '../../../services/level.service';
import { dataGradeAll, GradeService } from '../../../services/grade.service';
import { dataSectionAll, SectionService } from '../../../services/section.service';

@Component({
  selector: 'app-modal-edit-classroom',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-edit-classroom.component.html',
  styleUrl: './modal-edit-classroom.component.css'
})
export class ModalEditClassroomComponent {
  @Output() classroomEdited = new EventEmitter<any>();
  @Input() rowId!: number;

  private modalService = inject(NgbModal);
  private toolsForm = inject(FormBuilder);
  private notifycation = inject(ToastrService);
  private classroomService = inject(ClassroomService);
  private campusService = inject(CampusService);
  private levelService = inject(LevelService);
  private gradeService = inject(GradeService);
  private sectionService = inject(SectionService);

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

  //FILTRAR LOS GRADOS POR NIVEL
  selectedLevelId: number | null = null;

  get filteredGrades() {
    if (!this.selectedLevelId) return this.grades;
    return this.grades.filter(grade => grade.level.id === this.selectedLevelId);
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


  sections: dataSectionAll[] = []
  loadSections() {
    this.sectionService.getAllSections().subscribe({
      next: (value) => {
        this.sections = value;
      },
      error: (error: Error) => {
        console.error('Error al cargar las secciones', error);
      }
    })
  }

  formEditClassroom = this.toolsForm.group({
    'name': [''],
    'campus': [0, [Validators.required]],
    'grade': [0, [Validators.required]],
    'section': [0, [Validators.required]],
    'shift': ['', [Validators.required]],
    'capacity': [0, [Validators.required]],
    'specialCapacity': [0, [Validators.required]]
  })

  loadClassroomDetails() {
    if (this.rowId && !isNaN(this.rowId)) {
      this.classroomService.getClassroomById(this.rowId).subscribe({
        next: (classroom) => {
          this.formEditClassroom.patchValue({
            name: classroom.name,
            campus: classroom.campus?.id,
            grade: classroom.grade?.id,
            section: classroom.section?.id,
            shift: classroom.shift,
            capacity: classroom.capacity,
            specialCapacity: classroom.specialCapacity,
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

  updateClassroom() {
    if (this.formEditClassroom.valid && this.rowId) {
      const updatedClassroom: dataClassroom = {
        name: this.formEditClassroom.get('name')?.value ?? '',
        idCampus: Number(this.formEditClassroom.get('campus')?.value) ?? 0,
        idGrade: Number(this.formEditClassroom.get('grade')?.value) ?? 0,
        idSection: Number(this.formEditClassroom.get('section')?.value) ?? 0,
        shift: this.formEditClassroom.get('shift')?.value ?? '',
        capacity: Number(this.formEditClassroom.get('capacity')?.value) ?? 0,
        specialCapacity: Number(this.formEditClassroom.get('specialCapacity')?.value) ?? 0,
      }
      this.classroomService.updateClassroom(this.rowId, updatedClassroom).subscribe({
        next: (value: any) => {
          this.notifycation.success(`Aula actualizada con éxito.`, 'Éxito');
          this.classroomEdited.emit();
          this.modalService.dismissAll();
          this.formEditClassroom.reset();
        },
        error: (error: Error) => {
          this.notifycation.error(error.message, 'Error');
        }
      })
    } else {
      this.notifycation.error('Debes completar todos los campos correctamente', 'Error');
    }
  }
  
  @ViewChild('modalEditClassroom') modalEditClassroom!: TemplateRef<ElementRef>;  

  openModal() {
    this.loadClassroomDetails();
    this.loadCampus();
    this.loadLevels();
    this.loadGrades();
    this.loadSections();
    this.modalService.open(this.modalEditClassroom, { 
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
  }

  onCancel() {
    this.formEditClassroom.reset();
    this.modalService.dismissAll();
  }
}
