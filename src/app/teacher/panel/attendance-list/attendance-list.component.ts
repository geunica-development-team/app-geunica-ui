import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../enviroments/environment';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { FormsModule } from '@angular/forms';

type Status = 'asistió' | 'falto' | 'tardanza';

@Component({
  selector: 'app-attendance-list',
  imports: [CommonModule, PanelHeaderComponent, FormsModule],
  templateUrl: './attendance-list.component.html',
  styleUrl: './attendance-list.component.css'
})
export class AttendanceListComponent implements OnInit {

  days = ['Lunes','Martes','Miércoles','Jueves','Viernes'];
  allStatuses: Status[] = ['asistió','falto','tardanza'];

  students: any[] = [];
  caId!: number;
  private baseUrl = environment.apiBase;
  private attendanceMap = new Map<string, any>(); // Para mapear userId-day -> attendance record

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.caId = +this.route.snapshot.paramMap.get('id_salon')!;
    this.loadAttendance();
  }

  private loadAttendance() {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .get<any[]>(
        `${environment.apiBase}/teacher/me/assignment/${this.caId}/attendance`,
        { headers }
      )
      .subscribe(
        atts => this.buildStudentGrid(atts),
        err  => console.error('Error al cargar asistencias:', err)
      );
  }

  private buildStudentGrid(atts: any[]) {
    const grouped = new Map<number, { name: string, recs: any[] }>();
    this.attendanceMap.clear(); // Limpiar el mapa

    // 1) Agrupar por usuario y guardar referencia completa del attendance
    atts.forEach(a => {
      const uid = a.userId;
      if (!grouped.has(uid)) {
        grouped.set(uid, {
          name: `${a.user.person.names} ${a.user.person.paternalSurname} ${a.user.person.maternalSurname}`,
          recs: []
        });
      }

      const date = new Date(a.attendanceDate);
      const weekday = this.days[date.getDay() - 1];
      const attendanceRecord = {
        day: weekday,
        status: this.mapStatus(a.status),
        attendanceId: a.id, // ← Importante: guardar el ID de la asistencia
        originalAttendance: a // ← Guardar el registro completo
      };

      grouped.get(uid)!.recs.push(attendanceRecord);

      // Mapear userId-day -> attendance para búsqueda rápida
      const key = `${uid}-${weekday}`;
      this.attendanceMap.set(key, a);
    });

    // 2) Construir arreglo final, con un registro por cada día
    this.students = Array.from(grouped.entries()).map(([uid, info]) => {
      const recs = this.days.map((day, dayIndex) => {
        const existingRec = info.recs.find(r => r.day === day);
        if (existingRec) {
          return existingRec;
        }
        // Si no existe asistencia para ese día, crear placeholder
        return { 
          day, 
          status: 'falto', 
          attendanceId: null,
          originalAttendance: null
        };
      });
      return { id: uid, name: info.name, records: recs };
    });

    console.log('Students grid built:', this.students);
    console.log('Attendance map:', this.attendanceMap);
  }

  private mapStatus(s: string): Status {
    if (s === 'present' || s === 'asistió')   return 'asistió';
    if (s === 'absent'  || s === 'falto')     return 'falto';
    if (s === 'late'    || s === 'tardanza')  return 'tardanza';
    return 'falto';
  }

  getOtherStatuses(current: Status): Status[] {
    return this.allStatuses.filter(s => s !== current);
  }

  statusClass(status: Status) {
    return {
      'asistió':  'btn-asistio',
      'falto':    'btn-falto',
      'tardanza': 'btn-tardanza'
    }[status];
  }

  getStudentInitials(name: string): string {
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }

  getDayDate(dayIndex: number): string {
    // Implementar lógica real para fechas
    const dates = ['11/08', '12/08', '13/08', '14/08', '15/08'];
    return dates[dayIndex] || '';
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

  trackByStudentId(index: number, student: any): number {
    return student.id;
  }

  // MÉTODO PRINCIPAL CORREGIDO - maneja tanto string como Status
  updateStatus(studentId: number, dayIndex: number, newStatus: string | Status): void {
    // Convertir a Status si viene como string del select
    const status = typeof newStatus === 'string' ? newStatus as Status : newStatus;
    
    const student = this.students.find(s => s.id === studentId);
    if (!student || !student.records[dayIndex]) return;

    const record = student.records[dayIndex];
    const day = this.days[dayIndex];
    
    // Buscar si existe un registro de asistencia para este día
    const key = `${studentId}-${day}`;
    const attendanceRecord = this.attendanceMap.get(key);

    if (attendanceRecord && attendanceRecord.id) {
      // Si existe, actualizar el registro existente
      this.updateExistingAttendance(attendanceRecord.id, status, record);
    } else {
      // Si no existe, necesitarás crear uno nuevo (esto requiere otro endpoint)
      console.warn('No existe registro de asistencia para este día. Necesitas implementar creación.');
      // Por ahora, solo actualizar en el frontend
      record.status = status;
    }
  }

  // Actualizar asistencia existente usando tu endpoint PATCH
  private updateExistingAttendance(attendanceId: number, newStatus: Status, record: any): void {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    const updateData = {
      status: this.mapStatusToBackend(newStatus),
      remarks: '' // opcional
    };

    // Pedimos la respuesta completa para depurar
    this.http.patch(
      `${this.baseUrl}/teacher/assignment/${this.caId}/attendance/${attendanceId}`,
      updateData,
      { headers, observe: 'response' as const }
    ).subscribe({
      next: (resp) => {
        console.log('PATCH response status:', resp.status, 'body:', resp.body);
        // Actualizar en frontend
        record.status = newStatus;
      },
      error: (err) => {
        console.error('Error al actualizar asistencia (detalles):', {
          status: err.status,
          message: err.message,
          error: err.error
        });
        // mostrar alerta útil al usuario (temporal)
        alert(`Error al actualizar: ${err.status}\n${JSON.stringify(err.error)}`);
      }
    });
  }


  private mapStatusToBackend(status: Status): string {
    const statusMap = {
      'asistió': 'present',
      'falto': 'absent',
      'tardanza': 'late'
    };
    return statusMap[status] || 'absent';
  }

  // Métodos de navegación (implementar según necesidades)
  previousWeek(): void {
    console.log('Navegando a semana anterior');
  }

  currentWeek(): void {
    console.log('Navegando a semana actual');
  }

  nextWeek(): void {
    console.log('Navegando a semana siguiente');
  }
// Reemplaza students: any[] = [];


// Método para cargar datos falsos (llámalo desde ngOnInit() mientras pruebas)
loadMockData() {
  const baseDate = ['2025-08-11','2025-08-12','2025-08-13','2025-08-14','2025-08-15'];
  this.students = [
    {
      id: 101,
      name: 'María López',
      records: [
        { day: 'Lunes',    status: 'asistió',  attendanceId: 1001, originalAttendance: { id:1001, userId:101, attendanceDate: baseDate[0], status: 'present' } },
        { day: 'Martes',   status: 'asistió',  attendanceId: 1002, originalAttendance: { id:1002, userId:101, attendanceDate: baseDate[1], status: 'present' } },
        { day: 'Miércoles',status: 'tardanza', attendanceId: 1003, originalAttendance: { id:1003, userId:101, attendanceDate: baseDate[2], status: 'late' } },
        { day: 'Jueves',   status: 'asistió',  attendanceId: 1004, originalAttendance: { id:1004, userId:101, attendanceDate: baseDate[3], status: 'present' } },
        { day: 'Viernes',  status: 'asistió',  attendanceId: 1005, originalAttendance: { id:1005, userId:101, attendanceDate: baseDate[4], status: 'present' } }
      ]
    },
    {
      id: 102,
      name: 'Carlos Mendoza',
      records: [
        { day: 'Lunes',    status: 'falto',    attendanceId: 2001, originalAttendance: { id:2001, userId:102, attendanceDate: baseDate[0], status: 'absent' } },
        { day: 'Martes',   status: 'asistió',  attendanceId: 2002, originalAttendance: { id:2002, userId:102, attendanceDate: baseDate[1], status: 'present' } },
        { day: 'Miércoles',status: 'asistió',  attendanceId: 2003, originalAttendance: { id:2003, userId:102, attendanceDate: baseDate[2], status: 'present' } },
        { day: 'Jueves',   status: 'tardanza', attendanceId: 2004, originalAttendance: { id:2004, userId:102, attendanceDate: baseDate[3], status: 'late' } },
        { day: 'Viernes',  status: 'asistió',  attendanceId: 2005, originalAttendance: { id:2005, userId:102, attendanceDate: baseDate[4], status: 'present' } }
      ]
    },
    {
      id: 103,
      name: 'Ana María Quispe',
      records: [
        { day: 'Lunes',    status: 'asistió',  attendanceId: 3001, originalAttendance: { id:3001, userId:103, attendanceDate: baseDate[0], status: 'present' } },
        { day: 'Martes',   status: 'falto',    attendanceId: 3002, originalAttendance: { id:3002, userId:103, attendanceDate: baseDate[1], status: 'absent' } },
        { day: 'Miércoles',status: 'falto',    attendanceId: 3003, originalAttendance: { id:3003, userId:103, attendanceDate: baseDate[2], status: 'absent' } },
        { day: 'Jueves',   status: 'asistió',  attendanceId: 3004, originalAttendance: { id:3004, userId:103, attendanceDate: baseDate[3], status: 'present' } },
        { day: 'Viernes',  status: 'tardanza', attendanceId: 3005, originalAttendance: { id:3005, userId:103, attendanceDate: baseDate[4], status: 'late' } }
      ]
    },
    {
      id: 104,
      name: 'Jorge Ramírez',
      records: [
        { day: 'Lunes',    status: 'tardanza', attendanceId: 4001, originalAttendance: { id:4001, userId:104, attendanceDate: baseDate[0], status: 'late' } },
        { day: 'Martes',   status: 'asistió',  attendanceId: 4002, originalAttendance: { id:4002, userId:104, attendanceDate: baseDate[1], status: 'present' } },
        { day: 'Miércoles',status: 'asistió',  attendanceId: 4003, originalAttendance: { id:4003, userId:104, attendanceDate: baseDate[2], status: 'present' } },
        { day: 'Jueves',   status: 'asistió',  attendanceId: 4004, originalAttendance: { id:4004, userId:104, attendanceDate: baseDate[3], status: 'present' } },
        { day: 'Viernes',  status: 'falto',    attendanceId: 4005, originalAttendance: { id:4005, userId:104, attendanceDate: baseDate[4], status: 'absent' } }
      ]
    }
  ];

  // Opcional: poblar attendanceMap para que updateStatus encuentre los records
  this.attendanceMap.clear();
  this.students.forEach(s => {
    s.records.forEach((r: any) => {
      if (r.attendanceId) {
        this.attendanceMap.set(`${s.id}-${r.day}`, { id: r.attendanceId, userId: s.id, attendanceDate: r.originalAttendance?.attendanceDate, status: r.originalAttendance?.status });
      }
    });
  });

  console.log('Mock students loaded', this.students);
}

  

}
