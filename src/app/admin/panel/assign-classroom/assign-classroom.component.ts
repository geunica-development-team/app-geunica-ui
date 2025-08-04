import { Component, inject, ViewChild } from '@angular/core';
import { PanelHeaderComponent } from "../../../components/dashboard/shared-components/panel-header/panel-header.component";
import { TableComponent } from "../../../components/table/table.component";
import { AssignClassroomService, dataAssignClassroomAll } from '../../services/class-assignment.service';

@Component({
  selector: 'app-assign-classroom',
  imports: [PanelHeaderComponent, TableComponent],
  templateUrl: './assign-classroom.component.html',
  styleUrl: './assign-classroom.component.css'
})
export class AssignClassroomComponent {
  private assignClassroomService = inject(AssignClassroomService);

  ngOnInit() {
    this.loadAssignsClassroom();
  }

  // COLUMNAS DE LA TABLA
  columns = [
    'ID',
    'Curso',
    'Código',
    'Docente',
    'Especialidad',
    'Aula',
    'Turno',
    'Nivel',
    'Grado y Sección'
  ];
  
  // MAPEO PARA COLUMNAS Y FILAS
  columnMappings = {
    'ID': 'id',
    'Curso': 'courseName',
    'Código': 'courseCode',
    'Docente': 'teacherFullName',
    'Especialidad': 'teacherSpecialty',
    'Aula': 'classroomName',
    'Turno': 'shift',
    'Nivel': 'level',
    'Grado y Sección': 'gradeAndSection'
  };

  rows: dataAssignClassroomAll[] = [];

  @ViewChild('assignClassroomTable') assignClassroomTable?: TableComponent;

  loadAssignsClassroom() {
    this.assignClassroomService.getAssignsClassroomAll().subscribe({
      next: (assignClassroom) => {
        this.rows = assignClassroom.map((assignClassroom: any): dataAssignClassroomAll & {gradeAndSection: string} => ({
          id: assignClassroom.id,
          courseName: assignClassroom.course.name,
          courseCode: assignClassroom.course.code,
          classroomName: assignClassroom.classroom.name,
          shift: assignClassroom.classroom.shift,
          grade: assignClassroom.classroom.grade.name,
          section: assignClassroom.classroom.section.name,
          level: assignClassroom.classroom.grade.level.name,
          teacherFullName: `${assignClassroom.teacher.person.names} ${assignClassroom.teacher.person.paternalSurname} ${assignClassroom.teacher.person.maternalSurname}`,
          teacherSpecialty: assignClassroom.teacher.specialty,
          gradeAndSection: `${assignClassroom.classroom.grade.name} ${assignClassroom.classroom.section.name}`
        }));
        if (this.assignClassroomTable) {
          this.assignClassroomTable.updateTable();
        }
      },
      error: (error) => {
        console.error('Error al cargar la lista de asignaciones', error);
      }
    })
  }

  applyFilter(event: Event) {
    if (this.assignClassroomTable) {
      this.assignClassroomTable.filterValue = (
        event.target as HTMLInputElement
      ).value;
      this.assignClassroomTable.updateTable();
    }
  }
}
