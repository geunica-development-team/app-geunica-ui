import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-panel-header',
  imports: [],
  templateUrl: './panel-header.component.html',
  styleUrl: './panel-header.component.css'
})
export class PanelHeaderComponent {
  @Input({required : true}) title!: string;
  
  constructor(private location: Location) {}

  goBack(): void {
      this.location.back();
  }
}
