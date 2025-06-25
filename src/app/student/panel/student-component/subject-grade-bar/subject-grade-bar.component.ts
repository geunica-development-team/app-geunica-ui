import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-subject-grade-bar',
  imports: [],
  templateUrl: './subject-grade-bar.component.html',
  styleUrl: './subject-grade-bar.component.css'
})
export class SubjectGradeBarComponent {
  @Input({required : true}) materia!: string;
  @Input({required : true}) nota!: number;
  @Input({required : true}) notaMaxima!: number;
  @Input({required : true}) color!: string;

  get porcentaje(): number {
    return Math.round((this.nota / this.notaMaxima) * 100);
  }

  get notaMateria(): string {
    return `${this.nota}/${this.notaMaxima}`;
  }
}
