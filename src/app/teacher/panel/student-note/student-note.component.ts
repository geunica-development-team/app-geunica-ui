import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-student-note',
  imports: [CommonModule, FormsModule],
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
  studentInfo: any = null;

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

    this.loadStudentGrades();
    
  }

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
    this.loadStudentGrades();
  }

  onPeriodNumberChange() {
    this.loadStudentGrades();
  }

  getPeriodNumbers(): number[] {
    const entry = this.periodTypes.find(p => p.value === this.selectedPeriodType);
    const maxNumber = entry?.maxNumber ?? 1;
    return Array.from({ length: maxNumber }, (_, i) => i + 1);
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

  goBack() {
    this.router.navigate(['/teacher/panel', 'NoteList', this.assignmentId]);
  }

  editExamScore(examScore: any) {
    console.log('Editar nota de examen:', examScore);
  }

  editActivityScore(activityScore: any) {
    console.log('Editar nota de actividad:', activityScore);
  }
}
