import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";

//OJO, EN EL BACKEND "INSCRIPCION" ES INSCRIPTION,
//EN EL FRONTEND "INSCRIPCION" ES ENROLLMENT
//EN EL BACKEND ES ENROLLMENT Y EN EL FRONTEND ES REGISTRATION
export interface dataRegistration {
    idInscription: number;
    idClassroom: number
}

@Injectable({
    providedIn: 'root'
})
export class EnrollmentService {
    private httpService = inject(HttpClient);
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
                
    addEnrollment(data: dataRegistration) {
        return this.httpService
        .post(this.auth_end_point+'/enrollment', {...data})
        .pipe(catchError(this.handleError)
        );
    }
    updateEnrollment(id: number, data: dataRegistration) {
        return this.httpService
        .patch(`${this.auth_end_point}/enrollment/${id}`, { ...data})
        .pipe(catchError(this.handleError));
    }
    deleteEnrollment(id: number) {
        return this.httpService
        .delete(`${this.auth_end_point}/enrollment/${id}`)
        .pipe(catchError(this.handleError));
    }
}
            

        