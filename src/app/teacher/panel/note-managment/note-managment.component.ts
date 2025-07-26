import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SearcherComponent } from '../../../components/searcher/searcher.component';
import { DataTeacherService } from '../../services/dataTeacher.service';
import { CardCoursesComponent } from '../../../components/card-courses/card-courses.component';
import { forkJoin } from 'rxjs';
import { AppModalComponent } from '../../../components/app-modal/app-modal.component';
import { Estudiante, Persona } from '../../services/modelTeacher';
import { Router } from '@angular/router';

interface GradeInfo {
  grado:     string;
  nivel:     string;
  seccion:   string;
  sede:      string;
  id_salon?: number;

}

@Component({
  selector: 'app-note-managment',
  imports: [CommonModule, SearcherComponent, CardCoursesComponent, AppModalComponent],
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

  ngOnInit() {

        this.students = [
      { 
        id_estudiante: 1,
        id_persona: 4,
        id_usuario: 4,
        codigo_estudiante: 'EST001',
        fecha_ingreso: '2025-01-15',
        estado: 'activo',
        persona: { 
          id_persona: 4, 
          nombres: 'Pepe', 
          apell_paterno: 'Torres', 
          correo: 'Pepe.torres@mail.com' 
        }
      },
      { 
        id_estudiante: 2,
        id_persona: 6,
        id_usuario: 4,
        codigo_estudiante: 'EST002',
        fecha_ingreso: '2025-01-15',
        estado: 'activo',
        persona: { 
          id_persona: 6, 
          nombres: 'Pepillo', 
          apell_paterno: 'Torres', 
          correo: 'PepilloTorres@mail.com' 
        }
      },
      // …otros estudiantes
    ];

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

      this.applyFilter();
    });

  }

  onSearch() {
    this.applyFilter();
  }

  private applyFilter() {
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

  
  goToStudentNotes(id: number) {
    // Navega al componente de notas, p.ej. /student-notes/:id
    this.router.navigate(['/student-notes', id]);
  }

    closeModal() {
    this.selectedGrade = null;
  }

}
