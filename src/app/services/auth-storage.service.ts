import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {
  private platformId = inject(PLATFORM_ID);
  private tokenKey = 'accessToken';

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('🔧 Guardando token en localStorage:', !!token);
      localStorage.setItem(this.tokenKey, token);
      
      // Verificar que se guardó
      const saved = localStorage.getItem(this.tokenKey);
      console.log('🔧 Token verificado después de guardar:', !!saved);
    } else {
      console.log('🔧 No se puede guardar token - no estamos en el browser');
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.tokenKey);
      console.log('🔧 Obteniendo token:', !!token);
      return token;
    }
    console.log('🔧 No se puede obtener token - no estamos en el browser');
    return null;
  }

  removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      console.log('🔧 Token removido');
    }
  }

  logOut(): void {
    this.removeToken();
  }
}
