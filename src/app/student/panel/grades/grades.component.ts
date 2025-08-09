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
    // Llama al endpoint de mis cursos con profesor
    this.http.get<any[]>(`${this.baseUrl}/student/me/courses`)
      .subscribe(
        data => {
          this.courses = data;
          this.filteredCourse = data;
        },
        err => console.error('Error al cargar mis cursos:', err)
      );
  }

  onCardClick(course: any) {
    console.log('onCardClick, course =', course);

    // intenta detectar el campo correcto (ajusta si tu modelo usa otro nombre)
    const classAssignmentId = course?.assignmentId ?? course?.classAssignmentId ?? course?.idClassAssignment ?? course?.id;

    if (!classAssignmentId) {
      console.error('No se encontró id para navegar. Revisa la propiedad en "course".', course);
      // mostrar UI al usuario o notificación si quieres
      return;
    }

    // navega sólo si existe
    this.router.navigate(['/student/panel', 'grades', classAssignmentId, 'gradesRegistry']);
  }

  
}
