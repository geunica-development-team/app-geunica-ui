import { Component } from '@angular/core';
import { CardAuthComponent } from '../../../components/auth/card-auth/card-auth.component';

@Component({
  selector: 'app-login',
  imports: [CardAuthComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}
