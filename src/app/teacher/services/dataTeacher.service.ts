// src/app/services/dataTeacher.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment';

import {
  Sede,
  Nivel,
  Grado,
  Seccion,
  Salon,
  Anuncio,
  Curso,
  FlatAsistencia,
  Session,
  Month,
  Attendance,
} from './modelTeacher';

@Injectable({
  providedIn: 'root'
})
export class DataTeacherService {
  private base = environment.apiBase;
  constructor(private http: HttpClient) {}

  getCourses(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.base}/curso`);
  }
  
  getCourseById(id: number): Observable<Curso> {
    return this.http
      .get<Curso[]>(`${this.base}/curso?id=${id}`)
      .pipe(
        map(arr => {
          if (!arr.length) {
            throw new Error(`Curso con id ${id} no encontrado`);
          }
          return arr[0];
        })
      );
  }

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
  

  /** Obtener todas las sedes */
  getSedes(): Observable<Sede[]> {
    return this.http.get<Sede[]>(`${this.base}/sede`);
  }

  /** Obtener una sola sede por ID */
  getSedeById(id: number): Observable<Sede> {
    return this.http.get<Sede>(`${this.base}/sede/${id}`);
  }

  /** Obtener niveles */
  getNiveles(): Observable<Nivel[]> {
    return this.http.get<Nivel[]>(`${this.base}/nivel`);
  }

  /** Obtener grados */
  getGrados(): Observable<Grado[]> {
    return this.http.get<Grado[]>(`${this.base}/grado`);
  }

  /** Obtener secciones */
  getSecciones(): Observable<Seccion[]> {
    return this.http.get<Seccion[]>(`${this.base}/seccion`);
  }

  /** Obtener salones */
  getSalones(): Observable<Salon[]> {
    return this.http.get<Salon[]>(`${this.base}/salon`);
  }

  /** Obtener salón por ID */
  getSalonById(id: number): Observable<Salon> {
    return this.http.get<Salon>(`${this.base}/salon/${id}`);
  }

  getAnnouncements(): Observable<Anuncio[]> {
    return this.http.get<Anuncio[]>(`${this.base}/anuncio`);
  }
}
