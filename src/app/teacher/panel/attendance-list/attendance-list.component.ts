import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../enviroments/environment';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';

type Status = 'asistió' | 'falto' | 'tardanza';

@Component({
  selector: 'app-attendance-list',
  imports: [CommonModule, PanelHeaderComponent],
  templateUrl: './attendance-list.component.html',
  styleUrl: './attendance-list.component.css'
})
export class AttendanceListComponent implements OnInit {
 days = ['Lunes','Martes','Miércoles','Jueves','Viernes'];
  allStatuses: Status[] = ['asistió','falto','tardanza'];

  students: any[] = [];    // arreglo de alumnos con sus registros
  caId!: number;
  private baseUrl = environment.apiBase;

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
    const grouped = new Map<number, { name: string, recs: { day: string, status: Status }[] }>();

    // 1) Agrupar por usuario
    atts.forEach(a => {
      const uid = a.userId;
      if (!grouped.has(uid)) {
        grouped.set(uid, {
          name: `${a.user.person.names} ${a.user.person.paternalSurname} ${a.user.person.maternalSurname}` ,
          recs: []
        });
      }
      const date = new Date(a.attendanceDate);
      const weekday = this.days[date.getDay() - 1];
      grouped.get(uid)!.recs.push({
        day: weekday,
        status: this.mapStatus(a.status)
      });
    });

    // 2) Construir arreglo final, con un registro por cada día
    this.students = Array.from(grouped.entries()).map(([uid, info]) => {
      const recs = this.days.map(day =>
        info.recs.find(r => r.day === day) || { day, status: 'falto' }
      );
      return { id: uid, name: info.name, records: recs };
    });
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

// Para obtener las fechas de los días
getDayDate(dayIndex: number): string {
  // Aquí puedes implementar la lógica para mostrar las fechas reales
  // Por ahora devuelve fechas de ejemplo
  const dates = ['10/07', '11/07', '12/07', '13/07', '14/07'];
  return dates[dayIndex] || '';
}

// Para contar los estados de asistencia
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

// Para tracking en ngFor (mejora el rendimiento)
trackByStudentId(index: number, student: any): number {
  return student.id;
}

// Para actualizar el estado de asistencia
updateStatus(studentId: number, dayIndex: number, newStatus: Status): void {
  // Encuentra el estudiante y actualiza su registro
  const student = this.students.find(s => s.id === studentId);
  if (student && student.records[dayIndex]) {
    student.records[dayIndex].status = newStatus;
    
    // Aquí puedes agregar la lógica para enviar la actualización al backend
    this.saveAttendanceChange(studentId, dayIndex, newStatus);
  }
}

// Método para enviar los cambios al backend
private saveAttendanceChange(studentId: number, dayIndex: number, newStatus: Status): void {
  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
  // Construir la fecha del día correspondiente
  const attendanceDate = this.getAttendanceDateForDay(dayIndex);
  
  const updateData = {
    userId: studentId,
    attendanceDate: attendanceDate,
    status: this.mapStatusToBackend(newStatus)
  };
  
  // Realizar la petición HTTP para actualizar la asistencia
  this.http.put(`${this.baseUrl}/teacher/me/assignment/${this.caId}/attendance`, updateData, { headers })
    .subscribe(
      response => {
        console.log('Asistencia actualizada correctamente');
        // Podrías mostrar un mensaje de éxito aquí
      },
      error => {
        console.error('Error al actualizar asistencia:', error);
        // Podrías revertir el cambio en caso de error
        // this.loadAttendance(); // Recargar datos
      }
    );
}

// Convertir el status del frontend al formato del backend
private mapStatusToBackend(status: Status): string {
  const statusMap = {
    'asistió': 'present',
    'falto': 'absent',
    'tardanza': 'late'
  };
  return statusMap[status] || 'absent';
}

// Obtener la fecha de asistencia para un día específico
private getAttendanceDateForDay(dayIndex: number): string {
  // Aquí deberías implementar la lógica para obtener la fecha real
  // basándote en la semana actual y el índice del día
  const currentWeekStart = new Date(); // Obtener el inicio de la semana actual
  const targetDate = new Date(currentWeekStart);
  targetDate.setDate(currentWeekStart.getDate() + dayIndex);
  
  return targetDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
}

// Métodos para navegación de semana (puedes implementar la lógica según tus necesidades)
previousWeek(): void {
  // Implementar lógica para semana anterior
  console.log('Navegando a semana anterior');
}

currentWeek(): void {
  // Implementar lógica para semana actual
  console.log('Navegando a semana actual');
}

nextWeek(): void {
  // Implementar lógica para semana siguiente
  console.log('Navegando a semana siguiente');
}

}
