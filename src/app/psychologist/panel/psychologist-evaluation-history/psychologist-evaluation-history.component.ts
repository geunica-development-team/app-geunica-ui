import { Component, inject, ViewChild } from '@angular/core';
import { PanelHeaderComponent } from "../../../components/dashboard/shared-components/panel-header/panel-header.component";
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { UserService, UserSession } from '../../../services/user.service';
import { TableEnrollmentComponent } from '../../../admin/panel/admin-component/table-enrollment/table-enrollment.component';
import { dataInscriptionAll, InscriptionService } from '../../../admin/services/inscription.service';
import { ModalEditEvaluationComponent } from '../modal-edit-evaluation/modal-edit-evaluation.component';
import { ModalDeleteEvaluationComponent } from '../modal-delete-evaluation/modal-delete-evaluation.component';

@Component({
  selector: 'app-psychologist-evaluation-history',
  imports: [PanelHeaderComponent, TableEnrollmentComponent, ModalEditEvaluationComponent, ModalDeleteEvaluationComponent],
  templateUrl: './psychologist-evaluation-history.component.html',
  styleUrl: './psychologist-evaluation-history.component.css'
})
export class PsychologistEvaluationHistoryComponent {
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

  @ViewChild ('modalEditEvaluation') modalEditEvaluation!: ModalEditEvaluationComponent;
  @ViewChild ('modalDeleteEvaluation') modalDeleteEvaluation!: ModalDeleteEvaluationComponent;

  // FILTROS
  selectedStatus = ""
  searchValue = ""

  // COLUMNAS DE LA TABLA
  columns = [
    "ID",
    "Estado Inscripción",
    "Estudiante",
    "DNI",
    "Grado y Sección",
    "Fecha Evaluación",
    "Estado Evaluación",
    "Evaluación Resultado"
  ]

  // MAPEO PARA COLUMNAS Y FILAS
  columnMappings = {
    ID: "id",
    "Estado Inscripción": "state",
    Estudiante: "studentFullName",
    "DNI": "documentNumber",
    "Grado y Sección": "gradeAndSection",
    "Fecha Evaluación": "dateEvaluation",
    "Estado Evaluación": "stateEvaluation",
    "Evaluación Resultado": "evaluationResult"
  }

  rows: dataInscriptionAll[] = [];
  
  @ViewChild("enrollmentTable") enrollmentTable!: TableEnrollmentComponent

  loadEnrollments() {
    this.inscriptionService.getAllInscriptions().subscribe({
      next:(inscription) => {
        this.rows = inscription.map((inscription: any): dataInscriptionAll & {
          studentFullName: string,
          gradeAndSection: string,
          documentNumber: string,
          evaluationResult: string,
          stateEvaluation: string,
          dateEvaluation: string
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
          grade: {
            id: inscription.grade.id,
            name: inscription.grade.name,
            level: {
              id: inscription.grade.level.id,
              name: inscription.grade.level.name
            }
          },
          psychology: inscription.psychology ?? null,
          stateEvaluation: inscription.psychology ? "Se registró 1 evaluación" : "No evaluado",
          dateEvaluation: this.formatDate(inscription.psychology?.evaluationDate),
          documentNumber: `${inscription.student?.person?.documentNumber}`,
          studentFullName: `${inscription.student?.person?.names} ${inscription.student?.person?.paternalSurname} ${inscription.student?.person?.maternalSurname}`,
          gradeAndSection: `${inscription.grade?.level?.name} - ${inscription.grade?.name}`,
          evaluationResult: inscription.psychology ? (inscription.psychology.result === true
            ? 'Con condición'
            : 'Sin condición'
          )
          : 'No evaluado'
        }
      ));

        if (this.userProfile?.role.role === 'psychologist') {
          this.rows = this.rows.filter(inscripciones =>
            inscripciones.state === 'Evaluado' || inscripciones.psychology !== null
          );
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

  openModalEditEvaluation(row: any) {
    if (row && row.id && !isNaN(row.id)) {
      this.modalEditEvaluation.rowId = Number(row.id);
      this.modalEditEvaluation.openModal();
    } else {
      console.error('ID inválido:', row.id);
    }
  }

  openModalDeleteEvaluation(row: any) {
    if (row && row.id && !isNaN(row.id)) {
      this.modalDeleteEvaluation.rowId = Number(row.id);
      this.modalDeleteEvaluation.openModal();
    } else {
      console.error('ID inválido:', row.id);
    }
  }


  onCreatedOrEditedOrDeleted() {
    this.loadEnrollments();
  }
}
