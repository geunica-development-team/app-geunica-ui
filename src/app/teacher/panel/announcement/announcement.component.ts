import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AppModalComponent } from '../../../components/app-modal/app-modal.component';
import { SearcherComponent } from '../../../components/searcher/searcher.component';
import { Anuncio } from '../../services/modelTeacher';
import { DataTeacherService } from '../../services/dataTeacher.service';
import {QuillModule } from 'ngx-quill'
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../enviroments/environment';

export interface DocenteAnnouncement {
  id: number;
  titulo: string;
  cuerpo: string;
  fecha_creacion: string;
  fecha_programada?: string;
  estado: 'enviado' | 'borrador' | 'programado';
  destinatarios: string[];
  prioridad: 'normal' | 'alta' | 'urgente';
  creado_por: string;
}

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [CommonModule, AppModalComponent,  FormsModule, QuillModule, PanelHeaderComponent ],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.css'
})
export class AnnouncementComponent implements OnInit {
  announcements$!: Observable<Anuncio[]>;
  selectedAnnouncement: Anuncio | null = null;
  creatingAnnouncement = false;
  students: readonly any[]|null|undefined;

  private http = inject(HttpClient);
  private formBuilder = inject(FormBuilder);
  private notification = inject(ToastrService);
  private modal = inject(NgbModal);
  private BaseUrl = environment.apiBase;

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

  announcements: DocenteAnnouncement[] = [
  {
    id: 1,
    titulo: "Reunión de Coordinación Académica",
    cuerpo: "Se convoca a todos los docentes a la reunión mensual de coordinación académica que se realizará el próximo viernes a las 10:00 AM en el auditorio principal. Se tratarán temas importantes sobre el nuevo semestre.",
    fecha_creacion: "2025-01-15",
    estado: "enviado",
    destinatarios: ["docentes", "administrativos"],
    prioridad: "normal",
    creado_por: "Prof. María González"
  },
  {
    id: 2,
    titulo: "Cambios en el Cronograma de Exámenes",
    cuerpo: "Estimados estudiantes, debido a las festividades navideñas, se ha modificado el cronograma de exámenes finales. Por favor revisar el nuevo calendario que será enviado por correo electrónico.",
    fecha_creacion: "2025-01-12",
    estado: "enviado",
    destinatarios: ["estudiantes"],
    prioridad: "alta",
    creado_por: "Prof. María González"
  },
  {
    id: 3,
    titulo: "Capacitación en Nuevas Tecnologías",
    cuerpo: "Se ha programado una capacitación sobre el uso de nuevas tecnologías educativas para el próximo mes. La inscripción será voluntaria y se otorgarán certificados de participación.",
    fecha_creacion: "2025-01-10",
    estado: "borrador",
    destinatarios: ["docentes"],
    prioridad: "normal",
    creado_por: "Prof. María González"
  },
  {
    id: 4,
    titulo: "Recordatorio: Entrega de Notas",
    cuerpo: "Recordatorio para todos los docentes: la fecha límite para la entrega de calificaciones del primer parcial es el 20 de enero. No se aceptarán entregas tardías.",
    fecha_creacion: "2025-01-08",
    fecha_programada: "2025-01-18T09:00",
    estado: "programado",
    destinatarios: ["docentes"],
    prioridad: "urgente",
    creado_por: "Prof. María González"
  },
  {
    id: 5,
    titulo: "Nuevas Políticas de Biblioteca",
    cuerpo: "A partir del próximo mes entrarán en vigor las nuevas políticas de préstamo de libros y uso de espacios de estudio en la biblioteca central.",
    fecha_creacion: "2025-01-05",
    estado: "enviado",
    destinatarios: ["estudiantes", "docentes"],
    prioridad: "normal",
    creado_por: "Prof. María González"
  }
];

// Métodos de ejemplo:
currentFilter = 'all';
showCreateModal = false;
showDeleteModal = false;
isEditMode = false;

announcementToDelete: DocenteAnnouncement | null = null;

// Form reactive
announcementForm = this.formBuilder.group({
  titulo: ['', Validators.required],
  cuerpo: ['', Validators.required],
  prioridad: ['normal'],
  destinatarios: [[]],
  fechaProgramada: ['']
});

}
