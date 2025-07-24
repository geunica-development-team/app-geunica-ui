import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[tabId]'
})
export class TabContentDirective {
  @Input('tabId') id!: string;
  constructor(public template: TemplateRef<any>) {}
}