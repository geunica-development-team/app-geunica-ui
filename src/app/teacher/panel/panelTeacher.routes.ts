import { Routes } from "@angular/router";
import { roleGuard } from "../../guards/role.guard";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { PanelComponent } from "./panel.component";
import { AssignedCoursesComponent } from "./assigned-courses/assigned-courses.component";
import { NoteManagmentComponent } from "./note-managment/note-managment.component";
import { AttendanceManagmentComponent } from "./attendance-managment/attendance-managment.component";
import { AnnouncementComponent } from "./announcement/announcement.component";
import { ScheduleComponent } from "./schedule/schedule.component";
import { AttendanceListComponent } from "./attendance-list/attendance-list.component";

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
                path: "attendanceList/:id_salon",
                component: AttendanceListComponent
            },
            {
                path: "announcement",
                component: AnnouncementComponent
            },
            {
                path: "schedule",
                component: ScheduleComponent
            }

        ]
    }
]