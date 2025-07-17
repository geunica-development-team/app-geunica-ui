import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";

interface dataCampus {
    name: string,
    location: string
}

export interface dataCampusAll extends dataCampus {
    id: number
}

@Injectable({
    providedIn: 'root'
})
export class CampusService {
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
                
    addCampus(data: dataCampus) {
        return this.httpService
        .post(this.auth_end_point+'/campus', {...data})
        .pipe(catchError(this.handleError)
        );
    }
    getAllCampus() {
        return this.httpService
        .get<dataCampusAll[]>(this.auth_end_point+'/campus')
        .pipe(catchError(this.handleError)
        );
    }
}
            

        