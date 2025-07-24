import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DayHeaderContentArg } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
@Component({
  selector: 'app-schedule',
  imports: [FullCalendarModule,],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent {

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

    dateClick: (arg) => this.handleDateClick(arg),
    events: [
      // Lunes 21
      { title: 'Matemáticas',   start: '2025-07-21T07:30:00', end: '2025-07-21T09:00:00', color: '#3498db' },
      { title: 'Recreo',        start: '2025-07-21T09:00:00', end: '2025-07-21T09:30:00', display: 'background', color: '#95a5a6' },
      { title: 'Ciencias',      start: '2025-07-21T09:30:00', end: '2025-07-21T11:00:00', color: '#2ecc71' },

      // Martes 22
      { title: 'Historia',      start: '2025-07-22T07:30:00', end: '2025-07-22T09:00:00', color: '#e67e22' },
      { title: 'Recreo',        start: '2025-07-22T09:00:00', end: '2025-07-22T09:30:00', display: 'background', color: '#95a5a6' },
      { title: 'Lengua',        start: '2025-07-22T09:30:00', end: '2025-07-22T11:00:00', color: '#9b59b6' },

      // Miércoles 23
      { title: 'Inglés',        start: '2025-07-23T07:30:00', end: '2025-07-23T09:00:00', color: '#1abc9c' },
      { title: 'Recreo',        start: '2025-07-23T09:00:00', end: '2025-07-23T09:30:00', display: 'background', color: '#95a5a6' },
      { title: 'Arte',          start: '2025-07-23T09:30:00', end: '2025-07-23T11:00:00', color: '#f1c40f' },

      // Jueves 24
      { title: 'Educ. Física',  start: '2025-07-24T07:30:00', end: '2025-07-24T09:00:00', color: '#e74c3c' },
      { title: 'Recreo',        start: '2025-07-24T09:00:00', end: '2025-07-24T09:30:00', display: 'background', color: '#95a5a6' },
      { title: 'Geografía',     start: '2025-07-24T09:30:00', end: '2025-07-24T11:00:00', color: '#34495e' },

      // Viernes 25
      { title: 'Música',        start: '2025-07-25T07:30:00', end: '2025-07-25T09:00:00', color: '#2c3e50' },
      { title: 'Recreo',        start: '2025-07-25T09:00:00', end: '2025-07-25T09:30:00', display: 'background', color: '#95a5a6' },
      { title: 'Biología',      start: '2025-07-25T09:30:00', end: '2025-07-25T11:00:00', color: '#27ae60' }
    ]
  };

  handleDateClick(arg: DateClickArg) {
    alert('date click! ' + arg.dateStr);
  }

}
