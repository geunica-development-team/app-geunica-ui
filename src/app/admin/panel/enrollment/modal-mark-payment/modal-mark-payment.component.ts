import { Component, ElementRef, EventEmitter, inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssignGroupData, GroupOption } from '../../../services/enrollment.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-mark-payment',
  imports: [FormsModule],
  templateUrl: './modal-mark-payment.component.html',
  styleUrl: './modal-mark-payment.component.css'
})
export class ModalMarkPaymentComponent {
//INYECCIONES
  private modalService = inject(NgbModal);

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

  // Grupos disponibles (esto normalmente vendría de un servicio)
  availableGroups: GroupOption[] = [
    {
      id: '2do-a',
      name: '2do A',
      available: true,
      conditionQuota: 0,
      maxConditionQuota: 1,
      totalStudents: 25,
      maxCapacity: 30,
      status: 'Disponible'
    },
    {
      id: '2do-b',
      name: '2do B',
      available: true,
      conditionQuota: 1,
      maxConditionQuota: 1,
      totalStudents: 30,
      maxCapacity: 30,
      status: 'Disponible'
    }
  ];

  @ViewChild('modalMarkPayment') modalMarkPayment!: TemplateRef<ElementRef>;

  openModal(studentData: any) {
    console.log('Abriendo modal para:', studentData); // Para debug
    
    this.currentStudent = studentData;
    this.selectedLevel = studentData.application_level || 'Primaria';
    this.selectedGrade = '2do';
    
    // Seleccionar el primer grupo disponible por defecto
    const firstAvailable = this.availableGroups.find(g => g.available);
    if (firstAvailable) {
      this.selectedGroupId = firstAvailable.id;
    }
    
    this.modalService.open(this.modalMarkPayment, { 
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

  isGroupDisabled(group: GroupOption): boolean {
    return !group.available || group.status === 'Saturado';
  }

  onConfirm() {
    const selectedGroup = this.availableGroups.find(g => g.id === this.selectedGroupId);
    
    if (!selectedGroup) {
      alert('Por favor selecciona un grupo');
      return;
    }

    const assignData: AssignGroupData = {
      studentId: this.currentStudent.id,
      studentName: this.currentStudent.student,
      level: this.selectedLevel,
      grade: this.selectedGrade,
      selectedGroup: selectedGroup
    };

    console.log('Datos a enviar:', assignData);
    this.groupAssigned.emit(assignData);
    this.modalService.dismissAll();
  }

  onCancel() {
    this.modalService.dismissAll();
  }
}
