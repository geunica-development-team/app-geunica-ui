import { Routes } from "@angular/router";
import { PanelComponent } from "./panel/panel.component";

export const teacherPanelRoutes: Routes = [
    {
        path: 'teacher/panel',
        component: PanelComponent,
        children: []
    }
]