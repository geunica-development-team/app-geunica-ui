import { Component, ElementRef, EventEmitter, inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssignGroupData, EnrollmentData, GroupOption } from '../../../services/enrollment.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-read-enrollment',
  imports: [FormsModule],
  templateUrl: './modal-read-enrollment.component.html',
  styleUrl: './modal-read-enrollment.component.css'
})
export class ModalReadEnrollmentComponent {
  private modalService = inject(NgbModal);
  
  @Output() enrollmentUpdated = new EventEmitter<EnrollmentData>();

  // Estado del modal
  isEditMode: boolean = false;
  originalData: EnrollmentData | null = null;
  currentData: EnrollmentData | null = null;

  // Opciones para dropdowns
  documentTypes = [
    { value: 'DNI', label: 'DNI' },
    { value: 'CE', label: 'Carnet de Extranjería' },
    { value: 'PASAPORTE', label: 'Pasaporte' }
  ];

  genders = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' }
  ];

  enrollmentStatuses = [
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Evaluado', label: 'Evaluado' },
    { value: 'Aprobado', label: 'Aprobado' },
    { value: 'Inscrito', label: 'Inscrito' },
    { value: 'Rechazado', label: 'Rechazado' }
  ];

  @ViewChild('modalReadEnrollment') modalReadEnrollment!: TemplateRef<ElementRef>;

  openModal(enrollmentData: any) {
    // Mapear los datos recibidos al formato interno
    this.originalData = {
      studentName: enrollmentData.student || 'Carlos Zuñiga',
      enrollmentDate: enrollmentData.date || '12/05/2025',
      level: enrollmentData.application_level || 'Primaria',
      grade: '4to',
      shift: 'Mañana',
      student: {
        firstName: 'Gabriel',
        paternalLastName: 'Echevarria',
        maternalLastName: 'Gutierrez',
        documentType: 'DNI',
        documentNumber: '76251458',
        birthDate: '2005-01-16',
        gender: 'M',
        phone: '987123654',
        address: 'Cal. Amazonas 345',
        email: 'correo@example.com'
      },
      guardian: {
        firstName: 'Gabriel',
        paternalLastName: 'Echevarria',
        maternalLastName: 'Gutierrez',
        documentType: 'DNI',
        documentNumber: '76251458',
        birthDate: '2005-01-16',
        gender: 'M',
        phone: '987123654',
        address: 'Cal. Amazonas 345',
        email: 'correo@example.com'
      },
      enrollmentStatus: 'Inscrito'
    };

    // Crear una copia para edición
    this.currentData = JSON.parse(JSON.stringify(this.originalData));
    this.isEditMode = false;

    this.modalService.open(this.modalReadEnrollment, { 
      centered: true,
      size: 'xl',
      backdrop: 'static'
    });
  }

  enableEditMode() {
    this.isEditMode = true;
  }

  cancelEdit() {
    // Restaurar datos originales
    this.currentData = JSON.parse(JSON.stringify(this.originalData));
    this.isEditMode = false;
  }

  saveChanges() {
    if (this.currentData) {
      // Actualizar los datos originales
      this.originalData = JSON.parse(JSON.stringify(this.currentData));
      this.isEditMode = false;
      
      // Emitir evento con los datos actualizados
      this.enrollmentUpdated.emit(this.currentData);
      
      // Mostrar mensaje de éxito
      alert('Cambios guardados exitosamente');
    }
  }

  onCancel() {
    if (this.isEditMode) {
      // Si está en modo edición, preguntar si quiere descartar cambios
      if (confirm('¿Estás seguro de que quieres descartar los cambios?')) {
        this.cancelEdit();
        this.modalService.dismissAll();
      }
    } else {
      this.modalService.dismissAll();
    }
  }
}
