import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';

@Component({
  selector: 'app-app-modal',
  imports: [CommonModule],
  templateUrl: './app-modal.component.html',
  styleUrl: './app-modal.component.css'
})
export class AppModalComponent {
    @Input() visible = false;
  @Input() width: string = '450px';
  @Input() maxWidth: string = '80vw';
  @Input() borderRadius: string = '0.5rem';

  @Output() closed = new EventEmitter<void>();

  onBackdropClick() {
    this.close();
  }

  close() {
    this.closed.emit();
  }
}
