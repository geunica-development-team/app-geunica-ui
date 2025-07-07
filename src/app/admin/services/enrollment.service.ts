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
  area_id: string;
  cycle_id: string;
  name: string;
  level: string;
  shift: string;
  capacity: number;
  special_capacity: number;
  total_students: number;
  total_special_students: number;
  status: string;
}

export interface AssignGroupData {
  studentId: number;
  studentName: string;
  level: string;
  grade: string;
  selectedGroup: GroupOption | null;
}

export interface StudentData {
  firstName: string;
  paternalLastName: string;
  maternalLastName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
  gender: string;
  phone: string;
  address: string;
  email: string;
}

export interface GuardianData {
  firstName: string;
  paternalLastName: string;
  maternalLastName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
  gender: string;
  phone: string;
  address: string;
  email: string;
}

export interface AcademicData {
  level: string;
  grade: string;
  shift: string;
}

export interface EnrollmentData {
  // Datos básicos
  studentName: string;
  enrollmentDate: string;
  level: string;
  grade: string;
  shift: string;
  
  // Datos del estudiante
  student: {
    firstName: string;
    paternalLastName: string;
    maternalLastName: string;
    documentType: string;
    documentNumber: string;
    birthDate: string;
    gender: string;
    phone: string;
    address: string;
    email: string;
  };
  
  // Datos del apoderado
  guardian: {
    firstName: string;
    paternalLastName: string;
    maternalLastName: string;
    documentType: string;
    documentNumber: string;
    birthDate: string;
    gender: string;
    phone: string;
    address: string;
    email: string;
  };
  
  // Estado
  enrollmentStatus: string;
}

export interface PaymentData {
  studentId: number
  studentName: string
  level: string
  grade: string
  amount: number
  paymentDate: string
  paymentMethod: string
  observations: string
  generateCredentials: string
  notifyGuardianBy: string
  credentials?: {
    // Agregar esta propiedad opcional
    username: string
    password: string
  }
}

export interface CredentialsData {
  studentId: number;
  studentName: string;
  level: string;
  grade: string;
  username: string;
  password: string;
  status: string;
  notifyGuardianBy: string;
}