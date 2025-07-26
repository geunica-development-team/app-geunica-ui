import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FlatAsistencia } from '../../services/modelTeacher';
import { ActivatedRoute } from '@angular/router';
import { DataTeacherService } from '../../services/dataTeacher.service';

type Status = 'asistió' | 'falto' | 'tardanza';

interface AttendanceRecord {
  day: string;       // e.g. 'Lunes'
  status: Status;
}

interface Student {
  id: number;
  name: string;
  avatarUrl: string;
  records: AttendanceRecord[];
}

@Component({
  selector: 'app-attendance-list',
  imports: [CommonModule],
  templateUrl: './attendance-list.component.html',
  styleUrl: './attendance-list.component.css'
})
export class AttendanceListComponent implements OnInit {
  // 1. Cabecera de días de la semana
  weekRange = '10 Julio 2025 - 16 Julio 2025';
  days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  // Dentro de AttendanceListComponent
  allStatuses: Status[] = ['asistió', 'falto', 'tardanza'];

  // 2. Datos simulados de estudiantes y su asistencia
  students: Student[] = [
    {
      id: 1,
      name: 'Juanito Quispe',
      avatarUrl: 'https://i.pravatar.cc/40?img=1',
      records: [
        { day: 'Lunes',     status: 'asistió' },
        { day: 'Martes',    status: 'asistió' },
        { day: 'Miércoles', status: 'falto'   },
        { day: 'Jueves',    status: 'asistió' },
        { day: 'Viernes',   status: 'falto'   },
      ]
    },
    {
      id: 2,
      name: 'María Gómez',
      avatarUrl: 'https://i.pravatar.cc/40?img=2',
      records: [
        { day: 'Lunes',     status: 'asistió' },
        { day: 'Martes',    status: 'asistió' },
        { day: 'Miércoles', status: 'tardanza' },
        { day: 'Jueves',    status: 'asistió' },
        { day: 'Viernes',   status: 'asistió' },
      ]
    },
        {
      id: 3,
      name: 'Jomaira Jujuy',
      avatarUrl: 'https://i.pravatar.cc/40?img=3',
      records: [
        { day: 'Lunes',     status: 'asistió' },
        { day: 'Martes',    status: 'asistió' },
        { day: 'Miércoles', status: 'tardanza' },
        { day: 'Jueves',    status: 'asistió' },
        { day: 'Viernes',   status: 'asistió' },
      ]
    },
        {
      id: 4,
      name: 'Xiomara Menez',
      avatarUrl: 'https://i.pravatar.cc/40?img=4',
      records: [
        { day: 'Lunes',     status: 'asistió' },
        { day: 'Martes',    status: 'asistió' },
        { day: 'Miércoles', status: 'tardanza' },
        { day: 'Jueves',    status: 'asistió' },
        { day: 'Viernes',   status: 'asistió' },
      ]
    },
        {
      id: 5,
      name: 'Ernestro Nuñez',
      avatarUrl: 'https://i.pravatar.cc/40?img=5',
      records: [
        { day: 'Lunes',     status: 'asistió' },
        { day: 'Martes',    status: 'asistió' },
        { day: 'Miércoles', status: 'tardanza' },
        { day: 'Jueves',    status: 'asistió' },
        { day: 'Viernes',   status: 'asistió' },
      ]
    },
    // …más estudiantes
  ];

  constructor() {}

  ngOnInit(): void {}

  // Devuelve las dos opciones que NO son el actual
  getOtherStatuses(current: Status): Status[] {
    return this.allStatuses.filter(s => s !== current);
  }


  // Mapea status a clase Bootstrap
  statusClass(status: Status) {
    return {
      'asistió':  'btn-success',
      'falto':    'btn-danger',
      'tardanza': 'btn-warning text-dark'
    }[status];
  }

}
