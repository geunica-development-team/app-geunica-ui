import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {  DataStudentService } from '../../services/dataStudent.service';
import { CardCoursesComponent } from '../../../components/card-courses/card-courses.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Attendance, Month } from '../../services/modelStudent';

@Component({
  selector: 'app-attendance',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})
export class AttendanceComponent implements OnInit {
  attendance!: Attendance;
  selectedMonth: Month | null = null;
  isClosing = false;
  presentCount = 0;
  absentCount = 0;
  tardyCount = 0;

  constructor(private dataSvc: DataStudentService) {}

  ngOnInit() {
    this.dataSvc.getAttendance().subscribe(att => {
      // getAttendance retorna un object Attendance
      this.attendance = att;
    });
  }

  openMonth(month: Month) {
    this.selectedMonth = month;
    this.isClosing = false;
    this.presentCount = month.sessions.filter(s => s.status === 'asistió').length;
    this.absentCount = month.sessions.filter(s => s.status === 'faltó').length;
    this.tardyCount = month.sessions.filter(s => s.status === 'tardanza').length;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    if (this.isClosing) { return; }
    this.isClosing = true;
    setTimeout(() => {
      this.selectedMonth = null;
      this.isClosing = false;
      document.body.style.overflow = '';
    }, 300);
  }


}
