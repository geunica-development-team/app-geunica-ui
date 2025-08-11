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
      // Cargar mocks
  this.loadMockEnrollment();
  this.loadMockPayments();
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

  // ---- ngOnInit() temporal para usar datos mock ----


// ---- Mock de enrollment (para header) ----
loadMockEnrollment() {
  this.enrollment = {
    id: 7001,
    campus: { id: 10, name: 'Sede Central - Miraflores' },
    classroom: {
      id: 300,
      name: 'Aula 201',
      grade: { name: '3', level: { name: 'Secundaria' } },
      period: { name: '2025-II' }
    },
    inscription: {
      student: {
        id: 501,
        documentNumber: '12345678',
        person: {
          names: 'Lucía',
          paternalSurname: 'González',
          maternalSurname: 'Chávez',
          documentNumber: '12345678',
          id: 501
        }
      }
    }
  };

  console.log('Mock enrollment loaded', this.enrollment);
}

// ---- Mock de payments (4 filas) ----
loadMockPayments() {
  this.payments = [
    {
      id: 1,
      paymentType: { id: 1, name: 'Mensualidad Agosto' },
      datePayment: '2025-08-10T00:00:00Z',
      amountPaid: 120.00,
      state: 'pendiente'   // se mostrará como "Pendiente"
    },
    {
      id: 2,
      paymentType: { id: 2, name: 'Mensualidad Julio' },
      datePayment: '2025-07-05T00:00:00Z',
      amountPaid: 120.00,
      state: 'pagado'      // se mostrará como "Pagado"
    },
    {
      id: 3,
      paymentType: { id: 3, name: 'Matrícula' },
      datePayment: '2025-03-01T00:00:00Z',
      amountPaid: 250.00,
      state: 'pagado'      // ya cancelado
    },
    {
      id: 4,
      paymentType: { id: 4, name: 'Mensualidad Septiembre' },
      datePayment: '2025-09-10T00:00:00Z',
      amountPaid: 120.00,
      state: 'atrasado'    // se mostrará como "Atrasado"
    }
  ];

  // Determinar nextPayment similar a la lógica real (primer no pagado)
  this.nextPayment = this.payments.find(p => p.state !== 'pagado') || null;

  console.log('Mock payments loaded', this.payments, 'nextPayment=', this.nextPayment);
}



}
