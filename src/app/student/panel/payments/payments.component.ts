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
    { vencimiento: '2025-07-15', concepto: 'Cuota 1', accion: 'Pagar', monto: 400 },
    { vencimiento: '2025-08-15', concepto: 'Cuota 2', accion: 'Pagar', monto: 450 },
    { vencimiento: '2025-09-15', concepto: 'Cuota 3', accion: 'Pagar', monto: 500 },
  ];
}
