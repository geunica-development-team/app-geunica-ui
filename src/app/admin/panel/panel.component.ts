import { Component, inject, OnInit } from '@angular/core';
import { SidenavComponent } from '../../components/dashboard/sidenav/sidenav.component';
import { HeaderComponent } from '../../components/dashboard/header/header.component';
import { RouterOutlet } from '@angular/router';
import { generalItems, menuItemsAdmin, menuItemsPsychologist } from '../../components/dashboard/sidenav/sidenav-data';
import { AuthStorageService } from '../../services/auth-storage.service';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-panel',
  imports: [SidenavComponent, HeaderComponent, RouterOutlet],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent implements OnInit {
  private authStorage = inject(AuthStorageService);
  private notifycation = inject(ToastrService);

  menuItems: any[] = [];
  generalItems = generalItems;

  ngOnInit(): void {
    console.log('hola')
    const token = this.authStorage.getToken();

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const role = decoded.role;
        if (role === 'admin') {
          this.menuItems = menuItemsAdmin;
        } else if (role === 'psychologist') {
          this.menuItems = menuItemsPsychologist;
        }
      } catch (error) {
        this.notifycation.error('Token inválido', 'Error');
      }
    } else {
      this.notifycation.error('No se pudo leer el token', 'Error');
    }
  }
}
