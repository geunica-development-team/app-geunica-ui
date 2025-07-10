import { Component, ElementRef, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-virtual-enrollment',
  imports: [FormsModule],
  templateUrl: './modal-virtual-enrollment.component.html',
  styleUrl: './modal-virtual-enrollment.component.css'
})
export class ModalVirtualEnrollmentComponent {
  //INYECCIONES
  private modalService = inject(NgbModal)
  @ViewChild("modalVirtualEnrollment") modalVirtualEnrollment!: TemplateRef<ElementRef>

  // DATOS DEL FORMULARIO
  studentData = {
    firstName: "",
    paternalLastName: "",
    maternalLastName: "",
    documentType: "DNI",
    documentNumber: "",
    birthDate: "",
    gender: "",
    phone: "",
    address: "",
    email: "",
    level: "",
    grade: "",
  }

  guardianData = {
    firstName: "",
    paternalLastName: "",
    maternalLastName: "",
    documentType: "DNI",
    documentNumber: "",
    birthDate: "",
    gender: "",
    phone: "",
    address: "",
    email: "",
  }

  currentStep = 1

  openModal() {
    const modalRef = this.modalService.open(this.modalVirtualEnrollment, {
      centered: true,
      size: "xl",
      backdrop: "static",
    })

    // Limpiar datos cuando se cierre el modal
    modalRef.result.then(
      (result) => {
        // Modal cerrado con resultado (botón Cerrar)
        this.clearFormData()
      },
      (dismissed) => {
        // Modal cerrado sin resultado (X, ESC, backdrop)
        this.clearFormData()
      },
    )
  }

  goToStep(step: number) {
    this.currentStep = step
  }

  nextStep() {
    if (this.currentStep < 4) {
      this.currentStep++
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--
    }
  }

  completeEnrollment() {
    this.currentStep = 4

    // Aquí puedes agregar la lógica para enviar los datos al servidor
    const enrollmentData = {
      student: this.studentData,
      guardian: this.guardianData,
      enrollmentDate: new Date().toISOString(),
    }

    console.log("Datos de inscripción:", enrollmentData)

    // TODO: Enviar datos al backend
    // this.enrollmentService.submitEnrollment(enrollmentData).subscribe(...)
  }

  // Método para limpiar todos los datos del formulario
  clearFormData() {
    this.studentData = {
      firstName: "",
      paternalLastName: "",
      maternalLastName: "",
      documentType: "DNI",
      documentNumber: "",
      birthDate: "",
      gender: "",
      phone: "",
      address: "",
      email: "",
      level: "",
      grade: "",
    }

    this.guardianData = {
      firstName: "",
      paternalLastName: "",
      maternalLastName: "",
      documentType: "DNI",
      documentNumber: "",
      birthDate: "",
      gender: "",
      phone: "",
      address: "",
      email: "",
    }

    this.currentStep = 1
  }

  // Método para obtener el nombre completo del estudiante
  getStudentFullName(): string {
    return `${this.studentData.firstName} ${this.studentData.paternalLastName} ${this.studentData.maternalLastName}`.trim()
  }

  // Método para obtener el nombre completo del apoderado
  getGuardianFullName(): string {
    return `${this.guardianData.firstName} ${this.guardianData.paternalLastName} ${this.guardianData.maternalLastName}`.trim()
  }

  // Método para formatear fecha
  formatDate(dateString: string): string {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("es-PE")
  }

  // Método para validar si se puede avanzar al siguiente paso
  canProceedToNextStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return (
          this.studentData.firstName.trim() !== "" &&
          this.studentData.paternalLastName.trim() !== "" &&
          this.studentData.documentNumber.trim() !== "" &&
          this.studentData.level.trim() !== "" &&
          this.studentData.grade.trim() !== ""
        )
      case 2:
        return (
          this.guardianData.firstName.trim() !== "" &&
          this.guardianData.paternalLastName.trim() !== "" &&
          this.guardianData.documentNumber.trim() !== "" &&
          this.guardianData.phone.trim() !== ""
        )
      case 3:
        return true
      default:
        return false
    }
  }
}
