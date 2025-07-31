import { Component, ElementRef, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modal-delete',
  imports: [],
  templateUrl: './modal-delete.component.html',
  styleUrl: './modal-delete.component.css'
})
export class ModalDeleteComponent {
  //@Input({required : true}) activeTab: string = 'sedes'; 
  @Input({ required: true })
  activeTab!: string;
  @Input() rowId!: number;
  @Output() deleted = new EventEmitter<void>();

  private modalService = inject(NgbModal);
  //private toolsForm = inject(FormBuilder);
  private notification       = inject(ToastrService);
  private http         = inject(HttpClient);
  private apiBase      = environment.apiBase;

  @ViewChild('modalDelete') modalDelete!: TemplateRef<ElementRef>;

  getTitle(): string {
    switch (this.activeTab) {
      case 'sedes': return 'Eliminar sede';
      case 'niveles': return 'Eliminar nivel/programa';
      case 'grados': return 'Eliminar grado';
      case 'secciones': return 'Eliminar sección';
      case 'periodos' : return 'Eliminar periodo';
      default: return 'Eliminar';
    }
  }

  openModal() {
    this.modalService.open(this.modalDelete, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
  }

  onCancel() {
    this.modalService.dismissAll();
  }

  onConfirmDelete() {
    if (!this.rowId || isNaN(this.rowId)) {
      this.notification.error('ID no válido', 'Error');
      return;
    }

    // Decidir URL según pestaña
    let url = '';
    switch (this.activeTab) {
      case 'sedes':
        url = `${this.apiBase}/campus/${this.rowId}`;
        break;
      case 'niveles':
        url = `${this.apiBase}/level/${this.rowId}`;
        break;
      case 'grados':
        url = `${this.apiBase}/grade/${this.rowId}`;
        break;
      case 'secciones':
        url = `${this.apiBase}/section/${this.rowId}`;
        break;
      case 'periodos':
        url = `${this.apiBase}/period/${this.rowId}`;
        break;
      default:
        this.notification.error('Operación no soportada', 'Error');
        return;
    }

    this.http.delete(url).subscribe({
      next: () => {
        this.notification.success('Eliminado correctamente', 'Éxito');
        this.modalService.dismissAll();
        this.deleted.emit();
      },
      error: err => {
        console.error('Error borrando:', err);
        this.notification.error(err.error?.message || err.message, 'Error');
      }
    });
  }
  




}
