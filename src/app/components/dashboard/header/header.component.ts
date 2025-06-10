import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() title: string = 'Dashboard';
  @Input() showBackButton: boolean = true;
  @Input() userAvatar: string = 'assets/images/default-avatar.jpg';
  @Input() userName: string = 'Usuario';
  @Input() notificationCount: number = 0;

  @Output() backClick = new EventEmitter<void>();
  @Output() notificationClick = new EventEmitter<void>();
  @Output() messageClick = new EventEmitter<void>();
  @Output() settingsClick = new EventEmitter<void>();
  @Output() profileClick = new EventEmitter<void>();

  constructor() { }

  onBackClick(): void {
    this.backClick.emit();
  }

  onNotificationClick(): void {
    this.notificationClick.emit();
  }

  onMessageClick(): void {
    this.messageClick.emit();
  }

  onSettingsClick(): void {
    this.settingsClick.emit();
  }

  onProfileClick(): void {
    this.profileClick.emit();
  }
}
