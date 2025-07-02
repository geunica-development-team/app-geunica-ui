import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Announcement, DataService } from '../../services/dataStudent.service';
import { CommonModule } from '@angular/common';
import { CardListComponent } from '../../../components/card-list/card-list.component';
import { CardItemComponent } from '../../../components/card-item/card-item.component';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-announcement',
  imports: [CommonModule],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.css'
})
export class AnnouncementComponent implements OnInit{
  
  announcements$!: Observable<Announcement[]>;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.announcements$ = this.dataService.getAnnouncements();
  }
}
