import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../enviroments/environment';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { FormsModule } from '@angular/forms';
import { AuthStorageService } from '../../../services/auth-storage.service';
import { firstValueFrom } from 'rxjs';

export type Status = 'presente' | 'ausente' | 'tardanza' | 'sin_registro';

@Component({
  selector: 'app-attendance-list',
  imports: [CommonModule, PanelHeaderComponent, FormsModule],
  templateUrl: './attendance-list.component.html',
  styleUrl: './attendance-list.component.css'
})
export class AttendanceListComponent implements OnInit {

  days = ['Lunes','Martes','Miércoles','Jueves','Viernes'];
  allStatuses: Status[] = ['presente','ausente','tardanza','sin_registro'];

  students: any[] = [];
  caId!: number;
  
  // PROPIEDADES PARA NAVEGACIÓN DE SEMANAS
  currentWeekInfo: any = null;
  availableWeeks: any[] = [];
  selectedWeekStart: string = '';
  periodInfo: any = null;
  isLoading = false;
  
  private baseUrl = environment.apiBase;
  private attendanceMap = new Map<string, any>();

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authStorage: AuthStorageService
  ) {}

  ngOnInit(): void {
    this.caId = +this.route.snapshot.paramMap.get('id_salon')!;
    console.log('🔍 caId extraído de la ruta:', this.caId);
    this.loadWeeksAndAttendance();
  }

  // MÉTODO PRINCIPAL: Cargar semanas disponibles y asistencias
  private async loadWeeksAndAttendance(): Promise<void> {
    this.isLoading = true;
    
    try {
      // 1. Primero cargar semanas disponibles
      await this.loadAvailableWeeks();
      
      // 2. Luego cargar asistencias de la semana actual
      await this.loadAttendance();
      
    } catch (error) {
      console.error('❌ Error en la carga inicial:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // CARGAR SEMANAS DISPONIBLES
  private loadAvailableWeeks(): Promise<void> {
    const token = this.authStorage.getToken();
    const headers = token ? { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) } : {};

    const url = `${this.baseUrl}/attendance/teacher/assignment/${this.caId}/weeks`;
    console.log('📅 Cargando semanas disponibles:', url);

    return this.http.get<any>(url, headers).toPromise().then((response) => {
      console.log('📊 Semanas disponibles:', response);
      
      this.currentWeekInfo = response.currentWeek;
      this.availableWeeks = response.availableWeeks;
      this.periodInfo = response.periodInfo;
      
      // Establecer semana actual como seleccionada
      this.selectedWeekStart = this.currentWeekInfo.weekStart;
      
      console.log('✅ Semana seleccionada:', this.selectedWeekStart);
    }).catch((error) => {
      console.error('❌ Error al cargar semanas:', error);
      throw error;
    });
  }

  // 🔄 CARGAR ASISTENCIAS CORREGIDO
  private async loadAttendance(weekStart?: string): Promise<void> {
    const token = this.authStorage.getToken();
    const headers = token ? { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) } : {};

    const week = weekStart || this.selectedWeekStart;
    const url = week 
      ? `${this.baseUrl}/attendance/teacher/assignment/${this.caId}/attendance?week=${week}`
      : `${this.baseUrl}/attendance/teacher/assignment/${this.caId}/attendance`;

    console.log('📡 Cargando asistencias:', url);

    try {
      const response = await firstValueFrom(this.http.get<any[]>(url, headers));
      const data = response ?? [];
      console.log('📊 Respuesta del backend:', data);
      this.buildStudentGrid(data);
    } catch (error: any) {
      console.error('❌ Error al cargar asistencias:', error);
      if (error.status === 401) {
        alert('Error de autenticación. Por favor, inicia sesión nuevamente.');
      } else if (error.status === 400 && error.error?.message?.includes('período académico')) {
        alert('La semana seleccionada está fuera del período académico');
      } else {
        alert('Error al cargar las asistencias');
      }
      throw error;
    }
  }

  // 🔄 BUILD STUDENT GRID CORREGIDO
  private buildStudentGrid(studentsData: any[]) {
    console.log('🏗️ Construyendo grid con datos:', studentsData);
    this.attendanceMap.clear();

    this.students = studentsData.map(studentData => {
      const student = studentData.student;
      const user = studentData.user;
      const attendances = studentData.attendances || [];

      console.log(`   👤 Procesando: ${student.person.names} ${student.person.paternalSurname}`);
      console.log(`      - Tiene usuario: ${studentData.hasUser}`);
      console.log(`      - Asistencias:`, attendances);

      // Crear registro para cada día de la semana
      const records = this.days.map((day, dayIndex) => {
        // 🚀 CORRECCIÓN: Asegurar que siempre empecemos desde el lunes
        const weekStartDate = new Date(this.selectedWeekStart + 'T00:00:00');
        
        // Si selectedWeekStart no es lunes, ajustar al lunes de esa semana
        const dayOfWeek = weekStartDate.getDay(); // 0=domingo, 1=lunes, etc.
        const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Ajustar al lunes
        weekStartDate.setDate(weekStartDate.getDate() + daysToMonday);
        
        // Ahora calcular el día específico (lunes + dayIndex)
        const dayDate = new Date(weekStartDate);
        dayDate.setDate(weekStartDate.getDate() + dayIndex);
        const dayDateString = dayDate.toISOString().split('T')[0];

        console.log(`      📅 Procesando día ${dayIndex} (${day}): ${dayDateString}`);
        console.log(`         - selectedWeekStart: ${this.selectedWeekStart}`);
        console.log(`         - weekStartDate ajustado: ${weekStartDate.toISOString().split('T')[0]}`);

        // Buscar asistencia para esta fecha específica
        const attendance = attendances.find((att: any) => {
          const match = att.attendanceDate === dayDateString;
          console.log(`         - Comparando: ${att.attendanceDate} === ${dayDateString} → ${match}`);
          return match;
        });

        if (attendance) {
          console.log(`         ✅ Asistencia encontrada:`, attendance);
          // Hay registro de asistencia - MAPEO CORREGIDO
          const status = this.mapBackendStatusToFrontend(attendance.status);
          const key = `${user?.id || 'no-user'}-${dayDateString}`;
          this.attendanceMap.set(key, attendance);
          
          return {
            day,
            dayDate: dayDateString,
            status,
            attendanceId: attendance.id,
            originalAttendance: attendance,
            hasRecord: true
          };
        } else {
          console.log(`         ❌ Sin asistencia para ${dayDateString}`);
          // No hay registro de asistencia
          return {
            day,
            dayDate: dayDateString,
            status: 'sin_registro' as Status,
            attendanceId: null,
            originalAttendance: null,
            hasRecord: false
          };
        }
      });

      return {
        id: user?.id || student.id,
        studentId: student.id,
        userId: user?.id || null,
        name: `${student.person.names} ${student.person.paternalSurname} ${student.person.maternalSurname}`,
        hasUser: studentData.hasUser,
        records
      };
    });

    console.log('✅ Grid construido:', this.students);
    console.log('🗺️ Mapa de asistencias:', this.attendanceMap);
  }

  // 🔄 MAPEOS CORREGIDOS
  private mapBackendStatusToFrontend(backendStatus: string): Status {
    console.log(`🔄 Mapeando status backend "${backendStatus}" a frontend`);
    
    const statusMap: { [key: string]: Status } = {
      'present': 'presente',
      'absent': 'ausente', 
      'late': 'tardanza',
    };
    
    const mapped = statusMap[backendStatus] || 'sin_registro';
    console.log(`   -> Resultado: "${mapped}"`);
    return mapped;
  }

  private mapFrontendStatusToBackend(frontendStatus: Status): string {
    console.log(`🔄 Mapeando status frontend "${frontendStatus}" a backend`);
    
    const statusMap: { [key in Status]: string } = {
      'presente': 'present',
      'ausente': 'absent',
      'tardanza': 'late',
      'sin_registro': 'absent' // Fallback
    };
    
    const mapped = statusMap[frontendStatus] || 'absent';
    console.log(`   -> Resultado: "${mapped}"`);
    return mapped;
  }

  // 🔄 UPDATE STATUS COMPLETAMENTE CORREGIDO
  updateStatus(studentId: number, dayIndex: number, newStatus: Status): void {
    console.log(`🔄 Actualizando estado: Estudiante ${studentId}, Día ${dayIndex}, Nuevo estado: ${newStatus}`);
    
    const student = this.students.find(s => s.id === studentId);
    if (!student || !student.records[dayIndex]) {
      console.error('❌ Estudiante o registro no encontrado');
      return;
    }

    const record = student.records[dayIndex];
    console.log('📋 Record actual:', record);
    
    // Verificar si el estudiante tiene usuario
    if (!student.hasUser) {
      console.warn('⚠️ Estudiante sin usuario, no se puede registrar asistencia');
      alert('Este estudiante no tiene usuario registrado en el sistema');
      return;
    }

    // 🆕 LÓGICA MEJORADA PARA DETERMINAR ACCIÓN
    const hasExistingAttendance = record.hasRecord && record.attendanceId;
    
    console.log(`📊 Estado actual:
      - hasRecord: ${record.hasRecord}
      - attendanceId: ${record.attendanceId}
      - hasExistingAttendance: ${hasExistingAttendance}
      - newStatus: ${newStatus}`);

    if (newStatus === 'sin_registro') {
      // ELIMINAR asistencia si existe
      if (hasExistingAttendance) {
        this.deleteAttendance(record.attendanceId, record);
      } else {
        // Ya está sin registro, solo actualizar UI
        record.status = 'sin_registro';
        record.hasRecord = false;
      }
    } else if (hasExistingAttendance) {
      // ACTUALIZAR asistencia existente
      this.updateExistingAttendance(record.attendanceId, newStatus, record);
    } else {
      // CREAR nueva asistencia
      this.createNewAttendance(student.userId, record.dayDate, newStatus, record);
    }
  }

  // 🆕 ELIMINAR ASISTENCIA
  private deleteAttendance(attendanceId: number, record: any): void {
    const token = this.authStorage.getToken();
    const headers = token ? { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) } : {};

    console.log(`🗑️ Eliminando asistencia ${attendanceId}`);

    this.http.delete(`${this.baseUrl}/attendance/${attendanceId}`, headers).subscribe({
      next: (response) => {
        console.log('✅ Asistencia eliminada:', response);
        
        // Actualizar record
        record.status = 'sin_registro';
        record.attendanceId = null;
        record.hasRecord = false;
        record.originalAttendance = null;
        
        // Actualizar mapa
        this.attendanceMap.delete(`${record.userId}-${record.dayDate}`);
      },
      error: (err) => {
        console.error('❌ Error al eliminar asistencia:', err);
        alert(`Error al eliminar asistencia: ${err.error?.message || err.message}`);
      }
    });
  }

  // 🔄 ACTUALIZAR ASISTENCIA MEJORADO
  private updateExistingAttendance(attendanceId: number, newStatus: Status, record: any): void {
    const token = this.authStorage.getToken();
    const headers = token ? { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) } : {};
    
    const updateData = {
      status: this.mapFrontendStatusToBackend(newStatus),
      remarks: ''
    };

    console.log(`📝 Actualizando asistencia ${attendanceId}:`, updateData);

    this.http.patch(`${this.baseUrl}/attendance/${attendanceId}`, updateData, headers).subscribe({
      next: (response: any) => {
        console.log('✅ Asistencia actualizada:', response);
        
        // Actualizar record
        record.status = newStatus;
        record.hasRecord = true;
        record.originalAttendance = response;
        
        // Actualizar mapa
        const key = `${record.userId}-${record.dayDate}`;
        this.attendanceMap.set(key, response);
      },
      error: (err) => {
        console.error('❌ Error al actualizar asistencia:', err);
        alert(`Error al actualizar asistencia: ${err.error?.message || err.message}`);
        
        // Revertir estado en caso de error
        this.reloadCurrentWeek();
      }
    });
  }

  // 🔄 CREAR ASISTENCIA MEJORADO
  private createNewAttendance(userId: number, dayDate: string, newStatus: Status, record: any): void {
    const token = this.authStorage.getToken();
    const headers = token ? { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) } : {};
    
    const createData = {
      userId: userId,
      attendanceDate: dayDate,
      status: this.mapFrontendStatusToBackend(newStatus),
      timeIn: newStatus === 'presente' ? new Date().toTimeString().split(' ')[0] : null,
      remarks: ''
    };

    console.log(`➕ Creando nueva asistencia:`, createData);

    this.http.post(`${this.baseUrl}/attendance`, createData, headers).subscribe({
      next: (response: any) => {
        console.log('✅ Nueva asistencia creada:', response);
        
        // Actualizar record
        record.status = newStatus;
        record.attendanceId = response.id;
        record.hasRecord = true;
        record.originalAttendance = response;
        
        // Actualizar mapa
        const key = `${userId}-${dayDate}`;
        this.attendanceMap.set(key, response);
      },
      error: (err) => {
        console.error('❌ Error al crear asistencia:', err);
        
        // Mensaje de error más específico
        if (err.error?.message?.includes('Ya existe una asistencia')) {
          alert('Ya existe una asistencia para este día. Recargando datos...');
          this.reloadCurrentWeek();
        } else {
          alert(`Error al crear asistencia: ${err.error?.message || err.message}`);
        }
      }
    });
  }

  // 🆕 RECARGAR SEMANA ACTUAL
  private reloadCurrentWeek(): void {
    console.log('🔄 Recargando semana actual...');
    this.isLoading = true;
    this.loadAttendance(this.selectedWeekStart).finally(() => {
      this.isLoading = false;
    });
  }

  // NAVEGACIÓN DE SEMANAS
  previousWeek(): void {
    const currentIndex = this.availableWeeks.findIndex(w => w.weekStart === this.selectedWeekStart);
    if (currentIndex > 0) {
      const previousWeek = this.availableWeeks[currentIndex - 1];
      this.selectWeek(previousWeek.weekStart);
    } else {
      console.log('📅 Ya estás en la primera semana del período');
      alert('Ya estás en la primera semana del período académico');
    }
  }

  currentWeek(): void {
    if (this.currentWeekInfo) {
      this.selectWeek(this.currentWeekInfo.weekStart);
    }
  }

  nextWeek(): void {
    const currentIndex = this.availableWeeks.findIndex(w => w.weekStart === this.selectedWeekStart);
    if (currentIndex < this.availableWeeks.length - 1) {
      const nextWeek = this.availableWeeks[currentIndex + 1];
      this.selectWeek(nextWeek.weekStart);
    } else {
      console.log('📅 Ya estás en la última semana del período');
      alert('Ya estás en la última semana del período académico');
    }
  }

  // SELECCIONAR SEMANA ESPECÍFICA
  private selectWeek(weekStart: string): void {
    console.log(`📅 Seleccionando semana: ${weekStart}`);
    this.selectedWeekStart = weekStart;
    this.isLoading = true;
    
    this.loadAttendance(weekStart).finally(() => {
      this.isLoading = false;
    });
  }

  // MÉTODO PARA FECHAS
  getDayDate(dayIndex: number): string {
    if (this.selectedWeekStart) {
      const weekStartDate = new Date(this.selectedWeekStart + 'T00:00:00');
      
      // Asegurar que empecemos desde el lunes
      const dayOfWeek = weekStartDate.getDay();
      const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      weekStartDate.setDate(weekStartDate.getDate() + daysToMonday);
      
      // Calcular el día específico
      const dayDate = new Date(weekStartDate);
      dayDate.setDate(weekStartDate.getDate() + dayIndex);
      
      return dayDate.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
    
    // Fallback a semana actual
    const today = new Date();
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() - today.getDay() + dayIndex + 1);
    
    return dayDate.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  }

  // OBTENER RANGO DE FECHAS ACTUAL
  getCurrentDateRange(): string {
    if (this.selectedWeekStart) {
      const selectedWeek = this.availableWeeks.find(w => w.weekStart === this.selectedWeekStart);
      if (selectedWeek) {
        const startDate = new Date(selectedWeek.weekStart + 'T00:00:00');
        const endDate = new Date(selectedWeek.weekEnd + 'T00:00:00');
        
        return `${startDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })} - ${endDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}`;
      }
    }
    return 'Cargando...';
  }

  // VERIFICAR SI ES SEMANA ACTUAL
  isCurrentWeekSelected(): boolean {
    return this.currentWeekInfo && this.selectedWeekStart === this.currentWeekInfo.weekStart;
  }

  // MÉTODOS AUXILIARES
  statusClass(status: Status) {
    return {
      'presente': 'btn-presente',
      'ausente': 'btn-ausente', 
      'tardanza': 'btn-tardanza',
      'sin_registro': 'btn-sin-registro'
    }[status];
  }

  getStatusCount(status: Status): number {
    let count = 0;
    this.students.forEach(student => {
      student.records.forEach((record: any) => {
        if (record.status === status) {
          count++;
        }
      });
    });
    return count;
  }

  getStudentInitials(name: string): string {
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }

  trackByStudentId(index: number, student: any): number {
    return student.id;
  }
  

}
