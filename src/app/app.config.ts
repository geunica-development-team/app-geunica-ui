// src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideClientHydration,
  withEventReplay
} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr }     from 'ngx-toastr';
import {
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi
} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideRouter }     from '@angular/router';

import { routes }             from './app.routes';
import { authRoutes }         from './pages/auth/auth.routes';
import { studentPanelRoutes } from './student/panel/panelStudent.routes';
import { teacherPanelRoutes } from './teacher/panel/panelTeacher.routes';
import { adminPanelRoutes }   from './admin/panel/panelAdmin.routes';

import { AuthInterceptor }    from './services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // 1) Zona y detección optimizada
    provideZoneChangeDetection({ eventCoalescing: true }),

    // 2) Hidratación (SSR) + replay
    provideClientHydration(
      withEventReplay()
    ),

    // 3) Animaciones y toastr
    provideAnimations(),
    provideToastr(),

    // 4) HTTP client con fetch y uso de interceptores desde DI
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi()
    ),

    // 5) Registro de tu interceptor en HTTP_INTERCEPTORS
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },

    // 6) Configuración de rutas
    provideRouter([
      ...routes,
      ...authRoutes,
      ...studentPanelRoutes,
      ...teacherPanelRoutes,
      ...adminPanelRoutes
    ]),
  ]
};
