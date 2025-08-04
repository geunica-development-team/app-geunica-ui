import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";

export interface dataAssignClassroom {
    idCourse: number,
    idClassroom: number,
    idTeacher: number
}

export interface dataAssignClassroomById {
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
    period: {
        id: number,
        name: string
    }
}

export interface dataAssignClassroomAll {
    id: number;
    courseName: string;
    courseCode: string;
    classroomName: string;
    shift: string;
    grade: string;
    section: string;
    level: string;
    teacherFullName: string;
    teacherSpecialty: string;
}

@Injectable({
    providedIn: 'root'
})
export class AssignClassroomService {
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
                
    addAssignClassroom(data: dataAssignClassroom) {
        return this.httpService
        .post(this.auth_end_point+'/class-assignment', {...data})
        .pipe(catchError(this.handleError)
        );
    }
    getAssignsClassroomAll() {
        return this.httpService
        .get<dataAssignClassroomAll[]>(this.auth_end_point+'/class-assignment')
        .pipe(catchError(this.handleError)
        );
    }
    getAssignClassroomById(id:number) {
        return this.httpService
        .get<dataAssignClassroomById>(`${this.auth_end_point}/class-assignment/${id}`)
        .pipe(catchError(this.handleError));
    }
    updateAssignClassroom(id: number, data: dataAssignClassroom) {
        return this.httpService
        .patch(`${this.auth_end_point}/class-assignment/${id}`, { ...data})
        .pipe(catchError(this.handleError));
    }
}
            

        