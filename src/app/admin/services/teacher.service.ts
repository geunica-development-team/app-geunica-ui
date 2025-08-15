import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";

export interface dataTeacher {
    idPerson?: number,
    specialty: string
}

export interface dataTeacherAll {
    id: number;
    specialty: string;
    state: string;
    person: {
        names: string;
        paternalSurname: string;
        maternalSurname: string;
        documentNumber: string;
        phoneNumber: string;
        email: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class TeacherService {
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
                case "Docente no encontrado":
                    errorMessage = backend.message;
                    break;
                default:
                    errorMessage = backend.message || 'Error interno del servidor';
                    break;
                }
        }
        return throwError(() => new Error(errorMessage));
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

    getAllTeachers() {
        return this.httpService
        .get<dataTeacherAll[]>(this.auth_end_point+'/teacher')
        .pipe(catchError(this.handleError)
        );
    }
}