import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { CommonModule } from '@angular/common';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-schedule',
  imports: [ FullCalendarModule, CommonModule],

  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
  })
export class ScheduleComponent {
  /* Plugins que queremos usar
  plugins = [ dayGridPlugin, timeGridPlugin, interactionPlugin ];

  // Eventos de ejemplo
  events = [
    {
      title: 'Aritmética 5to primaria',
      start: '2022-07-11T07:00:00',
      end:   '2022-07-11T08:00:00',
      color: '#8e44ad'
    },
    {
      title: 'RECREO',
      start: '2022-07-11T10:00:00',
      end:   '2022-07-11T11:00:00',
      display: 'background',
      color: '#8e44ad'
    }
    // …añade más eventos según necesites
  ];*/

    calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: [
      { title: 'event 1', date: '2019-04-01' },
      { title: 'event 2', date: '2019-04-02' }
    ]
  };

  handleDateClick(arg: DateClickArg) {
    alert('date click! ' + arg.dateStr)
  }

}
