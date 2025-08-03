import { Component, ElementRef, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { environment } from '../../../../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-modal-delete',
  imports: [],
  templateUrl: './modal-delete.component.html',
  styleUrl: './modal-delete.component.css'
})
export class ModalDeleteComponent {

  private modalService = inject(NgbModal);
  //private toolsForm = inject(FormBuilder);
  private notification       = inject(ToastrService);
  private http         = inject(HttpClient);
  private route        = inject(ActivatedRoute);
  private baseUrl      = environment.apiBase;

  @Input({ required: true }) activeTab!: string;
  @Input() rowId!: number;
  @Output() deleted = new EventEmitter<void>();

  @ViewChild('modalDelete') modalDelete!: TemplateRef<ElementRef>;

  isLoading = false;

  getTitle(): string {
    switch (this.activeTab) {
      case 'lunes':      return 'Eliminar horario: Lunes';
      case 'martes':     return 'Eliminar horario: Martes';
      case 'miercoles':  return 'Eliminar horario: Miércoles';
      case 'jueves':     return 'Eliminar horario: Jueves';
      case 'viernes':    return 'Eliminar horario: Viernes';
      case 'sabado':     return 'Eliminar horario: Sábado';
      case 'domingo':    return 'Eliminar horario: Domingo';
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

    const classroomId = +this.route.snapshot.paramMap.get('id')!;
    const url = `${this.baseUrl}/aula/${classroomId}/schedule/${this.rowId}`;

    this.isLoading = true;
    this.http.delete(url).subscribe({
      next: () => {
        this.isLoading = false;

        // Notificación de éxito
        this.notification.success('Horario eliminado correctamente', 'Éxito');

        // Cerrar modal
        this.modalService.dismissAll();

        // Emitir evento al componente padre si lo necesitas
        this.deleted.emit();
      },
      error: err => {
        this.isLoading = false;
        console.error('🚨 DELETE response error:', err);
        this.notification.error(
          err.error?.message || err.message || JSON.stringify(err),
          'Error'
        );
      }
    });
  }

}

