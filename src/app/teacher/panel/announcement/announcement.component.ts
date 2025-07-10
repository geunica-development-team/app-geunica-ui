import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Announcement, DataService } from '../../../student/services/dataStudent.service';
import { CommonModule } from '@angular/common';
import { AppModalComponent } from '../../../components/app-modal/app-modal.component';

@Component({
  selector: 'app-announcement',
  imports: [CommonModule, AppModalComponent],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.css'
})
export class AnnouncementComponent implements OnInit {
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
