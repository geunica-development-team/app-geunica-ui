import { Component } from '@angular/core';
import { generalItems, menuItems } from './sidenav-data';

@Component({
  selector: 'app-sidenav',
  imports: [],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {

  Items = menuItems;
  GeneralItems = generalItems;

  constructor() { }
  onMenuClick(item: any): void {
    if (item.action === 'logout') {
      this.logout();
    } else {
      // Aquí puedes implementar la navegación
      console.log('Navegando a:', item.route);
    }
  }
  logout(): void {
    // Implementar lógica de cierre de sesión
    console.log('Cerrando sesión...');
  }
}
