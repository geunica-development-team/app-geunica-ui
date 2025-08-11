import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardCoursesComponent } from '../../../components/card-courses/card-courses.component';
import { SearcherComponent } from '../../../components/searcher/searcher.component';
import { HttpClient } from '@angular/common/http';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { environment } from '../../../../enviroments/environment';

@Component({
  selector: 'app-assigned-courses',
  imports: [CommonModule, CardCoursesComponent, SearcherComponent, PanelHeaderComponent],
  templateUrl: './assigned-courses.component.html',
  styleUrl: './assigned-courses.component.css'
})
export class AssignedCoursesComponent implements OnInit {
  courses: any[]         = [];
  filteredCourses: any[] = [];
  searchTerm = '';

  private baseUrl = environment.apiBase;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // 1) Llamamos a /teacher/me/assignments
    this.http
      .get<any[]>(`${this.baseUrl}/teacher/me/assignments`)
      .subscribe({
        next: data => {
          // data: Array de ClassAssignment con relaciones course y classroom
          this.courses         = data;
          this.filteredCourses = data;
        },
        error: err => console.error('Error al cargar asignaciones:', err)
      });
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredCourses = this.courses.filter(c =>
      c.course.name.toLowerCase().includes(term)
    );
  }
  
}
