import { Component, OnInit } from '@angular/core';
import { CardCoursesComponent } from '../../../components/card-courses/card-courses.component';
import { Course, DataService } from '../../services/dataStudent.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CardCoursesComponent, CommonModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];

  constructor(private dataSvc: DataService) {}    // <-- aquí
  ngOnInit() {
    this.dataSvc.getCourses().subscribe(c => this.courses = c);
  }
}
