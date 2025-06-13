import { Component, ViewChild } from '@angular/core';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { SubjectGradeBarComponent } from '../student-component/subject-grade-bar/subject-grade-bar.component';
import { TableComponent } from '../../../components/table/table.component';
import { Assignment } from '../../services/assignments.service';

interface SubjectGrade {
  subject: string;
  currentScore: number;
  maxScore: number;
  color: string;
}

interface Announcement {
  title: string;
  description: string;
  type: 'warning' | 'info' | 'success';
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [PanelHeaderComponent, SubjectGradeBarComponent, TableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  attendancePercentage = 80;
  
  //PROGRESO Y CALIFICACIÓN POR CURSO
  subjectGrades: SubjectGrade[] = [
    { subject: 'Aritmética', currentScore: 18, maxScore: 20, color: '#FFED9F' },
    { subject: 'Biología', currentScore: 16, maxScore: 20, color: '#c4b5fd' },
    { subject: 'Anatomía', currentScore: 19, maxScore: 20, color: '#FFCED0' },
    { subject: 'Historia', currentScore: 17, maxScore: 20, color: '#C6E8CA' },
    // ... más materias
  ];

  // ANUNCIOS
  announcements: Announcement[] = [
    {
      title: 'Anuncio del Día Deportivo',
      description: 'El Día Deportivo anual se llevará a cabo el 15 de mayo de 2024. ¡Apunta la fecha!',
      type: 'warning',
      icon: 'fas fa-trophy'
    },
    {
      title: 'Inicio de Vacaciones de Verano',
      description: 'Las vacaciones de verano comienzan el 25 de mayo de 2024. ¡Que tengas unas felices vacaciones!',
      type: 'info',
      icon: 'fas fa-sun'
    }
  ];

  //TAREAS EN TABLA
  // COLUMNAS DE LA TABLA
  columns = [
    'ID',
    'Tarea',
    'Curso',
    'Vencimiento',
    'Estado'
  ];
  
  // MAPEO PARA COLUMNAS Y FILAS
  columnMappings = {
    'ID': 'id',
    'Tarea': 'task',
    'Curso': 'subject',
    'Vencimiento': 'dueDate',
    'Estado': 'status'
  };

  rows: Assignment[] = [
    { id: '01', task: 'Leer los capítulos 1 al 3', subject: 'Comunicación', dueDate: '12 mayo 2024', status: 'En progreso' },
    { id: '02', task: 'Resolver la hoja de ejercicios #5', subject: 'Matemática', dueDate: '12 mayo 2024', status: 'Completado' },
    { id: '03', task: 'Redactar informe de laboratorio sobre titulación ácido-base', subject: 'Física', dueDate: '12 mayo 2024', status: 'Pendiente' },
    { id: '04', task: 'Preparar exposición oral', subject: 'Química', dueDate: '12 mayo 2024', status: 'Pendiente' },
    { id: '05', task: 'Crear obra artística para proyecto final', subject: 'Arte', dueDate: '12 mayo 2024', status: 'Pendiente' },
    { id: '06', task: 'Redactar informe sobre el cambio climático', subject: 'Ciencias Ambientales', dueDate: '12 mayo 2024', status: 'Completado' },
    { id: '07', task: 'Resolver cuestionario de álgebra', subject: 'Matemática', dueDate: '12 mayo 2024', status: 'Completado' },
    { id: '08', task: 'Prepararse para debate en clase de Historia', subject: 'Historia', dueDate: '12 mayo 2024', status: 'Pendiente' },
    { id: '09', task: 'Entregar diseño final para proyecto de arquitectura', subject: 'Arquitectura', dueDate: '12 mayo 2024', status: 'Completado' }
  ];

  //HORARIO HOY
  todaySchedule = [
    { subject: 'Aritmética', time: '8:00 AM', color: '#fbbf24' },
    { subject: 'Inglés', time: '9:00 AM', color: '#a78bfa' },
    { subject: 'Lenguaje', time: '10:00 AM', color: '#34d399' },
    { subject: 'Biología', time: '11:00 AM', color: '#60a5fa' },
    { subject: 'Historia', time: '1:00 PM', color: '#f87171' },
    { subject: 'Música', time: '2:00 PM', color: '#fb7185' }
  ];

  ngOnInit(): void { }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Completado': return 'badge bg-success';
      case 'En progreso': return 'badge bg-primary';
      case 'Pendiente': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  getAnnouncementClass(type: string): string {
    switch (type) {
      case 'warning': return 'alert-warning';
      case 'info': return 'alert-info';
      case 'success': return 'alert-success';
      default: return 'alert-secondary';
    }
  }

  //APLICAR FILTRO EN LA TABLA
  @ViewChild('assignmentsTable') assignmentsTable?: TableComponent;

  applyFilter(event: Event) {
    if (this.assignmentsTable) {
      this.assignmentsTable.filterValue = (
        event.target as HTMLInputElement
      ).value;
      this.assignmentsTable.updateTable();
    }
  }
}
