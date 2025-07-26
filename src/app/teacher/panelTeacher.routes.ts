import { Routes } from "@angular/router";
import { PanelComponent } from "./panel/panel.component";
import { DashboardComponent } from "./panel/dashboard/dashboard.component";
import { AssignedCoursesComponent } from "./panel/assigned-courses/assigned-courses.component";
import { NoteManagmentComponent } from "./panel/note-managment/note-managment.component";
import { AttendanceManagmentComponent } from "./panel/attendance-managment/attendance-managment.component";
import { AnnouncementComponent } from "./panel/announcement/announcement.component";
import { ScheduleComponent } from "./panel/schedule/schedule.component";
import { AttendanceListComponent } from "./panel/attendance-list/attendance-list.component";
import { NoteListComponent } from "./panel/note-list/note-list.component";

export const teacherPanelRoutes: Routes = [
    {
        path: 'teacher/panel',
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
                path: "coursesAsigned",
                component: AssignedCoursesComponent
            },
            {
                path: "NoteManagment",
                component: NoteManagmentComponent
            },
            {
                path: "NoteList/:id_estudiante",
                component: NoteListComponent
            },
            {
                path: "attendanceManagment",
                component: AttendanceManagmentComponent
            },
            {
                path: "attendanceList",
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