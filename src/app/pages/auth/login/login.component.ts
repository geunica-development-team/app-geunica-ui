import { Component, inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { AuthStorageService } from '../../../services/auth-storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSessionExpiredComponent } from './modal-session-expired/modal-session-expired.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
  
})
export class LoginComponent {

  //INJECCION DE HERRAMIENTAS
  private platformId = inject(PLATFORM_ID);
  private toolsForm = inject(FormBuilder);
  private notifycation = inject(ToastrService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private authStorage = inject(AuthStorageService);
  private activatedRoute = inject(ActivatedRoute);
  private modalService = inject(NgbModal);

  showPassword = false;

  ngOnInit(): void {
    const isBrowser = isPlatformBrowser(this.platformId);

    if (isBrowser) {
      this.activatedRoute.queryParams.subscribe(params => {
        if (params['sessionExpired']) {
          //Se elimina el token
          this.authStorage.logOut();

          this.modalService.open(ModalSessionExpiredComponent, {
            centered: true,
            backdrop: 'static',
            keyboard: false
          })

          //Limpiar el query param para eliminar la "sessionexpired" de la URL
          this.router.navigate([], {
            queryParams: {
              sessionExpired: null
            },
            queryParamsHandling: 'merge',
            replaceUrl: true
          })
        }
      })
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  formLogin = this.toolsForm.group({
    'user': ['', [Validators.required, Validators.minLength(6)]],
    'password': ['', [Validators.required, Validators.minLength(6)]]
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
