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

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: [
      { title: 'Aritmética 5to primaria', date: '2025-07-16', color: '#8e44ar' },
      { title: 'Geometria 5to primaria', date: '2025-07-17', display: 'background', color: '#8e44ad'}
    ]
  };

  handleDateClick(arg: DateClickArg) {
    alert('date click! ' + arg.dateStr)
  }
  
}
