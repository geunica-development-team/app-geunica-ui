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