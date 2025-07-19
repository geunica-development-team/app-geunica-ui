import { Component, inject } from '@angular/core';
import { UserProfile } from '../../../admin/services/users.service';
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

    console.log(userId)
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

  //userProfile: UserProfile = {
  //  fullName: "Carlos Echevarria Gutiérrez",
  //  dni: "87654321",
  //  birthDate: "12/05/2008",
  //  gender: "Masculino",
  //  phone: "987654321",
  //  address: "Cuesta fusable bloc 9 Piso 5",
  //  email: "12/05/2008",
  //  studentCode: "Carlos Echevarria Gutiérrez",
  //  enrollmentDate: "12/03/2023",
  //  academicStatus: "Matriculado",
  //  username: "987456932",
  //}

}
