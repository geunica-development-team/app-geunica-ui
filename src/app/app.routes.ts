import { Routes } from '@angular/router';
import { authRoutes } from './pages/auth/auth.routes';
import { panelRoutes } from './student/panel/panel.routes';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    ... authRoutes,
    ... panelRoutes
];
