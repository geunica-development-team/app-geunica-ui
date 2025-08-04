import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";

export interface dataCourse {
    name: string;
    code: string;
    description?: string;
    mode: string;
    area: string;
    type: string;
    state: string
}

export interface dataCourseById extends dataCourse {
    state: string;
}

export interface dataCourseAll extends dataCourse {
    id: number;
}

@Injectable({
    providedIn: 'root'
})
export class CourseService {
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
                case "Curso no encontrado":
                    errorMessage = backend.message;
                    break;
                default:
                    errorMessage = backend.message || 'Error interno del servidor';
                    break;
            }
        }
        return throwError(() => new Error(errorMessage));
    }
                
    addCourse(data: dataCourse) {
        return this.httpService
        .post(this.auth_end_point+'/course', {...data})
        .pipe(catchError(this.handleError)
        );
    }
    getAllCourses() {
        return this.httpService
        .get<dataCourseAll[]>(this.auth_end_point+'/course')
        .pipe(catchError(this.handleError)
        );
    }
    getCourseById(id: number) {
        return this.httpService
        .get<dataCourseById>(`${this.auth_end_point}/course/${id}`)
        .pipe(catchError(this.handleError));
    }
    updateCourse(id: number, data: dataCourse) {
        return this.httpService
        .patch(`${this.auth_end_point}/course/${id}`, { ...data})
        .pipe(catchError(this.handleError));
    }
}
            
