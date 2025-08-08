import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { Estudiante, Persona } from '../../services/modelTeacher';
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
  students: Array<Estudiante & { persona: Persona }> = [];
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

  ngOnInit() {
    this.loadClassAssignment();
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
