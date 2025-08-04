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
  courses: any[] = [];
  filteredCourse: any[] = [];
  searchTerm: string = '';

  private baseUrl = environment.apiBase;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>(`${this.baseUrl}/student/me/courses`)
      .subscribe(
        data => {
          this.courses = data;
          this.filteredCourse = data;
        },
        err => console.error('Error al cargar mis cursos:', err)
      );
  }



}
