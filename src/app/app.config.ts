// app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes }            from './app.routes';
import { authRoutes }        from './pages/auth/auth.routes';
import { studentPanelRoutes} from './student/panel/panelStudent.routes';
import { teacherPanelRoutes} from './teacher/panel/panelTeacher.routes';
import { adminPanelRoutes}   from './admin/panel/panelAdmin.routes';

import { AuthInterceptor }   from './services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),

    // 1) Router con todas las rutas
    provideRouter([
      ...routes,
      ...authRoutes,
      ...studentPanelRoutes,
      ...teacherPanelRoutes,
      ...adminPanelRoutes
    ]),

    // 2) HTTP client + tu interceptor
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },

    // 3) Hydration / cache si lo necesitas
    provideClientHydration(
      withHttpTransferCacheOptions({ includePostRequests: true }),
      withEventReplay()
    ),

    // 4) Animaciones y Toastr
    provideAnimations(),
    provideToastr()
  ]
};
