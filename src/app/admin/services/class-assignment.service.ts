import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";

export interface dataAssignClassroom {
    idCourse: number,
    idClassroom: number,
    idTeacher: number
}

export interface dataScheduleClassroom {
    idClassAssignment: number,
    day: string,
    startTime: string,
    endTime: string
}

export interface ScheduleItem {
  id?: number,
  day: string,
  startTime: string,
  endTime: string,
  isNew?: boolean
}

export interface dataAssignClassroomById {
    id: number,
    classroom: {
        id: number
    },
    course: {
        id: number
    },
    teacher: {
        id: number
    },
}

@Injectable({
    providedIn: 'root'
})
export class AssignClassroomService {
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
           
    //ASIGNACION DE CURSO
    addAssignClassroom(data: dataAssignClassroom) {
        return this.httpService
        .post(this.auth_end_point+'/class-assignment', {...data})
        .pipe(catchError(this.handleError));
    }
    updateAssignClassroom(id: number, data: dataAssignClassroom) {
        return this.httpService
        .patch(`${this.auth_end_point}/class-assignment/${id}`, { ...data})
        .pipe(catchError(this.handleError));
    }
    getAssignClassroomById(id:number) {
        return this.httpService
        .get<dataAssignClassroomById>(`${this.auth_end_point}/class-assignment/${id}`)
        .pipe(catchError(this.handleError));
    }
    deleteAssignmentClassroom(id: number) {
        return this.httpService
        .delete(`${this.auth_end_point}/class-assignment/${id}`)
        .pipe(catchError(this.handleError))
    }

    //HORARIOS
    addScheduleClassroom(data: dataScheduleClassroom) {
        return this.httpService
        .post(this.auth_end_point+'/class-schedule', {...data})
        .pipe(catchError(this.handleError));
    }
    getScheduleByAssigmentId(id:number) {
        return this.httpService
        .get(`${this.auth_end_point}/class-schedule/allById/${id}`)
        .pipe(catchError(this.handleError));
    }
    deleteScheduleClassroom(id: number) {
        return this.httpService
        .delete(`${this.auth_end_point}/class-schedule/${id}`)
        .pipe(catchError(this.handleError)
        )
    }
}
            

        