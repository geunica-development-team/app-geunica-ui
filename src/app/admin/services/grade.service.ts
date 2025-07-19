import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";

export interface dataGrade {
    name: string,
    idLevel: number
}

export interface dataGradeById {
    id: number,
    name: string,
    level: {
        id: number
    }
}

export interface dataGradeAll {
    id: number,
    name: string,
    level: {
        name: number
    }
}

@Injectable({
    providedIn: 'root'
})
export class GradeService {
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
                case "Grado no encontrado":
                    errorMessage = backend.message;
                    break;
                default:
                    errorMessage = backend.message || 'Error interno del servidor';
                    break;
            }
        }
        return throwError(() => new Error(errorMessage));
    }
                
    addGrade(data: dataGrade) {
        return this.httpService
        .post(this.auth_end_point+'/grade', {...data})
        .pipe(catchError(this.handleError)
        );
    }
    getAllGrades() {
        return this.httpService
        .get<dataGradeAll[]>(this.auth_end_point+'/grade')
        .pipe(catchError(this.handleError)
        );
    }
    getGradeById(id: number) {
        return this.httpService
        .get<dataGradeById>(`${this.auth_end_point}/grade/${id}`)
        .pipe(catchError(this.handleError));
    }
    updateGrade(id: number, data: dataGrade) {
        return this.httpService
        .patch(`${this.auth_end_point}/grade/${id}`, { ...data})
        .pipe(catchError(this.handleError));
    }
}
            
