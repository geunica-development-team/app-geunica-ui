import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { TableComponent } from '../../../components/table/table.component';
import { environment } from '../../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';
import { SearcherComponent } from '../../../components/searcher/searcher.component';
import { FormsModule } from '@angular/forms';
import { ModalAddActivityComponent } from './modalActivity/modal-add-activity/modal-add-activity.component';
import { ModalAddExamComponent } from './modalExam/modal-add-exam/modal-add-exam.component';

@Component({
  selector: 'app-note-list',
  imports: [CommonModule, RouterModule, PanelHeaderComponent, TableComponent,  FormsModule, 
    ModalAddActivityComponent, ModalAddExamComponent],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.css'
})
export class NoteListComponent implements OnInit{

  @ViewChild('assignmentsTable') assignmentsTable?: TableComponent;

  // columnas y mapeos
  columnsAssignments    = ['ID', 'Nombres y apellidos', 'Código', 'Teléfono', 'Género'];
  columnMappingsAssignments = {
    'ID':                   'enrollmentId',
    'Nombres y apellidos':  'studentName',
    'Código':               'studentCode',
    'Teléfono':             'phoneNumber',
    'Género':               'gender'
  };

  // datos
  allRows: any[] = [];
  rowsAssignments: any[] = [];

  // buscador
  searchTerm = '';

