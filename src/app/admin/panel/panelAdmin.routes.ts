import { Routes } from "@angular/router";
import { PanelComponent } from "./panel.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { UsersComponent } from "./users/users.component";
import { FinanceComponent } from "./finance/finance.component";
import { EnrollmentComponent } from "./enrollment/enrollment.component";
import { StudentUsersComponent } from "./student-users/student-users.component";
import { InternalUsersComponent } from "./internal-users/internal-users.component";
import { StudentDetailsComponent } from "./student-users/student-details/student-details.component";

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
                path: 'inscripciones',
                component: EnrollmentComponent,
            },
            {
                path: 'estudiantes-matriculados',
                component: StudentUsersComponent
            },
            {
                path: "estudiantes-matriculados/:id",
                component: StudentDetailsComponent,
            },
            {
                path: 'equipo-academico',
                component: InternalUsersComponent
            },
            {
                path: 'usuarios',
                component: UsersComponent
            },
            {
                path: 'finanzas',
                component: FinanceComponent
            }
        ]
    }
]