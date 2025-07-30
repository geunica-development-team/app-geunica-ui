import { Component, OnInit } from '@angular/core';
import { CardCoursesComponent } from '../../../components/card-courses/card-courses.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearcherComponent } from '../../../components/searcher/searcher.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-courses',
  
  imports: [CardCoursesComponent, CommonModule, FormsModule, RouterModule, SearcherComponent],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: any[]        = [];
  filteredCourses: any[] = [];
  searchTerm: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Llama directamente a la vista /cursos
    this.http.get<any[]>('http://localhost:3000/course/cursos')
      .subscribe(data => {
        this.courses = data;
        this.filteredCourses = data;
      }, err => {
        console.error('Error al cargar cursos:', err);
      });
  }

  onSearch() {
    // filtra por course_name si quieres...
    this.filteredCourses = this.courses.filter(c =>
      c.course_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

}
