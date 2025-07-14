import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthStorageService } from '../services/auth-storage.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authStorage = inject(AuthStorageService);
  const expectedRole = route.data['role']; // <-- aquí leemos el rol esperado

  const token = authStorage.getToken();

  if (!token) {
    router.navigate(['/unauthorized']);
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
