import { Component, OnInit } from '@angular/core';
import {  DataStudentService } from '../../services/dataStudent.service';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from '../../../app.component';
import { AppModalComponent } from '../../../components/app-modal/app-modal.component';
import { Anuncio } from '../../services/modelStudent';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../enviroments/environment';


@Component({
  selector: 'app-announcement',
  imports: [CommonModule, AppModalComponent, PanelHeaderComponent],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.css'
})
export class AnnouncementComponent implements OnInit{
  
  announcements$!: Observable<Anuncio[]>;
  selectedAnnouncement: Anuncio | null = null;

  private baseUrl = environment.apiBase;
  constructor(private dataService: DataStudentService, private http: HttpClient) {}

  ngOnInit() {
    this.announcements$ = this.dataService.getAnnouncements();
  }

  


    //announcements$ = this.announcementsService.getAnnouncements(); // Tu observable actual
  //selectedAnnouncement: any = null;
  currentFilter: string = 'all';

  // ... resto de tu código existente

  // Método para abrir un anuncio (ya lo tienes, pero puedes optimizarlo)
  openAnnouncement(announcement: any): void {
    this.selectedAnnouncement = announcement;
    
    // Marcar como visto si no lo está
    if (announcement.estado === 'publicado') {
      this.markAsRead(announcement);
    }
  }

  // Método para cerrar el modal (ya lo tienes)
  closeModal(): void {
    this.selectedAnnouncement = null;
  }

  // Nuevo método para filtrar anuncios
  setFilter(filter: string): void {
    this.currentFilter = filter;
  }

  // Obtener texto del filtro actual
  getCurrentFilterText(): string {
    const filterTexts = {
      'all': 'Ver todos',
      'visto': 'Completados',
      'publicado': 'Por completar'
    };
    return filterTexts[this.currentFilter as keyof typeof filterTexts] || 'Ver todos';
  }

  // Filtrar anuncios según el filtro seleccionado
  getFilteredAnnouncements(announcements: any[]): any[] {
    if (!announcements) return [];
    
    if (this.currentFilter === 'all') {
      return announcements;
    }
    
    return announcements.filter(announcement => 
      announcement.estado === this.currentFilter
    );
  }

  // TrackBy function para mejor rendimiento en ngFor
  trackByAnnouncementId(index: number, announcement: any): number {
    return announcement.id || index;
  }

  // Método para marcar anuncio como leído
  private markAsRead(announcement: any): void {
    // Aquí implementarías la llamada al backend para marcar como visto
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Ejemplo de llamada HTTP (ajusta según tu API)
    this.http.put(`${this.baseUrl}/announcements/${announcement.id}/mark-read`, {}, { headers })
      .subscribe(
        response => {
          // Actualizar el estado localmente
          announcement.estado = 'visto';
          console.log('Anuncio marcado como leído');
        },
        error => {
          console.error('Error al marcar anuncio como leído:', error);
        }
      );
  }

  // Método para obtener estadísticas de anuncios (opcional)
  getAnnouncementStats(announcements: any[]): { total: number, read: number, unread: number } {
    if (!announcements) return { total: 0, read: 0, unread: 0 };
    
    const total = announcements.length;
    const read = announcements.filter(a => a.estado === 'visto').length;
    const unread = announcements.filter(a => a.estado === 'publicado').length;
    
    return { total, read, unread };
  }

  // Método para refrescar anuncios
  refreshAnnouncements(): void {
    //this.announcements$ = this.announcementsService.getAnnouncements();
  }

  // Método para manejar errores
  handleError(error: any): void {
    console.error('Error en anuncios:', error);
    // Aquí podrías mostrar un toast o mensaje de error
  }


}
