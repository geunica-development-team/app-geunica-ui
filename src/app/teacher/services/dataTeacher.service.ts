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
  Curso
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
