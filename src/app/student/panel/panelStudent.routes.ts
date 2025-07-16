import { Routes } from "@angular/router";
import { PanelComponent } from "./panel.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { roleGuard } from "../../guards/role.guard";

export const studentPanelRoutes: Routes = [
    {
        path: 'student/panel',
        component: PanelComponent,
        canActivate: [roleGuard],
        data: { role: 'student' },
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            }
        ]
    }
]