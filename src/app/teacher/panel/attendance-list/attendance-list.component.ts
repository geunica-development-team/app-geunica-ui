import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../enviroments/environment';

type Status = 'asistió' | 'falto' | 'tardanza';

@Component({
  selector: 'app-attendance-list',
  imports: [CommonModule],
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
          name: `${a.user.person.names} ${a.user.person.paternalSurname}`,
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

}
