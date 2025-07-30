import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SearcherComponent } from '../../../components/searcher/searcher.component';
import { DataTeacherService } from '../../services/dataTeacher.service';
import { CardCoursesComponent } from '../../../components/card-courses/card-courses.component';
import { forkJoin } from 'rxjs';
import { AppModalComponent } from '../../../components/app-modal/app-modal.component';
import { Attendance, Month } from '../../services/modelTeacher';
import { Router } from '@angular/router';
import { TableComponent } from '../../../components/table/table.component';
import { USERS } from '../../../admin/utility/db-simulator';
import { ModalDebtDetailsComponent } from '../../../admin/panel/student-users/modal-debt-details/modal-debt-details.component';
import { FormsModule } from '@angular/forms';

interface GradeInfo {
  grado:     string;
  nivel:     string;
  seccion:   string;
  id_salon?: number;
}

@Component({
  selector: 'app-attendance-managment',
  imports: [CommonModule, SearcherComponent, CardCoursesComponent, AppModalComponent, TableComponent, FormsModule],
  templateUrl: './attendance-managment.component.html',
  styleUrl: './attendance-managment.component.css'
})
export class AttendanceManagmentComponent implements OnInit{
  filteredGrades: GradeInfo[] = [];
  searchTerm = '';
  attendance?: Attendance;
  selectedGrade: GradeInfo | null = null;
  constructor(private dataSvc: DataTeacherService, private router: Router) {}

  // FILTROS
  searchValue = ""

  // Columnas de la tabla
  columns = [
    "ID",
    "Código Estudiante",
    "Nombres y Apellidos"
  ]

  // Mapeo para columnas y filas
  columnMappings = {
    ID: "userId",
    "Código Estudiante": "studentCode",
    "Nombres y Apellidos": "fullName"
  }

  // Filtrar solo usuarios con rol 'student' y procesar los datos
  get rows() {
    return USERS.filter((user) => user.role === "student").map((user) => ({
      userId: user.userId,
      studentCode: user.student?.studentCode || "-",
      fullName: `${user.person.firstName} ${user.person.lastName} ${user.person.middleName}`.trim(),
      debtStatus: "",
      // Clases CSS para los badges

      // Mantener referencia al objeto original para el modal
      originalData: user,
    }))
  }

  @ViewChild("studentUsersTable") studentUsersTable?: TableComponent

  // MÉTODOS DE FILTRADO
  applyFilters() {
    if (this.studentUsersTable) {
      this.studentUsersTable.updateTable()
    }
  }

  applySearchFilter(event: Event) {
    this.searchValue = (event.target as HTMLInputElement).value
    this.applyFilters()
  }

  clearFilters() {

    this.searchValue = ""
    this.applyFilters()
  }

  applyFilter(event: Event) {
    if (this.studentUsersTable) {
      this.studentUsersTable.filterValue = (event.target as HTMLInputElement).value
      this.studentUsersTable.updateTable()
    }
  }

  // ACCIONES
onVerFicha = (row: any) => {
  this.router.navigate(
    ['/teacher/panel/attendanceList', row.userId]
  );
}

    openAttendanceList(id_salon: number, monthLabel: string) {
    this.router.navigate(
      ['/teacher/panel/attendanceList', id_salon],
      { queryParams: { month: monthLabel } }
    );
  }
  
  ngOnInit() {
    forkJoin({
      niveles:   this.dataSvc.getNiveles(),
      grados:    this.dataSvc.getGrados(),
      secciones: this.dataSvc.getSecciones(),
      salones:   this.dataSvc.getSalones()
    }).subscribe(({ niveles, grados, secciones, salones }) => {
      this.filteredGrades = salones.map(salon => {
        // 1) Encuentra el grado
        const gradoObj = grados.find(g => g.id === salon.id);

        // 2) A partir del grado, encuentra el nivel
        const nivelObj = gradoObj
          ? niveles.find(n => n.id === gradoObj.id)
          : undefined;

        // 3) Encuentra la sección directamente
        const seccionObj = secciones.find(s => s.id === salon.id);

        return {
          grado:   gradoObj?.nombre   ?? '—',
          nivel:   nivelObj?.nombre   ?? '—',
          seccion: seccionObj?.nombre ?? '—',
          id_salon: salon.id
        };
      });

      this.applicarFiltro();
    });

  }

  onSearch() {
    this.applicarFiltro();
  }

  private applicarFiltro() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return;

    this.filteredGrades = this.filteredGrades.filter(item =>
      item.grado   .toLowerCase().includes(term) ||
      item.nivel   .toLowerCase().includes(term) ||
      item.seccion.toLowerCase().includes(term)
    );
  }

  openModalAttendanceManagment(grade: GradeInfo) {
    this.selectedGrade = grade;
    this.dataSvc.getAttendance().subscribe(data => {
      this.attendance = data;
    });
  }

  closeModal() {
    this.selectedGrade = null;
  }

  // Método que define si un mes está "completado"
  isMonthComplete(month: Month): boolean {
    // Definición arbitraria: si tiene al menos una sesión por semana
    // o simplemente si el mes ya pasó completamente
    const now = new Date();
    const [monthName, yearStr] = month.month.split(' ');
    const monthIndex = new Date(Date.parse(monthName + " 1, 2020")).getMonth();
    const year = parseInt(yearStr, 10);

    // Se considera completado si el mes ya terminó
    const lastDayOfMonth = new Date(year, monthIndex + 1, 0);
    return lastDayOfMonth < now;
  }



}
