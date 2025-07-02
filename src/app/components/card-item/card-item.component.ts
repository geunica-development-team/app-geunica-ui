import { Component, Input } from '@angular/core';
import { Announcement, Curriculum } from '../../student/services/dataStudent.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-item',
  imports: [CommonModule],
  templateUrl: './card-item.component.html',
  styleUrl: './card-item.component.css'
})
export class CardItemComponent {
  @Input() item!: Curriculum;
}
