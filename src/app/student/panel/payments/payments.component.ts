import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { TableComponent } from '../../../components/table/table.component';
import { environment } from '../../../../enviroments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthStorageService } from '../../../services/auth-storage.service';

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
  private authStorage = inject(AuthStorageService); 

  ngOnInit(): void {
    const token = this.authStorage.getToken();
    const headers = token ? { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) } : {};
    this.http
      .get<any[]>(`${this.baseUrl}/student/me/enrollments`, headers)
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
  const person = this.enrollment.inscription.student.person;  // ← Usar person
  return `${person.names} ${person.paternalSurname} ${person.maternalSurname}`;
  }

  get documentAndId(): string {
  if (!this.enrollment) return '';
  const person = this.enrollment.inscription.student.person;  // ← Usar person, no student
  return `DNI: ${person.documentNumber} | ID: ${person.id}`;
  }

  get classroomInfo(): string {
    if (!this.enrollment?.classroom) return '';
    const c = this.enrollment.classroom;
    
    // Verificar si existen las propiedades antes de usarlas
    const aula = c.name || '';
    const grado = c.grade?.name || '';
    const nivel = c.grade?.level?.name || '';
    const periodo = c.period?.name || 'Sin período';
    
    // Si no hay período, no lo mostramos
    if (periodo === 'Sin período' || !c.period) {
      return `${aula} | ${grado} de ${nivel}`;
    }
    
    return `${aula} | ${grado} de ${nivel} | ${periodo}`;
  }

  get campusName(): string {
    return this.enrollment?.campus?.name || '';
  }

  // Raw data
  payments: any[] = [];
  nextPayment: any = null;



  loadPayments() {
     const token = this.authStorage.getToken();
    const headers = token ? { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) } : {};
    this.http.get<any[]>(`${this.baseUrl}/student/me/payments`, headers)
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

