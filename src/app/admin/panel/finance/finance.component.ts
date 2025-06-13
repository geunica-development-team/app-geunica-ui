import { Component } from '@angular/core';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { TableComponent } from '../../../components/table/table.component';
import { FeeRecord } from '../../services/payments.service';

@Component({
  selector: 'app-finance',
  imports: [PanelHeaderComponent, TableComponent],
  templateUrl: './finance.component.html',
  styleUrl: './finance.component.css'
})
export class FinanceComponent {
  // Estadísticas de pagos
  paidCount: number = 1335;
  pendingCount: number = 4366;
  overdueCount: number = 208;
  
  // Resumen de pagos
  totalAmount: number = 3500000;
  totalHostel: number = 1200000;
  totalTuition: number = 2000000;
  totalDayBoarding: number = 300000;
  
  // Datos del gráfico
  chartData = {
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    values: [2500, 3800, 3200, 4100, 3700, 5200, 2800, 4300, 5100, 4800, 4200, 3900]
  };
  
  // Tabla de pagos
  // COLUMNAS DE LA TABLA
  columns = [
    'ID',
    'Estudiante',
    'Monto Pagado',
    'Método de Pago',
    'Fecha de Pago',
    'Estado'
  ];

    
    // MAPEO PARA COLUMNAS Y FILAS
  columnMappings = {
    'ID': 'id',
    'Estudiante': 'studentName',
    'Monto Pagado': 'amountPaid',
    'Método de Pago': 'paymentMethod',
    'Fecha de Pago': 'paymentDate',
    'Estado': 'status'
  };


  rows: FeeRecord[] = [
    {
      id: '01',
      studentName: 'Sofía Martínez',
      studentImage: 'https://randomuser.me/api/portraits/women/65.jpg',
      amountPaid: 300.00,
      paymentMethod: 'Efectivo',
      paymentDate: '2024-03-10',
      status: 'Pagado'
    },
    {
      id: '02',
      studentName: 'Luis Huamán',
      studentImage: 'https://randomuser.me/api/portraits/men/44.jpg',
      amountPaid: 0.00,
      paymentMethod: 'Transferencia',
      paymentDate: '',
      status: 'Vencido'
    },
    {
      id: '03',
      studentName: 'Daniela Paredes',
      studentImage: 'https://randomuser.me/api/portraits/women/32.jpg',
      amountPaid: 100.00,
      paymentMethod: 'Tarjeta',
      paymentDate: '2024-04-05',
      status: 'Pendiente'
    },
    {
      id: '04',
      studentName: 'Renzo Vilchez',
      studentImage: 'https://randomuser.me/api/portraits/men/76.jpg',
      amountPaid: 350.00,
      paymentMethod: 'Transferencia',
      paymentDate: '2024-03-25',
      status: 'Pagado'
    },
    {
      id: '05',
      studentName: 'Luciana Torres',
      studentImage: 'https://randomuser.me/api/portraits/women/55.jpg',
      amountPaid: 200.00,
      paymentMethod: 'Tarjeta',
      paymentDate: '2024-05-01',
      status: 'Pendiente'
    },
    {
      id: '06',
      studentName: 'Carlos Gómez',
      studentImage: 'https://randomuser.me/api/portraits/men/33.jpg',
      amountPaid: 0.00,
      paymentMethod: 'Efectivo',
      paymentDate: '',
      status: 'Vencido'
    },
    {
      id: '07',
      studentName: 'Fiorella Chávez',
      studentImage: 'https://randomuser.me/api/portraits/women/88.jpg',
      amountPaid: 250.00,
      paymentMethod: 'Transferencia',
      paymentDate: '2024-05-20',
      status: 'Pagado'
    },
    {
      id: '08',
      studentName: 'Mateo Lévano',
      studentImage: 'https://randomuser.me/api/portraits/men/71.jpg',
      amountPaid: 50.00,
      paymentMethod: 'Efectivo',
      paymentDate: '2024-06-01',
      status: 'Pendiente'
    }
  ];

  
  selectedYear: string = '2023-2024';
  selectedPeriod: string = 'Anual';
  selectedRecord: FeeRecord | null = null;
  
  constructor() { }
  
  ngOnInit(): void {
    // Inicialización del componente
  }
  
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'paid': return 'status-paid';
      case 'pending': return 'status-pending';
      case 'overdue': return 'status-overdue';
      default: return '';
    }
  }
  
  getStatusText(status: string): string {
    switch (status) {
      case 'paid': return 'Pagado';
      case 'pending': return 'Pendiente';
      case 'overdue': return 'Vencido';
      default: return '';
    }
  }
  
  toggleRecordSelection(record: FeeRecord): void {
    this.selectedRecord = this.selectedRecord === record ? null : record;
  }
  
  isSelected(record: FeeRecord): boolean {
    return this.selectedRecord === record;
  }
}
