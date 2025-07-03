import { Routes } from "@angular/router";
import { PanelComponent } from "./panel/panel.component";
import { DashboardComponent } from "./panel/dashboard/dashboard.component";
import { CoursesComponent } from "./panel/courses/courses.component";
import { CurriculumComponent } from "./panel/curriculum/curriculum.component";
import { GradesComponent } from "./panel/grades/grades.component";
import { AttendanceComponent } from "./panel/attendance/attendance.component";
import { PaymentsComponent } from "./panel/payments/payments.component";
import { AnnouncementComponent } from "./panel/announcement/announcement.component";
import { ScheduleComponent } from "./panel/schedule/schedule.component";
import { GradesRegistryComponent } from "./panel/grades-registry/grades-registry.component";

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
            }

        ]
    }
]