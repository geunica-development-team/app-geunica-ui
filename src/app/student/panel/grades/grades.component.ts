import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {  DataStudentService } from '../../services/dataStudent.service';
import { FormsModule } from '@angular/forms';
import { CardCoursesComponent } from '../../../components/card-courses/card-courses.component';
import { SearcherComponent } from '../../../components/searcher/searcher.component';
import { RouterModule } from '@angular/router';
import { Curso, Docente } from '../../services/modelStudent';
import { HttpClient } from '@angular/common/http';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';

@Component({
  selector: 'app-grades',
  imports: [CommonModule, FormsModule, CardCoursesComponent, SearcherComponent, RouterModule, PanelHeaderComponent],
  templateUrl: './grades.component.html',
  styleUrl: './grades.component.css'
})
export class GradesComponent implements OnInit {
  
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

        // getter que devuelve sólo los que coinciden con la busqeuda
  get cursosFiltro(): Curso[] {
      const raw = this.searchTerm.toLowerCase().trim();
  
      // Si hay menos de 4 caracteres, no filtramos
      if (raw.length < 4) {
        return this.courses;
      }
  
      // 2) Normalizar y eliminar diacríticos del término
      const normalizedSearch = raw
        .normalize('NFD')                    // descompone caracteres acentuados
        .replace(/[\u0300-\u036f]/g, '');    // elimina marcas diacríticas
  
      // Separamos la búsqueda en palabras individuales
      const terms = normalizedSearch.split(/\s+/);
  
      // Para cada curso, comprobamos que todas las palabras aparezcan
      return this.courses.filter(c => {
        const title = c.nombre
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
  
        // cada término debe aparecer en el título normalizado
        return terms.every(t => title.includes(t));
      });
    }
  
}
