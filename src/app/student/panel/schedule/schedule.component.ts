import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { CommonModule } from '@angular/common';
import { CalendarOptions, DayHeaderContentArg, EventInput } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { environment } from '../../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-schedule',
  imports: [ FullCalendarModule, CommonModule, PanelHeaderComponent],

  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
  })
export class ScheduleComponent implements OnInit {

  private baseUrl = environment.apiBase;
  constructor(private http: HttpClient) {}

  private courseColors: Record<string, string> = {
    'Matemáticas':    '#3498db',
    'Ciencias':       '#2ecc71',
    'Historia':       '#e67e22',
    'Lengua':         '#9b59b6',
    'Inglés':         '#1abc9c',
    'Arte':           '#f1c40f',
    'Educ. Física':   '#e74c3c',
    'Geografía':      '#34495e',
    'Música':         '#2c3e50',
    'Biología':       '#27ae60',
    // curso por defecto
    '_default':       '#95a5a6'
  };

  calendarOptions: CalendarOptions = {
    plugins: [
      dayGridPlugin,
      timeGridPlugin,
      interactionPlugin
    ],
    initialView: 'timeGridWeek',
    hiddenDays: [0, 6], // 1) Ocultar fines de semana (domingo = 0, sábado = 6)
      // 2) Ajustar el rango de horario mostrado (desde temprano hasta las 12:00)
    slotMinTime: '06:00:00',   // opcionalmente cambia el inicio
    slotMaxTime: '23:00:00',   // corta la franja a mediodía
    // 3) (Opcional) Primera columna empieza el lunes
    firstDay: 1,
    // 4) toolbar para navegar y cambiar vista si hace falta
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,dayGridMonth'
    },

    // 1) Ocultar la franja de “All Day”
    allDaySlot: false,

    // 6) personalización de cabeceras
    dayHeaderContent: (arg: DayHeaderContentArg) => {
      
      // Aquí defines cómo quieres renderizar cada cabecera:
      // Por ejemplo, un array con nombres personalizados:
      const nombresSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const d = arg.date;
      const nombre = nombresSemana[d.getDay()];

      // Formatear fecha como "7/20"
      const textoFecha = `${d.getMonth() + 1}/${d.getDate()}`;

      return { html: `<span>${nombre} ${textoFecha}</span>` };
    },

    dateClick: (arg: DateClickArg) => this.handleDateClick(arg),
    events: []
  };

  ngOnInit() {
    this.loadSchedule();
  }

  private loadSchedule() {
    this.http
      .get<any[]>(`${this.baseUrl}/student/me/schedule`)
      .subscribe(
        data => {
          const dowMap: Record<string, number> = {
            'Lunes': 1, 'Martes': 2, 'Miércoles': 3,
            'Jueves': 4, 'Viernes': 5
          };

          const events: EventInput[] = data.map(item => ({
            title:      item.courseName,
            daysOfWeek: [dowMap[item.day] || 1],
            startTime:  item.startTime.slice(0,5),  // "HH:mm"
            endTime:    item.endTime.slice(0,5),
            color:      this.courseColors[item.courseName] 
                        ?? this.courseColors['_default']
          }));

          this.calendarOptions = {
            ...this.calendarOptions,
            events
          };
        },
        err => console.error('Error cargando schedule:', err)
      );
  }

  /** Combina un día de la semana ("Lunes") con la hora en ISO para esta semana */
  private combineDateTime(dayName: string, time: string): string | null {
    // Lista original de días en español
    const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    // Creamos un mapa normalizado (sin acentos, minúsculas) → índice de día
    const map: Record<string, number> = {};
    dias.forEach((d, idx) => {
      const key = d
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase();
      map[key] = idx;
    });

    // Normalizamos el día entrante
    const keyIn = dayName
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase();

    const targetDay = map[keyIn];
    if (targetDay === undefined) {
      console.warn(`Día no reconocido: "${dayName}"`);
      return null;
    }

    const today = new Date();
    // Ajustamos domingo (0) a 7 para cálculo
    const currentDow = today.getDay() === 0 ? 7 : today.getDay();
    const desiredDow = targetDay === 0 ? 7 : targetDay;
    const offset = desiredDow - currentDow;
    const d = new Date(today);
    d.setDate(today.getDate() + offset);

    // Validamos fecha
    if (isNaN(d.getTime())) {
      console.warn('Fecha inválida generada para', dayName);
      return null;
    }

    const datePart = d.toISOString().slice(0, 10);
    return `${datePart}T${time}`;
  }


  handleDateClick(arg: DateClickArg) {
    alert('Clicked en ' + arg.dateStr);
  }
  
  
}
