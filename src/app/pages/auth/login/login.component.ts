import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { AuthStorageService } from '../../../services/auth-storage.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
  
})
export class LoginComponent {

  //INJECCION DE HERRAMIENTAS
  private toolsForm = inject(FormBuilder);
  private notifycation = inject(ToastrService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private authStorage = inject(AuthStorageService)

  formLogin = this.toolsForm.group({
    'user': ['', [Validators.required]],
    'password': ['', [Validators.required, Validators.minLength(5)]]
  })

  login() {
    if (this.formLogin.invalid) {
      this.notifycation.error('Debes completar todos los campos')
      return;
    }
    this.authService.login({
      user: this.formLogin.get('user')?.value ?? '',
      password: this.formLogin.get('password')?.value ?? '',
    }).subscribe({
      next: (value: any) => {
        this.notifycation.success(`${value.message}, ${value.user.person.names} ${value.user.person.paternalSurname}.`, 'Éxito')
        this.formLogin.reset();

        const token = this.authStorage.getToken();
        if (token) {
          const decoded: any = jwtDecode(token);
          const role = decoded.role;

          if (role === 'admin') {
            this.router.navigateByUrl('/admin/panel/dashboard');
          } else if (role === 'student') {
            this.router.navigateByUrl('/student/panel/dashboard');
          } else {
            this.router.navigateByUrl('/unauthorized');
          }
        } else {
          this.notifycation.error('No se pudo leer el token', 'Error');
        }
      },
      error: (error: Error) => {
          this.notifycation.error(error.message, 'Error');
      }
    })
  }
}
