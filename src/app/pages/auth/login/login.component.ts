import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
  
})
export class LoginComponent {

  //INJECCION DE HERRAMIENTAS
  private toolsForm = inject(FormBuilder);
  private notifycation = inject(ToastrService);
  private authService = inject(AuthService);
  private router = inject(Router);

  formLogin = this.toolsForm.group({
    'studentCode': ['', [Validators.required]],
    'password': ['', [Validators.required, Validators.minLength(8)]]
  })

  login() {
    if (this.formLogin.invalid) {
      this.notifycation.error('Debes completar todos los campos')
      return;
    }
    this.authService.login({
      studentCode: this.formLogin.get('studentCode')?.value ?? '',
      password: this.formLogin.get('password')?.value ?? '',
    }).subscribe({
      next: (value: any) => {
        this.notifycation.success(`${value.message}, ${value.nombre} ${value.apellido_paterno}.`, 'Éxito')
        this.formLogin.reset();
        //ESTO SE TIENE QUE CONTROLAR DEPENDIENDO DEL ROL
        this.router.navigateByUrl('/pages/dashboard');
      },
      error: (error: Error) => {
          this.notifycation.error(error.message, 'Error');
      }
    })
  }
}
