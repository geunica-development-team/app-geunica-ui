import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthStorageService } from "./auth-storage.service";
import {  catchError, throwError } from "rxjs";


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStorage = inject(AuthStorageService);
  const router = inject(Router);
  
  console.log('🔧 Interceptando request a:', req.url);
  
  const token = authStorage.getToken();
  console.log('🔧 Token disponible para interceptor:', !!token);
  
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('🔧 Header Authorization agregado al request');
  } else {
    console.log('⚠️ No hay token - request sin autenticar');
  }

  return next(authReq).pipe(
    catchError((error: any) => {
      console.error('❌ Error HTTP:', error.status, error.statusText);
      
      if (error.status === 401) {
        console.log('❌ Error 401 - limpiando sesión');
        authStorage.logOut();
        router.navigate(['/auth/login'], { 
          queryParams: { sessionExpired: true } 
        });
      }
      
      return throwError(() => error);
    })
  );
};