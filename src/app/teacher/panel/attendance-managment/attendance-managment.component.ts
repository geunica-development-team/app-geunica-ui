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
  imports: [CommonModule, FormsModule, PanelHeaderComponent],
  templateUrl: './attendance-managment.component.html',
  styleUrl: './attendance-managment.component.css'
})
export class AttendanceManagmentComponent implements OnInit{
  // búsqueda
  searchTerm = '';

  // columnas (ya no usadas por app-table, solo informativas)
  columnsAttendances = ['ID', 'Grado/Nivel/Sección', 'Aula', 'Turno'];

  // datos falsos (4 filas)
  rowsAttendances: any[] = [];
  filteredAttendances: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    // --- Datos falsos ---
    this.rowsAttendances = [
      {
        id: 101,
        gradoSeccion: 'Primaria Quinto - Sección A',
        aula: 'Aula 12',
        turno: 'Mañana'
      },
      {
        id: 102,
        gradoSeccion: 'Secundaria Primero - Sección B',
        aula: 'Aula 03',
        turno: 'Tarde'
      },
      {
        id: 103,
        gradoSeccion: 'Primaria Tercero - Sección C',
        aula: 'Aula 07',
        turno: 'Mañana'
      },
      {
        id: 104,
        gradoSeccion: 'Secundaria Segundo - Sección A',
        aula: 'Aula 01',
        turno: 'Tarde'
      }
    ];

    // inicializar filtro
    this.filteredAttendances = [...this.rowsAttendances];
  }

  // búsqueda disparada por el input
  onSearchInput(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value || '';
    this.onSearch();
  }

  onSearch() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredAttendances = [...this.rowsAttendances];
      return;
    }

    this.filteredAttendances = this.rowsAttendances.filter(r =>
      (r.gradoSeccion || '').toLowerCase().includes(term) ||
      (r.aula || '').toLowerCase().includes(term)
    );
  }

  // navegar a la ficha (usa tu ruta existente)
  onVerFicha(row: any) {
    this.router.navigate(['/teacher/panel/attendanceList', row.id]);
  }

  trackById(index: number, item: any) {
    return item?.id ?? index;
  }

}
