import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataStudentService } from '../../services/dataStudent.service';
import { CommonModule } from '@angular/common';
import { CardListComponent } from '../../../components/card-list/card-list.component';
import { Curriculum, Curso } from '../../services/modelStudent';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../enviroments/environment';
import { AuthStorageService } from '../../../services/auth-storage.service';

@Component({
  selector: 'app-curriculum',
  imports: [CommonModule, RouterModule, PanelHeaderComponent],
  templateUrl: './curriculum.component.html',
  styleUrl: './curriculum.component.css'
})
export class CurriculumComponent implements OnInit {
  course: any;
  curriculum: any[] = [];
  loading = true;
  error: string | null = null;

  private baseUrl = environment.apiBase;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authStorage: AuthStorageService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const assignmentId = idParam ? +idParam : null;

    if (!assignmentId) {
      this.error = 'ID de asignación inválido';
      this.loading = false;
      return;
    }

    const token = this.authStorage.getToken();
    const httpOptions = token ? { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) } : {};

    // 1) obtengo datos de la asignación/curso (si lo necesitas)
    this.http.get<any>(`${this.baseUrl}/student/me/courses/${assignmentId}`, httpOptions)
      .subscribe({
        next: courseResp => {
          this.course = courseResp;
          // 2) obtener el currículum: el backend devuelve { message, data, assignmentId, total }
          this.http.get<any>(`${this.baseUrl}/student/me/courses/${assignmentId}/curriculum`, httpOptions)
            .subscribe({
              next: resp => {
                console.log('RESP CURRICULUM ->', resp); // DEBUG: mira estructura real
                // Si la API envía { data: [...] } usamos resp.data
                if (Array.isArray(resp)) {
                  this.curriculum = resp;
                } else if (Array.isArray(resp?.data)) {
                  this.curriculum = resp.data;
                } else {
                  // Fallback: intenta asignar lo que venga
                  this.curriculum = resp ?? [];
                }

                // opcional: ordenar por position si quieres
                if (Array.isArray(this.curriculum)) {
                  this.curriculum.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
                }

                this.loading = false;
              },
              error: err => {
                console.error('Error cargando currículum', err);
                this.error = 'No se pudo cargar el currículum';
                this.loading = false;
              }
            });

        },
        error: err => {
          console.error('Error cargando datos del curso', err);
          this.error = 'No se pudo cargar los datos del curso';
          this.loading = false;
        }
      });
  }



}
