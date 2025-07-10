// src/app/services/dataTeacher.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment';

export interface Sede {
  id: number;
  studentId: number;
  division: 'primary' | 'secondary';
  grade: string;
  // agrega aquí otros campos que consideres
}

@Injectable({
  providedIn: 'root'
})
export class DataTeacherService {
  private base = environment.apiBase;
  constructor(private http: HttpClient) {}

  /** Obtener todas las sedes */
  getSedes(): Observable<Sede[]> {
    return this.http.get<Sede[]>(`${this.base}/sede`);
  }

  /** Obtener una sola sede por ID */
  getSedeById(id: number): Observable<Sede> {
    return this.http.get<Sede>(`${this.base}/sede/${id}`);
  }


}
