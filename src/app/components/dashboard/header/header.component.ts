import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthStorageService } from '../../../services/auth-storage.service';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { UserService, UserSession } from '../../../services/user.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private authStorage = inject(AuthStorageService);
  private userService = inject(UserService);
  private router = inject(Router);


  nameUser() {
    const token = this.authStorage.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      const name = decoded.username;
      return name;
    }
  }

  goProfile() {
    const token = this.authStorage.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      const role = decoded.role;

      if (role === 'admin') {
        this.router.navigateByUrl('/admin/panel/perfil');
      } else if (role === 'student') {
        this.router.navigateByUrl('student/panel/perfil');
      } else if (role === 'psychologist') {
        this.router.navigateByUrl('psychologist/panel/perfil');
      } else {
        this.router.navigateByUrl('/unauthorized');
      }
    }
  }

  logOut() {
    this.authStorage.logOut();
    this.router.navigateByUrl('/auth/login');
  }
}
