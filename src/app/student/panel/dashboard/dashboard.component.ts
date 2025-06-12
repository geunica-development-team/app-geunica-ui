import { Component } from '@angular/core';
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

  //ANUNCIOS
  announcements: Announcement[] = [
    {
      title: 'Sports Day Announcement',
      description: 'The annual Sports Day will be held on May 15, 2024. Mark your calendars!',
      type: 'warning',
      icon: 'fas fa-trophy'
    },
    {
      title: 'Summer Break Start Date',
      description: 'Summer break begins on May 25, 2024. Have a wonderful holiday!',
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
    'Fecha de vencimiento',
    'Estado'
  ];
  
  // MAPEO PARA COLUMNAS Y FILAS
  columnMappings = {
    'ID': 'id',
    'Tarea': 'task',
    'Curso': 'subject',
    'Fecha de vencimiento': 'dueDate',
    'Estado': 'status'
  };

  rows: Assignment[] = [
    { id: '01', task: 'Read Chapters 1-3', subject: 'English', dueDate: '12 May 2024', status: 'En progreso' },
    { id: '02', task: 'Complete Problem Set #5', subject: 'Maths', dueDate: '12 May 2024', status: 'Completado' },
    { id: '03', task: 'Write Lab Report on Acid-Base Titration', subject: 'Physics', dueDate: '12 May 2024', status: 'Pendiente' },
    { id: '04', task: 'Prepare for Oral Presentation', subject: 'Chemistry', dueDate: '12 May 2024', status: 'Pendiente' },
    { id: '05', task: 'Create Art Piece for Final Project', subject: 'English', dueDate: '12 May 2024', status: 'Pendiente' },
    { id: '06', task: 'Write Research Paper on Climate Change', subject: 'EVS', dueDate: '12 May 2024', status: 'Completado' },
    { id: '07', task: 'Complete Math Quiz on Algebra', subject: 'Math', dueDate: '12 May 2024', status: 'Completado' },
    { id: '08', task: 'Prepare for History Class Debate', subject: 'History', dueDate: '12 May 2024', status: 'Pendiente' },
    { id: '09', task: 'Submit Final Design for Architecture Project', subject: 'Architecture', dueDate: '12 May 2024', status: 'Completado' }
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
      case 'Completed': return 'badge bg-success';
      case 'In Progress': return 'badge bg-primary';
      case 'Not Started': return 'badge bg-danger';
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

}
