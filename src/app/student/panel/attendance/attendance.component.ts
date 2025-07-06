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

  // Para controlar la animación de salida
  isClosing = false;

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
    this.isClosing = false;   // aseguramos que no esté en modo closing
    // recalcular contadores
    this.presentCount = month.sessions.filter(s => s.status === 'asistió').length;
    this.absentCount  = month.sessions.filter(s => s.status === 'faltó').length;
    this.tardyCount   = month.sessions.filter(s => s.status === 'tardanza').length;
  }

  /** Cierra el modal */
  closeModal() {
    // en lugar de quitarlo inmediatamente, arrancamos la animación de salida
        if (this.isClosing) { return; }
    this.isClosing = true;

    // Termina la animación (300ms) y entonces quitamos el modal
    setTimeout(() => {
      this.selectedMonth = null;
      this.isClosing = false;
      // si habías bloqueado el scroll del body, lo desbloqueas aquí:
      document.body.style.overflow = '';
    }, 300);
  }


}
