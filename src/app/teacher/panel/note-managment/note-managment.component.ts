import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SearcherComponent } from '../../../components/searcher/searcher.component';
import { DataService } from '../../../student/services/dataStudent.service';

interface GradeInfo {
  grado: string;
  nivel: string;
  sede: string;
}

@Component({
  selector: 'app-note-managment',
  imports: [CommonModule, SearcherComponent],
  templateUrl: './note-managment.component.html',
  styleUrl: './note-managment.component.css'
})
export class NoteManagmentComponent {
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
