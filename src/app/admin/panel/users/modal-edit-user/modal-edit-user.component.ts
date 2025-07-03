import { Component, ElementRef, EventEmitter, inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssignGroupData, GroupOption } from '../../../services/enrollment.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-edit-user',
  imports: [FormsModule],
  templateUrl: './modal-edit-user.component.html',
  styleUrl: './modal-edit-user.component.css'
})
export class ModalEditUserComponent {
  //INYECCIONES
  private modalService = inject(NgbModal);


  @Output() userUpdated = new EventEmitter<void>();

  @Output() groupAssigned = new EventEmitter<AssignGroupData>();

  // Datos del estudiante seleccionado
  currentStudent: any = null;
  selectedLevel: string = 'Primaria';
  selectedGrade: string = '2do';
  selectedGroupId: string = '';

  levels = [
    { value: 'Inicial', label: 'Inicial' },
    { value: 'Primaria', label: 'Primaria' },
    { value: 'Secundaria', label: 'Secundaria' }
  ];

  grades = [
    { value: '1ro', label: '1ro' },
    { value: '2do', label: '2do' },
    { value: '3ro', label: '3ro' },
    { value: '4to', label: '4to' },
    { value: '5to', label: '5to' },
    { value: '6to', label: '6to' }
  ];

  

  @ViewChild('modalEditUser') modalEditUser!: TemplateRef<ElementRef>;

  openModal(studentData: any) {
    console.log('Abriendo modal para:', studentData); // Para debug
    
    this.currentStudent = studentData;
    this.selectedLevel = studentData.application_level || 'Primaria';
    this.selectedGrade = '2do';
    
    
    
    this.modalService.open(this.modalEditUser, { 
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
  }





  onLevelChange() {
    console.log('Nivel cambiado a:', this.selectedLevel);
  }

  onGradeChange() {
    console.log('Grado cambiado a:', this.selectedGrade);
  }

  onGroupSelect(groupId: string) {
    this.selectedGroupId = groupId;
    console.log('Grupo seleccionado:', groupId);
  }

  getGroupStatusClass(group: GroupOption): string {
    switch (group.status) {
      case 'Disponible':
        return 'badge-success';
      case 'Saturado':
        return 'badge-warning';
      case 'Completo':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  

  onCancel() {
    this.modalService.dismissAll();
  }
}
