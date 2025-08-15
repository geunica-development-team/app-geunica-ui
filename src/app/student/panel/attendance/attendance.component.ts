import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {  DataStudentService } from '../../services/dataStudent.service';
import { CardCoursesComponent } from '../../../components/card-courses/card-courses.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { environment } from '../../../../enviroments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthStorageService } from '../../../services/auth-storage.service';

interface Attendance {
  months: Month[];
}

interface Month {
  month: string;
  sessions: Session[];
}

interface Session {
  date: string;
  status: 'asistió' | 'faltó' | 'tardanza';
}


@Component({
  selector: 'app-attendance',
  imports: [CommonModule, FormsModule, RouterModule, PanelHeaderComponent],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})
export class AttendanceComponent implements OnInit {

     months: Array<{ key: string; month: string; year: number; sessions: any[] }> = [];
  selectedMonth: { month: string; year: number; sessions: any[] } | null = null;
  isClosing = false;
  presentCount = 0;
  absentCount = 0;
  tardyCount = 0;

  private baseUrl = environment.apiBase;

  constructor(private http: HttpClient, private authStorage: AuthStorageService) {}

  ngOnInit() {
    const token = this.authStorage.getToken();
    const headers = token ? { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) } : {};
    this.http.get<any[]>(`${this.baseUrl}/student/me/attendance`, headers)
      .subscribe(data => {
        this.groupByMonth(data);
      }, err => console.error(err));
  }

  private groupByMonth(att: any[]) {
    const map = new Map<string, any[]>();

    att.forEach(a => {
      const d = new Date(a.attendanceDate);
      const year = d.getFullYear();
      const monthIndex = d.getMonth();        // 0 = enero … 2 = marzo
      const key = `${year}-${monthIndex}`;

      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    });

    this.months = Array.from(map.entries())
      .map(([key, sessions]) => {
        const [year, monthIndexStr] = key.split('-');
        const monthIndex = parseInt(monthIndexStr, 10);
        // Etiqueta legible: “Marzo 2025”
        const label = new Date(Number(year), monthIndex, 1)
          .toLocaleString('es-PE', { month: 'long', year: 'numeric' });

        return {
          key,
          month: label,      // ya incluye año si quieres
          year: Number(year),
          sessions: sessions.sort((a, b) =>
            a.attendanceDate.localeCompare(b.attendanceDate))
        };
      })
      // Orden descendente por clave “YYYY-M”
      .sort((a, b) => b.key.localeCompare(a.key));
  }


  openMonth(m: { month: string; year: number; sessions: any[] }) {
    this.selectedMonth = m;
    this.presentCount = m.sessions.filter(s => s.status === 'present').length;
    this.absentCount  = m.sessions.filter(s => s.status === 'absent').length;
    this.tardyCount   = m.sessions.filter(s => s.status === 'late').length;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    if (this.isClosing) return;
    this.isClosing = true;
    setTimeout(() => {
      this.selectedMonth = null;
      this.isClosing = false;
      document.body.style.overflow = '';
    }, 300);
  }


}