import { Routes } from "@angular/router";
import { AuthComponent } from "./auth.component";
import { LoginComponent } from "./login/login.component";
import { RecoverEmailComponent } from "./recover-email/recover-email.component";
import { RecoverCodeComponent } from "./recover-code/recover-code.component";
import { RecoverPasswordComponent } from "./recover-password/recover-password.component";

export const authRoutes: Routes = [
    {
        path: 'auth',
        component: AuthComponent,
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'recover/email',
                component: RecoverEmailComponent
            },
            {
                path: 'recover/code',
                component: RecoverCodeComponent
            },
            {
                path: 'recover/password',
                component: RecoverPasswordComponent
            }
        ]
    }
]