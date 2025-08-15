import { Component, OnInit } from '@angular/core';
import { CardCoursesComponent } from '../../../components/card-courses/card-courses.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearcherComponent } from '../../../components/searcher/searcher.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { environment } from '../../../../enviroments/environment';
import { AuthStorageService } from '../../../services/auth-storage.service';

@Component({
  selector: 'app-courses',
  
  imports: [CardCoursesComponent, CommonModule, FormsModule, RouterModule, SearcherComponent, PanelHeaderComponent],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

courses: any[] = [];
  filteredCourse: any[] = [];
  searchTerm = '';

  private baseUrl = environment.apiBase;

  constructor(private http: HttpClient, private authStorage: AuthStorageService) {}

  ngOnInit(): void {
    const token = this.authStorage.getToken();
    const headers = token ? { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) } : {};
    this.http.get<any[]>(`${this.baseUrl}/student/me/courses`, headers)
      .subscribe({
        next: data => { this.courses = data; this.filteredCourse = data; },
        error: err => console.error('Error al cargar mis cursos:', err)
      });
  }

  // Fallback: si tu componente searcher no funciona o quieres filtrar localmente
  onLocalSearch(term: string) {
    const t = term?.trim().toLowerCase() || '';
    if (!t) {
      this.filteredCourse = [...this.courses];
      return;
    }
    this.filteredCourse = this.courses.filter(c =>
      (c.courseName || '').toLowerCase().includes(t)
      || (c.courseCode || '').toLowerCase().includes(t)
      || (c.classroomName || '').toLowerCase().includes(t)
      || (c.teacherName || '').toLowerCase().includes(t)
    );
  }



}
