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
      return this.http
    .get<Curso[]>(`${this.base}/curso?id_curso=${id}`)//is_curso es como ests en la json
    .pipe(
      map(arr => {
        if (!arr.length) throw new Error(`Curso con id ${id} no encontrado`);
        return arr[0];
      })
    );
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
    return this.http.get<FlatAsistencia[]>(`${this.base}/asistencia`)
      .pipe(
        map(flat => {
          if (!flat?.length) {
            return { startDate: '', endDate: '', months: [] } as Attendance;
          }

          // 1) Orden cronológico
          flat.sort((a, b) => a.date.localeCompare(b.date));

          const startDate = flat[0].date;
          const endDate   = flat[flat.length - 1].date;

          // 2) Agrupación
          const monthsMap = new Map<string, Session[]>();
          flat.forEach(item => {
            // 1) parseo de la fecha en zona local
            const [y, m, d] = item.date.split('-').map(Number);
            const dateObj   = new Date(y, m - 1, d);
            const monthName = dateObj.toLocaleString('es-ES', { month: 'long' });
            const year      = dateObj.getFullYear();
            const key       = `${monthName} ${year}`;

            // 2) validación / mapeo del status
            const raw = item.status.toLowerCase();
            const status: Session['status'] =
              raw === 'asistió'   ? 'asistió'  :
              raw === 'faltó'     ? 'faltó'    :
              raw === 'tardanza'  ? 'tardanza' :
              // Por defecto, si algo extraño llega:
              'asistió';

            // 3) creación de la sesión tipada correctamente
            const session: Session = {
              date: item.date,
              status
            };

            // 4) agrupación en el monthsMap como antes
            if (!monthsMap.has(key)) { monthsMap.set(key, []); }
            monthsMap.get(key)!.push(session);
          });


          // 3) A arreglo final
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
    return this.http
      .get<Examen[]>(`${this.base}/examen?id_examen=${id}`)
      .pipe(
        map(arr => {
          if (!arr.length) {
            throw new Error(`Examen con id ${id} no encontrado`);
          }
          return arr[0];
        })
      );
  }


  getGrades(): Observable<NotaExamen[]> {
    return this.http.get<NotaExamen[]>(`${this.base}/nota_examen`);
  }

  getGradesByExamId(examId: number): Observable<NotaExamen[]> {
    return this.http.get<NotaExamen[]>(
      `${this.base}/nota_examen?id_examen=${examId}`
    );
  }

  getGradesByStudentId(studentId: number): Observable<NotaExamen[]> {
    return this.http.get<NotaExamen[]>(
      `${this.base}/nota_examen?id_matricula=${studentId}`
    );
  }

}




