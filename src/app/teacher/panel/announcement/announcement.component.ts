import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AppModalComponent } from '../../../components/app-modal/app-modal.component';
import { SearcherComponent } from '../../../components/searcher/searcher.component';
import { Anuncio } from '../../services/modelTeacher';
import { DataTeacherService } from '../../services/dataTeacher.service';
import { NgSelectModule } from '@ng-select/ng-select';
import Quill from 'quill';

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [CommonModule, AppModalComponent, NgSelectModule],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.css'
})
export class AnnouncementComponent implements OnInit {
  announcements$!: Observable<Anuncio[]>;
  selectedAnnouncement: Anuncio | null = null;
  creatingAnnouncement = false;
  students: readonly any[]|null|undefined;


  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef<HTMLDivElement>;
  private quillEditor!: Quill;//el quill no carga aaaaaah

  constructor(private dataService: DataTeacherService) {}

  ngOnInit() {
    this.announcements$ = this.dataService.getAnnouncements();
  }


    ngAfterViewInit() {
    // Inicializa Quill editor con toolbar básico
    this.quillEditor = new Quill(this.editorContainer.nativeElement, {
      modules: {
        toolbar: [ ['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link'] ]
      },
      theme: 'snow'
    });
  }

    openAnnouncement(a: Anuncio) {
    this.selectedAnnouncement = a;
  }

  closeModal() {
    this.selectedAnnouncement = null;
    this.creatingAnnouncement = false;
  }

  openModalAnuncio(){
    this.creatingAnnouncement = true;
  }

}
