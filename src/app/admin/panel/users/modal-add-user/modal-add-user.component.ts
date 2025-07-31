import { Component, ElementRef, EventEmitter, inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../enviroments/environment';

interface UserData {
  username: string;
  password: string;
  role_id: number;
  status: string;
  first_name: string;
  paternal_lastname: string;
  maternal_lastname: string;
  document_type_id: number;
  document_number: string;
  phone: string;
  email: string;
  address: string;
  birth_date: string;  // ISO yyyy-MM-dd
  gender: 'M'|'F';
  // opcionales según rol:
  specialty?: string;
  specialty_area?: string;
  access_level?: string;
}

@Component({
  selector: 'app-modal-add-user',
  imports: [FormsModule],
  templateUrl: './modal-add-user.component.html',
  styleUrl: './modal-add-user.component.css'
})
export class ModalAddUserComponent {
  private modalService = inject(NgbModal)
  private http         = inject(HttpClient);

  @Output() userCreated = new EventEmitter<UserData>()
  @ViewChild("modalAddUser") modalAddUser!: TemplateRef<ElementRef>

  // Datos del formulario - usando la interfaz extendida
  userData: UserData = {
    username: "",
    password: "",
    role_id: 0,
    status: "Active",
    first_name: "",
    paternal_lastname: "",
    maternal_lastname: "",
    document_type_id: 1,
    document_number: "",
    phone: "",
    email: "",
    address: "",
    birth_date: "",
    gender: "M",
  }

  // Opciones para dropdowns
  roles = [
    { id: 1, name: "administrador", code: "ADMIN" },
    { id: 2, name: "docente", code: "TEACHER" },
    { id: 3, name: "psicólogo", code: "PSYCHOLOGIST" },
    {id: 4, name: "alumno", code: "STUDENT"}
  ]

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

  teacherSpecialties = [
    "Matemáticas",
    "Comunicación",
    "Ciencias Naturales",
    "Ciencias Sociales",
    "Educación Física",
    "Arte",
    "Inglés",
    "Computación",
  ]

  psychologistSpecialtyAreas = [
    "Psicología Educativa",
    "Psicología Clínica",
    "Psicología del Desarrollo",
    "Orientación Vocacional",
  ]

  adminAccessLevels = ["Super Administrador", "Administrador"]

  openModal() {
    // Resetear formulario
    this.resetForm()

    this.modalService.open(this.modalAddUser, {
      centered: true,
      size: "xl",
      backdrop: "static",
    })
  }

  resetForm() {
    this.userData = {
      username: "",
      password: "",
      role_id: 0,
      status: "Active",
      first_name: "",
      paternal_lastname: "",
      maternal_lastname: "",
      document_type_id: 1,
      document_number: "",
      phone: "",
      email: "",
      address: "",
      birth_date: "",
      gender: "M",
    }
  }

  onRoleChange() {
    console.log("Rol cambiado a:", this.userData.role_id)
    console.log("Código del rol:", this.getRoleCode())

    // Limpiar campos específicos cuando cambia el rol
    delete this.userData.specialty
    delete this.userData.specialty_area
    delete this.userData.access_level
  }

  getRoleCode(): string {
    const role = this.roles.find((r) => r.id === Number(this.userData.role_id))
    //console.log("Role encontrado:", role)
    return role ? role.code : ""
  }

  generateUsername() {
    if (this.userData.first_name && this.userData.paternal_lastname) {
      const firstName = this.userData.first_name.toLowerCase().replace(/\s+/g, "")
      const lastName = this.userData.paternal_lastname.toLowerCase().replace(/\s+/g, "")
      const randomNum = Math.floor(Math.random() * 100)
      this.userData.username = `${firstName}.${lastName}${randomNum}`
    }
  }

  generatePassword() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let password = ""
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    this.userData.password = password
  }

    validateForm(): boolean {
    // Validar campos obligatorios
    if (!this.userData.username.trim()) {
      alert("El usuario es obligatorio")
      return false
    }

    if (!this.userData.password.trim()) {
      alert("La contraseña es obligatoria")
      return false
    }

    if (!this.userData.role_id) {
      alert("Debe seleccionar un rol")
      return false
    }

    if (!this.userData.first_name.trim()) {
      alert("Los nombres son obligatorios")
      return false
    }

    if (!this.userData.paternal_lastname.trim()) {
      alert("El apellido paterno es obligatorio")
      return false
    }

    if (!this.userData.document_number.trim()) {
      alert("El número de documento es obligatorio")
      return false
    }

    if (!this.userData.email.trim()) {
      alert("El correo es obligatorio")
      return false
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(this.userData.email)) {
      alert("El correo no tiene un formato válido")
      return false
    }

    // Validaciones específicas por rol
    const roleCode = this.getRoleCode()
    if (roleCode === "TEACHER" && !this.userData.specialty) {
      alert("La especialidad es obligatoria para docentes")
      return false
    }

    if (roleCode === "PSYCHOLOGIST" && !this.userData.specialty_area) {
      alert("El área de especialidad es obligatoria para psicólogas")
      return false
    }

    if (roleCode === "ADMIN" && !this.userData.access_level) {
      alert("El nivel de acceso es obligatorio para administradores")
      return false
    }

    return true
  }

onCreateUser() {
  if (!this.validateForm()) return;

  // 1) Buscamos primero los objetos dropdown
  const dt = this.documentTypes.find(d => d.id === this.userData.document_type_id);
  const roleObj = this.roles.find(r => r.id === this.userData.role_id);

  // 2) Validaciones de existencias
  if (!dt) {
    alert('Tipo de documento inválido');
    return;
  }
  if (!roleObj) {
    alert('Rol inválido');
    return;
  }

  // 3) Construimos el payload
  const payload = {
    // Persona
    names:                  this.userData.first_name,
    paternalSurname:        this.userData.paternal_lastname,
    maternalSurname:        this.userData.maternal_lastname,
    typeOfIdentityDocument: dt.name,               // ya sabemos que existe
    documentNumber:         this.userData.document_number,
    phoneNumber:            this.userData.phone,
    email:                  this.userData.email,
    address:                this.userData.address,
    birthDate:              this.userData.birth_date,
    gender:                 this.userData.gender,

    // Usuario
    user:    this.userData.username,
    password:this.userData.password,
    state:   this.userData.status,

    // Rol y campus
    role: roleObj.name,          // ya sabemos que existe
    idCampus: 1
  };

  // 4) Petición directa
  this.http.post<{ userId: number }>(
    `${environment.apiBase}/user/CreateUser`,
    payload
  )
  .subscribe({
    next: res => {
      alert('Usuario creado con ID ' + res.userId);
      this.modalService.dismissAll();
      this.userCreated.emit();
    },
    error: err => {
      const msg = err.error?.message ?? err.message;
      alert(`Error creando usuario: ${msg}`);
    }
  });
}



  onCancel() {
    this.modalService.dismissAll()
  }
}
