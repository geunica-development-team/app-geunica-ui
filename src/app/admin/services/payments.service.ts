export interface FeeRecord {
  id: string;
  studentName: string;
  studentImage: string;
  amountPaid: number;
  paymentMethod: 'Efectivo' | 'Transferencia' | 'Tarjeta';
  paymentDate: string; // puedes usar Date si lo vas a tratar como fecha
  status: 'Pagado' | 'Pendiente' | 'Vencido';
}
