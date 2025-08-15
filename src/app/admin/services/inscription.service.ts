import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";

//OJO, EN EL BACKEND "INSCRIPCION" ES INSCRIPTION,
//EN EL FRONTEND "INSCRIPCION" ES ENROLLMENT
export interface dataInscription {
    student: {
        person: {
            names: string;
            paternalSurname: string;
            maternalSurname: string;
            typeOfIdentityDocument: string;
            documentNumber: string;
            birthDate: string; // formato ISO: YYYY-MM-DD
            gender: string;
            address?: string;
            phoneNumber?: string;
            email?: string;
        }
    },
    tutor: {
        person: {
            names: string;
            paternalSurname: string;
            maternalSurname: string;
            typeOfIdentityDocument: string;
            documentNumber: string;
            birthDate: string; // formato ISO: YYYY-MM-DD
            gender: string;
            address: string;
            phoneNumber: string;
            email: string;
        }
    }
    idGrade: number
}

export interface dataInscriptionbyId extends dataInscription {
    id: number;
    registrationDate: string;
    state: string;
    psychology?: {
        result: boolean;
        observation: string;
        evaluationDate: string;
    } | null;
    grade: {
        id: number,
        name: string
        level: {
            id: number;
            name: string;
        }
    }
}

export interface dataInscriptionAll {
    id: number;
    registrationDate: string;
    state: string;
    psychology?: {
        result: boolean;
        observation: string;
        evaluationDate: string;
    } | null;
    student: {
        person: {
            names: string,
            paternalSurname: string;
            maternalSurname: string;
            documentNumber: string;
        }
    };
    tutor?: {
        person: {
            names: string,
            paternalSurname: string;
            maternalSurname: string;
        }
    };
    grade: {
        id: number;
        name: string;
        level: {
            id: number;
            name: string;
        }
    }
    enrollments?: {
        state: string;
    }[];
}

export interface dataEnrollmentList {
    enrollments: {
        id: number;
        state: string;
        dateEnrollment: string;
        classroom: {
            id?: number;
            name: string;
            shift: string;
            grade: {
                name: string
                level: {
                    name: string;
                }
            };
            period: {
                name: string
                startDate: string
                endDate: string
                state: boolean
            };
            section: {
                name: string
            };
            campus: {
                name: string
            }
        }
    }[];
}

export interface dataChangeState {
    state: string;
}

export interface acceptedInscription {
  id: number; // id de la inscripción
  state: string; // estado de la inscripción
  student: {
    id: number;
    studentCode: string; // DNI o código
    person: {
      id: number;
      names: string;
      paternalSurname: string;
      maternalSurname: string;
      user: {
        id: number;
        user: string;
        state: string;
        lastLogin: string | null; // puede ser null
        person: {
          names: string;
          paternalSurname: string;
          maternalSurname: string;
        };
      };
    };
  };
}

//TODA LA INFO DE INSCRIPTION: 
export interface InscriptionFull {
  id: number;
  state: string;
  registrationDate: string;
  updatedAt: string;
  psychology: Psychology;
  enrollments: Enrollment[];
  student: Student;
  tutor: Tutor;
  grade: Grade;
}

export interface Psychology {
  id: number;
  result: boolean;
  observation: string;
  evaluationDate: string;
  updatedAt: string;
  inscription: InscriptionBasic;
}

export interface InscriptionBasic {
  id: number;
  state: string;
  registrationDate: string;
  updatedAt: string;
}

export interface Enrollment {
  id: number;
  state: string;
  condition: boolean;
  dateEnrollment: string;
  updatedAt: string;
  classroom: Classroom;
  inscription: InscriptionBasic;
}

export interface Classroom {
  id: number;
  name: string;
  shift: string;
  capacity: number;
  specialCapacity: number;
  createdAt: string;
  updatedAt: string;
  grade: Grade;
  campus: Campus;
  section: Section;
  period: Period;
}

export interface Grade {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  level: Level;
}

export interface Level {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Campus {
  id: number;
  name: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Period {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  state: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: number;
  studentCode: string;
  state: string;
  createdAt: string;
  updatedAt: string;
  person: PersonWithUser;
}

export interface Tutor {
  id: number;
  person: PersonBasic;
}

export interface PersonBasic {
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
  createdAt: string;
  updatedAt: string;
}

export interface PersonWithUser extends PersonBasic {
  user: UserFull;
}

export interface UserFull {
  id: number;
  user: string;
  password: string;
  refreshToken: string | null;
  state: string;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
  person: PersonBasic;
  role: Role;
  campus: Campus;
}

export interface Role {
  id: number;
  role: string;
  description: string;
}

@Injectable({
    providedIn: 'root'
})
export class InscriptionService {
    private httpService = inject(HttpClient);
    private auth_end_point = 'http://localhost:3000';
    constructor() {}
    
    // Función para manejar errores
    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Error desconocido';
        
        if (error.error instanceof ErrorEvent) {
            // Error del cliente
            errorMessage = `Error: ${error.error.message}`;
        } else {
            const backend = error.error;
            
            switch (backend.message) {
                case "Sede no encontrada":
                    errorMessage = backend.message;
                    break;
                case "Contraseña incorrecta":
                    errorMessage = backend.message;
                    break;
                    default:
                        errorMessage = backend.message || 'Error interno del servidor';
                        break;
                    }
        }
        return throwError(() => new Error(errorMessage));
    }
                
    addInscription(data: dataInscription) {
        return this.httpService
        .post(this.auth_end_point+'/inscription/full', {...data})
        .pipe(catchError(this.handleError)
        );
    }
    getAllInscriptions() {
        return this.httpService
        .get<dataInscriptionAll[]>(this.auth_end_point+'/inscription')
        .pipe(catchError(this.handleError)
        );
    }
    getInscriptionById(id:number) {
        return this.httpService
        .get<dataInscriptionbyId>(`${this.auth_end_point}/inscription/${id}`)
        .pipe(catchError(this.handleError));
    }
    updateInscription(id: number, data: dataInscription) {
        return this.httpService
        .patch(`${this.auth_end_point}/inscription/full/${id}`, { ...data})
        .pipe(catchError(this.handleError));
    }
    changeState(id: number, data: dataChangeState) {
        return this.httpService
        .patch(`${this.auth_end_point}/inscription/state/${id}`, { ...data})
        .pipe(catchError(this.handleError));
    }
    getEnrollmentsById(id:number) {
        return this.httpService
        .get<dataEnrollmentList>(`${this.auth_end_point}/inscription/${id}`)
        .pipe(catchError(this.handleError));
    }

    getAcceptedInscriptions() {
        return this.httpService
        .get<acceptedInscription[]>(this.auth_end_point+'/inscription/accepted')
        .pipe(catchError(this.handleError)
        );
    }
    getInscriptionFullById(id:number) {
        return this.httpService
        .get<InscriptionFull>(`${this.auth_end_point}/inscription/full/${id}`)
        .pipe(catchError(this.handleError));
    }
}
            

        