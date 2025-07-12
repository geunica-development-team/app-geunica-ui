export interface User {
  id: string;
  name: string;
  rol: string;
  dni: string;
  phone: string;
  email: string;
  last_login: string;
  state: string;
}

export interface UserData {
  username: string
  password: string
  role_id: number
  status: string
  first_name: string
  paternal_lastname: string
  maternal_lastname: string
  document_type_id: number
  document_number: string
  phone: string
  email: string
  address: string
  birth_date: string
  gender: string

  // Campos específicos por rol
  specialty?: string // Para TEACHER
  specialty_area?: string // Para PSYCHOLOGIST
  access_level?: string // Para ADMIN
}




export interface UserDataAll {
  userId: number
  username: string
  status: "active" | "inactive"
  lastLogin: string
  role: "student" | "teacher" | "admin"
  person: {
    personId: number
    firstName: string
    lastName: string
    middleName: string
    documentNumber: string
    phone: string
    address: string
    email: string
    birthDate: string
    gender: string
  }
  student?: {
    studentId: number
    studentCode: string
    enrollmentDate: string
    studentStatus: "enrolled" | "withdrawn" | "conditional"
    levels: {
      levelName: string // Ej: "1ro Primaria"
      isCurrent: boolean
      payments: {
        year: number
        month: string // Ej: "Marzo"
        dueDate: string // Fecha límite
        paid: boolean // Si está pagado
        paidDate?: string // Fecha de pago (opcional)
      }[]
    }[]
  }
  teacher?: {
    teacherId: number
    specialty: string
  }
}

















export interface UserProfile {
  // Información básica
  fullName: string
  dni: string
  birthDate: string
  gender: string

  // Información de contacto
  phone: string
  address: string
  email: string

  // Información académica
  studentCode: string
  enrollmentDate: string
  academicStatus: string

  // Información de usuario
  username: string
  avatar?: string
}