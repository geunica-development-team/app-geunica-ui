import { Component, ElementRef, EventEmitter, inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CampusService, dataCampusAll } from '../../../services/campus.service';
import { dataLevelAll, LevelService } from '../../../services/level.service';
import { dataGradeAll, GradeService } from '../../../services/grade.service';
import { dataSectionAll, SectionService } from '../../../services/section.service';
import { ClassroomService } from '../../../services/classroom.service';

@Component({
  selector: 'app-modal-add-classroom',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-add-classroom.component.html',
  styleUrl: './modal-add-classroom.component.css'
})
export class ModalAddClassroomComponent {
  @Output() classroomAdded = new EventEmitter<any>();

  private modalService = inject(NgbModal);
  private toolsForm = inject(FormBuilder);
  private notifycation = inject(ToastrService);
  private classroomService = inject(ClassroomService);
  private campusService = inject(CampusService);
  private levelService = inject(LevelService);
  private gradeService = inject(GradeService);
  private sectionService = inject(SectionService);

  ngOnInit() {
    this.loadCampus();
    this.loadLevels();
    this.loadGrades();
    this.loadSections();
  }

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

  formAddClassroom = this.toolsForm.group({
    'name': [''],
    'campus': ['', [Validators.required]],
    'grade': ['', [Validators.required]],
    'section': ['', [Validators.required]],
    'shift': ['', [Validators.required]],
    'capacity': ['', [Validators.required]],
    'specialCapacity': ['', [Validators.required]]
  })

  addClassroom() {
    if (this.formAddClassroom.invalid) {
      this.notifycation.error('Debes completar todos los campos correctamente', 'Error');
      return;
    }
    this.classroomService.addClassroom({
      name: this.formAddClassroom.get('name')?.value ?? '',
      idCampus: Number(this.formAddClassroom.get('campus')?.value) ?? 0,
      idGrade: Number(this.formAddClassroom.get('grade')?.value) ?? 0,
      idSection: Number(this.formAddClassroom.get('section')?.value) ?? 0,
      shift: this.formAddClassroom.get('shift')?.value ?? '',
      capacity: Number(this.formAddClassroom.get('capacity')?.value) ?? 0,
      specialCapacity: Number(this.formAddClassroom.get('specialCapacity')?.value) ?? 0,
    }).subscribe({
      next: (value: any) => {
        this.notifycation.success('Aula agregada', 'Éxito')
        this.classroomAdded.emit();
        this.modalService.dismissAll();
        this.formAddClassroom.reset();
      },
      error: (error: Error) => {
        this.notifycation.error(error.message, 'Error');
      }
    })
  }
  
  @ViewChild('modalAddClassroom') modalAddClassroom!: TemplateRef<ElementRef>;  

  openModal() {
    this.modalService.open(this.modalAddClassroom, { 
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
  }

  onCancel() {
    this.formAddClassroom.reset();
    this.modalService.dismissAll();
  }
}
