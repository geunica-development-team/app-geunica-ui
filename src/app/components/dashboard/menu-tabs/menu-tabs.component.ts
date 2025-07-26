import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface TabItem {
  id: string
  label: string
  icon?: string
  badge?: number | string
  badgeClass?: string
  disabled?: boolean
}

@Component({
  selector: 'app-menu-tabs',
  imports: [],
  templateUrl: './menu-tabs.component.html',
  styleUrl: './menu-tabs.component.css'
})
export class MenuTabsComponent {
  @Input({ required: true }) tabs: TabItem[] = []
  @Input() activeTabId = ""

  @Output() tabChanged = new EventEmitter<string>()

  ngOnInit() {
    // Si no hay tab activo, activar el primero por defecto
    if (!this.activeTabId && this.tabs.length > 0) {
      this.activeTabId = this.tabs[0].id
    }
  }

  setActiveTab(tabId: string) {
    if (this.tabs.find((tab) => tab.id === tabId && !tab.disabled)) {
      this.activeTabId = tabId
      this.tabChanged.emit(tabId)
    }
  }

  isTabActive(tabId: string): boolean {
    return this.activeTabId === tabId
  }
}
