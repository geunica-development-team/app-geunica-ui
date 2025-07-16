import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { CommonModule } from '@angular/common';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-schedule',
  imports: [ FullCalendarModule, CommonModule],

  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
  })
export class ScheduleComponent {

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',               // vista semanal
    plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin ],
    headerToolbar: {                            // barra con botones
      left:   'prev today next',
      center: 'title',
      right:  'timeGridWeek,timeGridDay,dayGridMonth'
    },
    slotMinTime: '06:00:00',                    // hora de inicio del día
    slotMaxTime: '20:00:00',                    // hora final del día
    slotDuration: '01:00:00',                   // ranuras de 1 hora
    dateClick: (arg: DateClickArg) => this.handleDateClick(arg),
    events: [
      { title: 'Aritmética 5to primaria', date: '2025-07-16', color: '#8e44ad' },
      { title: 'Geometría 5to primaria', date: '2025-07-17', display: 'background', color: '#8e44ad' }
    ]
  };

  handleDateClick(arg: DateClickArg) {
    alert('date click! ' + arg.dateStr)
  }
  
}
