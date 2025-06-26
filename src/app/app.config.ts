import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { authRoutes } from './pages/auth/auth.routes';
import { studentPanelRoutes } from './student/panelStudent.routes';
import { adminPanelRoutes } from './admin/panel/panelAdmin.routes';



export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideRouter(authRoutes),
    provideRouter(studentPanelRoutes),
    provideRouter(adminPanelRoutes),
    provideClientHydration(
      withHttpTransferCacheOptions({
				includePostRequests: true,
			}),
    ),
    provideAnimations(),
    provideToastr(),
    provideHttpClient(withFetch())
  ]
};
