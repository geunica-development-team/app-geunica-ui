import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {  DataStudentService } from '../../services/dataStudent.service';
import { FormsModule } from '@angular/forms';
import { CardCoursesComponent } from '../../../components/card-courses/card-courses.component';
import { SearcherComponent } from '../../../components/searcher/searcher.component';
import { RouterModule } from '@angular/router';
import { Curso } from '../../services/modelStudent';

@Component({
  selector: 'app-grades',
  imports: [CommonModule, FormsModule, CardCoursesComponent, SearcherComponent, RouterModule],
  templateUrl: './grades.component.html',
  styleUrl: './grades.component.css'
})
export class GradesComponent implements OnInit {
    [x: string]: any;
  
    courses: Curso[] = [];
    searchTerm: string = '';
  
    constructor(private dataSvc: DataStudentService) {}    // <-- aquí
    ngOnInit() {
      this.dataSvc.getCourses().subscribe(c => this.courses = c);
    }
  
    // getter que devuelve sólo los que coinciden con la busqeuda
    get filteredCourses(): Curso[] {
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
        const title = c.title
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
  
        // cada término debe aparecer en el título normalizado
        return terms.every(t => title.includes(t));
      });
    }
  
      onSearch() {
      // ya tenemos el getter filteredCourses que reacciona a searchTerm,
    }
}
