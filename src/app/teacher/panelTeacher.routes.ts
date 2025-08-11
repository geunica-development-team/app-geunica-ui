import { Routes } from "@angular/router";
import { PanelComponent } from "./panel/panel.component";
import { DashboardComponent } from "./panel/dashboard/dashboard.component";
import { AssignedCoursesComponent } from "./panel/assigned-courses/assigned-courses.component";
import { NoteManagmentComponent } from "./panel/note-managment/note-managment.component";
import { AttendanceManagmentComponent } from "./panel/attendance-managment/attendance-managment.component";
import { AnnouncementComponent } from "./panel/announcement/announcement.component";
import { ScheduleComponent } from "./panel/schedule/schedule.component";
import { roleGuard } from "../guards/role.guard";

export const teacherPanelRoutes: Routes = [
    {
        path: 'teacher/panel',
        component: PanelComponent,
        canActivate: [roleGuard],
        data: { role: 'teacher' },
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
                path: "coursesAsigned",
                component: AssignedCoursesComponent
            },
            {
                path: "NoteManagment",
                component: NoteManagmentComponent
            },
            {
                path: "attendanceManagment",
                component: AttendanceManagmentComponent
            },
            {
                path: "announcement",
                component: AnnouncementComponent
            },
            {
                path: "schedule",
                component: ScheduleComponent
            },
            {
                path: 'perfil',
                loadChildren: () => import('./../pages/shared/profile/profile.routes').then(m => m.profileRoutes)
            }
        ]
    }
]