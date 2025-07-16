import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'app-geunica-ui';
}
