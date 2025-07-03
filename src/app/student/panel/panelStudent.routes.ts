import { Routes } from "@angular/router";
import { PanelComponent } from "./panel.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

export const studentPanelRoutes: Routes = [
    {
        path: 'student/panel',
        component: PanelComponent,
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