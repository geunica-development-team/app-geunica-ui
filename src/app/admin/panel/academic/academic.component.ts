import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface DocumentType {
  value: string;
  label: string;
}

interface UserRole {
  value: string;
  label: string;
  description: string;
}

@Component({
  selector: 'app-academic',
  imports: [ReactiveFormsModule],
  templateUrl: './academic.component.html',
  styleUrl: './academic.component.css'
})
export class AcademicComponent {
  userForm: FormGroup;
  isEditMode: boolean = false;
  
  documentTypes: DocumentType[] = [
    { value: 'DNI', label: 'DNI' },
    { value: 'CE', label: 'Carné de Extranjería' },
    { value: 'PASSPORT', label: 'Pasaporte' },
    { value: 'OTHER', label: 'Otro' }
  ];
  
  genderOptions = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
    { value: 'OTHER', label: 'Otro' }
  ];
  
  userRoles: UserRole[] = [
    { 
      value: 'admin', 
      label: 'Administrador', 
      description: 'Acceso completo al sistema, puede gestionar usuarios y configuraciones' 
    },
    { 
      value: 'student', 
      label: 'Estudiante', 
      description: 'Acceso a contenido académico, calificaciones y actividades estudiantiles' 
    },
    { 
      value: 'teacher', 
      label: 'Docente', 
      description: 'Acceso a gestión de clases, calificaciones y contenido educativo' 
    }
  ];
  
  statusOptions = [
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' }
  ];
  
  specialties = [
    'Matemáticas',
    'Lengua y Literatura',
    'Ciencias Naturales',
    'Historia y Geografía',
    'Educación Física',
    'Inglés',
    'Arte y Cultura',
    'Tecnología e Informática',
    'Filosofía',
    'Química',
    'Física',
    'Biología'
  ];
  
  constructor(private fb: FormBuilder) {
    this.userForm = this.createForm();
  }
  
  ngOnInit(): void {
    // Suscribirse a cambios en el rol para mostrar/ocultar campos específicos
    this.userForm.get('role')?.valueChanges.subscribe(role => {
      this.updateFormValidators(role);
    });
  }
  
  createForm(): FormGroup {
    return this.fb.group({
      // Datos personales
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      paternalLastName: ['', [Validators.required, Validators.minLength(2)]],
      maternalLastName: ['', [Validators.required, Validators.minLength(2)]],
      documentType: ['DNI', Validators.required],
      documentNumber: ['', [Validators.required, Validators.minLength(8)]],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      address: ['', Validators.required],
      personalEmail: ['', [Validators.required, Validators.email]],
      
      // Cuenta de usuario
      loginEmail: ['', [Validators.required, Validators.email]],
      password: [''],
      accountStatus: ['active', Validators.required],
      lastLogin: [{ value: '', disabled: true }],
      
      // Rol del usuario
      role: ['student', Validators.required],
      roleDescription: [{ value: '', disabled: true }],
      
      // Campos específicos para estudiante
      studentCode: [''],
      enrollmentDate: [''],
      studentStatus: ['active'],
      
      // Campos específicos para docente
      specialty: ['']
    });
  }
  
  updateFormValidators(role: string): void {
    const studentCode = this.userForm.get('studentCode');
    const enrollmentDate = this.userForm.get('enrollmentDate');
    const specialty = this.userForm.get('specialty');
    
    // Limpiar validadores existentes
    studentCode?.clearValidators();
    enrollmentDate?.clearValidators();
    specialty?.clearValidators();
    
    // Agregar validadores según el rol
    if (role === 'student') {
      studentCode?.setValidators([Validators.required]);
      enrollmentDate?.setValidators([Validators.required]);
    } else if (role === 'teacher') {
      specialty?.setValidators([Validators.required]);
    }
    
    // Actualizar descripción del rol
    const selectedRole = this.userRoles.find(r => r.value === role);
    this.userForm.patchValue({
      roleDescription: selectedRole?.description || ''
    });
    
    // Actualizar validación
    studentCode?.updateValueAndValidity();
    enrollmentDate?.updateValueAndValidity();
    specialty?.updateValueAndValidity();
  }
  
  onSubmit(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      console.log('Datos del formulario:', formData);
      // Aquí enviarías los datos al backend
    } else {
      this.markFormGroupTouched();
    }
  }
  
  markFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
  
  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Este campo es obligatorio';
      if (field.errors['email']) return 'Ingrese un email válido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) return 'Formato inválido';
    }
    return '';
  }
  
  get selectedRole(): string {
    return this.userForm.get('role')?.value || '';
  }
  
  get isStudent(): boolean {
    return this.selectedRole === 'student';
  }
  
  get isTeacher(): boolean {
    return this.selectedRole === 'teacher';
  }
  
  onCancel(): void {
    this.userForm.reset();
  }
  
  generateStudentCode(): void {
    const currentYear = new Date().getFullYear();
    const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const studentCode = `EST${currentYear}${randomNumber}`;
    this.userForm.patchValue({ studentCode });
  }
}
