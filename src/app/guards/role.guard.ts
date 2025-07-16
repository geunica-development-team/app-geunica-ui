import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthStorageService } from '../services/auth-storage.service';

function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000); // en segundos
    return decoded.exp < now;
  } catch (e) {
    return true;
  }
}

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authStorage = inject(AuthStorageService);
  const expectedRole = route.data['role'];
  const token = authStorage.getToken();

  if (!token || isTokenExpired(token)) {
    authStorage.logOut();
    router.navigate(['/login'], {
      queryParams: { sessionExpired: true }
    });
    return false;
  }

  try {
    const decoded: any = jwtDecode(token);
    const userRole = decoded.role;

    if (userRole === expectedRole) {
      return true;
    } else {
      router.navigate(['/unauthorized']);
      return false;
    }
  } catch (error) {
    router.navigate(['/unauthorized']);
    return false;
  }
};
