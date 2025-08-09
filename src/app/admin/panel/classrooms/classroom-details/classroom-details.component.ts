import { Component, inject, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassroomService, dataClassroomById, enrollmentSummary } from '../../../services/classroom.service';
import { ToastrService } from 'ngx-toastr';
import { PanelHeaderComponent } from "../../../../components/dashboard/shared-components/panel-header/panel-header.component";
import { ModalClassAssignmentComponent } from './modal-class-assignment/modal-class-assignment.component';
import { ModalEditClassAssignmentComponent } from './modal-edit-class-assignment/modal-edit-class-assignment.component';
import { ModalDeleteClassAssignmentComponent } from "./modal-delete-class-assignment/modal-delete-class-assignment.component";
import { response } from 'express';

@Component({
  selector: 'app-classroom-details',
  imports: [PanelHeaderComponent, ModalClassAssignmentComponent, ModalEditClassAssignmentComponent, ModalDeleteClassAssignmentComponent],
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

  enrollments: enrollmentSummary[] = [];
  
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.classroomId = +params["id"]
      this.loadClassroomDetails()
      this.loadStudents()
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

  @ViewChild('modalEditClassAssignment') modalEditClassAssignment!: ModalEditClassAssignmentComponent;
  openModalEditClassAssignment(row: any) {
    if (row && row.id && !isNaN(row.id)) {
      this.modalEditClassAssignment.assignmentId = Number(row.id);
      this.modalEditClassAssignment.openModal();
    } else {
      console.error('Id de assignación inválido:', row.id);
    }
  }

  @ViewChild('modalDeleteClassAssignment') modalDeleteClassAssignment!: ModalDeleteClassAssignmentComponent;
  openModalDeleteClassAssignment(row: any) {
    if (row && row.id && !isNaN(row.id)) {
      this.modalDeleteClassAssignment.assignmentId = Number(row.id);
      this.modalDeleteClassAssignment.openModal();
    } else {
      console.error('Id de assignación inválido:', row.id);
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
      this.notifycation.error('ID del aula inválido', 'Error');
    }
  }

  loadStudents() {
    if (this.classroomId && !isNaN(this.classroomId)) {
      this.classroomService.getEnrollmentsByClassroomId(this.classroomId).subscribe({
        next: (response: any[]) => {
          this.enrollments = response.map((enrollment) => ({
            id:enrollment.id,
            idInscription: enrollment.inscription.id,
            state: enrollment.state,
            condition: enrollment.condition,
            idStudent: enrollment.inscription.student.id,
            names: enrollment.inscription.student.person.names,
            paternalSurname: enrollment.inscription.student.person.paternalSurname,
            maternalSurname: enrollment.inscription.student.person.maternalSurname,
            documentNumber: enrollment.inscription.student.person.documentNumber
          }));
        },
        error: (error) => {
          this.notifycation.error('Error al cargar estudiantes', 'Error')
        }
      })
    } else {
      this.notifycation.error('ID del aula para estudiantes inválido', 'Error');
    }
  }

  goToInscriptions() {
    this.router.navigate(["/admin/panel/inscripciones"])
  }

  goToStudent(id: number) {
    this.router.navigate([`/admin/panel/estudiantes-matriculados/${id}`])
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
