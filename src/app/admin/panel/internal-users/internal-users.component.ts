import { Component } from '@angular/core';
import { HeaderDinamicComponent } from '../../../components/header-dinamic/header-dinamic.component';
import { TabContentDirective } from '../../../components/header-dinamic/tab-content.directive';

@Component({
  selector: 'app-internal-users',
  imports: [HeaderDinamicComponent, TabContentDirective],
  templateUrl: './internal-users.component.html',
  styleUrl: './internal-users.component.css'
})
export class InternalUsersComponent {

}
