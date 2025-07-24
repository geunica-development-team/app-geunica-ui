import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataStudentService } from '../../services/dataStudent.service';
import { Curso } from '../../services/modelStudent';
import { HeaderDinamicComponent } from '../../../components/header-dinamic/header-dinamic.component';
import { TabContentDirective } from '../../../components/header-dinamic/tab-content.directive';
import { forkJoin } from 'rxjs';

interface RegistryItem {
  concepto: string;
  valor: number;
}

@Component({
  selector: 'app-grades-registry',
  imports: [CommonModule, RouterModule, HeaderDinamicComponent, TabContentDirective],
  templateUrl: './grades-registry.component.html',
  styleUrl: './grades-registry.component.css'
})
export class GradesRegistryComponent implements OnInit {

  course!: Curso;
  registryItems: RegistryItem[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private dataSvc: DataStudentService
  ) {}


  ngOnInit(): void {
  const idParam = this.route.snapshot.paramMap.get('id');
  const courseId = idParam ? +idParam : null;
  if (!courseId) return;

  // 1) Cargo curso + exámenes + notas en paralelo
  forkJoin({
    course: this.dataSvc.getCourseById(courseId),
    exams: this.dataSvc.getExams(),
    grades: this.dataSvc.getGrades(),
  }).subscribe(({ course, exams, grades }) => {
    this.course = course;

    // 2) Filtrar exámenes de este curso
    const courseExams = exams.filter(e => e.id_asignacion_de_clase === courseId);

    // 3) Filtrar notas de esos exámenes
    const relevantGrades = grades.filter(g =>
      courseExams.some(e => e.id_examen === g.id_examen)
    );

    // 4) Mapear a tu tabla
    this.registryItems = relevantGrades.map(g => {
      const exam = courseExams.find(e => e.id_examen === g.id_examen)!;
      return {
        concepto: exam.nombre_examen,
        valor:    g.valor
      };
    });

    this.loading = false;
  }, err => {
    console.error('Error cargando datos:', err);
    this.loading = false;
  });

  }

  
}
