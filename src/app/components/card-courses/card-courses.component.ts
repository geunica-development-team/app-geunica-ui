import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-courses',  
  imports: [CommonModule],
  templateUrl: './card-courses.component.html',
  styleUrl: './card-courses.component.css'
})
export class CardCoursesComponent {
  @Input() title = '';
  @Input() imageUrl?: string;
  @Input() code?: string;
  @Input() teacher!: string;

    /** Nueva propiedad: array de segmentos de ruta */
  @Input() link: any[] = [];

  constructor(private router: Router) {}

  /** Si se ha pasado link, navega al hacer click en la card */
  goToLink() {
    if (this.link && this.link.length) {
      this.router.navigate(this.link);
    }
  }
}
