import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment';

export interface Course { id: number; title: string; code: string; teacher: string; imageUrl?: string;}
export interface Grade  { id: number; courseId: number; studentId: number; grade: number; }
// …añade interfaces para Attendance, Payment, etc.

@Injectable({ providedIn: 'root' })
export class DataService {
  private base = environment.apiBase;

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.base}/courses`);
  }

  getGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.base}/grades`);
  }


  // …y así para cada colección
  constructor(private http: HttpClient) {}
}