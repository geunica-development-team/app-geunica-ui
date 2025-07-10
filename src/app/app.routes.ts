import { Routes } from '@angular/router';
import { authRoutes } from './pages/auth/auth.routes';
import { studentPanelRoutes } from './student/panel/panelStudent.routes';
import { adminPanelRoutes } from './admin/panel/panelAdmin.routes';

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
    }
];
