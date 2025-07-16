import { Component, OnInit } from '@angular/core';
import {  DataStudentService } from '../../services/dataStudent.service';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from '../../../app.component';
import { AppModalComponent } from '../../../components/app-modal/app-modal.component';
import { Anuncio } from '../../services/modelStudent';


@Component({
  selector: 'app-announcement',
  imports: [CommonModule, AppModalComponent],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.css'
})
export class AnnouncementComponent implements OnInit{
  
  announcements$!: Observable<Anuncio[]>;
  selectedAnnouncement: Anuncio | null = null;

  constructor(private dataService: DataStudentService) {}

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