  loading = true;
  error: string | null = null;
  private baseUrl = environment.apiBase;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}



  onSearch() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.rowsAssignments = [...this.allRows];
    } else {
      this.rowsAssignments = this.allRows.filter(r =>
        r.studentName.toLowerCase().includes(term)
      );
    }
  }



  //Al pulsar "Ver fila", navegamos a:/teacher/panel/:assignmentId/student/:enrollmentId/grades
  onVerNotas = (row: any) => {
    // 3) Vuelve a leer assignmentId para navegar
    const assignmentId = Number(this.route.snapshot.paramMap.get('assignmentId'));
    this.router.navigate([
      '/teacher/panel/StudentNote',
      assignmentId,
      row.enrollmentId
    ]);
  };

  // Filtrado local de la tabla (por ejemplo, por nombre)
  applyFilter(event: Event) {
    const term = (event.target as HTMLInputElement).value
                    .trim()
                    .toLowerCase();
    this.rowsAssignments = term
      ? this.allRows.filter(r => r.studentName.toLowerCase().includes(term))
      : [...this.allRows];
  }

  // Referencias a los modales
  @ViewChild('modalAddExam') modalAddExam: any;
  @ViewChild('modalEditExam') modalEditExam: any;
  @ViewChild('modalDeleteExam') modalDeleteExam: any;
  @ViewChild('modalAddActivity') modalAddActivity: any;
  @ViewChild('modalEditActivity') modalEditActivity: any;
  @ViewChild('modalDeleteActivity') modalDeleteActivity: any;
  @ViewChild('modalEditExamScore') modalEditExamScore: any;
  @ViewChild('modalEditActivityScore') modalEditActivityScore: any;


    // ========== CRUD MODALES - EXÁMENES ==========
  
  openCreateExamModal(): void {
    if (this.modalAddExam) {
      this.modalAddExam.openModal();
    }
  }

  editExam(exam: any): void {
    if (!isNaN(+exam.id) && this.modalEditExam) {
      this.modalEditExam.examId = +exam.id;
      this.modalEditExam.itemData = { ...exam }; // Copia de los datos
      this.modalEditExam.openModal();
    }
  }

  deleteExam(exam: any, event?: Event): void {
    if (event) event.preventDefault();
    
    if (!isNaN(+exam.id) && this.modalDeleteExam) {
      this.modalDeleteExam.examId = +exam.id;
      this.modalDeleteExam.itemData = { ...exam };
      this.modalDeleteExam.openModal();
    }
  }

  // ========== CRUD MODALES - ACTIVIDADES ==========
  
  openCreateActivityModal(): void {
    if (this.modalAddActivity) {
      this.modalAddActivity.openModal();
    }
  }

  editActivity(activity: any): void {
    if (!isNaN(+activity.id) && this.modalEditActivity) {
      this.modalEditActivity.activityId = +activity.id;
      this.modalEditActivity.itemData = { ...activity }; // Copia de los datos
      this.modalEditActivity.openModal();
    }
  }

  deleteActivity(activity: any, event?: Event): void {
    if (event) event.preventDefault();
    
    if (!isNaN(+activity.id) && this.modalDeleteActivity) {
      this.modalDeleteActivity.activityId = +activity.id;
      this.modalDeleteActivity.itemData = { ...activity };
      this.modalDeleteActivity.openModal();
    }
  }


  // Propiedades adicionales para los contadores
  totalExams = 0;
  totalActivities = 0;
  examsList: any[] = [];
  activitiesList: any[] = [];

  // Métodos para manejar las listas de exámenes para edición/eliminación
  showExamListForEdit(): void {
    // Aquí podrías mostrar un dropdown o modal con la lista de exámenes
    // O navegar a una vista separada
    console.log('Mostrando lista de exámenes para editar');
    
    // Ejemplo: si tienes los datos, puedes mostrar un modal con la lista
    if (this.examsList && this.examsList.length > 0) {
      // Implementar lógica para mostrar lista de exámenes
      this.showExamSelectionModal('edit');
    } else {
      this.loadExamsForManagement();
    }
  }

  showExamListForDelete(): void {
    console.log('Mostrando lista de exámenes para eliminar');
    
    if (this.examsList && this.examsList.length > 0) {
      this.showExamSelectionModal('delete');
    } else {
      this.loadExamsForManagement();
    }
  }

  // Métodos para manejar las listas de actividades para edición/eliminación
  showActivityListForEdit(): void {
    console.log('Mostrando lista de actividades para editar');
    
    if (this.activitiesList && this.activitiesList.length > 0) {
      this.showActivitySelectionModal('edit');
    } else {
      this.loadActivitiesForManagement();
    }
  }

  showActivityListForDelete(): void {
    console.log('Mostrando lista de actividades para eliminar');
    
    if (this.activitiesList && this.activitiesList.length > 0) {
      this.showActivitySelectionModal('delete');
    } else {
      this.loadActivitiesForManagement();
    }
  }

  // Método para cargar exámenes para gestión
  
  loadExamsForManagement(): void {
    const caId = Number(this.route.snapshot.paramMap.get('assignmentId'));
    if (!caId) return;

    this.http
      .get<any[]>(`${this.baseUrl}/teacher/me/assignment/${caId}/exams`)
      .subscribe({
        next: exams => {
          this.examsList = exams;
          this.totalExams = exams.length;
        },
        error: (error) => {
          console.error('Error cargando exámenes:', error);
          this.examsList = [];
          this.totalExams = 0;
        }
      });
  }

  // Método para cargar actividades para gestión
  loadActivitiesForManagement(): void {
    const caId = Number(this.route.snapshot.paramMap.get('assignmentId'));
    if (!caId) return;

    this.http
      .get<any[]>(`${this.baseUrl}/teacher/me/assignment/${caId}/activities`)
      .subscribe({
        next: activities => {
          this.activitiesList = activities;
          this.totalActivities = activities.length;
        },
        error: (error) => {
          console.error('Error cargando actividades:', error);
          this.activitiesList = [];
          this.totalActivities = 0;
        }
      });
  }

  // Método para mostrar modal de selección de exámenes
  showExamSelectionModal(action: 'edit' | 'delete'): void {
    // Implementar modal o dropdown para seleccionar examen
    // Por ejemplo, usando SweetAlert2 o un modal de Bootstrap
    
    // Ejemplo con alert nativo (reemplazar con modal real)
    const examOptions = this.examsList.map((exam, index) => `${index + 1}. ${exam.title || exam.name}`).join('\n');
    const selectedIndex = prompt(`Selecciona un examen para ${action === 'edit' ? 'editar' : 'eliminar'}:\n\n${examOptions}\n\nIngresa el número:`);
    
    if (selectedIndex && !isNaN(+selectedIndex)) {
      const index = +selectedIndex - 1;
      if (index >= 0 && index < this.examsList.length) {
        const selectedExam = this.examsList[index];
        if (action === 'edit') {
          this.editExam(selectedExam);
        } else {
          this.deleteExam(selectedExam);
        }
      }
    }
  }

  // Método para mostrar modal de selección de actividades
  showActivitySelectionModal(action: 'edit' | 'delete'): void {
    const activityOptions = this.activitiesList.map((activity, index) => `${index + 1}. ${activity.title || activity.name}`).join('\n');
    const selectedIndex = prompt(`Selecciona una actividad para ${action === 'edit' ? 'editar' : 'eliminar'}:\n\n${activityOptions}\n\nIngresa el número:`);
    
    if (selectedIndex && !isNaN(+selectedIndex)) {
      const index = +selectedIndex - 1;
      if (index >= 0 && index < this.activitiesList.length) {
        const selectedActivity = this.activitiesList[index];
        if (action === 'edit') {
          this.editActivity(selectedActivity);
        } else {
          this.deleteActivity(selectedActivity);
        }
      }
    }
  }

  // Actualizar el método ngOnInit para cargar también los exámenes y actividades
  ngOnInit() {
    // 1) leer tanto 'caId' como 'assignmentId' por si la ruta usa uno u otro
    const rawCaId = this.route.snapshot.paramMap.get('caId') ?? this.route.snapshot.paramMap.get('assignmentId');
    const caId = Number(rawCaId);
    if (!caId || isNaN(caId)) {
      this.error = 'ID de asignación inválido';
      this.loading = false;
      return;
    }

    // 2) construir URL exactamente igual que backend
    const url = `${this.baseUrl}/teacher/me/aula/${caId}/students`;

    // 3) opcional: si no tienes interceptor, agrega Authorization header aquí (si el token lo guardas en localStorage)
    const token = localStorage.getItem('token'); // o donde lo guardes
    const httpOptions = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    this.http.get<any[]>(url, httpOptions).subscribe({
      next: (enrollments) => {
        console.log('Respuesta del backend (enrollments):', enrollments); // <- mira aquí en consola el shape real

        // 4) mapear robustamente aceptando 2 formatos:
        // A) formato ANIDADO (en.inscription.student...)
        // B) formato PLANO (enrollmentId, names, studentCode, ...)
        this.allRows = enrollments.map(en => {
          // caso anidado
          const nestedStudent = en?.inscription?.student;
          if (nestedStudent) {
            return {
              enrollmentId: en.id ?? en.enrollmentId,
              studentName: `${nestedStudent.names ?? ''} ${nestedStudent.paternalSurname ?? ''} ${nestedStudent.maternalSurname ?? ''}`.trim(),
              studentCode: nestedStudent?.documentNumber ?? nestedStudent?.studentCode ?? null,
              phoneNumber: nestedStudent?.phoneNumber ?? null,
              gender: nestedStudent?.gender ?? null
            };
          }

          // caso plano (lo que tu backend actualmente devuelve)
          return {
            enrollmentId: en.enrollmentId ?? en.id,
            studentName: `${en.names ?? ''} ${en.paternalSurname ?? ''} ${en.maternalSurname ?? ''}`.trim(),
            studentCode: en.documentNumber ?? en.studentCode ?? null,
            phoneNumber: en.phoneNumber ?? null,
            gender: en.gender ?? null
          };
        });

        // inicializa la vista
        this.rowsAssignments = [...this.allRows];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando alumnos:', err);
        this.error = 'No se pudieron cargar los alumnos';
        this.loading = false;
      }
    });
}




  // Versión mejorada con manejo de errores para la recarga de datos
  /*
  onCreatedOrEditedOrDeleted(): void {
    console.log('Recargando datos después de operación CRUD...');
    
    // Recargar estudiantes
    const caId = Number(this.route.snapshot.paramMap.get('assignmentId'));
    if (caId) {
      this.http
        .get<any[]>(`${this.baseUrl}/teacher/me/assignment/${caId}/students`)
        .subscribe({
          next: enrollments => {
            this.allRows = enrollments.map(en => ({
              enrollmentId: en.id,
              studentName: `${en.inscription.student.names} ${en.inscription.student.paternalSurname} ${en.inscription.student.maternalSurname}`,
              studentCode: en.inscription.student.documentNumber,
              phoneNumber: en.inscription.student.phoneNumber,
              gender: en.inscription.student.gender
            }));
            this.rowsAssignments = [...this.allRows];
          },
          error: (error) => {
            console.error('Error recargando estudiantes:', error);
          }
        });
    }
    
    // Recargar exámenes y actividades
    //this.loadExamsForManagement();
    //this.loadActivitiesForManagement();
  }*/

}
