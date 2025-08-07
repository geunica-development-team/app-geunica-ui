import { Component, inject, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassroomService, dataClassroomById } from '../../../services/classroom.service';
import { ToastrService } from 'ngx-toastr';
import { PanelHeaderComponent } from "../../../../components/dashboard/shared-components/panel-header/panel-header.component";
import { ModalClassAssignmentComponent } from './modal-class-assignment/modal-class-assignment.component';

@Component({
  selector: 'app-classroom-details',
  imports: [PanelHeaderComponent, ModalClassAssignmentComponent],
  templateUrl: './classroom-details.component.html',
  styleUrl: './classroom-details.component.css'
})
export class ClassroomDetailsComponent {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notifycation = inject(ToastrService);
  private classroomService = inject(ClassroomService);
  
  dataClassroom: dataClassroomById | null = null;
  classroomId : number | null = null;

  
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.classroomId = +params["id"]
      this.loadClassroomDetails()
    })
  }

  @ViewChild('modalClassAssignment') modalClassAssignment!: ModalClassAssignmentComponent;
  openModalClassAssignment() {
    if (this.classroomId && !isNaN(this.classroomId)) {
      this.modalClassAssignment.classroomId = this.classroomId;
      this.modalClassAssignment.openModal();
    } else {
      console.error('ID inválido:', this.classroomId);
    }
  }

  loadClassroomDetails() {
    if (this.classroomId && !isNaN(this.classroomId)) {
      this.classroomService.getClassroomById(this.classroomId).subscribe({
        next: (classroom) => {
          this.dataClassroom = classroom;
        },
        error: (error) => {
          this.notifycation.error('Error al cargar los detalles del aula', 'Error');
        }
      })
    } else {
      this.notifycation.error('ID del grado inválido', 'Error');
    }
  }

  goToInscriptions() {
    this.router.navigate(["/admin/panel/inscripciones"])
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 porque enero es 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  onCreatedOrEditedOrDeleted() {
    this.loadClassroomDetails();
  }
}
