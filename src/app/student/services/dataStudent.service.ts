import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment';

export interface Course { id: number; title: string; code: string; teacher: string; imageUrl?: string;}
export interface Curriculum { id: number; courseId: number; topic: string; description: string; teacher: string; date: string; imageUrl?: string;}
                                                                                                                // ISO YYYY-MM-DD
export interface Grade  { id: number; courseId: number; studentId: number; grade: number; }
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

    getCurriculums(): Observable<Curriculum[]> {
    return this.http.get<Curriculum[]>(`${this.base}/curriculum`);
  }

    /** Temas de un curso concreto */
  getCurriculumByCourseId(courseId: number): Observable<Curriculum[]> {
    return this.http.get<Curriculum[]>(`${this.base}/curriculum?courseId=${courseId}`);
  }
}