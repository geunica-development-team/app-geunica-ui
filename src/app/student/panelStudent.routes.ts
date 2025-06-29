import { Routes } from "@angular/router";
import { PanelComponent } from "./panel/panel.component";
import { DashboardComponent } from "./panel/dashboard/dashboard.component";
import { CoursesComponent } from "./panel/courses/courses.component";
import { CurriculumComponent } from "./panel/curriculum/curriculum.component";

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
                    { path: 'curriculum', 
                        component: CurriculumComponent 
                    },
                ]
            },

        ]
    }
]