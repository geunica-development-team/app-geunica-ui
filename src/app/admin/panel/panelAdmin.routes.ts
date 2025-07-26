import { Routes } from "@angular/router";
import { PanelComponent } from "./panel.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { UsersComponent } from "./users/users.component";
import { FinanceComponent } from "./finance/finance.component";
import { EnrollmentComponent } from "./enrollment/enrollment.component";
import { StudentUsersComponent } from "./student-users/student-users.component";
import { InternalUsersComponent } from "./internal-users/internal-users.component";
import { StudentDetailsComponent } from "./student-users/student-details/student-details.component";
import { roleGuard } from "../../guards/role.guard";
import { AcademicSettingComponent } from "./academic-setting/academic-setting.component";
import { ClassroomsComponent } from "./classrooms/classrooms.component";

export const adminPanelRoutes: Routes = [
    //RUTAS DE ADMIN
    {
        path: 'admin/panel',
        component: PanelComponent,
        canActivate: [roleGuard],
        data: { role: 'admin' },
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
                path: 'aulas',
                component: ClassroomsComponent
            },
            {
                path: 'finanzas',
                component: FinanceComponent
            },
            {
                path: 'configuracion-academica',
                component: AcademicSettingComponent
            },
            {
                path: 'perfil',
                loadChildren: () => import('../../pages/shared/profile/profile.routes').then(m => m.profileRoutes)
            }
        ]
    }
]