import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuTabsComponent, TabItem } from '../../../components/dashboard/menu-tabs/menu-tabs.component';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { TeacherService } from '../student-note/teacher.service';
import { TableComponent } from '../../../components/table/table.component';
import { environment } from '../../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-note-list',
  imports: [CommonModule, RouterModule, PanelHeaderComponent, TableComponent],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.css'
})
export class NoteListComponent {

  @ViewChild('assignmentsTable') assignmentsTable?: TableComponent;

  // configuraciones de la tabla
  columnsAssignments    = ['ID', 'Nombres y apellidos', 'Código', 'Teléfono', 'Género'];
  columnMappingsAssignments = {
    'ID':       'enrollmentId',
    'Nombres y apellidos':   'studentName',
    'Código':   'studentCode',
    'Teléfono': 'phoneNumber',
    'Género':   'gender'
  };
  rowsAssignments: any[] = [];
  allRows: any[] = [];
  loading = true;
  error: string | null = null;

  private baseUrl = environment.apiBase;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
   // 1) Lee el parámetro correcto:
    const caId = Number(this.route.snapshot.paramMap.get('assignmentId'));
    if (!caId) {
      this.error   = 'ID de asignación inválido';
      this.loading = false;
      return;
    }

    // 2) Llama al endpoint con ese caId válido
    this.http
      .get<any[]>(`${this.baseUrl}/teacher/me/assignment/${caId}/students`)
      .subscribe({
        next: enrollments => {
          this.allRows = enrollments.map(en => ({
            enrollmentId: en.id,
            studentName:  `${en.inscription.student.names} ${en.inscription.student.paternalSurname} ${en.inscription.student.maternalSurname}`,
            studentCode:  en.inscription.student.documentNumber,
            phoneNumber:  en.inscription.student.phoneNumber,
            gender:       en.inscription.student.gender
          }));
          this.rowsAssignments = [...this.allRows];
          this.loading         = false;
        },
        error: () => {
          this.error   = 'No se pudieron cargar los alumnos';
          this.loading = false;
        }
      });
  }

  /**
   * Al pulsar "Ver fila", navegamos a:
   *  /teacher/panel/:assignmentId/student/:enrollmentId/grades
   */
  onVerNotas = (row: any) => {
    // 3) Vuelve a leer assignmentId para navegar
    const assignmentId = Number(this.route.snapshot.paramMap.get('assignmentId'));
    this.router.navigate([
      '/teacher/panel/StudentNote',
      assignmentId,
      row.enrollmentId
    ]);
  };


  /**
   * Filtrado local de la tabla (por ejemplo, por nombre)
   */
  applyFilter(event: Event) {
    const term = (event.target as HTMLInputElement).value
                   .trim()
                   .toLowerCase();

    // filtramos la copia completa y reasignamos a la tabla
    this.rowsAssignments = this.allRows.filter(row =>
      row.studentName.toLowerCase().includes(term)
      || row.studentCode.toLowerCase().includes(term)
      || row.classroomName.toLowerCase().includes(term)
    );
  }
}
