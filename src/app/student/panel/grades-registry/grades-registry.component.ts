import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { environment } from '../../../../enviroments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthStorageService } from '../../../services/auth-storage.service';

@Component({
  selector: 'app-grades-registry',
  imports: [CommonModule, RouterModule, PanelHeaderComponent, FormsModule],
  templateUrl: './grades-registry.component.html',
  styleUrl: './grades-registry.component.css'
})
export class GradesRegistryComponent implements OnInit {

 loading = true;
  error: string | null = null;
  // Quitadas las interfaces: uso any
  courseGrades: any = null;

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

  // Mantengo el tipo inline para studentInfo (no es interface separada)
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
    private http: HttpClient,
    private authStorage: AuthStorageService
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

  //helper centralizado
  private getAuthHeaders(): { headers?: HttpHeaders } {
    const token = this.authStorage.getToken();
    return token ? { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) } : {};
  }

  // Obtiene únicamente los datos de estudiante y curso 
  fetchStudentInfo() {
    const url = `${this.baseUrl}/student/me/enrollments`;
    const options = this.getAuthHeaders();
    this.http.get<any[]>(url, options).subscribe({
      next: (enrollments) => {
        console.log('Student enrollments data:', enrollments);
        
        if (enrollments && enrollments.length > 0) {
          const enrollment = enrollments[0];
          
          const student = enrollment.inscription?.student;
          const tutor = enrollment.inscription?.tutor;
          const classroom = enrollment.classroom;
          const grade = classroom?.grade;
          const level = grade?.level;
          const section = classroom?.section;
          
          if (student && classroom && grade && level && section) {
            this.studentInfo = {
              studentName: `${student.person.names} ${student.person.paternalSurname} ${student.person.maternalSurname}`.trim(),
              tutorName: `${tutor?.person.names || ''} ${tutor?.person.paternalSurname || ''} ${tutor?.person.maternalSurname || ''}`.trim(),
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

  // Carga toda la información del curso con notas
  loadCourseGrades() {
    this.loading = true;
    this.error = null;

    const url = `${this.baseUrl}/student/me/courses/${this.assignmentId}/grades`;
    const options = this.getAuthHeaders();

    this.http.get<any>(url, options).subscribe({
      next: resp => {
        // resp puede ser { message, data } o directamente payload
        //console.log('RESPUESTA RAW /courses/:id/grades ->', resp);
        const payload = resp?.data ?? resp; // toma payload interno si existe
        // Mostrar lo que realmente vamos a transformar
        //console.log('PAYLOAD usado para transformar ->', payload);
        this.courseGrades = this.transformData(payload);
       // console.log('courseGrades transformado ->', this.courseGrades);
        this.loading = false;
      },
      error: err => {
        //console.error('Error al cargar course grades', err);
        this.error = err?.error?.message || 'No se pudieron cargar las notas del curso';
        this.loading = false;
      }
    });
    
  }


  // Transforma los datos del backend al formato esperado
  transformData(data: any): any {
    const assignment = data.assignment ?? null;
    const courseObj = assignment?.course ?? assignment?.courseData ?? null;
    const classroom = assignment?.classroom ?? null;

    const courseInfo: any = {
    courseName:
      courseObj?.name ??
      courseObj?.title ??
      data.course?.name ??
      'Curso sin nombre',
    courseCode: courseObj?.code ?? data.course?.code ?? 'Sin código',
    teacher: assignment?.teacher ?? null,
    // teacherName construido a partir de los campos que devuelve tu backend
    teacherName: assignment?.teacher
      ? `${assignment.teacher.name ?? ''} ${assignment.teacher.paternalSurname ?? ''} ${assignment.teacher.maternalSurname ?? ''}`.trim()
      : (data.teacher
         ? `${data.teacher.name ?? ''} ${data.teacher.paternalSurname ?? ''} ${data.teacher.maternalSurname ?? ''}`.trim()
         : 'Sin profesor'),
      classroom: classroom ?? null,
      level: classroom?.grade?.level ?? null,
      grade: classroom?.grade ?? null,
      section: classroom?.section ?? null
    };

    // Normalizo exams -> cada item tendrá .exam con los detalles del examen
    const exams: any[] = (data.exams ?? []).map((e: any) => ({
      scoreId: e.scoreId ?? null,
      score: (e.score === null || e.score === undefined) ? -1 : e.score,
      scoreDisplay: e.scoreDisplay ?? (e.score === null ? 'Sin calificar' : String(e.score)),
      scoreState: e.scoreState ?? e.state ?? 'Sin estado',
      registrationDate: e.registrationDate ?? null,
      enrollmentId: e.enrollmentId ?? data.enrollmentId ?? null,
      exam: {
        id: e.examId ?? null,
        name: e.name ?? 'Sin nombre',
        date: e.date ?? null,
        weight: e.weight ?? 0,
        examState: e.examState ?? 'Activo',
        typeExam: e.typeExam ?? 'Evaluación',
        state: e.state ?? null
      }
    }));

    // Normalizo activities -> cada item tendrá .activity con los detalles de la actividad
    const activities: any[] = (data.activities ?? []).map((a: any) => ({
      scoreId: a.scoreId ?? null,
      score: (a.score === null || a.score === undefined) ? -1 : a.score,
      scoreDisplay: a.scoreDisplay ?? (a.score === null ? 'Sin calificar' : String(a.score)),
      scoreState: a.scoreState ?? a.state ?? 'Sin estado',
      registrationDate: a.registrationDate ?? null,
      enrollmentId: a.enrollmentId ?? data.enrollmentId ?? null,
      activity: {
        id: a.activityId ?? null,
        name: a.name ?? 'Sin nombre',
        date: a.date ?? null,
        weight: a.weight ?? 0,
        activityState: a.activityState ?? 'Activo',
        typeActivity: a.typeActivity ?? 'Tarea',
        state: a.state ?? null
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

  getPeriodLabel(periodNumber: number): string {
    const periodType = this.selectedPeriodType.toLowerCase();
    
    switch (periodType) {
      case 'mensual':
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const monthName = months[periodNumber - 1] || `Mes ${periodNumber}`;
        
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
  getFilteredExams(): any[] {
    if (!this.courseGrades?.exams) return [];
    
    return this.courseGrades.exams.filter((examScore: any) => 
      examScore.exam.periodType === this.selectedPeriodType && 
      examScore.exam.periodNumber === this.selectedPeriodNumber
    );
  }

  // Filtra actividades por período seleccionado
  getFilteredActivities(): any[] {
    if (!this.courseGrades?.activities) return [];
    
    return this.courseGrades.activities.filter((activityScore: any) => 
      activityScore.activity.periodType === this.selectedPeriodType && 
      activityScore.activity.periodNumber === this.selectedPeriodNumber
    );
  }

  getExamsAverage(): number {
    const exams = this.getFilteredExams();
    if (exams.length === 0) return 0;
    
    const validExams = exams.filter((e:any) => e.score > -1);
    if (validExams.length === 0) return 0;
    
    const total = validExams.reduce((sum: number, e: any) => sum + e.score, 0);
    return Math.round((total / validExams.length) * 100) / 100;
  }

  getActivitiesAverage(): number {
    const activities = this.getFilteredActivities();
    if (activities.length === 0) return 0;
    
    const validActivities = activities.filter((a:any) => a.score > -1);
    if (validActivities.length === 0) return 0;
    
    const total = validActivities.reduce((sum: number, a: any) => sum + a.score, 0);
    return Math.round((total / validActivities.length) * 100) / 100;
  }

  getWeightedAverage(): number {
    const filteredExams = this.getFilteredExams().filter((e:any) => e.score > -1);
    const filteredActivities = this.getFilteredActivities().filter((a:any) => a.score > -1);
    
    let totalWeighted = 0;
    let totalWeight = 0;

    filteredExams.forEach((ex:any) => {
      const w = Number(ex.exam.weight);
      totalWeighted += ex.score * w;
      totalWeight += w;
    });

    filteredActivities.forEach((act:any) => {
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
    if (score === -1) return 'text-muted';
    if (score >= 18) return 'text-success fw-bold';
    if (score >= 14) return 'text-primary fw-bold';
    if (score >= 11) return 'text-warning fw-bold';
    return 'text-danger fw-bold';
  }

  getScoreDisplay(score: number): string {
    return score === -1 ? 'Sin calificar' : score.toString();
  }


}

  

