export interface Enrollment {
  id: number;
  student: string;
  application_level: string;
  date: string;
  state: string;
  eval_result: string;
  ticket: string;
}

export interface GroupOption {
  id: string;
  name: string;
  available: boolean;
  conditionQuota: number;
  maxConditionQuota: number;
  totalStudents: number;
  maxCapacity: number;
  status: 'Disponible' | 'Saturado' | 'Completo';
}

export interface AssignGroupData {
  studentId: number;
  studentName: string;
  level: string;
  grade: string;
  selectedGroup: GroupOption | null;
}