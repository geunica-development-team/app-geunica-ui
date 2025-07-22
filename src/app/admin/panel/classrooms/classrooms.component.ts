import { Component, inject, ViewChild } from '@angular/core';
import { PanelHeaderComponent } from "../../../components/dashboard/shared-components/panel-header/panel-header.component";
import { TableComponent } from '../../../components/table/table.component';
import { ClassroomService, dataClassroomAll } from '../../services/classroom.service';
import { ModalAddClassroomComponent } from './modal-add-classroom/modal-add-classroom.component';
import { ModalEditClassroomComponent } from "./modal-edit-classroom/modal-edit-classroom.component";
import { ModalDeleteClassroomComponent } from "./modal-delete-classroom/modal-delete-classroom.component";

@Component({
  selector: 'app-classrooms',
  imports: [PanelHeaderComponent, TableComponent, ModalAddClassroomComponent, ModalEditClassroomComponent, ModalDeleteClassroomComponent],
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
  
  // COLUMNAS DE LA TABLA
  columns = [
    'ID',
    'Nombre',
    'Sede',
    'Nivel',
    'Grado y Sección',
    'Turno',
    'Capacidad | Capacidad Condición'
  ];
  
  // MAPEO PARA COLUMNAS Y FILAS
  columnMappings = {
    'ID': 'id',
    'Nombre': 'name',
    'Sede': 'campus',
    'Nivel': 'level',
    'Grado y Sección': 'gradeAndSection',
    'Turno': 'shift',
    'Capacidad | Capacidad Condición': 'capacityDisplay'
  };

  rows: dataClassroomAll[] = [];

  @ViewChild('classroomTable') classroomTable?: TableComponent;

  loadClassrooms() {
    this.classroomService.getAllClassrooms().subscribe({
      next:(classroom) => {
        this.rows = classroom.map((classroom: any): dataClassroomAll & { gradeAndSection: string, capacityDisplay: string } => ({
          id: classroom.id,
          name: classroom.name,
          campus: classroom.campus.name,
          level: classroom.grade.level.name,
          grade: classroom.grade.name,
          shift: classroom.shift,
          section: classroom.section.name,
          specialCapacity: classroom.specialCapacity,
          capacity: classroom.capacity,
          gradeAndSection: `${classroom.grade.name} ${classroom.section.name}`,
          capacityDisplay: `0/${classroom.capacity} | 0/${classroom.specialCapacity}`
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
