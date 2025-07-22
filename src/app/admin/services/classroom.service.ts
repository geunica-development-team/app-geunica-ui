import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";

export interface dataClassroom {
    idCampus: number,
    idGrade: number,
    idSection: number,
    name: string,
    shift: string,
    capacity: number,
    specialCapacity: number
}

export interface dataClassroomById {
    id: number,
    name: string,
    shift: string,
    capacity: number,
    specialCapacity: number
    campus: {
        id: number,
        name: string
    },
    grade: {
        id: number,
        name: string,
        level: {
        id: number,
        name: string
        }
    },
    section: {
        id: number,
        name: string
    },
}

export interface dataClassroomAll {
    id: number,
    name: string,
    shift: string,
    capacity: number,
    specialCapacity: number
    campus: {
        name: string
    },
    level: {
        id: number,
        name: string
    }
    grade: {
        name: string
    },
    section: {
        name: string
    }
}

@Injectable({
    providedIn: 'root'
})
export class ClassroomService {
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
                case "Aula no encontrada":
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
                
    addClassroom(data: dataClassroom) {
        return this.httpService
        .post(this.auth_end_point+'/classroom', {...data})
        .pipe(catchError(this.handleError)
        );
    }
    getAllClassrooms() {
        return this.httpService
        .get<dataClassroomAll[]>(this.auth_end_point+'/classroom')
        .pipe(catchError(this.handleError)
        );
    }
    getClassroomById(id:number) {
        return this.httpService
        .get<dataClassroomById>(`${this.auth_end_point}/classroom/${id}`)
        .pipe(catchError(this.handleError));
    }
    updateClassroom(id: number, data: dataClassroom) {
        return this.httpService
        .patch(`${this.auth_end_point}/classroom/${id}`, { ...data})
        .pipe(catchError(this.handleError));
    }
}
            

        