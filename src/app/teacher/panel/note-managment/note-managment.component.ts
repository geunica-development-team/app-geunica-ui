import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';

import { TableComponent } from '../../../components/table/table.component';
import { FormsModule } from '@angular/forms';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { environment } from '../../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SearcherComponent } from '../../../components/searcher/searcher.component';


@Component({
  selector: 'app-note-managment',
  imports: [CommonModule, TableComponent, FormsModule, PanelHeaderComponent, SearcherComponent],
  templateUrl: './note-managment.component.html',
  styleUrl: './note-managment.component.css'
})
export class NoteManagmentComponent {
  //filteredGrades: GradeInfo[] = [];
  searchTerm: string = '';
  //selectedGrade: GradeInfo | null = null;
    // Para más adelante: filtrar por salón o mes
  students: any[] = [];
  constructor(
  private router: Router) {}

  private http     = inject(HttpClient);
  private baseUrl  = environment.apiBase;

  @ViewChild("notesTable") notesTable?: TableComponent
  // Definición de columnas para la tabla
  columnsNotes = ['ID', 'Grado/Nivel/seccion', 'Aula'];

  // Mapeo de encabezados a propiedades de fila
  columnMappingsNotes = {
    'ID': 'id',
    'Grado/Nivel/seccion': 'gradoSeccion',
    'Aula': 'aula'
  };

  // Datos de ejemplo (15 registros: 5 originales + 10 nuevos)
  rowsNotes: any[] = [];
filteredNotes: any [] = [];

  // Carga de datos de ejemplo
  loadClassAssignment() {
     this.http.get<any[]>(`${this.baseUrl}/teacher/me/assignments`)
      .subscribe({
        next: data => {
          this.rowsNotes = data.map(ca => ({
            id:            ca.id,
            gradoSeccion:  `${ca.classroom.grade.level.name} ${ca.classroom.grade.name} - ${ca.classroom.section.name}`,
            aula:          ca.classroom.name,
          }));
        },
        error: err => console.error('Error al cargar asignaturas:', err)
      });
  }



  // Reemplaza rowsNotes: any[] = [];


// Método para cargar datos falsos (llámalo desde ngOnInit() mientras pruebas)
loadMockAssignments() {
  this.rowsNotes = [
    { id: 201, gradoSeccion: 'Primaria 1 - A',  aula: 'Aula 101' },
    { id: 202, gradoSeccion: 'Primaria 2 - B',  aula: 'Aula 102' },
    { id: 203, gradoSeccion: 'Primaria 3 - C',  aula: 'Aula 103' },
    { id: 204, gradoSeccion: 'Secundaria 1 - A', aula: 'Aula 201' },
    { id: 205, gradoSeccion: 'Secundaria 2 - B', aula: 'Aula 202' },

    // 10 registros adicionales
    { id: 206, gradoSeccion: 'Secundaria 3 - C', aula: 'Aula 203' },
    { id: 207, gradoSeccion: 'Secundaria 4 - A', aula: 'Laboratorio' },
    { id: 208, gradoSeccion: 'Bachillerato 1 - A', aula: 'Aula 301' },
    { id: 209, gradoSeccion: 'Bachillerato 2 - B', aula: 'Aula 302' },
    { id: 210, gradoSeccion: 'Técnico 1 - A', aula: 'Taller' },

    { id: 211, gradoSeccion: 'Técnico 1 - B', aula: 'Aula 304' },
    { id: 212, gradoSeccion: 'Adultos 1 - A',  aula: 'Sala Multiuso' },
    { id: 213, gradoSeccion: 'Primaria 4 - A',  aula: 'Aula 104' },
    { id: 214, gradoSeccion: 'Primaria 5 - B',  aula: 'Aula 105' },
    { id: 215, gradoSeccion: 'Secundaria 5 - D', aula: 'Biblioteca' }
  ];

  // Inicializar filteredNotes para que la tabla muestre todo al inicio
  this.filteredNotes = [...this.rowsNotes];

  console.log('Mock class assignments loaded', this.rowsNotes);
}
  ngOnInit() {
 
    this.loadMockAssignments();
  }

  onVerFicha = (row: any) => {
    // row.id es tu classAssignmentId (caId)
    this.router.navigate([
      '/teacher/panel/NoteList',
      row.id
    ]);
  };

  /*get rowsNotes() {
    return this.assignments;
  }*/

  onSearch() {
        const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredNotes = [...this.rowsNotes];
    } else {
      this.filteredNotes = this.rowsNotes.filter(r =>
        // aquí escoges el campo donde buscar, por ejemplo 'gradoSeccion'
        r.gradoSeccion.toLowerCase().includes(term)
      );
    }
  }

  applyFilter(event: Event) {

  }

    // FILTROS
    searchValue = ""
  
}
