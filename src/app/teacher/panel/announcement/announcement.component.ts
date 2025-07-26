import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AppModalComponent } from '../../../components/app-modal/app-modal.component';
import { SearcherComponent } from '../../../components/searcher/searcher.component';
import { Anuncio } from '../../services/modelTeacher';
import { DataTeacherService } from '../../services/dataTeacher.service';
import {QuillModule } from 'ngx-quill'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [CommonModule, AppModalComponent,  FormsModule, QuillModule ],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.css'
})
export class AnnouncementComponent implements OnInit {
  announcements$!: Observable<Anuncio[]>;
  selectedAnnouncement: Anuncio | null = null;
  creatingAnnouncement = false;
  students: readonly any[]|null|undefined;


  contenido = '';
  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // botones de formato
      
      [{ 'header': 1 }, { 'header': 2 }],               // encabezados personalizados
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // aumentar/disminuir sangría
      [{ 'direction': 'rtl' }],                         // dirección del texto (derecha a izquierda)
      [{ 'size': ['small', false, 'large', 'huge'] }],  // tamaño de fuente personalizado
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],          // colores de texto y fondo
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean']  
    ]
  };

  constructor(private dataService: DataTeacherService) {}

  ngOnInit() {
    this.announcements$ = this.dataService.getAnnouncements();
  }

    openAnnouncement(a: Anuncio) {
    this.selectedAnnouncement = a;
  }

  closeModal() {
    this.selectedAnnouncement = null;
    this.creatingAnnouncement = false;
    this.contenido = '';// Limpia el contenido para la próxima vez
  }

  openModalAnuncio(){
    this.creatingAnnouncement = true;
    // Si quieres asegurarte, también puedes vaciar aquí:
    this.contenido = '';
  }

  saveNewAnnouncement() {
    console.log('Enviar:', this.contenido);
    this.closeModal();
  }

}
