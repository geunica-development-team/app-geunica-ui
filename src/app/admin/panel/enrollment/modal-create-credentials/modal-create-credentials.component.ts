import { Component, ElementRef, EventEmitter, inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CredentialsData } from '../../../services/enrollment.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-create-credentials',
  imports: [FormsModule],
  templateUrl: './modal-create-credentials.component.html',
  styleUrl: './modal-create-credentials.component.css'
})
export class ModalCreateCredentialsComponent {
  private modalService = inject(NgbModal);
  
  @Output() credentialsCreated = new EventEmitter<CredentialsData>();

  // Datos del estudiante (solo lectura)
  currentStudent: any = null;

  // Datos de acceso
  credentialsData = {
    username: '',
    password: '',
    status: 'Activo',
    notifyGuardianBy: 'whatsapp'
  };

  // Opciones para dropdowns
  statusOptions = [
    { value: 'Activo', label: 'Activo' },
    { value: 'Inactivo', label: 'Inactivo' },
    { value: 'Suspendido', label: 'Suspendido' },
    { value: 'Bloqueado', label: 'Bloqueado' }
  ];

  @ViewChild('modalCreateCredentials') modalCreateCredentials!: TemplateRef<ElementRef>;

  openModal(studentData: any) {
    console.log('Abriendo modal de crear credenciales para:', studentData);
    
    this.currentStudent = studentData;
    
    // Generar username y password por defecto
    const studentName = studentData?.student || 'Carlos Zuñiga';
    const defaultUsername = this.generateUsername(studentName);
    const defaultPassword = this.generatePassword();
    
    // Inicializar datos de credenciales
    this.credentialsData = {
      username: defaultUsername,
      password: defaultPassword,
      status: 'Activo',
      notifyGuardianBy: 'whatsapp'
    };

    this.modalService.open(this.modalCreateCredentials, { 
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
  }

  generateUsername(studentName: string): string {
    // Generar username basado en el nombre del estudiante
    const cleanName = studentName.toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9]/g, '');
    
    const randomNum = Math.floor(Math.random() * 100);
    return `${cleanName}${randomNum}@gmail.com`;
  }

  generatePassword(): string {
    // Generar password aleatorio
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  regenerateCredentialsUsername() {
    const studentName = this.currentStudent?.student || 'Carlos Zuñiga';
    this.credentialsData.username = this.generateUsername(studentName);
  }

  regenerateCredentialsPassword() {
    this.credentialsData.password = this.generatePassword();
  }

  onCreateCredentials() {
    // Validaciones básicas
    if (!this.credentialsData.username.trim()) {
      alert('Por favor ingresa un usuario válido');
      return;
    }

    if (!this.credentialsData.password.trim()) {
      alert('Por favor ingresa una contraseña válida');
      return;
    }

    if (this.credentialsData.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Validar formato de email si el username es un email
    if (this.credentialsData.username.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.credentialsData.username)) {
        alert('Por favor ingresa un email válido');
        return;
      }
    }

    const credentialsInfo: CredentialsData = {
      studentId: this.currentStudent.id,
      studentName: this.currentStudent.student,
      level: this.currentStudent.application_level,
      grade: '2do A', // Esto debería venir de los datos del estudiante
      username: this.credentialsData.username,
      password: this.credentialsData.password,
      status: this.credentialsData.status,
      notifyGuardianBy: this.credentialsData.notifyGuardianBy
    };

    console.log('Datos de credenciales:', credentialsInfo);
    this.credentialsCreated.emit(credentialsInfo);
    this.modalService.dismissAll();

    // Mostrar mensaje de confirmación
    alert('Credenciales creadas exitosamente. Se notificará al apoderado.');
  }

  onCancel() {
    this.modalService.dismissAll();
  }
}
