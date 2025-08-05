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
    const idParam  = this.route.snapshot.paramMap.get('id');
    console.log('INIT: idParam =', idParam);
    const courseId = idParam ? +idParam : null;
    console.log('INIT: courseId =', courseId);

    if (!courseId) {
      this.error   = 'ID de curso inválido';
      this.loading = false;
      return;
    }

    // 1) obtengo datos del curso
    console.log('GET Course →', `${this.baseUrl}/student/me/courses/${courseId}`);
    this.http
      .get<any>(`${this.baseUrl}/student/me/courses/${courseId}`)
      .subscribe({
        next: c => {
          console.log('RESPONSE Course →', c);
          this.course = c;
          const realCourseId = c.courseId;
          console.log('USANDO realCourseId para currículum →', realCourseId);

          // 2) obtengo los temas de ese curso
          console.log('GET Curriculum →', `${this.baseUrl}/student/me/courses/${courseId}/curriculum`);
          this.http
            .get<any[]>(`${this.baseUrl}/student/me/courses/${realCourseId}/curriculum`)
            .subscribe({
              next: list => {
                console.log('RESPONSE Curriculum →', list);
                this.curriculum = list;
                this.loading    = false;
              },
              error: err => {
                console.error('ERROR Curriculum GET', err);
                this.error   = 'No se pudo cargar el currículum';
                this.loading = false;
              }
            });
        },
        error: err => {
          console.error('ERROR Course GET', err);
          this.error   = 'No se pudo cargar los datos del curso';
          this.loading = false;
        }
      });
  }
}
