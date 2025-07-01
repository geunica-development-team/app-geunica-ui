import { Component, Input } from '@angular/core';
import { Curriculum } from '../../student/services/dataStudent.service';
import { CommonModule } from '@angular/common';
import { CurriculumComponent } from '../../student/panel/curriculum/curriculum.component';
import { RouterModule } from '@angular/router';
import { CardItemComponent } from '../card-item/card-item.component';

@Component({
  selector: 'app-card-list',
  imports: [CommonModule, RouterModule, CardItemComponent],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css'
})
export class CardListComponent {
  @Input() title = 'Temario del curso';
  @Input() items: Curriculum[] = [];
}
