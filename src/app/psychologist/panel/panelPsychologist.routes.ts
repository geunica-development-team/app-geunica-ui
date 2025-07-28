import { Routes } from "@angular/router";
import { PanelComponent } from "./panel.component";
import { roleGuard } from "../../guards/role.guard";
import { PsychologistInscriptionsListComponent } from "./psychologist-inscriptions-list/psychologist-inscriptions-list.component";
import { PsychologistEvaluationHistoryComponent } from "./psychologist-evaluation-history/psychologist-evaluation-history.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

export const psychologistPanelRoutes: Routes = [
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
                component: PsychologistInscriptionsListComponent,
            },
            {
                path: 'historial-evaluaciones',
                component: PsychologistEvaluationHistoryComponent
            },
            {
                path: 'perfil',
                loadChildren: () => import('../../pages/shared/profile/profile.routes').then(m => m.profileRoutes)
            }
        ]
    }
]
