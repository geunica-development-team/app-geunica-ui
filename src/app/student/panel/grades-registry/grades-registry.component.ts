import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { environment } from '../../../../enviroments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface CourseGrades {
  courseInfo: {
    courseName: string;
    teacherName: string;
  };
  exams: ExamScore[];
  activities: ActivityScore[];
  enrollmentId: number;
  assignmentId: number;
}

interface ExamScore {
  id: number;
  score: number;
  state: string;
  scoreState: string;
  registrationDate: string;
  exam: {
    id: number;
    name: string;
    examState: string;
    typeExam: string;
    date: string;
    weight: number;
    periodType: string;
    periodNumber: number;
    state: string;
  };
}

interface ActivityScore {
  id: number;
  score: number;
  state: string;
  scoreState: string;
  registrationDate: string;
  activity: {
    id: number;
    name: string;
    activityState: string;
    typeActivity: string;
    date: string;
    weight: number;
    periodType: string;
    periodNumber: number;
    state: string;
  };
}

@Component({
  selector: 'app-grades-registry',
  imports: [CommonModule, RouterModule, PanelHeaderComponent, FormsModule],
  templateUrl: './grades-registry.component.html',
  styleUrl: './grades-registry.component.css'
})
export class GradesRegistryComponent implements OnInit {

  loading = true;
  error: string | null = null;
  courseGrades: CourseGrades | null = null;

  // Parámetros de la ruta
  assignmentId = 0;

  // Filtros de período
  selectedPeriodType = 'BIMESTRE';
  selectedPeriodNumber = 1;
  
  // Control para mostrar meses de vacaciones
  showVacationMonths = false;

  // Opciones para los filtros
  periodTypes = [
    { value: 'MENSUAL', label: 'Mensual', maxNumber: 12 },
    { value: 'BIMESTRE', label: 'Bimestre', maxNumber: 6 },
    { value: 'TRIMESTRE', label: 'Trimestre', maxNumber: 4 },
    { value: 'CUATRIMESTRE', label: 'Cuatrimestre', maxNumber: 3 },
    { value: 'SEMESTRE', label: 'Semestre', maxNumber: 2 },
    { value: 'ANUAL', label: 'Anual', maxNumber: 1 }
  ];

  studentInfo: {
    studentName: string;
    tutorName: string;
    gradeName: string;
    sectionName: string;
    levelName: string;
    classroomName: string;
  } | null = null;

  private baseUrl = environment.apiBase;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const params = this.route.snapshot.paramMap;
    this.assignmentId = Number(params.get('id'));

    if (!this.assignmentId) {
      this.error = 'ID de asignación inválido';
      this.loading = false;
      return;
    }

