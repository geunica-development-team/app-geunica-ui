import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataService } from '../../../student/services/dataStudent.service';
import { SearcherComponent } from '../../../components/searcher/searcher.component';

interface GradeInfo {
  grado: string;
  nivel: string;
  sede: string;
}

@Component({
  selector: 'app-attendance-managment',
  imports: [CommonModule, SearcherComponent],
  templateUrl: './attendance-managment.component.html',
  styleUrl: './attendance-managment.component.css'
})
export class AttendanceManagmentComponent {
  filteredGrades: GradeInfo[] = [];
  searchTerm: string = '';

  constructor(private dataSvc: DataService) {}

  ngOnInit() {
       // Ejemplo de datos; luego podrías cargarlos desde un servicio
    this.filteredGrades = [
      { grado: '1°', nivel: 'Primaria', sede: 'Matute' },
      { grado: '2°', nivel: 'Primaria', sede: 'San Miguel' },
      { grado: '3°', nivel: 'Secundaria', sede: 'Chorrillos' },
      // … más items
    ];
  }

    onSearch() {
    // opcional: aquí podrías disparar algún otro efecto al hacer submit,
    // pero el filtrado ya lo maneja el (filtered)
  }
}
