import { Component, OnInit } from '@angular/core';
import { Curriculum, Curso } from '../../services/modelTeacher';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardListComponent } from '../../../components/card-list/card-list.component';
import { CommonModule } from '@angular/common';
import { DataTeacherService } from '../../services/dataTeacher.service';

@Component({
  selector: 'app-curriculum-managment',
  imports: [CardListComponent, CommonModule, RouterModule],
  templateUrl: './curriculum-managment.component.html',
  styleUrl: './curriculum-managment.component.css'
})
export class CurriculumManagmentComponent implements OnInit {
  course!: Curso;
  curriculum: Curriculum[] = [];
  mostrarDetalle = false;

  constructor(
    private route: ActivatedRoute,
    private dataSvc: DataTeacherService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const courseId = idParam ? +idParam : null;
    if (!courseId) return;

    // 1) obtengo datos del curso
    this.dataSvc.getCourseById(courseId)
      .subscribe(c => this.course = c);

    // 2) obtengo los temas de ese curso
    this.dataSvc.getCurriculumByCourseId(courseId)
      .subscribe(list => this.curriculum = list);
  }

}
