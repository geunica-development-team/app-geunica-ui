import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Attendance, Month } from '../../services/modelTeacher';
import { Router } from '@angular/router';
import { TableComponent } from '../../../components/table/table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { environment } from '../../../../enviroments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SearcherComponent } from '../../../components/searcher/searcher.component';
import { AuthStorageService } from '../../../services/auth-storage.service';

@Component({
  selector: 'app-attendance-managment',
  imports: [CommonModule, FormsModule, PanelHeaderComponent, ReactiveFormsModule, TableComponent, SearcherComponent],
  templateUrl: './attendance-managment.component.html',
  styleUrl: './attendance-managment.component.css'
})
export class AttendanceManagmentComponent implements OnInit{
  // búsqueda
  searchTerm = '';
  attendance?: Attendance;
  constructor(private router: Router, private http: HttpClient, private authStorage: AuthStorageService) {}
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
    const token = this.authStorage.getToken();
    const headers = token ? { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) } : {};
    
    this.http.get<any[]>(`${this.baseUrl}/teacher/me/classrooms`, headers)
      .subscribe({
        next: data => {
          console.log('📊 Datos recibidos del API:', data); // Para debugging
          
          this.rowsAttendances = data.map(classroom => ({
            id: classroom.id,
            // ✅ CORRECCIÓN: Acceder directamente a las propiedades
            gradoSeccion: `${classroom.grade.level.name} ${classroom.grade.name} - ${classroom.section.name}`,
            aula: classroom.name,           // ← Sin .classroom
            turno: classroom.shift          // ← Sin .classroom
          }));
          
          this.filteredAttendances = [...this.rowsAttendances];
          console.log('📋 Datos mapeados:', this.rowsAttendances); // Para debugging
        },
        error: err => {
          console.error('❌ Error al cargar aulas:', err);
        }
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
