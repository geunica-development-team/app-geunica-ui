import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { environment } from '../../../../enviroments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalAddCurriculumComponent } from './modals/modal-add-curriculum/modal-add-curriculum.component';
import { ModalEditCurriculumComponent } from './modals/modal-edit-curriculum/modal-edit-curriculum.component';
import { ModalDeletCurriculumComponent } from './modals/modal-delet-curriculum/modal-delet-curriculum.component';
import { AuthStorageService } from '../../../services/auth-storage.service';

@Component({
  selector: 'app-curriculum-managment',
  imports: [CommonModule, RouterModule, PanelHeaderComponent, ModalDeletCurriculumComponent, ModalEditCurriculumComponent, ModalAddCurriculumComponent],
  templateUrl: './curriculum-managment.component.html',
  styleUrl: './curriculum-managment.component.css'
})
export class CurriculumManagmentComponent implements OnInit {

  assignment: any;
  curriculum: any[] = [];
  loading = true;
  error: string | null = null;
  caId: number = 0;

  private baseUrl = environment.apiBase;

  // ViewChild para los modales
  @ViewChild('modalAdd') modalAdd!: ModalAddCurriculumComponent;
  @ViewChild('modalEdit') modalEdit!: ModalEditCurriculumComponent;
  @ViewChild('modalDelete') modalDelete!: ModalDeletCurriculumComponent;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient, 
    private authStorage: AuthStorageService
  ) {}

  ngOnInit(): void {
    this.caId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.caId) {
      this.error = 'ID de asignación inválido';
      this.loading = false;
      return;
    }

    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    this.error = null;

    const token = this.authStorage.getToken();
    const headers = token ? { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) } : {};
    // 1) Traer datos de la asignación
    this.http.get<any>(`${this.baseUrl}/teacher/me/assignment/${this.caId}`, headers)
      .subscribe({
        next: asg => {
          this.assignment = asg;
          this.loadCurriculum();
        },
        error: err => {
          console.error('ERROR fetching assignment →', err);
          this.error = 'No se pudo cargar la asignación';
          this.loading = false;
        }
      });
  }

  private loadCurriculum(): void {
    const token = this.authStorage.getToken();
    const headers = token ? { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) } : {};
    this.http.get<any>(`${this.baseUrl}/teacher/me/assignment/${this.caId}/curriculum`, headers)
      .subscribe({
        next: resp => {
          let items: any[];
          if (Array.isArray(resp)) {
            items = resp;
          } else if (Array.isArray(resp.curriculum)) {
            items = resp.curriculum;
          } else if (Array.isArray(resp.data)) {
            items = resp.data;
          } else {
            items = [];
          }

          this.curriculum = items.sort((a, b) => a.position - b.position);
          this.loading = false;
        },
        error: err => {
          console.error('ERROR fetching curriculum →', err);
          this.error = 'No se pudo cargar el currículum';
          this.loading = false;
        }
      });
  }

  // ===================
  // MODAL HANDLERS
  // ===================
  openCreateModal(): void {
    this.modalAdd.caId = this.caId;
    this.modalAdd.nextPosition = this.curriculum.length + 1;
    this.modalAdd.openModal();
  }

  editTema(item: any): void {
    if (!isNaN(+item.id)) {
      this.modalEdit.curriculumId = +item.id;
      this.modalEdit.itemData = { ...item }; // Copia de los datos
      this.modalEdit.openModal();
    }
  }

  deleteTema(item: any, event?: Event): void {
    if (event) event.preventDefault();
    
    if (!isNaN(+item.id)) {
      this.modalDelete.curriculumId = +item.id;
      this.modalDelete.itemData = { ...item };
      this.modalDelete.openModal();
    }
  }

  // Callback cuando se crea, edita o elimina un tema
  onCreatedOrEditedOrDeleted(): void {
    this.loadCurriculum(); // Recargar la lista
  }

  // ===================
  // MOVER ARRIBA/ABAJO
  // ===================
  moveUp(item: any, event: Event): void {
    event.preventDefault();
    
    const currentIndex = this.curriculum.findIndex(c => c.id === item.id);
    if (currentIndex <= 0) return;

    const prevItem = this.curriculum[currentIndex - 1];
    this.swapPositions(item, prevItem);
  }

  moveDown(item: any, event: Event): void {
    event.preventDefault();
    
    const currentIndex = this.curriculum.findIndex(c => c.id === item.id);
    if (currentIndex >= this.curriculum.length - 1) return;

    const nextItem = this.curriculum[currentIndex + 1];
    this.swapPositions(item, nextItem);
  }

  private swapPositions(item1: any, item2: any): void {
    const tempPosition = item1.position;
    item1.position = item2.position;
    item2.position = tempPosition;

    const reorderData = {
      items: [
        { id: item1.id, position: item1.position },
        { id: item2.id, position: item2.position }
      ]
    };

    const token = this.authStorage.getToken();
    const headers = token ? { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) } : {};
    this.http.patch(`${this.baseUrl}/teacher/me/assignment/${this.caId}/curriculum/reorder`, reorderData, headers)
      .subscribe({
        next: () => {
          this.loadCurriculum();
          this.showSuccessMessage('Posiciones actualizadas');
        },
        error: err => {
          console.error('Error reordering →', err);
          this.showErrorMessage('Error al reordenar');
          // Revertir cambios locales
          const tempPos = item1.position;
          item1.position = item2.position;
          item2.position = tempPos;
        }
      });
  }

  // ===================
  // UTILIDADES
  // ===================
  reorderTemas(): void {
    console.log('Función reorderTemas - implementar drag & drop');
    alert('Función de reordenamiento masivo - por implementar');
  }

  exportTemas(): void {
    const csvContent = this.generateCSV();
    this.downloadCSV(csvContent, `temario_${this.assignment?.course?.name}_${Date.now()}.csv`);
    this.showSuccessMessage('Temario exportado exitosamente');
  }

  private generateCSV(): string {
    const headers = ['Posición', 'Título', 'Descripción', 'Fecha Programada', 'Fecha Creación'];
    const rows = this.curriculum.map(item => [
      item.position,
      `"${item.title}"`,
      `"${item.description || ''}"`,
      item.scheduledDate || '',
      new Date(item.createdAt).toLocaleDateString()
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  private downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  private showSuccessMessage(message: string): void {
    console.log('SUCCESS:', message);
    // Implementar toast/snackbar
  }

  private showErrorMessage(message: string): void {
    console.error('ERROR:', message);
    alert(message);
  }

}
