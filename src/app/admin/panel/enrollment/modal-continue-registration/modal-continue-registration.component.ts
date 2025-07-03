import { Component, ElementRef, EventEmitter, inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { AssignGroupData, GroupOption } from '../../../services/enrollment.service';
import { FormsModule } from '@angular/forms';
import { GRADO, NIVEL, TURNO } from '../../../utility/personal-data';

@Component({
  selector: 'app-modal-continue-registration',
  imports: [FormsModule],
  templateUrl: './modal-continue-registration.component.html',
  styleUrl: './modal-continue-registration.component.css'
})
export class ModalContinueRegistrationComponent {
  //INYECCIONES
  private modalService = inject(NgbModal);
  
  @Output() groupAssigned = new EventEmitter<AssignGroupData>();

  // Datos del estudiante seleccionado
  currentStudent: any = null;
  selectedLevel: string = '';
  selectedGrade: string = '';
  selectedShift: string = '';
  selectedGroupId: string = '';

  levels = NIVEL;
  grades = GRADO;
  shifts = TURNO;

  // Grupos disponibles (esto normalmente vendría de un servicio)
  availableGroups: GroupOption[] = [
    { id: '1', area_id: '1', cycle_id: '1', name: '1ro A', level: 'Primaria', shift: 'Mañana', capacity: 25, special_capacity: 1, total_students: 24, total_special_students: 0, status: 'Disponible' },
    { id: '2', area_id: '1', cycle_id: '1', name: '1ro B', level: 'Primaria', shift: 'Tarde', capacity: 25, special_capacity: 1, total_students: 25, total_special_students: 1, status: 'Completo' },
    { id: '3', area_id: '1', cycle_id: '2', name: '2do A', level: 'Primaria', shift: 'Mañana', capacity: 30, special_capacity: 1, total_students: 29, total_special_students: 0, status: 'Disponible' },
    { id: '4', area_id: '1', cycle_id: '2', name: '2do B', level: 'Primaria', shift: 'Tarde', capacity: 30, special_capacity: 1, total_students: 30, total_special_students: 1, status: 'Completo' },
    { id: '5', area_id: '1', cycle_id: '2', name: '2do C', level: 'Primaria', shift: 'Mañana', capacity: 30, special_capacity: 2, total_students: 28, total_special_students: 2, status: 'Saturado' },
    { id: '6', area_id: '2', cycle_id: '3', name: '3ro A', level: 'Primaria', shift: 'Mañana', capacity: 32, special_capacity: 2, total_students: 30, total_special_students: 1, status: 'Disponible' },
    { id: '7', area_id: '2', cycle_id: '3', name: '3ro B', level: 'Primaria', shift: 'Tarde', capacity: 32, special_capacity: 1, total_students: 32, total_special_students: 1, status: 'Completo' },
    { id: '8', area_id: '2', cycle_id: '4', name: '4to A', level: 'Primaria', shift: 'Mañana', capacity: 35, special_capacity: 2, total_students: 34, total_special_students: 2, status: 'Saturado' },
    { id: '9', area_id: '2', cycle_id: '4', name: '4to B', level: 'Primaria', shift: 'Tarde', capacity: 35, special_capacity: 2, total_students: 33, total_special_students: 1, status: 'Disponible' },
    { id: '10', area_id: '2', cycle_id: '5', name: '5to A', level: 'Primaria', shift: 'Mañana', capacity: 28, special_capacity: 1, total_students: 27, total_special_students: 0, status: 'Disponible' },
    { id: '11', area_id: '2', cycle_id: '5', name: '5to B', level: 'Primaria', shift: 'Noche', capacity: 28, special_capacity: 1, total_students: 28, total_special_students: 1, status: 'Completo' },
    { id: '12', area_id: '2', cycle_id: '6', name: '6to A', level: 'Primaria', shift: 'Mañana', capacity: 30, special_capacity: 2, total_students: 30, total_special_students: 2, status: 'Saturado' },
    { id: '13', area_id: '3', cycle_id: '7', name: '1ro A', level: 'Secundaria', shift: 'Mañana', capacity: 30, special_capacity: 2, total_students: 28, total_special_students: 1, status: 'Disponible' },
    { id: '14', area_id: '3', cycle_id: '7', name: '1ro B', level: 'Secundaria', shift: 'Tarde', capacity: 30, special_capacity: 1, total_students: 30, total_special_students: 1, status: 'Completo' },
    { id: '15', area_id: '3', cycle_id: '8', name: '2do A', level: 'Secundaria', shift: 'Mañana', capacity: 33, special_capacity: 2, total_students: 33, total_special_students: 2, status: 'Saturado' },
    { id: '16', area_id: '3', cycle_id: '8', name: '2do B', level: 'Secundaria', shift: 'Noche', capacity: 33, special_capacity: 1, total_students: 31, total_special_students: 1, status: 'Disponible' },
    { id: '17', area_id: '3', cycle_id: '9', name: '3ro A', level: 'Secundaria', shift: 'Mañana', capacity: 35, special_capacity: 2, total_students: 34, total_special_students: 1, status: 'Disponible' },
    { id: '18', area_id: '3', cycle_id: '9', name: '3ro B', level: 'Secundaria', shift: 'Tarde', capacity: 35, special_capacity: 2, total_students: 35, total_special_students: 2, status: 'Saturado' },
    { id: '19', area_id: '3', cycle_id: '10', name: '4to A', level: 'Secundaria', shift: 'Mañana', capacity: 36, special_capacity: 2, total_students: 36, total_special_students: 2, status: 'Completo' },
    { id: '20', area_id: '3', cycle_id: '10', name: '4to B', level: 'Secundaria', shift: 'Noche', capacity: 36, special_capacity: 3, total_students: 35, total_special_students: 2, status: 'Disponible' },
  ];

  @ViewChild('modalContinueRegistration') modalContinueRegistration!: TemplateRef<ElementRef>;

  openModal(studentData: any) {
    console.log('Abriendo modal para:', studentData);
    
    this.currentStudent = studentData;
    // Inicializar filtros vacíos para mostrar todos los grupos
    this.selectedLevel = '';
    this.selectedGrade = '';
    this.selectedShift = '';
    this.selectedGroupId = '';
    
    // Actualizar el estado de disponibilidad de todos los grupos
    this.updateGroupAvailability();
    
    this.modalService.open(this.modalContinueRegistration, { 
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
  }

  // Método para obtener grupos filtrados
  get filteredGroups(): GroupOption[] {
    return this.availableGroups.filter(group => {
      // Filtrar por nivel (si está seleccionado)
      if (this.selectedLevel && group.level.toLowerCase() !== this.selectedLevel.toLowerCase()) {
        return false;
      }
      
      // Filtrar por grado (si está seleccionado)
      if (this.selectedGrade && !group.name.toLowerCase().includes(this.selectedGrade.toLowerCase())) {
        return false;
      }
      
      // Filtrar por turno (si está seleccionado)
      if (this.selectedShift && group.shift.toLowerCase() !== this.selectedShift.toLowerCase()) {
        return false;
      }
      
      return true;
    });
  }

  // Método para actualizar la disponibilidad de los grupos
  updateGroupAvailability() {
    this.availableGroups.forEach(group => {
      const studentHasCondition = this.currentStudent?.eval_result === 'Con condición';
      
      // Verificar si el grupo está completo
      const isGroupFull = group.total_students >= group.capacity;
      
      // Verificar si hay cupo para estudiantes con condición especial
      const hasSpecialSpot = group.total_special_students < group.special_capacity;
      
      // Determinar el estado del grupo
      if (isGroupFull) {
        group.status = 'Completo';
      } else if (studentHasCondition && !hasSpecialSpot) {
        group.status = 'Saturado';
      } else {
        group.status = 'Disponible';
      }
    });
  }

  onLevelChange() {
    console.log('Nivel cambiado a:', this.selectedLevel);
    this.selectedGroupId = ''; // Limpiar selección de grupo al cambiar filtro
    this.updateGroupAvailability();
  }

  onGradeChange() {
    console.log('Grado cambiado a:', this.selectedGrade);
    this.selectedGroupId = ''; // Limpiar selección de grupo al cambiar filtro
    this.updateGroupAvailability();
  }

  onShiftChange() {
    console.log('Turno cambiado a:', this.selectedShift);
    this.selectedGroupId = ''; // Limpiar selección de grupo al cambiar filtro
    this.updateGroupAvailability();
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

  // Método para verificar si un grupo debe estar deshabilitado
  isGroupDisabled(group: GroupOption): boolean {
    const studentHasCondition = this.currentStudent?.eval_result === 'Con condición';
    
    // El grupo está deshabilitado si:
    // 1. El total de estudiantes ya alcanzó la capacidad máxima, O
    // 2. El estudiante tiene condición especial Y ya se alcanzó el límite de estudiantes especiales
    const isGroupFull = group.total_students >= group.capacity;
    const specialCapacityFull = group.total_special_students >= group.special_capacity;
    
    if (isGroupFull) {
      return true; // Grupo completamente lleno
    }
    
    if (studentHasCondition && specialCapacityFull) {
      return true; // Sin cupo para estudiantes con condición especial
    }
    
    return false; // Grupo disponible
  }

  // Método para obtener información detallada sobre la disponibilidad
  getGroupAvailabilityInfo(group: GroupOption): string {
    const studentHasCondition = this.currentStudent?.eval_result === 'Con condición';
    const availableSpots = group.capacity - group.total_students;
    const availableSpecialSpots = group.special_capacity - group.total_special_students;
    
    if (group.total_students >= group.capacity) {
      return 'Grupo completo';
    }
    
    if (studentHasCondition && group.total_special_students >= group.special_capacity) {
      return 'Sin cupo para estudiantes con condición especial';
    }
    
    if (studentHasCondition) {
      return `${availableSpots} cupos disponibles (${availableSpecialSpots} para condición especial)`;
    }
    
    return `${availableSpots} cupos disponibles`;
  }

  get isSelectedGroupDisabled(): boolean {
    if (!this.selectedGroupId) return true;
    const group = this.availableGroups.find(g => g.id === this.selectedGroupId);
    return group ? this.isGroupDisabled(group) : true;
  }

  onConfirm() {
    const selectedGroup = this.availableGroups.find(g => g.id === this.selectedGroupId);
    
    if (!selectedGroup) {
      alert('Por favor selecciona un grupo');
      return;
    }
    
    if (this.isGroupDisabled(selectedGroup)) {
      alert('El grupo seleccionado no tiene cupos disponibles');
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
