import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-courses',
  imports: [],
  templateUrl: './card-courses.component.html',
  styleUrl: './card-courses.component.css'
})
export class CardCoursesComponent {
  @Input() title = '';
  @Input() subtitle?: string;
  @Input() imageUrl?: string;
  @Input() footer?: string;
}
