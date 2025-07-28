import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Curso } from '../../services/modelTeacher';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataStudentService } from '../../../student/services/dataStudent.service';
import { forkJoin } from 'rxjs';
import { MenuTabsComponent, TabItem } from '../../../components/dashboard/menu-tabs/menu-tabs.component';

interface RegistryItem {
  concepto: string;
  valor: number;
}

@Component({
  selector: 'app-note-list',
  imports: [CommonModule, RouterModule, MenuTabsComponent],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.css'
})
export class NoteListComponent {

    course!: Curso;
  registryItems: RegistryItem[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private dataSvc: DataStudentService
  ) {}

  tabs: TabItem[] = [
    { id: '1er Bimestre',  label: '1er Bimestre', icon: 'fas fa-file-alt' },
    {id: '2do Bimestre',     label: '2do Bimestre',     icon: 'fas fa-file-alt'},
    {id: '3er Bimestre',      label: '3er Bimestre',      icon: 'fas fa-file-alt'},
    {id: '4to Bimestre', label: '4to Bimestre', icon: 'fas fa-file-alt'},
    {id: 'Bimestre Final', label: 'Bimestre Final', icon: 'fas fa-file-alt'}

  ];

  // pestaña activa
  activeTab = "1er Bimestre";

  // opcional: reaccionar a cambio
  onTabChanged(newTab: string) {
    this.activeTab = newTab;
    console.log('Pestaña activa ahora:', newTab);
  }

  ngOnInit(): void {
  const idParam = this.route.snapshot.paramMap.get('id_estudiante');
  const courseId = idParam ? +idParam : null;
  if (!courseId) return;

  // 1) Cargo curso + exámenes + notas en paralelo
  forkJoin({
    course: this.dataSvc.getCourseById(courseId),
    exams: this.dataSvc.getExams(),
    grades: this.dataSvc.getGrades(),
  }).subscribe(({ course, exams, grades }) => {
    this.course = course;

    // 2) Filtrar exámenes de este curso
    const courseExams = exams.filter(e => e.id_asignacion_de_clase === courseId);

    // 3) Filtrar notas de esos exámenes
    const relevantGrades = grades.filter(g =>
      courseExams.some(e => e.id_examen === g.id_examen)
    );

    // 4) Mapear a tu tabla
    this.registryItems = relevantGrades.map(g => {
      const exam = courseExams.find(e => e.id_examen === g.id_examen)!;
      return {
        concepto: exam.nombre_examen,
        valor:    g.valor,
        
      };
    });

    this.loading = false;
  }, err => {
    console.error('Error cargando datos:', err);
    this.loading = false;
  });

  }

    // Métodos para acciones
  onEditNote(item: RegistryItem) {
    console.log('Editar', item);
    // Aquí podrías abrir un modal o navegar a un formulario de edición
  }

  onDeleteNote(item: RegistryItem) {
    console.log('Borrar', item);
    // Aquí podrías mostrar un confirm dialog y luego eliminar
    if (confirm(`¿Eliminar nota "${item.concepto}"?`)) {
      this.registryItems = this.registryItems.filter(i => i !== item);
    }
  }

}
