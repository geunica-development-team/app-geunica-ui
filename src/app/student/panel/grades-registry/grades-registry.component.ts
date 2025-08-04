import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataStudentService } from '../../services/dataStudent.service';
import { Curso } from '../../services/modelStudent';
import { forkJoin } from 'rxjs';
import { MenuTabsComponent, TabItem } from '../../../components/dashboard/menu-tabs/menu-tabs.component';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';

interface RegistryItem {
  concepto: string;
  valor: number;
}

@Component({
  selector: 'app-grades-registry',
  imports: [CommonModule, RouterModule, MenuTabsComponent, PanelHeaderComponent],
  templateUrl: './grades-registry.component.html',
  styleUrl: './grades-registry.component.css'
})
export class GradesRegistryComponent implements OnInit {

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
  const idParam = this.route.snapshot.paramMap.get('id');
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
        valor:    g.valor
      };
    });

    this.loading = false;
  }, err => {
    console.error('Error cargando datos:', err);
    this.loading = false;
  });

  }

  
}
