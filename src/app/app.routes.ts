import { Routes } from '@angular/router';
import { authRoutes } from './pages/auth/auth.routes';
import { studentPanelRoutes } from './student/panel/panelStudent.routes';
import { adminPanelRoutes } from './admin/panel/panelAdmin.routes';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    ... authRoutes,
    ... studentPanelRoutes,
    ... adminPanelRoutes
];
