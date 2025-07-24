import { CommonModule } from '@angular/common';
import { Component, ContentChildren, inject, Input, OnInit, Output, QueryList } from '@angular/core';
import { TabContentDirective } from './tab-content.directive';
interface Tab {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-header-dinamic',
  imports: [ CommonModule],
  templateUrl: './header-dinamic.component.html',
  styleUrl: './header-dinamic.component.css'
})
export class HeaderDinamicComponent  {

  @Input() tabs: Tab[] = [];
  activeTab!: string;

  @ContentChildren(TabContentDirective)
  contents!: QueryList<TabContentDirective>;

  private contentMap = new Map<string, any>();

  ngAfterContentInit() {
    // construye un mapa id → TemplateRef
    this.contents.forEach(c => this.contentMap.set(c.id, c.template));
    // valor inicial
    this.activeTab = this.tabs.length ? this.tabs[0].id : '';
  }

  setActiveTab(id: string) {
    this.activeTab = id;
  }

  get activeTemplate() {
    return this.contentMap.get(this.activeTab);
  }

}
