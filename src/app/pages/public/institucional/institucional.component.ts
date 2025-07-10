import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ModalVirtualEnrollmentComponent } from './modal-virtual-enrollment/modal-virtual-enrollment.component';

@Component({
  selector: 'app-institucional',
  imports: [ModalVirtualEnrollmentComponent],
  templateUrl: './institucional.component.html',
  styleUrl: './institucional.component.css'
})
export class InstitucionalComponent {
  private router = inject(Router)
  
  title = "GEÚNICA"

  // Método para scroll suave a secciones
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Método para manejar envío de formulario
  onSubmitForm(event: Event): void {
    event.preventDefault()
    console.log("Formulario enviado")
    alert("¡Mensaje enviado correctamente! Te contactaremos pronto.")
  }

  // Método para manejar inscripción
  onInscribirse(): void {
    this.router.navigate(["/public/virtual-enrollment"])
  }

  // Método para más información
  onMasInformacion(): void {
    this.scrollToSection("contacto")
  }

  goLogin(): void {
    this.router.navigate(["/auth/login"])
  }
}
