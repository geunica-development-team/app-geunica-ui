import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { TableComponent } from '../../../components/table/table.component';
import { environment } from '../../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payments',
  imports: [CommonModule, PanelHeaderComponent],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent {
  private http     = inject(HttpClient);
  private baseUrl  = environment.apiBase;
  enrollment: any = null;

  ngOnInit(): void {
    this.http
      .get<any[]>(`${this.baseUrl}/student/me/enrollments`)
      .subscribe({
        next: data => {
          this.enrollment = data.length ? data[0] : null;
        },
        error: err => console.error('Error fetching enrollment:', err)
      });
    this.loadPayments();
  }

  get fullName(): string {
    if (!this.enrollment) return '';
    const s = this.enrollment.inscription.student;
    return `${s.names} ${s.paternalSurname} ${s.maternalSurname}`;
  }

  get documentAndId(): string {
    if (!this.enrollment) return '';
    const s = this.enrollment.inscription.student;
    return `DNI: ${s.documentNumber} | ID: ${s.id}`;
  }

  get classroomInfo(): string {
    if (!this.enrollment) return '';
    const c = this.enrollment.classroom;
    const grado = c.grade.name;
    const nivel = c.grade.level?.name ?? '';   
    const aula = c.name;
    const periodo = c.period.name;
    // Ejemplo: "Aula 206 | Primaria 1ro | Semestre I 2026"
    return `${aula} | ${grado} de ${nivel} | ${periodo}`;
  }

  get campusName(): string {
    return this.enrollment?.campus?.name ?? '';
  }

  // Raw data
  payments: any[] = [];
  nextPayment: any = null;



  loadPayments() {
    //const url = `${this.baseUrl}/students/me/payments`;
    this.http.get<any[]>(`${this.baseUrl}/student/me/payments`)
      .subscribe({
        next: data => {
          this.payments = data;

          // Para el app-t
          this.nextPayment = this.payments.find(p => p.state !== 'pagado') || null;
        },
        error: err => console.error('Error cargando pagos', err)
      });
  }


}
