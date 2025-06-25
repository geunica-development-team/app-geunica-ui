
export interface Assignment {
  id: string;
  task: string;
  subject: string;
  dueDate: string;
  status: 'En progreso' | 'Completado' | 'Pendiente';
}


