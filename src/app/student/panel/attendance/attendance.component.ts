import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Attendance, DataService, Month } from '../../services/dataStudent.service';
import { CardCoursesComponent } from '../../../components/card-courses/card-courses.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-attendance',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})
export class AttendanceComponent implements OnInit {
  attendance!: Attendance;
  // Mes seleccionado cuando hacemos clic
  selectedMonth: Month | null = null;

  // Nuevos contadores
  presentCount = 0;
  absentCount = 0;
  tardyCount  = 0;

  constructor(private dataSvc: DataService) {}

  ngOnInit() {
    this.dataSvc.getAttendance().subscribe(list => {
      if (list.length) {
        this.attendance = list[0];
      }
    });
  }

    /** Al hacer clic en la card, abrimos el modal */
  openMonth(month: Month) {
    this.selectedMonth = month;
    // recalcular contadores
    this.presentCount = month.sessions.filter(s => s.status === 'asistió').length;
    this.absentCount  = month.sessions.filter(s => s.status === 'faltó').length;
    this.tardyCount   = month.sessions.filter(s => s.status === 'tardanza').length;
  }

  /** Cierra el modal */
  closeModal() {
    this.selectedMonth = null;
  }

}
