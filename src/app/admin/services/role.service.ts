import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";

export interface dataRole {
    role: string
    description: string
}

export interface dataRoleAll extends dataRole {
    id: number
}

@Injectable({
    providedIn: 'root'
})
export class RoleService {
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
                case "Rol no encontrado":
                    errorMessage = backend.message;
                    break;
                default:
                    errorMessage = backend.message || 'Error interno del servidor';
                    break;
            }
        }
        return throwError(() => new Error(errorMessage));
    }
                
    addRole(data: dataRole) {
        return this.httpService
        .post(this.auth_end_point+'/role', {...data})
        .pipe(catchError(this.handleError)
        );
    }
    getAllRoles() {
        return this.httpService
        .get<dataRoleAll[]>(this.auth_end_point+'/role')
        .pipe(catchError(this.handleError)
        );
    }
    getRoleById(id: number) {
        return this.httpService
        .get<dataRole>(`${this.auth_end_point}/role/${id}`)
        .pipe(catchError(this.handleError));
    }
    updateRole(id: number, data: dataRole) {
        return this.httpService
        .patch(`${this.auth_end_point}/role/${id}`, { ...data})
        .pipe(catchError(this.handleError));
    }
}
            
