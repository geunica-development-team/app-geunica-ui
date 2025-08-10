import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { authRoutes } from './pages/auth/auth.routes';
import { studentPanelRoutes } from './student/panel/panelStudent.routes';
import { adminPanelRoutes } from './admin/panel/panelAdmin.routes';
import { psychologistPanelRoutes } from './psychologist/panel/panelPsychologist.routes';
import { teacherPanelRoutes } from './teacher/panel/panelTeacher.routes';
import { authInterceptor } from './services/auth.interceptor';



export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter([
      ...routes,
      ...authRoutes,
      ...studentPanelRoutes,
      ...teacherPanelRoutes,
      ...adminPanelRoutes,
      ...psychologistPanelRoutes
    ]),

    provideClientHydration(
      withHttpTransferCacheOptions({
				includePostRequests: true,
			}), 
      withEventReplay()
    ),
    provideAnimations(),
    provideToastr(),
    provideHttpClient(withFetch(),
      withInterceptors([authInterceptor])
    )
  ]
};
