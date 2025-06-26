import { Component } from '@angular/core';
import { CardCoursesComponent } from '../../../components/card-courses/card-courses.component';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-courses',
  imports: [CardCoursesComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {

}
