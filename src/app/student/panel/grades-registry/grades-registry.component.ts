import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CoursesComponent } from '../courses/courses.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Course, DataService } from '../../services/dataStudent.service';

interface RegistryItem {
  concepto: string;
  valor: number;
}

@Component({
  selector: 'app-grades-registry',
  imports: [CommonModule, RouterModule],
  templateUrl: './grades-registry.component.html',
  styleUrl: './grades-registry.component.css'
})
export class GradesRegistryComponent implements OnInit {

  course!: Course;
  registryItems: RegistryItem[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private dataSvc: DataService
  ) {}


  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const courseId = idParam ? +idParam : null;
    if (!courseId) return;

    // 1) obtengo datos del curso
    this.dataSvc.getCourseById(courseId).subscribe(c => this.course = c);

    // 2) obtengo exámenes para este curso
    this.dataSvc.getExams().subscribe(exams => {
      console.log('Exams loaded:', exams);
      const courseExams = exams.filter(e => e.courseId === courseId);
      console.log('Course exams:', courseExams);

      // 3) obtengo notas y filtro por exámenes del curso
      this.dataSvc.getGrades().subscribe(grades => {
        console.log('Grades loaded:', grades);
        const relevantGrades = grades.filter(g =>
          courseExams.some(e => e.id_examen === g.id_examen)
        );
        console.log('Relevant grades:', relevantGrades);

        // 4) construyo el arreglo para la tabla
        this.registryItems = relevantGrades.map(g => {
          const exam = courseExams.find(e => e.id_examen === g.id_examen);
          return {
            concepto: exam ? exam.nombre_examen : '---',
            valor: g.valor
          };
        });

        this.loading = false;
      });
      
    });
  }

}
