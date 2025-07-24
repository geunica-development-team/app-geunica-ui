import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
interface ScheduleItem {
  vencimiento: string;
  concepto: string;
  accion: string;
  monto: number;
}
@Component({
  selector: 'app-payments',
  imports: [CommonModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent {
    schedule: ScheduleItem[] = [
    { vencimiento: '2025-07-15', concepto: 'Cuota 1', accion: 'Pagado', monto: 400 },
    { vencimiento: '2025-08-15', concepto: 'Cuota 2', accion: 'Pagar', monto: 450 },
    { vencimiento: '2025-09-15', concepto: 'Cuota 3', accion: 'Pagar', monto: 500 },
    { vencimiento: '2025-10-15', concepto: 'Cuota 4', accion: 'Pagar', monto: 500 },
    { vencimiento: '2025-11-15', concepto: 'Cuota 5', accion: 'Pagar', monto: 500 },
    { vencimiento: '2025-12-15', concepto: 'Cuota 6', accion: 'Pagar', monto: 500 },
    { vencimiento: '2025-13-15', concepto: 'Cuota 7', accion: 'Pagar', monto: 500 },
  ];
}
