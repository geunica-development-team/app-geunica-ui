import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";

export interface dataPeriod {
  name: string;
  startDate: string;
  endDate: string;
  state: boolean;
}

export interface dataPeriodById extends dataPeriod {
    id: number
}

export interface dataPeriodAll extends dataPeriod {
    id: number
}

@Injectable({
    providedIn: 'root'
})
export class PeriodService {
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
                case "Periodo no encontrado":
                    errorMessage = backend.message;
                    break;
                default:
                    errorMessage = backend.message || 'Error interno del servidor';
                    break;
            }
        }
        return throwError(() => new Error(errorMessage));
    }
                
    addPeriod(data: dataPeriod) {
        return this.httpService
        .post(this.auth_end_point+'/period', {...data})
        .pipe(catchError(this.handleError)
        );
    }
    getAllPeriods() {
        return this.httpService
        .get<dataPeriodAll[]>(this.auth_end_point+'/period')
        .pipe(catchError(this.handleError)
        );
    }
    getPeriodById(id: number) {
        return this.httpService
        .get<dataPeriodById>(`${this.auth_end_point}/period/${id}`)
        .pipe(catchError(this.handleError));
    }
    updatePeriod(id: number, data: dataPeriod) {
        return this.httpService
        .patch(`${this.auth_end_point}/period/${id}`, { ...data})
        .pipe(catchError(this.handleError));
    }
}
            
