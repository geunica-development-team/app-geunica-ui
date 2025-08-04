import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";
import { AuthStorageService } from "../../services/auth-storage.service";

export interface dataUser {
    person: {
        id?: number;
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
        teacher?: {
            id: number;
            specialty: string;
        }
    }
    idRole: number;
    idCampus: number;
    user: string;
    password?: string;
    state: string
}

export interface dataUserAll {
  id: number;
  fullName: string;
  role: string;
  user: string;
  campus: string;
  email: string;
  state: string;
  lastLogin: string | null;
}

export interface dataUserById extends dataUser {
    id: number,
    role: {
        id: number,
        role: string
    },
    campus: {
        id: number,
        name: number
    }
}

export interface dataTeacher {
    idPerson?: number,
    specialty: string
}


@Injectable({
    providedIn: 'root'
})
export class UserService {
    private httpService = inject(HttpClient);
    private authStorage = inject(AuthStorageService);
    private auth_end_point = 'https://app-geunica-backend.onrender.com';
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

    addUser(data: dataUser) {
        return this.httpService
        .post(this.auth_end_point+'/user/full', {...data})
        .pipe(catchError(this.handleError)
        );
    }
    
    getAllUsers() {
        return this.httpService
        .get<dataUserAll[]>(this.auth_end_point+'/user')
        .pipe(catchError(this.handleError)
        );
    }

    getUserById(id:number) {
        const token = this.authStorage.getToken();

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        })

        return this.httpService
        .get<dataUserById>(`${this.auth_end_point}/user/${id}`, { headers })
        .pipe(catchError(this.handleError));
    }

    updateUser(id: number, data: dataUser) {
        return this.httpService
        .patch(`${this.auth_end_point}/user/full/${id}`, { ...data})
        .pipe(catchError(this.handleError));
    }

    createTeacher(data: dataTeacher) {
        return this.httpService
        .post(this.auth_end_point+'/teacher', {...data})
        .pipe(catchError(this.handleError)
        )
    }

    updateTeacher(id: number, data: dataTeacher) {
        return this.httpService
        .patch(`${this.auth_end_point}/teacher/${id}`, { ...data})
        .pipe(catchError(this.handleError)
        )
    }

    deleteTeacher(id: number) {
        return this.httpService
        .delete(`${this.auth_end_point}/teacher/${id}`)
        .pipe(catchError(this.handleError)
        )
    }
}
            

        