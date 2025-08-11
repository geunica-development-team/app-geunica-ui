import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {  DataStudentService } from '../../services/dataStudent.service';
import { FormsModule } from '@angular/forms';
import { CardCoursesComponent } from '../../../components/card-courses/card-courses.component';
import { SearcherComponent } from '../../../components/searcher/searcher.component';
import { Router, RouterModule } from '@angular/router';
import { Curso, Docente } from '../../services/modelStudent';
import { HttpClient } from '@angular/common/http';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { environment } from '../../../../enviroments/environment';

@Component({
  selector: 'app-grades',
  imports: [CommonModule, FormsModule, SearcherComponent, RouterModule, PanelHeaderComponent],
  templateUrl: './grades.component.html',
  styleUrl: './grades.component.css'
})
export class GradesComponent implements OnInit {
  
  @Input() courses: any[] = [];
  filteredCourse : any[] = [];
  searchTerm: string   = '';

  private baseUrl = environment.apiBase;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
      this.loadMockNotesCourse();
    // Llama al endpoint de mis cursos con profesor
    this.http.get<any[]>(``)
      .subscribe(
        data => {
          this.courses = data;
          this.filteredCourse = data;
        },
        err => console.error('Error al cargar mis cursos:', err)
      );
  }



  // Props existentes


// Nuevo: curso seleccionado para mostrar en modal
selectedCourse: any | null = null;

// ---- ngOnInit() temporal para usar mocks ----


// ---- Mock: 1 card de ejemplo con datos de notas ----
loadMockNotesCourse() {
  this.courses = [
    {
      classAssignmentId: 7777,
      courseName: 'Química General',
      courseCode: 'QUI-120',
      teacherName: 'Dr. Miguel Herrera',
      room: 'Laboratorio 2',
      schedule: 'Lun / Mié 09:00 - 10:30',
      // Datos de notas (solo para mostrar en el modal)
      grades: [
        { label: 'Examen Parcial I', date: '2025-03-10', score: 16.5, weight: 40 },
        { label: 'Actividad 1',        date: '2025-03-20', score: 18.0, weight: 20 },
        { label: 'Examen Parcial II', date: '2025-04-15', score: 14.0, weight: 40 }
      ]
    }
  ];

  // Mostrar en la vista
  this.filteredCourse = [...this.courses];

  console.log('Mock notes course loaded', this.courses);
}

// Actualizar onCardClick para abrir modal en lugar de navegar (si quieres navegar, deja la lógica anterior)
onCardClick(course: any) {
  // detectar id por compatibilidad con distintos modelos
  const classAssignmentId = course?.assignmentId ?? course?.classAssignmentId ?? course?.idClassAssignment ?? course?.id;

  // Abrir modal local con datos (no navega)
  this.selectedCourse = { ...course, classAssignmentId };
this.router.navigate(['/student/panel', 'grades',  'gradesRegistry']);
  // (Opcional) si preferías navegar, reemplaza lo anterior por:
  // this.router.navigate(['/student/panel', 'grades', classAssignmentId, 'gradesRegistry']);
}

// Cerrar modal
closeCourseModal() {
  this.selectedCourse = null;
}

// Util: calcular promedio ponderado (si necesitas mostrarlo)
getCourseWeightedAverage(course: any) {
  const g = course?.grades || [];
  let totalW = 0;
  let totalWeight = 0;
  g.forEach((it: any) => {
    const s = Number(it.score);
    const w = Number(it.weight);
    if (!isNaN(s) && !isNaN(w)) {
      totalW += s * w;
      totalWeight += w;
    }
  });
  return totalWeight > 0 ? Math.round((totalW / totalWeight) * 100) / 100 : 0;
}


  
}
