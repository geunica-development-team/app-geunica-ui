import { Component, ElementRef, EventEmitter, inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssignGroupData, GroupOption, PaymentData } from '../../../services/enrollment.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-mark-payment',
  imports: [FormsModule],
  templateUrl: './modal-mark-payment.component.html',
  styleUrl: './modal-mark-payment.component.css'
})
export class ModalMarkPaymentComponent {
  private modalService = inject(NgbModal)

  @Output() paymentMarked = new EventEmitter<PaymentData>()

  // Datos del estudiante (solo lectura)
  currentStudent: any = null

  // Datos del pago
  paymentData = {
    amount: 350,
    paymentDate: "",
    paymentMethod: "Transferencia",
    observations: "",
    generateCredentials: "automatic",
    notifyGuardianBy: "whatsapp",
  }

  // Credenciales generadas automáticamente
  generatedCredentials = {
    username: "",
    password: "",
  }

  // Credenciales manuales
  manualCredentials = {
    username: "",
    password: "",
  }

  // Opciones para dropdowns
  paymentMethods = [
    { value: "Transferencia", label: "Transferencia" },
    { value: "Efectivo", label: "Efectivo" },
    { value: "Tarjeta", label: "Tarjeta de crédito/débito" },
    { value: "Deposito", label: "Depósito bancario" },
    { value: "Cheque", label: "Cheque" },
  ]

  @ViewChild("modalMarkPayment") modalMarkPayment!: TemplateRef<ElementRef>

  openModal(studentData: any) {
    this.currentStudent = studentData

    // Inicializar datos del pago
    this.paymentData = {
      amount: 350,
      paymentDate: this.getCurrentDate(),
      paymentMethod: "Transferencia",
      observations: "",
      generateCredentials: "automatic",
      notifyGuardianBy: "whatsapp",
    }

    // Limpiar credenciales manuales
    this.manualCredentials = {
      username: "",
      password: "",
    }

    // Generar credenciales automáticas iniciales
    this.generateAutomaticCredentials()

    this.modalService.open(this.modalMarkPayment, {
      centered: true,
      size: "lg",
      backdrop: "static",
    })
  }

  getCurrentDate(): string {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Generar credenciales automáticamente basadas en el DNI
  generateAutomaticCredentials() {
    const dni = this.currentStudent?.documentNumber || "12345678"

    // Usuario: número de DNI
    this.generatedCredentials.username = dni

    // Contraseña: DNI + combinación aleatoria
    const randomSuffix = this.generateRandomSuffix()
    this.generatedCredentials.password = dni + randomSuffix
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

  // Cambio en el tipo de generación de credenciales
  onCredentialsTypeChange() {
    if (this.paymentData.generateCredentials === "automatic") {
      this.generateAutomaticCredentials()
    }
  }

  // Copiar texto al portapapeles
  async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      this.showCopyMessage("Copiado al portapapeles")
    } catch (err) {
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement("textarea")
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      this.showCopyMessage("Copiado al portapapeles")
    }
  }

  // Copiar ambas credenciales
  async copyBothCredentials() {
    const credentialsText = `Usuario: ${this.generatedCredentials.username}\nContraseña: ${this.generatedCredentials.password}`
    await this.copyToClipboard(credentialsText)
  }

  // Mostrar mensaje de copiado
  showCopyMessage(message: string) {
    // Crear un elemento temporal para mostrar el mensaje
    const messageDiv = document.createElement("div")
    messageDiv.textContent = message
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      z-index: 9999;
      font-size: 14px;
    `

    document.body.appendChild(messageDiv)

    // Remover el mensaje después de 2 segundos
    setTimeout(() => {
      document.body.removeChild(messageDiv)
    }, 2000)
  }

  onConfirm() {
    // Validaciones básicas
    if (!this.paymentData.amount || this.paymentData.amount <= 0) {
      alert("Por favor ingresa un monto válido")
      return
    }

    if (!this.paymentData.paymentDate) {
      alert("Por favor selecciona una fecha de pago")
      return
    }

    if (!this.paymentData.paymentMethod) {
      alert("Por favor selecciona un método de pago")
      return
    }

    // Validar credenciales según el tipo seleccionado
    let finalCredentials = { username: "", password: "" }

    if (this.paymentData.generateCredentials === "automatic") {
      finalCredentials = { ...this.generatedCredentials }
    } else if (this.paymentData.generateCredentials === "manual") {
      if (!this.manualCredentials.username || !this.manualCredentials.password) {
        alert("Por favor completa las credenciales manuales")
        return
      }
      finalCredentials = { ...this.manualCredentials }
    }

    const paymentInfo: PaymentData = {
      studentId: this.currentStudent.id,
      studentName: this.currentStudent.student,
      level: this.currentStudent.application_level,
      grade: "2do A", // Esto debería venir de los datos del estudiante
      amount: this.paymentData.amount,
      paymentDate: this.paymentData.paymentDate,
      paymentMethod: this.paymentData.paymentMethod,
      observations: this.paymentData.observations,
      generateCredentials: this.paymentData.generateCredentials,
      notifyGuardianBy: this.paymentData.notifyGuardianBy,
      credentials: finalCredentials, // Agregar las credenciales al objeto
    }

    console.log("Datos del pago:", paymentInfo)
    this.paymentMarked.emit(paymentInfo)
    this.modalService.dismissAll()

    // Mostrar mensaje de confirmación
    let message = "Pago marcado exitosamente."

    if (this.paymentData.notifyGuardianBy === "whatsapp") {
      message += " Se enviará notificación por WhatsApp."
    } else if (this.paymentData.notifyGuardianBy === "email") {
      message += " Se enviará notificación por correo electrónico."
    } else {
      message += " No se enviará notificación."
    }

    alert(message)
  }

  onCancel() {
    this.modalService.dismissAll()
  }
}
