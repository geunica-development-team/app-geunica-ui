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
    private authStorage = inject(AuthStorageService);
    private auth_end_point = 'https://app-geunica-backend.onrender.com';//https://app-geunica-backend.onrender.com
    
    login(data: DataLogin) {
    console.log('🔧 Iniciando login para usuario:', data.user);
    
    return this.httpService
      .post(this.auth_end_point + '/auth/login', { ...data })
      .pipe(
        tap((res: any) => {
          console.log('🔧 Respuesta del backend:', res);
          console.log('🔧 Token recibido:', !!res.token);
          
          if (res.token) {
            console.log('🔧 Guardando token...');
            this.authStorage.setToken(res.token);
            
            // Verificar inmediatamente que se guardó
            const savedToken = this.authStorage.getToken();
            console.log('🔧 Token guardado exitosamente:', !!savedToken);
            
            if (!savedToken) {
              console.error('❌ ERROR: El token no se guardó correctamente');
            }
          } else {
            console.error('❌ ERROR: No se recibió token del backend');
          }
        }),
        catchError(this.handleError)
      );
    }
    
    //PARA MANEJAR ROLES Y EL TOKEN
    getDecodedToken(): any {
        const token = this.authStorage.getToken();
        if (!token) {
        console.log('🔧 No hay token para decodificar');
        return null;
        }

        try {
        const decoded = jwtDecode(token);
        console.log('🔧 Token decodificado exitosamente');
        return decoded;
        } catch (error) {
        console.error('🔧 Token inválido o corrupto', error);
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
                


}
            
   
//MANEJAR SI EL TOKEN EXPIRO
    export function isTokenExpired(token: string): boolean {
    try {
        const decoded: any = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000); // en segundos
        return decoded.exp < now;
    } catch {
        return true;
    }
    }
                