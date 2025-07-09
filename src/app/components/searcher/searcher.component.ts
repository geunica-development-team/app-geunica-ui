import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searcher',
  imports: [CommonModule, FormsModule],
  templateUrl: './searcher.component.html',
  styleUrl: './searcher.component.css'
})
export class SearcherComponent {
  /** valor del input */
  @Input() term: string = '';
  /** placeholder del buscador */
  @Input() placeholder: string = 'Buscar...';

  /** lista de elementos a filtrar */
  @Input() items: any[] = [];
  /** campo dentro de cada item donde buscar */
  @Input() field: string = 'title';
  /** emite cada vez que cambia term (soporta [(term)]) */
  @Output() termChange = new EventEmitter<string>();
  /** emite al hacer submit (opcional) */
  @Output() search = new EventEmitter<string>();
  /** emite la lista filtrada */
  @Output() filtered = new EventEmitter<any[]>();

  ngOnInit() {
    // Emitir lista completa al inicio
    this.filtered.emit(this.items);
  }

  onInputChange(value: string) {
    this.term = value;
    this.termChange.emit(this.term);
    this.applyFilter();
  }

  onSubmit() {
    this.search.emit(this.term.trim());
  }

  private applyFilter() {
    const raw = this.term.trim().toLowerCase();

    if (raw.length < 4) {
      this.filtered.emit(this.items);
      return;
    }

    const normalizedSearch = raw
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const terms = normalizedSearch.split(/\s+/);

    const result = this.items.filter(item => {
      const fieldValue = String(item[this.field] || '')
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      return terms.every(t => fieldValue.includes(t));
    });

    this.filtered.emit(result);
  }
}
