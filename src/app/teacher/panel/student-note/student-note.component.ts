import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';

@Component({
  selector: 'app-student-note',
  imports: [CommonModule, FormsModule, PanelHeaderComponent],
  templateUrl: './student-note.component.html',
  styleUrl: './student-note.component.css'
})
export class StudentNoteComponent implements OnInit {

  loading = true;
  error: string | null = null;
  studentGrades: any = null;    // antes StudentGrades

  // Parámetros de la ruta
  assignmentId = 0;
  enrollmentId = 0;

  // Filtros de período
  selectedPeriodType = 'BIMESTRE';
  selectedPeriodNumber = 1;
  
  // Control para mostrar meses de vacaciones
  showVacationMonths = false;
  
  // Tab activo actual
  currentActiveTab: 'exams' | 'activities' = 'exams';

  // Opciones para los filtros
  periodTypes = [
    { value: 'MENSUAL', label: 'Mensual', maxNumber: 12 },
    { value: 'BIMESTRE', label: 'Bimestre', maxNumber: 6 },
    { value: 'TRIMESTRE', label: 'Trimestre', maxNumber: 4 },
    { value: 'CUATRIMESTRE', label: 'Cuatrimestre', maxNumber: 3 },
    { value: 'SEMESTRE', label: 'Semestre', maxNumber: 2 },
    { value: 'ANUAL', label: 'Anual', maxNumber: 1 }
  ];

  // Información del estudiante
  // Información del estudiante y curso
  studentInfo: {
    studentName: string;
    gradeName: string;
    sectionName: string;
    levelName: string;
  } | null = null;

  private baseUrl = environment.apiBase;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const params       = this.route.snapshot.paramMap;
    this.assignmentId  = Number(params.get('assignmentId'));
    this.enrollmentId  = Number(params.get('enrollmentId'));

    if (!this.assignmentId || !this.enrollmentId) {
      this.error   = 'Parámetros de ruta inválidos';
      this.loading = false;
      return;
    }
    // Cargar primero la información del estudiante y curso
    this.fetchStudentInfo();
    // Luego, cargar las notas según el periodo
    this.loadStudentGrades();
    
  }

  // Obtiene únicamente los datos de estudiante y curso 
  fetchStudentInfo() {
    const url = `${this.baseUrl}/teacher/assignment/${this.assignmentId}/student/${this.enrollmentId}/grades`;
    this.http.get<any>(url).subscribe({
      next: data => {
        const firstExam = data.exams?.[0];
        if (firstExam) {
          const stu = firstExam.enrollment.inscription.student;
          const cls = firstExam.exam.classAssignment.classroom;
          this.studentInfo = {
            studentName: `${stu.names} ${stu.paternalSurname} ${stu.maternalSurname}`.trim(),
            gradeName: cls.grade.name,
            sectionName: cls.section.name,
            levelName: cls.grade.level.name
          };
        }
      },
      error: () => {
        console.warn('No se pudo obtener la información del estudiante');
      }
    });
  }

  //Carga las notas del estudiante según los filtros de período
  loadStudentGrades() {
    this.loading = true;
    this.error = null;

    const params = new URLSearchParams({
      periodType: this.selectedPeriodType,
      periodNumber: this.selectedPeriodNumber.toString()
    });

    const url = `${this.baseUrl}/teacher/assignment/${this.assignmentId}/student/${this.enrollmentId}/grades?${params}`;

    this.http.get<any>(url).subscribe({
      next: data => {
        this.studentGrades = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar las notas del estudiante';
        this.loading = false;
      }
    });
  }

  onPeriodTypeChange() {
    this.selectedPeriodNumber = 1;
    // Si no es mensual, resetear el toggle de vacaciones
    if (this.selectedPeriodType !== 'MENSUAL') {
      this.showVacationMonths = false;
    }
    this.loadStudentGrades();
  }

  // Método para manejar el cambio del toggle de vacaciones
  onShowVacationMonthsChange(): void {
    // Si se desactiva y estamos en enero o febrero, cambiar a marzo
    if (!this.showVacationMonths && (this.selectedPeriodNumber === 1 || this.selectedPeriodNumber === 2)) {
      this.selectedPeriodNumber = 3; // Marzo
    }
    this.loadStudentGrades();
  }

  // Métodos para cambio de tabs
  switchToExamsTab(): void {
    this.currentActiveTab = 'exams';
  }

  switchToActivitiesTab(): void {
    this.currentActiveTab = 'activities';
  }



  // ========== EDICIÓN DE NOTAS ==========
