export interface FeeRecord {
  id: string;
  studentName: string;
  studentImage: string;
  amountPaid: number;
  paymentMethod: 'Efectivo' | 'Transferencia' | 'Tarjeta';
  paymentDate: string; // puedes usar Date si lo vas a tratar como fecha
  status: 'Pagado' | 'Pendiente' | 'Vencido';
}

export interface DebtInfo {
  level: string
  month: string
  year: number
  dueDate: string
  daysOverdue: number
  amount: number
}

export interface LastPaymentInfo {
  level: string
  month: string
  year: number
  paidDate: string
  amount: number
}