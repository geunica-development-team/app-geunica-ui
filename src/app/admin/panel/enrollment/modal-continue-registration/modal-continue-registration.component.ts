import { Component, ElementRef, EventEmitter, inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { AssignGroupData, GroupOption } from '../../../services/enrollment.service';
import { FormsModule } from '@angular/forms';
import { GRADO, NIVEL, TURNO } from '../../../utility/personal-data';
import { ClassroomService, dataClassroomAll } from '../../../services/classroom.service';
import { InscriptionService } from '../../../services/inscription.service';

export interface dataClassroomAdapted {
  id: number;
  shift: string;
  capacity: number;
  special_capacity: number;
  total_students: number;
  total_special_students: number;
  level: string;
  grade: string;
  section: string;
  status: string;
}

@Component({
  selector: 'app-modal-continue-registration',
  imports: [FormsModule],
  templateUrl: './modal-continue-registration.component.html',
  styleUrl: './modal-continue-registration.component.css'
})
export class ModalContinueRegistrationComponent {
  @Output() classroomAssigned = new EventEmitter<any>();

  //INYECCIONES
  private modalService = inject(NgbModal);
  private classroomService = inject(ClassroomService);
  private inscriptionService = inject(InscriptionService);
  
  studentFullName: string = '';
  typeOfDocument: string = '';
  documentNumber: string = '';
  dateBirthDate: string = '';
  studentGender: string = '';

  registrationDate: string = '';
  levelAndGrade: string = '';

  result: string = '';

  classrooms: dataClassroomAll[] = []
  availableGroups: dataClassroomAdapted[] = []

  @ViewChild('modalContinueRegistration') modalContinueRegistration!: TemplateRef<ElementRef>;

  loadClassrooms() {
    this.classroomService.getAllClassrooms().subscribe({
      next:(classrooms) => {
        this.classrooms = classrooms;
        
        this.availableGroups = classrooms.map(classroom => ({
          id: classroom.id,
          shift: classroom.shift,
          capacity: classroom.capacity,
          special_capacity: classroom.specialCapacity,
          total_students: 0,
          total_special_students: 0,
          level: classroom.grade?.level?.name,
          grade: classroom.grade?.name,
          section: classroom.section?.name,
          status: 'Disponible'
        }));
        console.log(this.availableGroups);
      },
      error: (error) => {
        console.error('Error al cargar salones', error);
      }
    })
  }
  openModal(studentData: any) {
    this.loadClassrooms();
    // Actualizar el estado de disponibilidad de todos los grupos
    //this.updateGroupAvailability();
    
    this.modalService.open(this.modalContinueRegistration, { 
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
  }

  get filteredGroups(): dataClassroomAdapted[] {
    return this.availableGroups;
  }

  // Método para obtener grupos filtrados
  //get filteredGroups(): GroupOption[] {
  //  return this.availableGroups.filter(group => {
  //    // Filtrar por nivel (si está seleccionado)
  //    if (this.selectedLevel && group.level.toLowerCase() !== this.selectedLevel.toLowerCase()) {
  //      return false;
  //    }
  //    
  //    // Filtrar por grado (si está seleccionado)
  //    if (this.selectedGrade && !group.name.toLowerCase().includes(this.selectedGrade.toLowerCase())) {
  //      return false;
  //    }
  //    
  //    // Filtrar por turno (si está seleccionado)
  //    if (this.selectedShift && group.shift.toLowerCase() !== this.selectedShift.toLowerCase()) {
  //      return false;
  //    }
  //    
  //    return true;
  //  });
  //}
//
  //// Método para actualizar la disponibilidad de los grupos
  //updateGroupAvailability() {
  //  this.availableGroups.forEach(group => {
  //    const studentHasCondition = this.currentStudent?.eval_result === 'Con condición';
  //    
  //    // Verificar si el grupo está completo
  //    const isGroupFull = group.total_students >= group.capacity;
  //    
  //    // Verificar si hay cupo para estudiantes con condición especial
  //    const hasSpecialSpot = group.total_special_students < group.special_capacity;
  //    
  //    // Determinar el estado del grupo
  //    if (isGroupFull) {
  //      group.status = 'Completo';
  //    } else if (studentHasCondition && !hasSpecialSpot) {
  //      group.status = 'Saturado';
  //    } else {
  //      group.status = 'Disponible';
  //    }
  //  });
  //}
//
  //onLevelChange() {
  //  console.log('Nivel cambiado a:', this.selectedLevel);
  //  this.selectedGroupId = ''; // Limpiar selección de grupo al cambiar filtro
  //  this.updateGroupAvailability();
  //}
//
  //onGradeChange() {
  //  console.log('Grado cambiado a:', this.selectedGrade);
  //  this.selectedGroupId = ''; // Limpiar selección de grupo al cambiar filtro
  //  this.updateGroupAvailability();
  //}
//
  //onShiftChange() {
  //  console.log('Turno cambiado a:', this.selectedShift);
  //  this.selectedGroupId = ''; // Limpiar selección de grupo al cambiar filtro
  //  this.updateGroupAvailability();
  //}
//
  //onGroupSelect(groupId: string) {
  //  this.selectedGroupId = groupId;
  //  console.log('Grupo seleccionado:', groupId);
  //}
//
  //getGroupStatusClass(group: GroupOption): string {
  //  switch (group.status) {
  //    case 'Disponible':
  //      return 'badge-success';
  //    case 'Saturado':
  //      return 'badge-warning';
  //    case 'Completo':
  //      return 'badge-danger';
  //    default:
  //      return 'badge-secondary';
  //  }
  //}
//
  //// Método para verificar si un grupo debe estar deshabilitado
  //isGroupDisabled(group: GroupOption): boolean {
  //  const studentHasCondition = this.currentStudent?.eval_result === 'Con condición';
  //  
  //  // El grupo está deshabilitado si:
  //  // 1. El total de estudiantes ya alcanzó la capacidad máxima, O
  //  // 2. El estudiante tiene condición especial Y ya se alcanzó el límite de estudiantes especiales
  //  const isGroupFull = group.total_students >= group.capacity;
  //  const specialCapacityFull = group.total_special_students >= group.special_capacity;
  //  
  //  if (isGroupFull) {
  //    return true; // Grupo completamente lleno
  //  }
  //  
  //  if (studentHasCondition && specialCapacityFull) {
  //    return true; // Sin cupo para estudiantes con condición especial
  //  }
  //  
  //  return false; // Grupo disponible
  //}
//
  //// Método para obtener información detallada sobre la disponibilidad
  //getGroupAvailabilityInfo(group: GroupOption): string {
  //  const studentHasCondition = this.currentStudent?.eval_result === 'Con condición';
  //  const availableSpots = group.capacity - group.total_students;
  //  const availableSpecialSpots = group.special_capacity - group.total_special_students;
  //  
  //  if (group.total_students >= group.capacity) {
  //    return 'Grupo completo';
  //  }
  //  
  //  if (studentHasCondition && group.total_special_students >= group.special_capacity) {
  //    return 'Sin cupo para estudiantes con condición especial';
  //  }
  //  
  //  if (studentHasCondition) {
  //    return `${availableSpots} cupos disponibles (${availableSpecialSpots} para condición especial)`;
  //  }
  //  
  //  return `${availableSpots} cupos disponibles`;
  //}
//
  //get isSelectedGroupDisabled(): boolean {
  //  if (!this.selectedGroupId) return true;
  //  const group = this.availableGroups.find(g => g.id === this.selectedGroupId);
  //  return group ? this.isGroupDisabled(group) : true;
  //}
//
  //onConfirm() {
  //  const selectedGroup = this.availableGroups.find(g => g.id === this.selectedGroupId);
  //  
  //  if (!selectedGroup) {
  //    alert('Por favor selecciona un grupo');
  //    return;
  //  }
  //  
  //  if (this.isGroupDisabled(selectedGroup)) {
  //    alert('El grupo seleccionado no tiene cupos disponibles');
  //    return;
  //  }
  //  
  //  const assignData: AssignGroupData = {
  //    studentId: this.currentStudent.id,
  //    studentName: this.currentStudent.student,
  //    level: this.selectedLevel,
  //    grade: this.selectedGrade,
  //    selectedGroup: selectedGroup
  //  };
  //  
  //  console.log('Datos a enviar:', assignData);
  //  this.groupAssigned.emit(assignData);
  //  this.modalService.dismissAll();
  //}

  onCancel() {
    this.modalService.dismissAll();
  }
}
