import { Component } from '@angular/core';
import { UserProfile } from '../../../admin/services/users.service';
import { ModalChangePasswordComponent } from "./modal-change-password/modal-change-password.component";

@Component({
  selector: 'app-profile',
  imports: [ModalChangePasswordComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  userProfile: UserProfile = {
    fullName: "Carlos Echevarria Gutiérrez",
    dni: "87654321",
    birthDate: "12/05/2008",
    gender: "Masculino",
    phone: "987654321",
    address: "Cuesta fusable bloc 9 Piso 5",
    email: "12/05/2008",
    studentCode: "Carlos Echevarria Gutiérrez",
    enrollmentDate: "12/03/2023",
    academicStatus: "Matriculado",
    username: "987456932",
  }

  //ngOnInit(): void {
  //  this.loadUserProfile()
  //}
//
  //loadUserProfile(): void {
  //  console.log("Cargando perfil del usuario...")
  //}
}
