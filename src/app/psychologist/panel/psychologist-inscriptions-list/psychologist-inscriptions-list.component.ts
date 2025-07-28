import { Component, inject, ViewChild } from '@angular/core';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { dataInscriptionAll, InscriptionService } from '../../../admin/services/inscription.service';
import { ToastrService } from 'ngx-toastr';
import { TableEnrollmentComponent } from '../../../admin/panel/admin-component/table-enrollment/table-enrollment.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UserService, UserSession } from '../../../services/user.service';

@Component({
  selector: 'app-psychologist-inscriptions-list',
  imports: [PanelHeaderComponent, CommonModule, FormsModule, TableEnrollmentComponent],
  templateUrl: './psychologist-inscriptions-list.component.html',
  styleUrl: './psychologist-inscriptions-list.component.css'
})
export class PsychologistInscriptionsListComponent {
  private inscriptionService = inject(InscriptionService)
  private notifycation = inject(ToastrService);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  userProfile!: UserSession;
  
  ngOnInit(): void {
    const tokenDecoded = this.authService.getDecodedToken();
    const userId = tokenDecoded?.id;
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (user) => {
          this.userProfile = user;
          this.loadEnrollments();
        },
        error: (error) => {
          console.error('Error al cargar perfil de usuario: ', error)
        }
      })
    }
  }

  // ESTADOS DISPONIBLES
  enrollmentStatuses = [
    { value: "Pendiente", label: "Pendiente" },
    { value: "Evaluación en proceso", label: "Evaluación en proceso" },
    { value: "Evaluado", label: "Evaluado" },
    { value: "Rechazado", label: "Rechazado" },
    { value: "Pago pendiente", label: "Pago pendiente" },
    { value: "Matriculado", label: "Matriculado" },
  ]

  // FILTROS
  selectedStatus = ""
  searchValue = ""

  // COLUMNAS DE LA TABLA
  columns = [
    "ID",
    "Estudiante",
    "DNI",
    "Apoderado",
    "Grado y Sección",
    "Fecha",
    "Estado Inscripción",
    "Evaluación Resultado"
  ]

  // MAPEO PARA COLUMNAS Y FILAS
  columnMappings = {
    ID: "id",
    Estudiante: "studentFullName",
    "DNI": "documentNumber",
    Apoderado: "tutorFullName",
    "Grado y Sección": "gradeAndSection",
    Fecha: "registrationDate",
    "Estado Inscripción": "state",
    "Evaluación Resultado": "evaluationResult",
  }

  rows: dataInscriptionAll[] = [];
  
  @ViewChild("enrollmentTable") enrollmentTable!: TableEnrollmentComponent

  loadEnrollments() {
    this.inscriptionService.getAllInscriptions().subscribe({
      next:(inscription) => {
        this.rows = inscription.map((inscription: any): dataInscriptionAll & {
          studentFullName: string,
          tutorFullName: string,
          gradeAndSection: string,
          documentNumber: string,
          evaluationResult: string
        } => ({
          id: inscription.id,
          registrationDate: this.formatDate(inscription.registrationDate),
          state: inscription.state,
          student: {
            person: {
              names: inscription.student?.person?.names,
              paternalSurname: inscription.student?.person?.paternalSurname,
              maternalSurname: inscription.student?.person?.maternalSurname,
              documentNumber: inscription.student?.person?.documentNumber
            }
          },
          tutor: {
            person: {
              names: inscription.tutor?.person?.names,
              paternalSurname: inscription.tutor?.person?.paternalSurname,
              maternalSurname: inscription.tutor?.person?.maternalSurname,
            }
          },
          grade: {
            id: inscription.grade.id,
            name: inscription.grade.name,
            level: {
              id: inscription.grade.level.id,
              name: inscription.grade.level.name
            }
          },
          psychology: inscription.psychology ?? null,
          documentNumber: `${inscription.student?.person?.documentNumber}`,
          studentFullName: `${inscription.student?.person?.names} ${inscription.student?.person?.paternalSurname} ${inscription.student?.person?.maternalSurname}`,
          tutorFullName: `${inscription.tutor?.person?.names} ${inscription.tutor?.person?.paternalSurname} ${inscription.tutor?.person?.maternalSurname}`,
          gradeAndSection: `${inscription.grade?.level?.name} - ${inscription.grade?.name}`,
          evaluationResult: inscription.psychology ? (inscription.psychology.result === true
            ? 'Con condición'
            : 'Sin condición'
          )
          : 'No evaluado'
        }
      ));

        if (this.userProfile?.role.role === 'psychologist') {
          this.rows = this.rows.filter(inscripciones => inscripciones.state === 'Evaluación en proceso')
        }

        if (this.enrollmentTable) {
          this.enrollmentTable.updateTable();
        }
      },
      error: (error) => {
        console.error('Error al cargar la lista de inscripciones', error)
      }
    })
  }

  // FILTROS
  applyFilter(event: Event) {
    if (this.enrollmentTable) {
      this.enrollmentTable.filterValue = (
        event.target as HTMLInputElement
      ).value;
      this.enrollmentTable.updateTable();
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 porque enero es 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  onCreatedOrEditedOrDeleted() {
    this.loadEnrollments();
  }
}
