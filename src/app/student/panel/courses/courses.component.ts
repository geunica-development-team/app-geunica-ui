import { Component, OnInit } from '@angular/core';
import { CardCoursesComponent } from '../../../components/card-courses/card-courses.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearcherComponent } from '../../../components/searcher/searcher.component';
import { HttpClient } from '@angular/common/http';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { environment } from '../../../../enviroments/environment';



@Component({
  selector: 'app-courses',
  
  imports: [CardCoursesComponent, CommonModule, FormsModule, RouterModule, SearcherComponent, PanelHeaderComponent],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
// Reemplaza la inicialización vacía
courses: any[] = [];
filteredCourse: any[] = [];
searchTerm: string = '';

// ---- ngOnInit() de prueba (usar mocks mientras desarrollas) ----
ngOnInit() {
  // Comenta la llamada real al backend mientras pruebas:
  // this.http.get<any[]>(`${this.baseUrl}/student/me/courses`).subscribe(...)

  this.loadMockCourses();
}

// ----- Método mock: 2 cursos falsos -----
loadMockCourses() {
  this.courses = [
    {
      classAssignmentId: 9001,
      courseName: 'Matemáticas Aplicadas I',
      courseCode: 'MAT-101',
      teacherName: 'Dra. Elena Fuentes',

    },
    {
      classAssignmentId: 9002,
      courseName: 'Historia del Perú y América',
      courseCode: 'HIS-210',
      teacherName: 'Prof. Ricardo Tapia',

    }
  ];

  // Inicializar filteredCourse para que el componente muestre todo al inicio
  this.filteredCourse = [...this.courses];

  console.log('Mock courses loaded', this.courses);

}
}
