import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-courses',  
  imports: [CommonModule],
  templateUrl: './card-courses.component.html',
  styleUrl: './card-courses.component.css'
})
export class CardCoursesComponent {
  @Input() title = '';
  @Input() imageUrl?: string;
  @Input() subtitle?: string;
  @Input() teacher!: string;
}
