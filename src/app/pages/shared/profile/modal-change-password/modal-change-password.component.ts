import { Component, ElementRef, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../services/user.service';
import { error } from 'console';

@Component({
  selector: 'app-modal-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-change-password.component.html',
  styleUrl: './modal-change-password.component.css'
})
export class ModalChangePasswordComponent {
  //INYECCIONES
  private modalService = inject(NgbModal);
  private toolsForm = inject(FormBuilder);
  private notifycation = inject(ToastrService);
  private userService = inject(UserService);

  @ViewChild('modalChangePassword') modalChangePassword!: TemplateRef<ElementRef>;  

  formChangePassword = this.toolsForm.group({
    'currentPassword': ['', [Validators.required, Validators.minLength(6)]],
    'newPassword': ['', [Validators.required, Validators.minLength(6)]],
    'confirmNewPassword': ['', [Validators.required, Validators.minLength(6)]]
  })

  changePassword() {
    if (this.formChangePassword.invalid) {
      this.notifycation.error('Debes completar todos los campos correctamente', 'Error')
      return;
    }
    this.userService.changePassword({
      currentPassword: this.formChangePassword.get('currentPassword')?.value ?? '',
      newPassword: this.formChangePassword.get('confirmNewPassword')?. value ?? ''
    }).subscribe({
      next: (value:any) => {
        this.notifycation.success('Contraseña actualizada con éxito', 'Éxito')
        this.modalService.dismissAll();
        this.formChangePassword.reset();
      },
      error: (error: Error) => {
        this.notifycation.error(error.message, 'Error');
      }
    })
  }

  openModal() {
    this.modalService.open(this.modalChangePassword, { 
      centered: true,
      size: 'md',
      backdrop: 'static'
    });
  }

  onCancel() {
    this.formChangePassword.reset();
    this.modalService.dismissAll();
  }
}
