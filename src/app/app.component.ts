import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { environment } from '../enviroments/environment';
import { AuthInterceptor } from './services/auth.interceptor';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, FullCalendarModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'app-geunica-ui';

    constructor(private http: HttpClient) {}

  ngOnInit() {
    console.log('Usando API base:', environment.apiBase);
    this.http.get(`${environment.apiBase}/health`)
      .subscribe({
        next: (resp) => console.log('Health check OK:', resp),
        error: err => console.error('Error health check:', err)
      });
  }

}
