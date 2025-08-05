import { Component, inject, ViewChild } from '@angular/core';
import { PanelHeaderComponent } from "../../../components/dashboard/shared-components/panel-header/panel-header.component";
import { TableComponent } from '../../../components/table/table.component';
import { ClassroomService, dataClassroomAll } from '../../services/classroom.service';
import { ModalAddClassroomComponent } from './modal-add-classroom/modal-add-classroom.component';
import { ModalEditClassroomComponent } from "./modal-edit-classroom/modal-edit-classroom.component";
import { ModalDeleteClassroomComponent } from "./modal-delete-classroom/modal-delete-classroom.component";
import { ModalClassAssignmentComponent } from './modal-class-assignment/modal-class-assignment.component';

@Component({
  selector: 'app-classrooms',
  imports: [PanelHeaderComponent, TableComponent, ModalAddClassroomComponent, ModalEditClassroomComponent, ModalDeleteClassroomComponent, ModalClassAssignmentComponent],
  templateUrl: './classrooms.component.html',
  styleUrl: './classrooms.component.css'
})
export class ClassroomsComponent {
  private classroomService = inject(ClassroomService);

  ngOnInit() {
    this.loadClassrooms();
  }

  @ViewChild('modalEditClassroom') modalEditClassroom!: ModalEditClassroomComponent;
  openModalEditClassroom(row: any) {
    if (row && row.id && !isNaN(row.id)) {
      this.modalEditClassroom.rowId = Number(row.id);
      this.modalEditClassroom.openModal();
    } else {
      console.error('ID inválido:', row.id);
    }
  }

  @ViewChild('modalDeleteClassroom') modalDeleteClassroom!: ModalDeleteClassroomComponent;
  openModalDeleteClassroom(row: any) {
    if (row && row.id && !isNaN(row.id)) {
      this.modalDeleteClassroom.rowId = Number(row.id);
      this.modalDeleteClassroom.openModal();
    } else {
      console.error('ID inválido:', row.id);
    }
  }

  @ViewChild('modalClassAssignment') modalClassAssignment!: ModalClassAssignmentComponent;
  openModalClassAssignment(row: any) {
    if (row && row.id && !isNaN(row.id)) {
      this.modalClassAssignment.rowId = Number(row.id);
      this.modalClassAssignment.openModal();
    } else {
      console.error('ID inválido:', row.id);
    }
  }
  
  // COLUMNAS DE LA TABLA
  columns = [
    'ID',
    'Nombre',
    'Periodo',
    'Estado',
    'Sede',
    'Nivel',
    'Grado y Sección',
    'Turno',
    'Capacidad',
    'Cursos asignados',
  ];
  
  // MAPEO PARA COLUMNAS Y FILAS
  columnMappings = {
    'ID': 'id',
    'Nombre': 'name',
    'Periodo': 'period',
    'Estado': 'stateText',
    'Sede': 'campus',
    'Nivel': 'level',
    'Grado y Sección': 'gradeAndSection',
    'Turno': 'shift',
    'Capacidad': 'capacityDisplay',
    'Cursos asignados': 'classAssignmentsSummary'
  };

  rows: dataClassroomAll[] = [];

  @ViewChild('classroomTable') classroomTable?: TableComponent;

  loadClassrooms() {
    this.classroomService.getAllClassrooms().subscribe({
      next:(classroom) => {
        this.rows = classroom.map((classroom: any): dataClassroomAll & {
          gradeAndSection: string,
          capacityDisplay: string,
          stateText: string,
          stateClass: string,
          classAssignmentsSummary: string
        } => ({
          id: classroom.id,
          name: classroom.name,
          campus: classroom.campus?.name,
          level: classroom.grade?.level?.name,
          grade: classroom.grade?.name,
          shift: classroom.shift,
          section: classroom.section?.name,
          period: classroom.period?.name,
          specialCapacity: classroom.specialCapacity,
          capacity: classroom.capacity,
          stateText: classroom.period?.state === true ? 'En curso': 'Finalizado',
          stateClass: classroom.period?.state === true ? 'badge bg-success-subtle text-success fw-semibold' : 'badge bg-danger-subtle text-danger fw-semibold',
          gradeAndSection: `${classroom.grade.name} ${classroom.section.name}`,
          capacityDisplay: `${classroom.totalStudents}/${classroom.capacity} | ${classroom.totalSpecialStudents}/${classroom.specialCapacity}`,
          totalStudents: classroom.totalStudents,
          totalSpecialStudents: classroom.totalSpecialStudents,
          classAssignments: classroom.classAssignments ?? [],
          classAssignmentsSummary: classroom.classAssignments?.length > 0
          ? `${classroom.classAssignments?.length} curso/s asignado/s`
          : '-',
        }));
        if (this.classroomTable) {
          this.classroomTable.updateTable();
        }
      },
        error: (error) => {
          console.error('Error al cargar la lista de aulas: ', error);
        }
    });
  }

  applyFilter(event: Event) {
    if (this.classroomTable) {
      this.classroomTable.filterValue = (
        event.target as HTMLInputElement
      ).value;
      this.classroomTable.updateTable();
    }
  }

  onCreatedOrEditedOrDeleted() {
    this.loadClassrooms();
  }
}
