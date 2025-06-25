import { Routes } from "@angular/router";
import { PanelComponent } from "./panel.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { UsersComponent } from "./users/users.component";
import { FinanceComponent } from "./finance/finance.component";
import { AcademicComponent } from "./academic/academic.component";

export const adminPanelRoutes: Routes = [
    {
        path: 'admin/panel',
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
            },
            {
                path: 'usuarios',
                component: UsersComponent
            },
            {
                path: 'gestion-academica',
                component: AcademicComponent
            },
            {
                path: 'finanzas',
                component: FinanceComponent
            }
        ]
    }
]