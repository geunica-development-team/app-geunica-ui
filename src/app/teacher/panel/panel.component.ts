import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from '../../components/dashboard/sidenav/sidenav.component';
import { HeaderComponent } from '../../components/dashboard/header/header.component';
import { generalItems, menuItemsTeacher } from '../../components/dashboard/sidenav/sidenav-data';

@Component({
  selector: 'app-panel',
  imports: [RouterOutlet, SidenavComponent, HeaderComponent],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent {
  menuItemsTeacher = menuItemsTeacher;
  generalItems = generalItems;
}
