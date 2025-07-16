import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Anuncio,Curriculum } from '../../student/services/modelStudent';

@Component({
  selector: 'app-card-item',
  imports: [CommonModule],
  templateUrl: './card-item.component.html',
  styleUrl: './card-item.component.css'
})
export class CardItemComponent {
  @Input() item!: Curriculum;
}
