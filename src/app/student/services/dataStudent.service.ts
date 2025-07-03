import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment';

export interface Course { id: number; title: string; code: string; teacher: string; imageUrl?: string;}
export interface Curriculum { id: number; courseId: number; topic: string; description: string; teacher: string; date: string; imageUrl?: string;}
                                                                                                                // ISO YYYY-MM-DD
export interface Grade  { id: number; courseId: number; studentId: number; grade: number; }
export interface Announcement {
  id: number;
  title: string;
  cuerpo: string;
  creado_por: string;
  fecha_creacion: string; // ISO 8601 format, e.g. "2025-07-02T09:00:00Z"
  estado: 'visto' | 'publicado';
}
/** Nuevo: cada sesión de asistencia en un mes */
export interface Session {
  date: string;       // ISO YYYY-MM-DD
  status: 'asistió' | 'faltó' | 'tardanza';
}

/** Nuevo: definición de cada mes de asistencia */
export interface Month {
  month: string;      // e.g. "enero 2025"
  sessions: Session[];
}

/** Nuevo: objeto de attendance completo */
export interface Attendance {
  startDate: string;  // ISO YYYY-MM-DD
  endDate: string;    // ISO YYYY-MM-DD
  months: Month[];
}
// …añade interfaces para Attendance, Payment, etc.

@Injectable({ providedIn: 'root' })
export class DataService {
  private base = environment.apiBase;
    constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.base}/course`);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.base}/course/${id}`);
  }

    //curriculum
    getCurriculums(): Observable<Curriculum[]> {
    return this.http.get<Curriculum[]>(`${this.base}/curriculum`);
  }

    /** Temas de un curso concreto */
  getCurriculumByCourseId(courseId: number): Observable<Curriculum[]> {
    return this.http.get<Curriculum[]>(`${this.base}/curriculum?courseId=${courseId}`);
  }

    //anouncements
    getAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.base}/announcement`);
  }

    getAttendance(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.base}/attendance`);
  }


}