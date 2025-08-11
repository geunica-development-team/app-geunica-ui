import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardCoursesComponent } from '../../../components/card-courses/card-courses.component';
import { SearcherComponent } from '../../../components/searcher/searcher.component';
import { HttpClient } from '@angular/common/http';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { environment } from '../../../../enviroments/environment';

@Component({
  selector: 'app-assigned-courses',
  imports: [CommonModule, CardCoursesComponent, PanelHeaderComponent],
  templateUrl: './assigned-courses.component.html',
  styleUrl: './assigned-courses.component.css'
})
export class AssignedCoursesComponent {
  co = {
    id: 123,
    course: { name: 'Matemáticas Aplicadas' },
    classroom: {
      name: 'Aula 12',
      grade: {
        name: 'Quinto',
        level: { name: 'Primaria' }
      }
    },
    // --- arrays con 4 datos falsos cada uno ---
    tags: ['Álgebra', 'Geometría', 'Proyecto', 'Presencial'],
    students: [
      { id: 1, name: 'María González' },
      { id: 2, name: 'José Pérez' },
      { id: 3, name: 'Luisa Martínez' },
      { id: 4, name: 'Carlos Rojas' }
    ]
  };
  
}
