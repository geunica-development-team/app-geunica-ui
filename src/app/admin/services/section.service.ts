import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";

export interface dataSection {
    name: string
}

export interface dataSectionAll extends dataSection {
    id: number
}

@Injectable({
    providedIn: 'root'
})
export class SectionService {
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
                case "Sección no encontrado":
                    errorMessage = backend.message;
                    break;
                default:
                    errorMessage = backend.message || 'Error interno del servidor';
                    break;
            }
        }
        return throwError(() => new Error(errorMessage));
    }
                
    addSection(data: dataSection) {
        return this.httpService
        .post(this.auth_end_point+'/section', {...data})
        .pipe(catchError(this.handleError)
        );
    }
    getAllSections() {
        return this.httpService
        .get<dataSectionAll[]>(this.auth_end_point+'/section')
        .pipe(catchError(this.handleError)
        );
    }
    getSectionById(id: number) {
        return this.httpService
        .get<dataSection>(`${this.auth_end_point}/section/${id}`)
        .pipe(catchError(this.handleError));
    }
    updateSection(id: number, data: dataSection) {
        return this.httpService
        .patch(`${this.auth_end_point}/section/${id}`, { ...data})
        .pipe(catchError(this.handleError));
    }
}
            
