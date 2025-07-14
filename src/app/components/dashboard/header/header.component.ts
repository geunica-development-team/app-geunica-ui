import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthStorageService } from '../../../services/auth-storage.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private authStorage = inject(AuthStorageService);
  private router = inject(Router);

  logOut() {
    this.authStorage.logOut();
    this.router.navigateByUrl('/auth/login');
  }
}
