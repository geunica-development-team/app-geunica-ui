import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course, Curriculum, DataService } from '../../services/dataStudent.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-curriculum',
  imports: [CommonModule],
  templateUrl: './curriculum.component.html',
  styleUrl: './curriculum.component.css'
})
export class CurriculumComponent implements OnInit {
    course!: Course;
  curriculum: Curriculum[] = [];
  mostrarDetalle = false;

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

    // 2) obtengo los temas de ese curso
    this.dataSvc.getCurriculumByCourseId(courseId)
      .subscribe(list => this.curriculum = list);
  }

}
