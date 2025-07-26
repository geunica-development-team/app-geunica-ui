import { Component, ElementRef, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-delete',
  imports: [],
  templateUrl: './modal-delete.component.html',
  styleUrl: './modal-delete.component.css'
})
export class ModalDeleteComponent {
  @Input({required : true}) activeTab: string = 'sedes';
  @Input() rowId!: number;
  @Output() deleted = new EventEmitter<void>();

  getTitle(): string {
    switch (this.activeTab) {
      case 'sedes': return 'Eliminar sede';
      case 'niveles': return 'Eliminar nivel/programa';
      case 'grados': return 'Eliminar grado';
      case 'secciones': return 'Eliminar sección';
      default: return 'Eliminar';
    }
  }

  private modalService = inject(NgbModal);
  private toolsForm = inject(FormBuilder);
  private notifycation = inject(ToastrService);

  deleteCampus() {
    if (this.rowId) {
      console.log('HOLIIIIIIIIIIIIIII')
    } else {
      this.notifycation.error('ID de producto no válido', 'Error');
    }
  }

  deleteLevel() {
    if (this.rowId) {
      console.log('HOLIIIIIIIIIIIIIII')
    } else {
      this.notifycation.error('ID de producto no válido', 'Error');
    }
  }

  deleteGrade() {
    if (this.rowId) {
      console.log('HOLIIIIIIIIIIIIIII')
    } else {
      this.notifycation.error('ID de producto no válido', 'Error');
    }
  }

  deleteSection() {
    if (this.rowId) {
      console.log('HOLIIIIIIIIIIIIIII')
    } else {
      this.notifycation.error('ID de producto no válido', 'Error');
    }
  }
  
  @ViewChild('modalDelete') modalDelete!: TemplateRef<ElementRef>;
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
}
