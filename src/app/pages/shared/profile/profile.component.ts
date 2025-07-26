import { Component, inject } from '@angular/core';
import { ModalChangePasswordComponent } from "./modal-change-password/modal-change-password.component";
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { UserService, UserSession } from '../../../services/user.service';

@Component({
  selector: 'app-profile',
  imports: [ModalChangePasswordComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  userProfile!: UserSession;

  ngOnInit(): void {
    const tokenDecoded = this.authService.getDecodedToken();
    const userId = tokenDecoded?.id;
    if (userId) {
      this.loadUserProfile(userId);
    }
  }

  loadUserProfile(userId: number): void {
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.userProfile = user;
      },
      error: (error) => {
        console.error('Error al cargar perfil de usuario: ', error);
      }
    })
  }
}
