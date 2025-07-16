import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AppModalComponent } from '../../../components/app-modal/app-modal.component';
import { SearcherComponent } from '../../../components/searcher/searcher.component';
import { Anuncio } from '../../services/modelTeacher';
import { DataTeacherService } from '../../services/dataTeacher.service';

@Component({
  selector: 'app-announcement',
  imports: [CommonModule, AppModalComponent],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.css'
})
export class AnnouncementComponent implements OnInit {
  announcements$!: Observable<Anuncio[]>;
  selectedAnnouncement: Anuncio | null = null;

  constructor(private dataService: DataTeacherService) {}

  ngOnInit() {
    this.announcements$ = this.dataService.getAnnouncements();
  }

    openAnnouncement(a: Anuncio) {
    this.selectedAnnouncement = a;
  }

  closeModal() {
    this.selectedAnnouncement = null;
  }
}