/*
  editExamScore(examScore: any): void {
    if (this.modalEditExamScore) {
      this.modalEditExamScore.examScoreId = examScore.id;
      this.modalEditExamScore.itemData = { 
        ...examScore,
        examName: examScore.exam.name,
        studentName: this.studentInfo?.studentName
      };
      this.modalEditExamScore.openModal();
    }
  }*/
/*
  editActivityScore(activityScore: any): void {
    if (this.modalEditActivityScore) {
      this.modalEditActivityScore.activityScoreId = activityScore.id;
      this.modalEditActivityScore.itemData = { 
        ...activityScore,
        activityName: activityScore.activity.name,
        studentName: this.studentInfo?.studentName
      };
      this.modalEditActivityScore.openModal();
    }
  }*/

  // Callback cuando se crea, edita o elimina
  onCreatedOrEditedOrDeleted(): void {
    this.loadStudentGrades(); // Recargar las notas
  }

  // Método actualizado para manejar la selección de período desde la navbar
  onPeriodNumberChange(periodNumber?: number) {
    if (periodNumber !== undefined) {
      this.selectedPeriodNumber = periodNumber;
    }
    this.loadStudentGrades();
  }

  getPeriodNumbers(): number[] {
    const entry = this.periodTypes.find(p => p.value === this.selectedPeriodType);
    const maxNumber = entry?.maxNumber ?? 1;
    
    // Para período mensual, considerar si mostrar meses de vacaciones
    if (this.selectedPeriodType === 'MENSUAL') {
      const allMonths = Array.from({ length: maxNumber }, (_, i) => i + 1);
      
      if (!this.showVacationMonths) {
        // Filtrar enero (1) y febrero (2)
        return allMonths.filter(month => month !== 1 && month !== 2);
      }
      
      return allMonths;
    }
    
    return Array.from({ length: maxNumber }, (_, i) => i + 1);
  }

  // Nuevo método para obtener el label del período en la navbar
  getPeriodLabel(periodNumber: number): string {
    const periodType = this.selectedPeriodType.toLowerCase();
    
    switch (periodType) {
      case 'mensual':
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const monthName = months[periodNumber - 1] || `Mes ${periodNumber}`;
        
        // Marcar visualmente los meses de vacaciones
        if ((periodNumber === 1 || periodNumber === 2) && this.showVacationMonths) {
          return `${monthName} 🏖️`;
        }
        
        return monthName;
      
      case 'bimestre':
        return `${periodNumber}° Bimestre`;
      
      case 'trimestre':
        return `${periodNumber}° Trimestre`;
      
      case 'cuatrimestre':
        return `${periodNumber}° Cuatrimestre`;
      
      case 'semestre':
        return `${periodNumber}° Semestre`;
      
      case 'anual':
        return 'Año Completo';
      
      default:
        return `Período ${periodNumber}`;
    }
  }

  getExamsAverage(): number {
    const exams = this.studentGrades?.exams as any[] || [];
    if (exams.length === 0) return 0;
    const total = exams.reduce((sum, e) => sum + e.score, 0);
    return Math.round((total / exams.length) * 100) / 100;
  }

  getActivitiesAverage(): number {
    const acts = this.studentGrades?.activities as any[] || [];
    if (acts.length === 0) return 0;
    const total = acts.reduce((sum, a) => sum + a.score, 0);
    return Math.round((total / acts.length) * 100) / 100;
  }

  getWeightedAverage(): number {
    const grades = this.studentGrades;
    if (!grades) return 0;

    let totalWeighted = 0;
    let totalWeight = 0;

    (grades.exams as any[] || []).forEach(ex => {
      const w = Number(ex.exam.weight);
      totalWeighted += ex.score * w;
      totalWeight += w;
    });
    (grades.activities as any[] || []).forEach(act => {
      const w = Number(act.activity.weight);
      totalWeighted += act.score * w;
      totalWeight += w;
    });

    return totalWeight > 0
      ? Math.round((totalWeighted / totalWeight) * 100) / 100
      : 0;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-PE');
  }

  getStateClass(state: string): string {
    switch (state.toLowerCase()) {
      case 'activo':   return 'badge bg-success';
      case 'inactivo': return 'badge bg-secondary';
      case 'pendiente':return 'badge bg-warning';
      default:         return 'badge bg-primary';
    }
  }

  getScoreClass(score: number): string {
    if (score >= 18) return 'text-success fw-bold';
    if (score >= 14) return 'text-primary';
    if (score >= 11) return 'text-warning';
    return 'text-danger';
  }

  editExamScore(examScore: any) {
    // Esta función ahora maneja la edición de notas a través del modal
    this.editExamScore(examScore);
  }

  editActivityScore(activityScore: any) {
    // Esta función ahora maneja la edición de notas a través del modal
    this.editActivityScore(activityScore);
  }
}
