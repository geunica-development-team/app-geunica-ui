import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-panel-header',
  imports: [],
  templateUrl: './panel-header.component.html',
  styleUrl: './panel-header.component.css'
})
export class PanelHeaderComponent {
  @Input({required : true}) title!: string;

}
