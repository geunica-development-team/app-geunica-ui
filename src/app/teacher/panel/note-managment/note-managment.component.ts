import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { SearcherComponent } from '../../../components/searcher/searcher.component';
import { DataTeacherService } from '../../services/dataTeacher.service';
import { CardCoursesComponent } from '../../../components/card-courses/card-courses.component';
import { forkJoin } from 'rxjs';
import { AppModalComponent } from '../../../components/app-modal/app-modal.component';
import { Estudiante, Persona } from '../../services/modelTeacher';
import { Router } from '@angular/router';
import { USERS } from '../../../admin/utility/db-simulator';
import { TableComponent } from '../../../components/table/table.component';
import { FormsModule } from '@angular/forms';

interface GradeInfo {
  grado:     string;
  nivel:     string;
  seccion:   string;
  sede:      string;
  id_salon?: number;

}

@Component({
  selector: 'app-note-managment',
  imports: [CommonModule, SearcherComponent, CardCoursesComponent, AppModalComponent, TableComponent, FormsModule],
  templateUrl: './note-managment.component.html',
  styleUrl: './note-managment.component.css'
})
export class NoteManagmentComponent {
  filteredGrades: GradeInfo[] = [];
  searchTerm: string = '';
  selectedGrade: GradeInfo | null = null;
    // Para más adelante: filtrar por salón o mes
  students: Array<Estudiante & { persona: Persona }> = [];
  constructor(
    private dataSvc: DataTeacherService,
    private router: Router) {}


    // FILTROS
    searchValue = ""
  
    // Columnas de la tabla
    columns = [
      "ID",
      "Código Estudiante",
      "Nombres y Apellidos"
    ]
  
    // Mapeo para columnas y filas
    columnMappings = {
      ID: "userId",
      "Código Estudiante": "studentCode",
      "Nombres y Apellidos": "fullName"
    }
  
    // Filtrar solo usuarios con rol 'student' y procesar los datos
    get rows() {
      return USERS.filter((user) => user.role === "student").map((user) => ({
        userId: user.userId,
        studentCode: user.student?.studentCode || "-",
        fullName: `${user.person.firstName} ${user.person.lastName} ${user.person.middleName}`.trim(),
        debtStatus: "",
        // Clases CSS para los badges
  
        // Mantener referencia al objeto original para el modal
        originalData: user,
      }))
    }
  
    @ViewChild("studentUsersTable") studentUsersTable?: TableComponent
  
    // MÉTODOS DE FILTRADO
    applyFilters() {
      if (this.studentUsersTable) {
        this.studentUsersTable.updateTable()
      }
    }
  
    applySearchFilter(event: Event) {
      this.searchValue = (event.target as HTMLInputElement).value
      this.applyFilters()
    }
  
    clearFilters() {
  
      this.searchValue = ""
      this.applyFilters()
    }
  
    applyFilter(event: Event) {
      if (this.studentUsersTable) {
        this.studentUsersTable.filterValue = (event.target as HTMLInputElement).value
        this.studentUsersTable.updateTable()
      }
    }
  
    // ACCIONES
  onVerEstudentNote = (id_estudiante: number) => {
    this.router.navigate(
      ['/teacher/panel/NoteList', id_estudiante]
    );
  }

  ngOnInit() {


    forkJoin({
      niveles:   this.dataSvc.getNiveles(),
      grados:    this.dataSvc.getGrados(),
      secciones: this.dataSvc.getSecciones(),
      salones:   this.dataSvc.getSalones(),
      sedes:     this.dataSvc.getSedes()
    }).subscribe(({ niveles, grados, secciones, salones, sedes }) => {
      this.filteredGrades = salones.map(salon => {
        // 1) Encuentra el grado
        const gradoObj = grados.find(g => g.id_grado === salon.id_grado);

        // 2) A partir del grado, encuentra el nivel
        const nivelObj = gradoObj
          ? niveles.find(n => n.id_nivel === gradoObj.id_nivel)
          : undefined;

        // 3) Encuentra la sección directamente
        const seccionObj = secciones.find(s => s.id_seccion === salon.id_seccion);

        const sedeObj = sedes.find(s => s.id_sede === salon.id_sede);

        return {
          grado:   gradoObj?.nombre   ?? '—',
          nivel:   nivelObj?.nombre   ?? '—',
          seccion: seccionObj?.nombre ?? '—',
          sede:     sedeObj?.nombre ?? '—',
          id_salon: salon.id_salon 
          
        };
      });

      this.applyFiltro();
    });

  }

  onSearch() {
    this.applyFiltro();
  }

  private applyFiltro() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return;

    this.filteredGrades = this.filteredGrades.filter(item =>
      item.grado   .toLowerCase().includes(term) ||
      item.nivel   .toLowerCase().includes(term) ||
      item.seccion.toLowerCase().includes(term)
    );
  }

    openModalNoteManagment(grade: GradeInfo) {
    this.selectedGrade = grade;

  }

  
  goToStudentNotes(id_estudiante: number) {
    // Navega al componente de notas, p.ej. /student/:id , id_estudiante
    this.router.navigate(['/teacher', 'panel', 'NoteList', id_estudiante]);
  }

    closeModal() {
    this.selectedGrade = null;
  }

}
