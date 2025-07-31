import { Component, inject, OnInit } from '@angular/core';
import { ModalChangePasswordComponent } from "./modal-change-password/modal-change-password.component";
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { UserService, UserSession } from '../../../services/user.service';

export interface UserProfile {
  id: number;
  username: string;
  state: string;
  names: string;
  paternal_surname: string;
  maternal_surname: string;
  document_type: string;
  document_number: string;
  phone_number: string;
  email: string;
  address: string;
  birth_date: string;
  gender: 'M' | 'F' | 'O';
  role: string;
  campus_name: string;
  campus_location: string;
}

@Component({
  selector: 'app-profile',
  imports: [ModalChangePasswordComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userProfile?: UserProfile;
  loading = true;
  error?: string;


  //private authService = inject(AuthService);
  private userService = inject(UserService);
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getProfile().subscribe({
      next: profile => {
        this.userProfile = profile;
        this.loading = false;
      },
      error: err => {
        console.error('Error al cargar perfil:', err);
        this.error = 'No se pudo cargar el perfil';
        this.loading = false;
      }
    });
  }


}
