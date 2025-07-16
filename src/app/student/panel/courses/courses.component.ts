import { Component, OnInit } from '@angular/core';
import { CardCoursesComponent } from '../../../components/card-courses/card-courses.component';
import { DataStudentService } from '../../services/dataStudent.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearcherComponent } from '../../../components/searcher/searcher.component';
import { Curso, Docente } from '../../services/modelStudent';

@Component({
  selector: 'app-courses',
  
  imports: [CardCoursesComponent, CommonModule, FormsModule, RouterModule, SearcherComponent],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: Curso[] = [];
  teacher: Docente[] = [];
  filteredCourses: Curso[] = [];
  searchTerm: string = '';

  constructor(private dataSvc: DataStudentService) {}

  onSearch() {
    // opcional: aquí podrías disparar algún otro efecto al hacer submit,
    // pero el filtrado ya lo maneja el (filtered)
  }

  getDocenteAsignado(): string {//hasta que no tengamos claro la logica al agregar docente sera esto nomas
    return this.teacher.length
      ? `${this.teacher[0].persona.nombres} ${this.teacher[0].persona.apell_paterno}`
      : 'Sin docente asignado';
  }

  ngOnInit() {
    this.dataSvc.getCourses().subscribe(c => {
      this.courses = c;
      // Inicialmente mostrar todos
      this.filteredCourses = c;
    });

  }



}
