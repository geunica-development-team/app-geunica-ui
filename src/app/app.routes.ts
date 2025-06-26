import { Routes } from '@angular/router';
import { authRoutes } from './pages/auth/auth.routes';
import { studentPanelRoutes } from './student/panelStudent.routes';
import { adminPanelRoutes } from './admin/panel/panelAdmin.routes';
import { teacherPanelRoutes } from './teacher/panel/panelTeacher.routes';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    ... authRoutes,
    ... studentPanelRoutes,
    ... adminPanelRoutes,
    ... teacherPanelRoutes
];
