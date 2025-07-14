import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";
import { jwtDecode } from 'jwt-decode';
import { AuthStorageService } from "./auth-storage.service";

interface DataLogin {
    user: string,
    password: string
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private httpService = inject(HttpClient);
    private auth_end_point = 'http://localhost:3000';
    private authStorage = inject(AuthStorageService);

    constructor() {}

    //PARA MANEJAR ROLES Y EL TOKEN
    getDecodedToken(): any {
        const token = localStorage.getItem('accessToken');
        if (!token) return null;

        try {
            return jwtDecode(token);
        } catch (error) {
            console.error('Token inválido o corrupto', error);
            return null;
        }
    }
    getUserRole(): string {
        const decoded = this.getDecodedToken();
        return decoded?.rol ?? '';
    }

    // Función para manejar errores
    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Error desconocido';
    
        if (error.error instanceof ErrorEvent) {
            // Error del cliente
            errorMessage = `Error: ${error.error.message}`;
        } else {
            const backend = error.error;

            switch (backend.message) {
                case "Usuario no encontrado":
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

    login(data: DataLogin) {
        return this.httpService
        .post(this.auth_end_point+'/auth/login', {...data})
        .pipe(
            tap((res: any) => {
                //GUARDAMOS EL TOKEN DEVUELTO POR EL BACKEND
                this.authStorage.setToken(res.token);
            }),
            catchError(this.handleError)
        );
    }
}