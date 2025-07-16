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
  @Input() titulo: string = '';
  @Input() subtitulo1: string = '';
  @Input() subtitulo2: string = '';
  @Input() etiquetaTitulo: string = 'TÍTULO';
  @Input() etiquetaSubtitulo1: string = 'SUBTÍTULO 1';
  @Input() etiquetaSubtitulo2: string = 'SUBTÍTULO 2';
  @Input() link: any[] = [];// es el link

  constructor(private router: Router) {}

  /** Si se ha pasado link, navega al hacer click en la card */
  goToLink() {
    if (this.link && this.link.length) {
      this.router.navigate(this.link);
    }
  }
}
