// readonly-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../enviroments/environment';

import {
  Curso,
  Curriculum,
  Docente,
  Anuncio,
  FlatAsistencia,
  Session,
  Month,
  Attendance,
  Examen,
  NotaExamen,
  Actividad,
  NotaActividad
} from './modelStudent';

@Injectable({
  providedIn: 'root'
})
export class DataStudentService {
  private base = environment.apiBase;
  constructor(private http: HttpClient) {}

  getCourses(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.base}/curso`);
  }

  getCourseById(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.base}/curso?id=${id}`);//lamamos a un id del curso
  }

  getTeacher(): Observable<Docente[]> {
    return this.http.get<Docente[]>(`${this.base}/docente`);
  }

  getCurriculums(): Observable<Curriculum[]> {
    return this.http.get<Curriculum[]>(`${this.base}/curriculum`);
  }

  getCurriculumByCourseId(courseId: number): Observable<Curriculum[]> {
    return this.http.get<Curriculum[]>(`${this.base}/curriculum?courseId=${courseId}`);
  }

  getAnnouncements(): Observable<Anuncio[]> {
    return this.http.get<Anuncio[]>(`${this.base}/anuncio`);
  }

  /**
   * Obtiene el array plano de asistencia y lo transforma
   * en un objeto Attendance con meses agrupados.
   */
  getAttendance(): Observable<Attendance> {
    return this.http
      .get<FlatAsistencia[]>(`${this.base}/asistencia`)
      .pipe(
        map(flat => {
          if (!flat || flat.length === 0) {
            return { startDate: '', endDate: '', months: [] } as Attendance;
          }
          // Ordenar cronológicamente
          flat.sort((a, b) => a.date.localeCompare(b.date));
          const startDate = flat[0].date;
          const endDate = flat[flat.length - 1].date;
          // Agrupar por mes
          const monthsMap = new Map<string, Session[]>();
          flat.forEach(item => {
            const dateObj = new Date(item.date);
            const monthName = dateObj.toLocaleString('es-ES', { month: 'long' });
            const year = dateObj.getFullYear();
            const key = `${monthName} ${year}`;
            const session: Session = { date: item.date, status: item.status };
            if (!monthsMap.has(key)) {
              monthsMap.set(key, []);
            }
            monthsMap.get(key)!.push(session);
          });
          const months: Month[] = [];
          monthsMap.forEach((sessions, month) => {
            months.push({ month, sessions });
          });
          return { startDate, endDate, months } as Attendance;
        })
      );
  }

  getExams(): Observable<Examen[]> {
    return this.http.get<Examen[]>(`${this.base}/examen`);
  }

  getExamById(id: number): Observable<Examen> {
    return this.http.get<Examen>(`${this.base}/examen/${id}`);
  }

  getGrades(): Observable<NotaExamen[]> {
    return this.http.get<NotaExamen[]>(`${this.base}/nota_examen`);
  }

  getGradesByExamId(examId: number): Observable<NotaExamen[]> {
    return this.http.get<NotaExamen[]>(`${this.base}/nota_examen?examenId=${examId}`);
  }

  getGradesByStudentId(studentId: number): Observable<NotaExamen[]> {
    return this.http.get<NotaExamen[]>(`${this.base}/nota_examen?matriculaId=${studentId}`);
  }

}




