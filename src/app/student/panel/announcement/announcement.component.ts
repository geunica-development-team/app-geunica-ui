import { Component, OnInit } from '@angular/core';
import { Announcement, DataService } from '../../services/dataStudent.service';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from '../../../app.component';
import { AppModalComponent } from '../../../components/app-modal/app-modal.component';


@Component({
  selector: 'app-announcement',
  imports: [CommonModule, AppModalComponent],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.css'
})
export class AnnouncementComponent implements OnInit{
  
  announcements$!: Observable<Announcement[]>;
  selectedAnnouncement: Announcement | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.announcements$ = this.dataService.getAnnouncements();
  }

    openAnnouncement(a: Announcement) {
    this.selectedAnnouncement = a;
  }

  closeModal() {
    this.selectedAnnouncement = null;
  }
}
