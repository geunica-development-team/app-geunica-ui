import { Routes } from "@angular/router";
import { PanelComponent } from "./panel.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { UsersComponent } from "./users/users.component";
import { FinanceComponent } from "./finance/finance.component";
import { EnrollmentComponent } from "./enrollment/enrollment.component";
import { StudentUsersComponent } from "./student-users/student-users.component";
import { AcademicUsersComponent } from "./academic-users/academic-users.component";
import { StudentDetailsComponent } from "./student-users/student-details/student-details.component";
import { roleGuard } from "../../guards/role.guard";
import { AcademicSettingComponent } from "./academic-setting/academic-setting.component";
import { ClassroomsComponent } from "./classrooms/classrooms.component";
import { AcademicDetailComponent } from "./academic-users/academic-detail/academic-detail.component";
import { ClassAssignmentComponent } from "./class-assignment/class-assignment.component";

export const adminPanelRoutes: Routes = [
    {
        path: 'admin/panel',
        component: PanelComponent,
        canActivate: [roleGuard],
        data: { role: 'administrador' },
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
                component: AcademicUsersComponent
            },
            {
                path: 'equipo-academico/:id',
                component: AcademicDetailComponent
            },
            {
                path: 'usuarios',
                component: UsersComponent
            },
            {
                path: 'aulas',
                component: ClassroomsComponent
            },
            { path: 'aulas/:id/asignadas', //aulas/:id/
                component: ClassAssignmentComponent 
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
                path: 'profile',
                loadChildren: () => import('../../pages/shared/profile/profile.routes').then(m => m.profileRoutes)
            }
        ]
    }
]