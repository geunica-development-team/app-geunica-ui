import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Attendance, Month } from '../../services/modelTeacher';
import { Router } from '@angular/router';
import { TableComponent } from '../../../components/table/table.component';
import { FormsModule } from '@angular/forms';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { environment } from '../../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';
import { SearcherComponent } from '../../../components/searcher/searcher.component';

@Component({
  selector: 'app-attendance-managment',
  imports: [CommonModule, TableComponent, FormsModule, PanelHeaderComponent, SearcherComponent],
  templateUrl: './attendance-managment.component.html',
  styleUrl: './attendance-managment.component.css'
})
export class AttendanceManagmentComponent implements OnInit{
  searchTerm = '';
  attendance?: Attendance;
  constructor(private router: Router, private http: HttpClient) {}
  private baseUrl = environment.apiBase;


  @ViewChild("attendancesTable") attendancesTable?: TableComponent
  columnsAttendances = ['ID', 'Grado/Nivel/Sección', 'Aula', 'Turno'];

  // Mapeo para <app-table>
  columnMappingsAttendances = {
    'ID':              'id',
    'Grado/Nivel/Sección': 'gradoSeccion',
    'Aula':            'aula',
    'Turno':           'turno'
  };

  rowsAttendances: any[] = [];
  filteredAttendances: any[] = []; 

  loadAttendances() {
    this.http.get<any[]>(`${this.baseUrl}/teacher/me/assignments`)
      .subscribe({
        next: data => {
          this.rowsAttendances = data.map(ca => ({
            id:            ca.id,
            gradoSeccion:  `${ca.classroom.grade.level.name} ${ca.classroom.grade.name} - ${ca.classroom.section.name} `,
            aula:          ca.classroom.name,
            turno:         ca.classroom.shift
          }));
          this.filteredAttendances = [...this.rowsAttendances];
        },
        error: err => console.error('Error al cargar asignaturas:', err)
      });
  }
  // FILTROS
  searchValue = ""


  applyFilter(event: Event) {
    const term = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (!term) {
      this.filteredAttendances = [...this.rowsAttendances];
    } else {
      this.filteredAttendances = this.rowsAttendances.filter(r =>
        r.aula.toLowerCase().includes(term)
      );
    }
  }

  onVerFicha = (row: any) => {
    this.router.navigate(['/teacher/panel/attendanceList',row.id ]);
  };
  
  ngOnInit() {
    this.loadAttendances();
  }

  onSearch() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredAttendances = [...this.rowsAttendances];
    } else {
      this.filteredAttendances = this.rowsAttendances.filter(r =>
        // aquí escoges el campo donde buscar, por ejemplo 'gradoSeccion'
        r.gradoSeccion.toLowerCase().includes(term)
      );
    }
  }

  private applicarFiltro() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return;
  }

}
