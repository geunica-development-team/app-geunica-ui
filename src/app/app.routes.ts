import { Routes } from '@angular/router';
import { authRoutes } from './pages/auth/auth.routes';
import { adminPanelRoutes } from './admin/panel/panelAdmin.routes';
import { teacherPanelRoutes } from './teacher/panelTeacher.routes';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'public',
        pathMatch: 'full'
    },
    {
      path: 'auth',
      loadChildren: () => 
        import('./pages/auth/auth.routes').then(m => m.authRoutes) 
    },
    {
      path: 'psychologist',
      loadChildren: () => 
        import('./admin/panel/panelPsychologist.routes').then(m => m.psychologistPanelRoutes) 
    },
    {
      path: 'admin',
      loadChildren: () => 
        import('./admin/panel/panelAdmin.routes').then(m => m.adminPanelRoutes) 
    },
    {
      path: 'student',
      loadChildren: () => 
        import('./student/panel/panelStudent.routes').then(m => m.studentPanelRoutes) 
    },
    {
      path: 'public',
      loadChildren: () => 
        import('./pages/public/public.routes').then(m => m.publicRoutes) 
    },
    {
      path: 'unauthorized',
      loadComponent: () =>
        import('./pages/shared/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
    }
];
