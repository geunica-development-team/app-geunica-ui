import { Component, ElementRef, EventEmitter, inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AcademicData, AssignGroupData, GuardianData, StudentData } from '../../../services/enrollment.service';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { ESTADOS, GRADO, NIVEL, SEXO, TIPO_DOCUMENTO, TURNO } from '../../../utility/personal-data';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-add-enrollment',
  imports: [FormsModule],
  templateUrl: './modal-add-enrollment.component.html',
  styleUrl: './modal-add-enrollment.component.css'
})
export class ModalAddEnrollmentComponent {
  @Output() enrollmentAdded = new EventEmitter<any>();

  //INYECCIONES
  private modalService = inject(NgbModal);
  private toolsForm = inject(FormBuilder);
  private notifycation = inject(ToastrService);

  @ViewChild('modalAddEnrollment') modalAddEnrollment!: TemplateRef<ElementRef>;  

    formAddEnrollment = this.toolsForm.group({
      'namesStudent': ['', [Validators.required]],
      'paternalSurnameStudent': ['', [Validators.required]],
      'maternalSurnameStudent': ['', [Validators.required]],
      'typeDocument': ['', [Validators.required]],
      'nroDocument': ['', [Validators.required]],
      'birthdate': [Date],
      'gender': ['', [Validators.required]],
    })

  documentTypes = TIPO_DOCUMENTO;
  levels = NIVEL;
  grades = GRADO;
  shifts = TURNO;
  genres = SEXO;
  states = ESTADOS;

  studentData: StudentData = {
    firstName: '',
    paternalLastName: '',
    maternalLastName: '',
    documentType: '',
    documentNumber: '',
    birthDate: '',
    gender: '',
    phone: '',
    address: '',
    email: ''
  };

  guardianData: GuardianData = {
    firstName: '',
    paternalLastName: '',
    maternalLastName: '',
    documentType: '',
    documentNumber: '',
    birthDate: '',
    gender: '',
    phone: '',
    address: '',
    email: ''
  };

  academicData: AcademicData = {
    level: '',
    grade: '',
    shift: ''
  };

  enrollmentStatus: string = '';

  onLevelChange() {
    // Aquí puedes filtrar los grados según el nivel seleccionado
    console.log('Nivel cambiado a:', this.academicData.level);
  }

  private resetForm() {
    this.studentData = {
      firstName: '',
      paternalLastName: '',
      maternalLastName: '',
      documentType: '',
      documentNumber: '',
      birthDate: '',
      gender: '',
      phone: '',
      address: '',
      email: ''
    };

    this.guardianData = {
      firstName: '',
      paternalLastName: '',
      maternalLastName: '',
      documentType: '',
      documentNumber: '',
      birthDate: '',
      gender: '',
      phone: '',
      address: '',
      email: ''
    };

    this.academicData = {
      level: '',
      grade: '',
      shift: ''
    };

    this.enrollmentStatus = '';
  }

  openModal() {
    console.log('Abriendo modal para:'); // Para debug
    
    this.modalService.open(this.modalAddEnrollment, { 
      centered: true,
      size: 'xl',
      backdrop: 'static'
    });
  }

  onConfirm() {
    console.log('Datos a enviar: wi');
    this.modalService.dismissAll();
  }

  onCancel() {
    this.modalService.dismissAll();
  }
}
