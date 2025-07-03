import { Component, ElementRef, EventEmitter, inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserData } from '../../../services/users.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-add-user',
  imports: [FormsModule],
  templateUrl: './modal-add-user.component.html',
  styleUrl: './modal-add-user.component.css'
})
export class ModalAddUserComponent {
  private modalService = inject(NgbModal)

  @Output() userCreated = new EventEmitter<UserData>()

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
    { id: 1, name: "Administrador", code: "ADMIN" },
    { id: 2, name: "Docente", code: "TEACHER" },
    { id: 3, name: "Psicóloga", code: "PSYCHOLOGIST" }
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

  adminAccessLevels = ["Super Administrador", "Administrador", "Administrador Limitado"]

  @ViewChild("modalAddUser") modalAddUser!: TemplateRef<ElementRef>

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
    console.log("Role encontrado:", role)
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

  onCreateUser() {
    // Validaciones básicas
    if (!this.validateForm()) {
      return
    }

    console.log("Creando usuario:", this.userData)
    this.userCreated.emit(this.userData)
    this.modalService.dismissAll()

    alert("Usuario creado exitosamente")
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

  onCancel() {
    this.modalService.dismissAll()
  }
}
