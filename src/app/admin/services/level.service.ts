import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";

export interface dataLevel {
    name: string,
    cost: number
}

export interface dataLevelAll extends dataLevel {
    id: number
}

@Injectable({
    providedIn: 'root'
})
export class LevelService {
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
                case "Nivel/Programa no encontrado":
                    errorMessage = backend.message;
                    break;
                default:
                    errorMessage = backend.message || 'Error interno del servidor';
                    break;
            }
        }
        return throwError(() => new Error(errorMessage));
    }
                
    addLevel(data: dataLevel) {
        return this.httpService
        .post(this.auth_end_point+'/level', {...data})
        .pipe(catchError(this.handleError)
        );
    }
    getAllLevels() {
        return this.httpService
        .get<dataLevelAll[]>(this.auth_end_point+'/level')
        .pipe(catchError(this.handleError)
        );
    }
    getLevelById(id:number) {
        return this.httpService
        .get<dataLevel>(`${this.auth_end_point}/level/${id}`)
        .pipe(catchError(this.handleError));
    }
    updateLevel(id: number, data: dataLevel) {
        return this.httpService
        .patch(`${this.auth_end_point}/level/${id}`, { ...data})
        .pipe(catchError(this.handleError));
    }
}
            

        