    this.fetchStudentInfo();
    this.loadCourseGrades();
  }

    // Obtiene únicamente los datos de estudiante y curso 
  fetchStudentInfo() {
      const url = `${this.baseUrl}/student/me/enrollments`;
      this.http.get<any[]>(url).subscribe({
        next: (enrollments) => {
          console.log('Student enrollments data:', enrollments);
          
          if (enrollments && enrollments.length > 0) {
            // Tomar el primer enrollment (o buscar el específico si tienes el ID)
            const enrollment = enrollments[0];
            
            // Extraer información según la estructura que proporcionaste
            const student = enrollment.inscription?.student;
            const tutor = enrollment.inscription?.tutor;
            const classroom = enrollment.classroom;
            const grade = classroom?.grade;
            const level = grade?.level;
            const section = classroom?.section;
            
            if (student && classroom && grade && level && section) {
              this.studentInfo = {
                studentName: `${student.names} ${student.paternalSurname} ${student.maternalSurname}`.trim(),
                tutorName: `${tutor?.names || ''} ${tutor?.paternalSurname || ''} ${tutor?.maternalSurname || ''}`.trim(),
                gradeName: grade.name,
                sectionName: section.name,
                levelName: level.name,
                classroomName: classroom.name
              };
              
              console.log('Student info successfully loaded:', this.studentInfo);
            } else {
              console.warn('Estructura de datos incompleta en enrollment');
              this.setDefaultStudentInfo();
            }
          } else {
            console.warn('No se encontraron enrollments');
            this.setDefaultStudentInfo();
          }
        },
        error: (err) => {
          console.error('Error al obtener información del estudiante:', err);
          this.setDefaultStudentInfo();
        }
      });
    }

  private setDefaultStudentInfo() {
    this.studentInfo = {
      studentName: 'Estudiante',
      tutorName: 'Tutor',
      gradeName: 'Grado',
      sectionName: 'Sección', 
      levelName: 'Nivel',
      classroomName: 'Aula'
    };
  }

  // MÉTODO ALTERNATIVO SI QUIERES BUSCAR UN ENROLLMENT ESPECÍFICO
  fetchSpecificStudentInfo(targetClassroomId?: number) {
    const url = `${this.baseUrl}/student/me/enrollments`;
    this.http.get<any[]>(url).subscribe({
      next: (enrollments) => {
        if (enrollments && enrollments.length > 0) {
          // Si tienes un classroom específico, buscarlo
          let enrollment = enrollments[0]; // Por defecto el primero
          
          if (targetClassroomId) {
            const specific = enrollments.find(e => e.classroom?.id === targetClassroomId);
            if (specific) enrollment = specific;
          }
          
          this.processEnrollmentData(enrollment);
        }
      },
      error: (err) => {
        console.error('Error:', err);
        this.setDefaultStudentInfo();
      }
    });
  }

    private processEnrollmentData(enrollment: any) {
    const student = enrollment.inscription?.student;
    const tutor = enrollment.inscription?.tutor;
    const classroom = enrollment.classroom;
    const grade = classroom?.grade;
    const level = grade?.level;
    const section = classroom?.section;
    
    this.studentInfo = {
      studentName: student ? `${student.names} ${student.paternalSurname} ${student.maternalSurname}`.trim() : 'Estudiante',
      tutorName: tutor ? `${tutor.names} ${tutor.paternalSurname} ${tutor.maternalSurname}`.trim() : 'Tutor',
      gradeName: grade?.name || 'Grado',
      sectionName: section?.name || 'Sección',
      levelName: level?.name || 'Nivel',
      classroomName: classroom?.name || 'Aula'
    };
  }

  // Carga toda la información del curso con notas
  loadCourseGrades() {
    this.loading = true;
    this.error = null;

    const url = `${this.baseUrl}/student/me/courses/${this.assignmentId}/full`;

    this.http.get<any>(url).subscribe({
      next: data => {
        console.log('RESPUESTA /courses/:id/full ->', data); // <-- importante para ver qué llega
        
        console.log('exams.length:', (data.exams ?? []).length);
        console.log('examIds:', (data.exams ?? []).map((e:any) => e.examId));
        this.courseGrades = this.transformData(data);
        this.loading = false;
      },
      error: err => {
        console.error('Error al cargar course full', err);
        this.error = err?.error?.message || 'No se pudieron cargar las notas del curso';
        this.loading = false;
      }
    });
    
  }


  // Transforma los datos del backend al formato esperado
  transformData(data: any): CourseGrades {
    // Manejo el caso en que el backend devuelva "assignment" con el curso
    const assignment = data.assignment ?? data.assignmentData ?? null;
    const courseObj = assignment?.course ?? null;
    const classroom = assignment?.classroom ?? null;

    const courseInfo = {
      courseName: courseObj?.name ?? 'Curso sin nombre',
      courseCode: courseObj?.code ?? 'Sin código',
      teacherName: assignment?.teacherName ?? 'Sin profesor',
      classroom: classroom ?? null,
      level: classroom?.grade?.level ?? null,
      grade: classroom?.grade ?? null,
      section: classroom?.section ?? null
    };

    // Normalizo exams -> cada item tendrá .exam con los detalles del examen
    const exams: ExamScore[] = (data.exams ?? []).map((e: any) => ({
      scoreId: e.scoreId ?? null,
      score: (e.score === null || e.score === undefined) ? -1 : e.score,
      scoreDisplay: e.scoreDisplay ?? (e.score === null ? 'Sin calificar' : String(e.score)),
      scoreState: e.scoreState ?? e.state ?? 'Sin estado', // ⭐ AGREGAR FALLBACK
      registrationDate: e.registrationDate ?? null,
      enrollmentId: e.enrollmentId ?? data.enrollmentId ?? null,
      exam: {
        id: e.examId ?? null,
        name: e.name ?? 'Sin nombre',
        date: e.date ?? null,
        weight: e.weight ?? 0,
        examState: e.examState ?? 'Activo',
        typeExam: e.typeExam ?? 'Evaluación',
        periodType: e.periodType ?? e.period_type ?? this.selectedPeriodType,
        periodNumber: e.periodNumber ?? e.period_number ?? this.selectedPeriodNumber
      }
    }));

    // Normalizo activities -> cada item tendrá .activity con los detalles de la actividad
    const activities: ActivityScore[] = (data.activities ?? []).map((a: any) => ({
      scoreId: a.scoreId ?? null,
      score: (a.score === null || a.score === undefined) ? -1 : a.score,
      scoreDisplay: a.scoreDisplay ?? (a.score === null ? 'Sin calificar' : String(a.score)),
      scoreState: a.scoreState ?? a.state ?? 'Sin estado', // ⭐ AGREGAR FALLBACK
      registrationDate: a.registrationDate ?? null,
      enrollmentId: a.enrollmentId ?? data.enrollmentId ?? null,
      activity: {
        id: a.activityId ?? null,
        name: a.name ?? 'Sin nombre',
        date: a.date ?? null,
        weight: a.weight ?? 0,
        activityState: a.activityState ?? 'Activo',
        typeActivity: a.typeActivity ?? 'Tarea',
        periodType: a.periodType ?? a.period_type ?? this.selectedPeriodType,
        periodNumber: a.periodNumber ?? a.period_number ?? this.selectedPeriodNumber
      }
    }));

    return {
      courseInfo,
      exams,
      activities,
      enrollmentId: data.enrollmentId ?? 0,
      assignmentId: data.assignment?.id ?? this.assignmentId
    };
  }

  onPeriodTypeChange() {
    this.selectedPeriodNumber = 1;
    
    // Si no es mensual, resetear el toggle de vacaciones
    if (this.selectedPeriodType !== 'MENSUAL') {
      this.showVacationMonths = false;
    }
  }

  onShowVacationMonthsChange(): void {
    // Si se desactiva y estamos en enero o febrero, cambiar a marzo
    if (!this.showVacationMonths && (this.selectedPeriodNumber === 1 || this.selectedPeriodNumber === 2)) {
      this.selectedPeriodNumber = 3; // Marzo
    }
  }

  onPeriodNumberChange(periodNumber?: number) {
    if (periodNumber !== undefined) {
      this.selectedPeriodNumber = periodNumber;
    }
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

  // Filtra exámenes por período seleccionado
  getFilteredExams(): ExamScore[] {
    if (!this.courseGrades?.exams) return [];
    
    return this.courseGrades.exams.filter(examScore => 
      examScore.exam.periodType === this.selectedPeriodType && 
      examScore.exam.periodNumber === this.selectedPeriodNumber
    );
  }

  // Filtra actividades por período seleccionado
  getFilteredActivities(): ActivityScore[] {
    if (!this.courseGrades?.activities) return [];
    
    return this.courseGrades.activities.filter(activityScore => 
      activityScore.activity.periodType === this.selectedPeriodType && 
      activityScore.activity.periodNumber === this.selectedPeriodNumber
    );
  }

  getExamsAverage(): number {
    const exams = this.getFilteredExams();
    if (exams.length === 0) return 0;
    
    // Solo considerar exámenes con nota válida (mayor a -1)
    const validExams = exams.filter(e => e.score > -1);
    if (validExams.length === 0) return 0;
    
    const total = validExams.reduce((sum, e) => sum + e.score, 0);
    return Math.round((total / validExams.length) * 100) / 100;
  }

  getActivitiesAverage(): number {
    const activities = this.getFilteredActivities();
    if (activities.length === 0) return 0;
    
    // Solo considerar actividades con nota válida (mayor a -1)
    const validActivities = activities.filter(a => a.score > -1);
    if (validActivities.length === 0) return 0;
    
    const total = validActivities.reduce((sum, a) => sum + a.score, 0);
    return Math.round((total / validActivities.length) * 100) / 100;
  }

  getWeightedAverage(): number {
    const filteredExams = this.getFilteredExams().filter(e => e.score > -1);
    const filteredActivities = this.getFilteredActivities().filter(a => a.score > -1);
    
    let totalWeighted = 0;
    let totalWeight = 0;

    filteredExams.forEach(ex => {
      const w = Number(ex.exam.weight);
      totalWeighted += ex.score * w;
      totalWeight += w;
    });

    filteredActivities.forEach(act => {
      const w = Number(act.activity.weight);
      totalWeighted += act.score * w;
      totalWeight += w;
    });

    return totalWeight > 0
      ? Math.round((totalWeighted / totalWeight) * 100) / 100
      : 0;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Sin fecha';
    return new Date(dateString).toLocaleDateString('es-PE');
  }

  getStateClass(state: string): string {
    if (!state) return 'badge bg-secondary';
    switch (state.toLowerCase()) {
      case 'activo':   return 'badge bg-success';
      case 'inactivo': return 'badge bg-secondary';
      case 'pendiente':return 'badge bg-warning';
      case 'publicado':return 'badge bg-success';
      case 'en_espera':return 'badge bg-espera';
      default:         return 'badge bg-primary';
    }
  }

  getScoreClass(score: number): string {
    if (score === -1) return 'text-muted'; // Sin nota
    if (score >= 18) return 'text-success fw-bold';
    if (score >= 14) return 'text-primary fw-bold';
    if (score >= 11) return 'text-warning fw-bold';
    return 'text-danger fw-bold';
  }

  getScoreDisplay(score: number): string {
    return score === -1 ? 'Sin calificar' : score.toString();
  }



}

  

