import { Component, OnInit } from '@angular/core';
import { CardCoursesComponent } from '../../../components/card-courses/card-courses.component';
import { Course, DataService } from '../../services/dataStudent.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearcherComponent } from '../../../components/searcher/searcher.component';

@Component({
  selector: 'app-courses',
  
  imports: [CardCoursesComponent, CommonModule, FormsModule, RouterModule, SearcherComponent],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  [x: string]: any;

  courses: Course[] = [];
  searchTerm: string = '';

  constructor(private dataSvc: DataService) {}    // <-- aquí
  ngOnInit() {
    this.dataSvc.getCourses().subscribe(c => this.courses = c);
  }

  // getter que devuelve sólo los que coinciden con la busqeuda
  get filteredCourses(): Course[] {
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
