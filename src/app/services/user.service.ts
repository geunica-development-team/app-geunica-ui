import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";

export interface UserSession {
  id: number;
  user: string;
  password: string;
  refreshToken: string | null;
  state: string; // O según los estados que manejes
  lastLogin: string; // ISO date string
  person: Person;
  role: Role;
  campus: Campus;

  // Campos opcionales para otros roles (ej: estudiante, docente, etc)
  academicInfo?: AcademicInfo;
  teacherInfo?: TeacherInfo;
}

export interface Person {
  id: number;
  names: string;
  paternalSurname: string;
  maternalSurname: string;
  typeOfIdentityDocument: string;
  documentNumber: string;
  phoneNumber: string;
  email: string;
  address: string;
  birthDate: string;
  gender: string;
}

export interface Role {
  id: number;
  role: string; // Puedes ir agregando más
  description: string;
}

export interface Campus {
  id: number;
  name: string;
  location: string;
}

export interface AcademicInfo {
  academicProgram: string;
  enrollmentYear: number;
  studentCode: string;
  // Otros campos académicos...
}

export interface TeacherInfo {
  department: string;
  academicDegree: string;
  teachingArea: string;
  // Otros campos docentes...
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private httpService = inject(HttpClient);
  private auth_end_point = 'https://app-geunica-backend.onrender.com';

  constructor() {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || 'Error interno del servidor';
    }

    return throwError(() => new Error(errorMessage));
  }

  getUserById(id: number) {
    const token = localStorage.getItem('accessToken');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpService
      .get<UserSession>(`${this.auth_end_point}/user/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }
}
