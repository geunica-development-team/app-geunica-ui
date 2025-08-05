import { Component, ElementRef, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { dataUser, UserService } from '../../../services/user.service';
import { CampusService, dataCampusAll } from '../../../services/campus.service';
import { dataRoleAll, RoleService } from '../../../services/role.service';
import { TeacherService } from '../../../services/teacher.service';

@Component({
  selector: 'app-modal-edit-user',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-edit-user.component.html',
  styleUrl: './modal-edit-user.component.css'
})
export class ModalEditUserComponent {
  @Output() internalUserEdited = new EventEmitter<any>()
  @Input() rowId!: number;

  private modalService = inject(NgbModal)
  private notifycation = inject(ToastrService);
  private toolsForm = inject(FormBuilder);
  private userService = inject(UserService);
  private campusService = inject(CampusService);
  private roleService = inject(RoleService);
  private teacherService = inject(TeacherService);

  ngOnInit() {
    this.formEditInternalUser.get('password')?.clearValidators();

    this.formEditInternalUser.get('role')?.valueChanges.subscribe(roleId => {
      const selectedRole = this.roles.find(r => r.id === Number(roleId));
      const isTeacher = selectedRole?.role === 'teacher';

      const specialtyControl = this.formEditInternalUser.get('specialty');

      if (isTeacher) {
        specialtyControl?.setValidators([Validators.required]);
      } else {
        specialtyControl?.clearValidators();
        specialtyControl?.setValue('');
      }

      specialtyControl?.updateValueAndValidity();
    });
  }

  campus: dataCampusAll[] = []
  loadCampus() {
    this.campusService.getAllCampus().subscribe({
      next: (value) => {
        this.campus = value;
      },
      error: (error: Error) => {
        console.error('Error al cargar las sedes', error);
      }
    })
  }

  roles: dataRoleAll[] = []
  loadRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (value) => {
        this.roles = value;
      },
      error: (error: Error) => {
        console.error('Error al cargar los roles', error);
      }
    })
  }

  showResetPasswordField: boolean = false;

  //GENERACIÓN DE CREDENCIALES
  generatedCredentials = {
    username: "",
    password: "",
  }

  get credentialsMode() {
    return this.formEditInternalUser.get('credentialsMode')?.value;
  }
  
  // Cambio en el tipo de generación de credenciales
  onCredentialsTypeChange() {
    const mode = this.formEditInternalUser.get('credentialsMode')?.value;

    if (mode === 'manual') {
      this.formEditInternalUser.get('manualUsername')?.enable();
      this.formEditInternalUser.get('manualPassword')?.enable();
    } else {
      this.formEditInternalUser.get('manualUsername')?.disable();
      this.formEditInternalUser.get('manualPassword')?.disable();
      this.generateAutomaticCredentials(); // por si quieres regenerar en cada cambio
    }
  }

  // Generar credenciales automáticamente basadas en el DNI
  generateAutomaticCredentials() {
    const dni = this.formEditInternalUser.get('documentNumber')?.value?.trim()

    if (dni) {
      this.generatedCredentials.username = dni
      const randomSuffix = this.generateRandomSuffix()
      this.generatedCredentials.password = dni + randomSuffix
    
      this.formEditInternalUser.patchValue({
        user: this.generatedCredentials.username,
        password: this.generatedCredentials.username
      })
    }
  }
  
  // Generar sufijo aleatorio para la contraseña
  generateRandomSuffix(): string {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const numbers = "0123456789"

    // Generar 2 letras aleatorias y 2 números aleatorios
    let suffix = ""

    // 2 letras
    for (let i = 0; i < 2; i++) {
      suffix += letters.charAt(Math.floor(Math.random() * letters.length))
    }

    // 2 números
    for (let i = 0; i < 2; i++) {
      suffix += numbers.charAt(Math.floor(Math.random() * numbers.length))
    }

    return suffix
  }

  // Regenerar credenciales automáticas
  regenerateCredentials() {
    this.generateAutomaticCredentials()
  }


  // Copiar texto al portapapeles
  async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      this.notifycation.success('Copiado al portapapeles')
    } catch (err) {
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement("textarea")
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      this.notifycation.success('Copiado al portapapeles')
    }
  }

  // Copiar ambas credenciales
  async copyBothCredentials() {
    const user = this.formEditInternalUser.get('user')?.value;
    const pass = this.formEditInternalUser.get('password')?.value;
    const credentialsText = `Usuario: ${user}\nContraseña: ${pass}`;
    await this.copyToClipboard(credentialsText);
  }

  formEditInternalUser = this.toolsForm.group({ 
    'role': [0, [Validators.required]],
    'campus': [0, [Validators.required]],
    'state': ['', [Validators.required]],
    'names': ['', [Validators.required]],
    'paternalSurname': ['', [Validators.required]],
    'maternalSurname': ['', [Validators.required]],
    'typeOfIdentityDocument': ['', [Validators.required]],
    'documentNumber': ['', [Validators.required]],
    'phoneNumber': ['', [Validators.required]],
    'email': ['', [Validators.required, Validators.email]],
    'address': ['', [Validators.required]],
    'birthDate': ['', [Validators.required]],
    'gender': ['', [Validators.required]],
    'user': ['', [Validators.required]],
    'password': ['', [Validators.required]],
    'specialty': ['']
  })

  userFullName: string = '';

  teacherId: number | null = null;

  personId: number | null = null;

  previousRole: string | null = null;

  roleSelected: string | null = null;

  loadUserDetails() {
    if (this.rowId && !isNaN(this.rowId)) {
      console.log(this.rowId)
      this.userService.getUserById(this.rowId).subscribe({
        next: (user) => {

          this.teacherId = user.person?.teacher?.id ?? null;

          this.personId = user.person?.id ?? null;

          this.previousRole = user.role?.role ?? null;

          const names = user.person?.names ?? '';
          const paternal = user.person?.paternalSurname ?? '';
          const maternal = user.person?.maternalSurname ?? '';
          this.userFullName = `${names} ${paternal} ${maternal}`;

          this.formEditInternalUser.patchValue({
            role: user.role?.id,
            campus: user.campus?.id,
            state: user.state,
            
            names: user.person?.names,
            paternalSurname: user.person?.paternalSurname,
            maternalSurname: user.person?.maternalSurname,
            typeOfIdentityDocument: user.person?.typeOfIdentityDocument,
            documentNumber: user.person?.documentNumber,
            phoneNumber: user.person?.phoneNumber,
            email: user.person?.email,
            address: user.person?.address,
            birthDate: user.person?.birthDate,
            gender: user.person?.gender,
            user: user.user,
            password: '',
            specialty: user.person?.teacher?.specialty ?? ''
          });
        },
        error: (error) => {
          this.notifycation.error('Error al cargar los detalles del usuario', 'Error')
        }
      })
    } else {
      this.notifycation.error('ID del usuario inválido', 'Error');
    }
  }

  updateInternalUser() {
    if (this.formEditInternalUser.invalid) {
      this.notifycation.error('Debes completar todos los campos correctamente', 'Error');
      return;
    }

    if (this.formEditInternalUser.valid && this.rowId) {
      const updatedUser: dataUser = {
        person: {
          names: this.formEditInternalUser.get('names')?.value ?? '',
          paternalSurname: this.formEditInternalUser.get('paternalSurname')?.value ?? '',
          maternalSurname: this.formEditInternalUser.get('maternalSurname')?.value ?? '',
          typeOfIdentityDocument: this.formEditInternalUser.get('typeOfIdentityDocument')?.value ?? '',
          documentNumber: this.formEditInternalUser.get('documentNumber')?.value ?? '',
          birthDate: this.formEditInternalUser.get('birthDate')?.value ?? '',
          gender: this.formEditInternalUser.get('gender')?.value ?? '',
          address: this.formEditInternalUser.get('address')?.value ?? '',
          phoneNumber: this.formEditInternalUser.get('phoneNumber')?.value ?? '',
          email: this.formEditInternalUser.get('email')?.value ?? '',
        },
        user: this.formEditInternalUser.get('user')?.value ?? '',
        state: this.formEditInternalUser.get('state')?.value ?? '',
        idCampus: Number(this.formEditInternalUser.get('grade')?.value) ?? 0,
        idRole: Number(this.formEditInternalUser.get('role')?.value) ?? 0,

        ...(this.showResetPasswordField && {
          password: this.formEditInternalUser.get('password')?.value ?? ''
        })
      };

      const selectedRoleId = Number(this.formEditInternalUser.get('role')?.value);
      const selectedRole = this.roles.find(role => role.id === selectedRoleId)
      const selectedRoleName = selectedRole?.role ?? null;

      const previousRole = this.previousRole;

      const newRole = selectedRoleName;
      if (previousRole === 'teacher' && newRole !== 'teacher' && this.teacherId) {
        this.teacherService.deleteTeacher(this.teacherId).subscribe({
          next: () => {
            console.log('Docente eliminado o desactivado exitosamente');
          },
          error: (err) => {
            this.notifycation.error('Error al eliminar o desactivar al docente', 'Error');
          }
        });
      }
      
      this.userService.updateUser(this.rowId, updatedUser).subscribe({
        next: (value: any) => {
          
          const teacherRole = this.roles.find(role => role.id === selectedRoleId && role.role === 'teacher');
          
          const specialty = this.formEditInternalUser.get('specialty')?.value ?? '';
          
          if (teacherRole) {
            if (!specialty.trim()) {
              this.notifycation.error('Debes ingresar la especialidad del docente', 'Error');
              return;
            }

            const teacherData = {
              specialty: specialty.trim()
            }

            if (this.teacherId) {
              this.teacherService.updateTeacher(this.teacherId, teacherData).subscribe({
                next: () => {
                  this.notifycation.success('Docente actualizado correctamente', 'Éxito');
                  this.internalUserEdited.emit();
                  this.modalService.dismissAll();
                  this.formEditInternalUser.reset();
                },
                error: (err) => {
                  this.notifycation.error('Error al actualizar datos del docente', 'Error');
                }
              });
            } else {

              const teacherCreationData = {
                idPerson: this.personId ?? undefined,
                specialty: specialty.trim()
              };
  
              if (!this.personId) {
                this.notifycation.error('No se pudo obtener el ID de la persona', 'Error');
                return;
              }
              
              this.teacherService.createTeacher(teacherCreationData).subscribe({
                next: () => {
                  this.notifycation.success('Docente creado correctamente', 'Éxito');
                  this.internalUserEdited.emit();
                  this.modalService.dismissAll();
                  this.formEditInternalUser.reset();
                },
                error: () => {
                  this.notifycation.error('Error al crear docente', 'Error')
                }
              });
            }
          } else {
            this.notifycation.success(`Usuario actualizado con éxito.`, 'Éxito');
            this.internalUserEdited.emit();
            this.modalService.dismissAll();
            this.formEditInternalUser.reset();
          }
        },
        error: (error: Error) => {
          this.notifycation.error(error.message, 'Error')
        }
      })
    } else {
      this.notifycation.error('Debes completar todos los campos correctamente', 'Error');
    }
  }

  get isTeacherRoleSelected(): boolean {
    const selectedRoleId = this.formEditInternalUser.get('role')?.value;
    const teacherRole = this.roles.find(role => role.role === 'teacher');
    return teacherRole ? Number(selectedRoleId) == teacherRole.id : false;
  }

  @ViewChild('modalEditInternalUser') modalEditInternalUser!: TemplateRef<ElementRef>;

  openModal() {
    this.loadCampus();
    this.loadRoles();
    this.loadUserDetails();

    this.showResetPasswordField = false;

    this.modalService.open(this.modalEditInternalUser, {
      centered: true,
      size: 'xl',
      backdrop: 'static'
    });
  }

  getRoleText(role: string): string {
    switch (role) {
      case "admin":
        return "Administrador"
      case "student":
        return "Estudiante"
      case "teacher":
        return "Docente"
      case "psychologist":
        return "Psicólogo/a"
      default:
        return role
    }
  }

  onCancel() {
    this.modalService.dismissAll();
  }
}
