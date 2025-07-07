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

  isCollapsed = false

  @HostListener("window:resize", ["$event"])
  onResize() {
    if (window.innerWidth <= 768) {
      this.isCollapsed = true
    } else {
      this.isCollapsed = false
    }
  }

  ngOnInit() {
    if (window.innerWidth <= 768) {
      this.isCollapsed = true
    }
  }

  toggleSidenav() {
    this.isCollapsed = !this.isCollapsed
  }
}
