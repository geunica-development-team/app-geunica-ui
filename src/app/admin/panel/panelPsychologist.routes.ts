import { Routes } from "@angular/router";
import { PanelComponent } from "./panel.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { EnrollmentComponent } from "./enrollment/enrollment.component";
import { roleGuard } from "../../guards/role.guard";

export const psychologistPanelRoutes: Routes = [
    //RUTAS DE PSICOLOGA
    {
        path: 'psychologist/panel',
        component: PanelComponent,
        canActivate: [roleGuard],
        data: { role: 'psychologist' },
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'inscripciones',
                component: EnrollmentComponent,
            },
            {
                path: 'perfil',
                loadChildren: () => import('../../pages/shared/profile/profile.routes').then(m => m.profileRoutes)
            }
        ]
    }
]