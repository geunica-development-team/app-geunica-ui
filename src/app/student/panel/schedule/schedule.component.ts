import { Component } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin  from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-schedule',
  imports: [ FullCalendarModule],

  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
  })
export class ScheduleComponent {
  // Plugins que queremos usar
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
  ];
}
