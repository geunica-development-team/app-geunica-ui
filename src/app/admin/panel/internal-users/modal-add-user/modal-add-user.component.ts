import { Component, ElementRef, EventEmitter, inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CampusService, dataCampusAll } from '../../../services/campus.service';
import { dataRoleAll, RoleService } from '../../../services/role.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../services/user.service';
import { TeacherService } from '../../../services/teacher.service';

@Component({
  selector: 'app-modal-add-user',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './modal-add-user.component.html',
  styleUrl: './modal-add-user.component.css'
})
export class ModalAddUserComponent {
  @Output() internalUserAdded = new EventEmitter<any>()
  
  private modalService = inject(NgbModal)
  private notifycation = inject(ToastrService);
  private toolsForm = inject(FormBuilder);
  private campusService = inject(CampusService);
  private roleService = inject(RoleService);
  private userService = inject(UserService);
  private teacherService = inject(TeacherService);
  
  ngOnInit() {
    this.loadCampus();
    this.loadRoles();
    this.formAddInternalUser.get('manualUsername')?.disable();
    this.formAddInternalUser.get('manualPassword')?.disable();
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
  
  //GENERACIÓN DE CREDENCIALES
  generatedCredentials = {
    username: "",
    password: "",
  }

  get credentialsMode() {
    return this.formAddInternalUser.get('credentialsMode')?.value;
  }
  
  // Cambio en el tipo de generación de credenciales
  onCredentialsTypeChange() {
    const mode = this.formAddInternalUser.get('credentialsMode')?.value;

    if (mode === 'manual') {
      this.formAddInternalUser.get('manualUsername')?.enable();
      this.formAddInternalUser.get('manualPassword')?.enable();
    } else {
      this.formAddInternalUser.get('manualUsername')?.disable();
      this.formAddInternalUser.get('manualPassword')?.disable();
      this.generateAutomaticCredentials(); // por si quieres regenerar en cada cambio
    }
  }

  // Generar credenciales automáticamente basadas en el DNI
  generateAutomaticCredentials() {
    const dni = this.formAddInternalUser.get('documentNumber')?.value?.trim()

    if (dni) {
      this.generatedCredentials.username = dni
      const randomSuffix = this.generateRandomSuffix()
      this.generatedCredentials.password = dni + randomSuffix
    
      this.formAddInternalUser.patchValue({
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
    const credentialsText = `Usuario: ${this.generatedCredentials.username}\nContraseña: ${this.generatedCredentials.password}`
    await this.copyToClipboard(credentialsText)
  }

  formAddInternalUser = this.toolsForm.group({ 
    'role': ['', [Validators.required]],
    'campus': ['', [Validators.required]],
    'state': ['', [Validators.required]],
    'user': ['', [Validators.required]],
    'password': ['', [Validators.required]],
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
    'credentialsMode': ['automatic'],
    'manualUsername': [''],
    'manualPassword': [''],
    'specialty': ['']
  })

  addInternalUser() {
    if (this.formAddInternalUser.invalid) {
      this.notifycation.error('Debes completar todos los campos correctamente', 'Error');
      return;
    }

    const credentialsMode = this.formAddInternalUser.get('credentialsMode')?.value;

    const user =
      credentialsMode === 'automatic'
        ? this.generatedCredentials.username
        : this.formAddInternalUser.get('manualUsername')?.value ?? '';

    const password =
      credentialsMode === 'automatic'
        ? this.generatedCredentials.password
        : this.formAddInternalUser.get('manualPassword')?.value ?? '';

    this.userService.addUser({
      person: {
        names: this.formAddInternalUser.get('names')?.value ?? '',
        paternalSurname: this.formAddInternalUser.get('paternalSurname')?.value ?? '',
        maternalSurname: this.formAddInternalUser.get('maternalSurname')?.value ?? '',
        typeOfIdentityDocument: this.formAddInternalUser.get('typeOfIdentityDocument')?.value ?? '',
        documentNumber: this.formAddInternalUser.get('documentNumber')?.value ?? '',
        birthDate: this.formAddInternalUser.get('birthDate')?.value ?? '',
        gender: this.formAddInternalUser.get('gender')?.value ?? '',
        address: this.formAddInternalUser.get('address')?.value ?? '',
        phoneNumber: this.formAddInternalUser.get('phoneNumber')?.value ?? '',
        email: this.formAddInternalUser.get('email')?.value ?? ''
      },
      idRole: Number(this.formAddInternalUser.get('role')?.value) ?? 0,
      idCampus: Number(this.formAddInternalUser.get('campus')?.value) ?? 0,
      user,
      password,
      state: this.formAddInternalUser.get('state')?.value ?? '',
    }).subscribe({
      next: (value: any) => {
        const selectedRoleId = Number(this.formAddInternalUser.get('role')?.value);
        const teacherRole = this.roles.find(role => role.id === selectedRoleId && role.role === 'teacher');

        if (teacherRole) {
          const specialty = this.formAddInternalUser.get('specialty')?.value ?? '';
          if (!specialty.trim()) {
            this.notifycation.error('Debes ingresar la especialidad del docente', 'Error');
            return;
          }

          const teacherData = {
            idPerson: value.user.person.id,
            specialty
          };

          this.teacherService.createTeacher(teacherData).subscribe({
            next: () => {
              this.notifycation.success('Docente creado correctamente', 'Éxito');
              this.internalUserAdded.emit();
              this.modalService.dismissAll();
              this.formAddInternalUser.reset();
            },
            error: () => {
              this.notifycation.error('Error al crear docente', 'Error');
            }
          });
        } else {
          this.notifycation.success('Usuario agregado correctamente', 'Éxito');
          this.internalUserAdded.emit();
          this.modalService.dismissAll();
          this.formAddInternalUser.reset();
        }
      },
      error: (error: Error) => {
        this.notifycation.error(error.message, 'Error');
      }
    });
  }

  @ViewChild("modalAddInternalUser") modalAddInternalUser!: TemplateRef<ElementRef>

  openModal() {
    this.modalService.open(this.modalAddInternalUser, {
      centered: true,
      size: "xl",
      backdrop: "static",
    })
  }

  get isTeacherRoleSelected(): boolean {
    const selectedRoleId = this.formAddInternalUser.get('role')?.value;
    const teacherRole = this.roles.find(role => role.role === 'teacher');
    return teacherRole ? Number(selectedRoleId) == teacherRole.id : false;
  }

  documentTypes = [
    { id: 1, name: "DNI" },
    { id: 2, name: "Carnet de Extranjería" },
    { id: 3, name: "Pasaporte" },
  ]

  genders = [
    { value: "M", label: "Masculino" },
    { value: "F", label: "Femenino" },
  ]

  statuses = [
    { value: "Active", label: "Activo" },
    { value: "Inactive", label: "Inactivo" },
    { value: "Suspended", label: "Suspendido" },
  ]

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
    this.modalService.dismissAll()
    this.formAddInternalUser.reset(
      {
        credentialsMode: 'automatic',
        typeOfIdentityDocument: '',
        gender: '',
        state: '',
        campus: '',
        role: ''
      }
    )
  }
}
