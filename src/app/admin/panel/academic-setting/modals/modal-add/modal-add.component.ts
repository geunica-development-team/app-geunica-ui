import { Component, ElementRef, EventEmitter, inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CampusService } from '../../../../services/campus.service';
import { error } from 'console';

@Component({
  selector: 'app-modal-add',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-add.component.html',
  styleUrl: './modal-add.component.css'
})
export class ModalAddComponent {
  @Output() added = new EventEmitter<any>();

  private modalService = inject(NgbModal);
  private toolsForm = inject(FormBuilder);
  private notifycation = inject(ToastrService);
  private campusService = inject(CampusService)

  formAddCampus = this.toolsForm.group({
    'name': ['', [Validators.required]],
    'location': ['', [Validators.required]]
  })

  addCampus() {
    if (this.formAddCampus.invalid) {
      this.notifycation.error('Debes completar todos los campos correctamente', 'Error');
      return;
    }
    this.campusService.addCampus({
      name: this.formAddCampus.get('name')?.value ?? '',
      location: this.formAddCampus.get('location')?.value ?? ''
    }).subscribe({
      next: (value: any) => {
        this.notifycation.success('Sede agregada', 'Éxito')
        this.added.emit();
        this.modalService.dismissAll();
        this.formAddCampus.reset();
      },
      error: (error: Error) => {
        this.notifycation.error(error.message, 'Error');
      }
    })
  }

  @ViewChild('modalAdd') modalAdd!: TemplateRef<ElementRef>;  

  openModal() {
    console.log('Abriendo modal para:'); // Para debug
    
    this.modalService.open(this.modalAdd, { 
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
  }

  onCancel() {
    this.modalService.dismissAll();
  }
}
