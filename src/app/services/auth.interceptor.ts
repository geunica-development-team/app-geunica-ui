// src/app/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from '@angular/common/http';
import { AuthStorageService } from './auth-storage.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authStorage: AuthStorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authStorage.getToken();
    if (token) {
      const clone = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next.handle(clone);
    }
    return next.handle(req);
  }
}
