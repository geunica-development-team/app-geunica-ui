import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Course, DataService } from '../../../student/services/dataStudent.service';
import { CardCoursesComponent } from '../../../components/card-courses/card-courses.component';
import { SearcherComponent } from '../../../components/searcher/searcher.component';

@Component({
  selector: 'app-assigned-courses',
  imports: [CommonModule, CardCoursesComponent, SearcherComponent],
  templateUrl: './assigned-courses.component.html',
  styleUrl: './assigned-courses.component.css'
})
export class AssignedCoursesComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchTerm: string = '';

  constructor(private dataSvc: DataService) {}

  ngOnInit() {
    this.dataSvc.getCourses().subscribe(c => {
      this.courses = c;
      // Inicialmente mostrar todos
      this.filteredCourses = c;
    });
  }

  onSearch() {
    // opcional: aquí podrías disparar algún otro efecto al hacer submit,
    // pero el filtrado ya lo maneja el (filtered)
  }
  
}
