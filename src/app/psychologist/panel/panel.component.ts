import { Component } from '@angular/core';
import { SidenavComponent } from "../../components/dashboard/sidenav/sidenav.component";
import { HeaderComponent } from "../../components/dashboard/header/header.component";
import { RouterOutlet } from '@angular/router';
import { generalItems, menuItemsPsychologist } from '../../components/dashboard/sidenav/sidenav-data';

@Component({
  selector: 'app-panel',
  imports: [SidenavComponent, HeaderComponent, RouterOutlet],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent {
  menuItemsAdmin = menuItemsPsychologist;
  generalItems = generalItems;
}
