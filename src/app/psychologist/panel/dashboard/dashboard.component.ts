import { Component } from '@angular/core';
import { PanelHeaderComponent } from "../../../components/dashboard/shared-components/panel-header/panel-header.component";

@Component({
  selector: 'app-dashboard',
  imports: [PanelHeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
