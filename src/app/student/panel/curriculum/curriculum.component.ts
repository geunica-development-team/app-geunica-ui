import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataStudentService } from '../../services/dataStudent.service';
import { CommonModule } from '@angular/common';
import { CardListComponent } from '../../../components/card-list/card-list.component';
import { Curriculum, Curso } from '../../services/modelStudent';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../enviroments/environment';

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
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const assignmentId = idParam ? +idParam : null;

    if (!assignmentId) {
      this.error   = 'ID de asignación inválido';
      this.loading = false;
      return;
    }

    // 1) obtengo datos de la asignación/curso
    this.http.get<any>(`${this.baseUrl}/student/me/courses/${assignmentId}`)
      .subscribe({
        next: c => {
          this.course = c;
          // ------------------------------------------------------------------
          // 2) OJO: vuelvo a usar assignmentId, ¡no c.courseId!
          // ------------------------------------------------------------------
          this.http.get<Curriculum[]>(`${this.baseUrl}/student/me/courses/${assignmentId}/curriculum`)
            .subscribe({
              next: list => {
                this.curriculum = list;
                this.loading    = false;
              },
              error: () => {
                this.error   = 'No se pudo cargar el currículum';
                this.loading = false;
              }
            });
        },
        error: () => {
          this.error   = 'No se pudo cargar los datos del curso';
          this.loading = false;
        }
      });
  }


}
