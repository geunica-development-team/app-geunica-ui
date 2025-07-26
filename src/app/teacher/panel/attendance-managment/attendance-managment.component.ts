import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SearcherComponent } from '../../../components/searcher/searcher.component';
import { DataTeacherService } from '../../services/dataTeacher.service';
import { CardCoursesComponent } from '../../../components/card-courses/card-courses.component';
import { forkJoin } from 'rxjs';
import { AppModalComponent } from '../../../components/app-modal/app-modal.component';
import { Attendance, Month } from '../../services/modelTeacher';
import { Router } from '@angular/router';

interface GradeInfo {
  grado:     string;
  nivel:     string;
  seccion:   string;
  id_salon?: number;
}

@Component({
  selector: 'app-attendance-managment',
  imports: [CommonModule, SearcherComponent, CardCoursesComponent, AppModalComponent],
  templateUrl: './attendance-managment.component.html',
  styleUrl: './attendance-managment.component.css'
})
export class AttendanceManagmentComponent implements OnInit{
  filteredGrades: GradeInfo[] = [];
  searchTerm = '';
  attendance?: Attendance;
  selectedGrade: GradeInfo | null = null;
  constructor(private dataSvc: DataTeacherService,
    private router: Router
  ) {}

  ngOnInit() {
    forkJoin({
      niveles:   this.dataSvc.getNiveles(),
      grados:    this.dataSvc.getGrados(),
      secciones: this.dataSvc.getSecciones(),
      salones:   this.dataSvc.getSalones()
    }).subscribe(({ niveles, grados, secciones, salones }) => {
      this.filteredGrades = salones.map(salon => {
        // 1) Encuentra el grado
        const gradoObj = grados.find(g => g.id_grado === salon.id_grado);

        // 2) A partir del grado, encuentra el nivel
        const nivelObj = gradoObj
          ? niveles.find(n => n.id_nivel === gradoObj.id_nivel)
          : undefined;

        // 3) Encuentra la sección directamente
        const seccionObj = secciones.find(s => s.id_seccion === salon.id_seccion);

        return {
          grado:   gradoObj?.nombre   ?? '—',
          nivel:   nivelObj?.nombre   ?? '—',
          seccion: seccionObj?.nombre ?? '—',
          id_salon: salon.id_salon
        };
      });

      this.applyFilter();
    });

  }

  onSearch() {
    this.applyFilter();
  }

  private applyFilter() {
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

  openAttendanceList(id_salon: number, monthLabel: string) {
    this.router.navigate(
      ['/teacher/panel/attendanceList', id_salon],
      { queryParams: { month: monthLabel } }
    );
  }

}
