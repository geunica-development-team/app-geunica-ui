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
  /** emite cada vez que cambia term (soporta [(term)]) */
  @Output() termChange = new EventEmitter<string>();
  /** emite al hacer submit (opcional) */
  @Output() search = new EventEmitter<string>();

  onInputChange(value: string) {
    this.term = value;
    this.termChange.emit(this.term);
  }

  onSubmit() {
    this.search.emit(this.term.trim());
  }
}
