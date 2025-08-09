import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { EditExamScoreModalComponent } from './editExam/edit-exam-score-modal/edit-exam-score-modal.component';
import { EditActivityScoreModalComponent } from './editActivity/edit-activity-score-modal/edit-activity-score-modal.component';

export interface Exam {
  id: number;
  name: string;
  score: number;
  maxScore?: number; // opcional si lo manejas
  date?: string;     // opcional si lo manejas
}

@Component({
  selector: 'app-student-note',
  imports: [CommonModule, FormsModule, PanelHeaderComponent, EditExamScoreModalComponent, EditActivityScoreModalComponent],
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
        console.log('Student info data:', data); // Debug
        
        // CORREGIDO: Adaptar a la nueva estructura de datos
        const firstExam = data.exams?.[0];
        const firstActivity = data.activities?.[0];
        
        // Intentar obtener la información del primer examen
        if (firstExam && firstExam.enrollment && firstExam.enrollment.inscription) {
          const stu = firstExam.enrollment.inscription.student;
          const cls = firstExam.exam.classAssignment.classroom;
          this.studentInfo = {
            studentName: `${stu.names} ${stu.paternalSurname} ${stu.maternalSurname}`.trim(),
            gradeName: cls.grade.name,
            sectionName: cls.section.name,
            levelName: cls.grade.level.name
          };
        } 
        // Si no hay información en el examen, intentar con la primera actividad
        else if (firstActivity && firstActivity.enrollment && firstActivity.enrollment.inscription) {
          const stu = firstActivity.enrollment.inscription.student;
          const cls = firstActivity.activity.classAssignment.classroom;
          this.studentInfo = {
            studentName: `${stu.names} ${stu.paternalSurname} ${stu.maternalSurname}`.trim(),
            gradeName: cls.grade.name,
            sectionName: cls.section.name,
            levelName: cls.grade.level.name
          };
        }
        // Si la nueva estructura no tiene estos datos anidados, usar un endpoint diferente
        else {
          // Fallback: obtener información del estudiante desde otro endpoint si es necesario
          this.fetchStudentInfoFallback();
        }
      },
      error: (err) => {
        console.warn('No se pudo obtener la información del estudiante', err);
        // Intentar método alternativo
        this.fetchStudentInfoFallback();
      }
    });
  }

  // Método alternativo para obtener información del estudiante
  fetchStudentInfoFallback() {
    // Si tienes otro endpoint que devuelva la información del estudiante/enrollment
    const url = `${this.baseUrl}/teacher/enrollment/${this.enrollmentId}/info`;
    this.http.get<any>(url).subscribe({
      next: data => {
        console.log('Student info fallback data:', data); // Debug
        if (data) {
          this.studentInfo = {
            studentName: data.studentName || 'Estudiante',
            gradeName: data.gradeName || 'Grado',
            sectionName: data.sectionName || 'Sección',
            levelName: data.levelName || 'Nivel'
          };
        }
      },
      error: () => {
        // Si tampoco funciona, poner valores por defecto
        this.studentInfo = {
          studentName: 'Estudiante',
          gradeName: 'Grado',
          sectionName: 'Sección',
          levelName: 'Nivel'
        };
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
        console.log('Student grades data:', data); // Debug
        this.studentGrades = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading grades:', err); // Debug
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
  onCreatedOrEditedOrDeleted(updatedResponse?: any) {
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
    
    // CORREGIDO: Verificar que score existe y no es null
    const validExams = exams.filter(e => e.score !== null && e.score !== undefined && !isNaN(e.score));
    if (validExams.length === 0) return 0;
    
    const total = validExams.reduce((sum, e) => sum + Number(e.score), 0);
    return Math.round((total / validExams.length) * 100) / 100;
  }

  getActivitiesAverage(): number {
    const acts = this.studentGrades?.activities as any[] || [];
    if (acts.length === 0) return 0;
    
    // CORREGIDO: Verificar que score existe y no es null
    const validActivities = acts.filter(a => a.score !== null && a.score !== undefined && !isNaN(a.score));
    if (validActivities.length === 0) return 0;
    
    const total = validActivities.reduce((sum, a) => sum + Number(a.score), 0);
    return Math.round((total / validActivities.length) * 100) / 100;
  }

  getWeightedAverage(): number {
    const grades = this.studentGrades;
    if (!grades) return 0;

    let totalWeighted = 0;
    let totalWeight = 0;

    // CORREGIDO: Verificar la estructura correcta de los datos
    (grades.exams as any[] || []).forEach(examScore => {
      // CORREGIDO: Verificar que tanto score como exam.weight existen
      if (examScore.score !== null && examScore.score !== undefined && !isNaN(examScore.score) && 
          examScore.exam?.weight !== null && examScore.exam?.weight !== undefined) {
        const score = Number(examScore.score);
        const weight = Number(examScore.exam.weight); // CORREGIDO: Acceder a exam.weight
        if (!isNaN(score) && !isNaN(weight)) {
          totalWeighted += score * weight;
          totalWeight += weight;
        }
      }
    });

    (grades.activities as any[] || []).forEach(activityScore => {
      // CORREGIDO: Verificar que tanto score como activity.weight existen
      if (activityScore.score !== null && activityScore.score !== undefined && !isNaN(activityScore.score) && 
          activityScore.activity?.weight !== null && activityScore.activity?.weight !== undefined) {
        const score = Number(activityScore.score);
        const weight = Number(activityScore.activity.weight); // CORREGIDO: Acceder a activity.weight
        if (!isNaN(score) && !isNaN(weight)) {
          totalWeighted += score * weight;
          totalWeight += weight;
        }
      }
    });

    return totalWeight > 0
      ? Math.round((totalWeighted / totalWeight) * 100) / 100
      : 0;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Sin fecha';
    try {
      return new Date(dateString).toLocaleDateString('es-PE');
    } catch (error) {
      return 'Fecha inválida';
    }
  }

  getStateClass(state: string): string {
    if (!state) return 'badge bg-secondary';
    switch (state.toLowerCase()) {
      case 'pendiente':return 'badge bg-warning';
      case 'publicado':return 'badge bg-success';
      case 'en_espera':return 'badge bg-esperan';
      default:         return 'badge bg-primary';
    }
  }

  // CORREGIDO: Manejar el caso de "sin calificar"
  getScoreClass(score: any): string {
    // Si es "sin calificar" (string) o null/undefined
    if (score === null || score === undefined || score === 'sin calificar' || score === -1) {
      return 'text-muted';
    }
    
    // Si es un número válido
    const numScore = Number(score);
    if (isNaN(numScore)) return 'text-muted';
    
    if (numScore >= 18) return 'text-success fw-bold';
    if (numScore >= 14) return 'text-primary';
    if (numScore >= 11) return 'text-warning';
    return 'text-danger';
  }

  // CORREGIDO: Método para mostrar el score formateado
  getDisplayScore(score: any): string {
    if (score === null || score === undefined || score === -1) {
      return 'Sin calificar';
    }
    if (score === 'sin calificar') {
      return 'Sin calificar';
    }
    return score.toString();
  }

  // ELIMINADO: Las funciones duplicadas que causaban recursión infinita
  // editExamScore(examScore: any) {
  //   // Esta función ahora maneja la edición de notas a través del modal
  //   this.editExamScore(examScore);
  // }

  // editActivityScore(activityScore: any) {
  //   // Esta función ahora maneja la edición de notas a través del modal
  //   this.editActivityScore(activityScore);
  // }

  @ViewChild(EditExamScoreModalComponent) editExamModal!: EditExamScoreModalComponent;
  editExamScore(examScore: any): void {
    console.log('Edit exam score:', examScore);
    
    // Abrir el modal pasando los datos del examen
    if (this.editExamModal) {
      this.editExamModal.open(examScore);
    }
  }

  @ViewChild(EditActivityScoreModalComponent) editActivityModal!: EditActivityScoreModalComponent;
  editActivityScore(activityScore: any): void {
    console.log('Edit activity score:', activityScore);
    if (this.editActivityModal) {
      this.editActivityModal.open(activityScore);
    } else {
      console.error('EditActivity modal no disponible');
    }
  }

}
