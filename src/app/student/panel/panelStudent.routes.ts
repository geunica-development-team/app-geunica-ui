import { Routes } from "@angular/router";
import { PanelComponent } from "./panel.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { CoursesComponent } from "./courses/courses.component";
import { CurriculumComponent } from "./curriculum/curriculum.component";
import { GradesComponent } from "./grades/grades.component";
import { AttendanceComponent } from "./attendance/attendance.component";
import { PaymentsComponent } from "./payments/payments.component";
import { AnnouncementComponent } from "./announcement/announcement.component";
import { ScheduleComponent } from "./schedule/schedule.component";
import { GradesRegistryComponent } from "./grades-registry/grades-registry.component";
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
            },
            {
                path: 'courses',
                children: [
                    { path: '', 
                        component: CoursesComponent 
                    },
                    { path: ':id/curriculum', 
                        component: CurriculumComponent 
                    },
                ]
            },
            {
                path: 'grades',
                children: [
                    { path: '', 
                        component: GradesComponent 
                    },
                    { path: ':id/gradesRegistry', 
                        component: GradesRegistryComponent
                    },
                ]
            },
            {
                path: 'attendance',
                component: AttendanceComponent
            },
            {
                path: 'payments',
                component: PaymentsComponent
            },
            {
                path: 'announcement',
                component: AnnouncementComponent
            },
            {
                path: 'schedule',
                component: ScheduleComponent
            },
            {
                path: 'perfil',
                loadChildren: () => import('../../pages/shared/profile/profile.routes').then(m => m.profileRoutes)
            }

        ]
    }
]