import { Component, HostListener, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  @Input({required : true}) menuItems: any[] = [];
  @Input({required : true}) generalItems: any[] = [];

  isCollapsed = true;

  toggleSidenav() {
    this.isCollapsed = !this.isCollapsed;
  }
}
