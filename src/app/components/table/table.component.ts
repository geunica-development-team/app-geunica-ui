import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  	@Input() accionEditar!: (row: any) => void;
	@Input() accionEliminar!: (row: any) => void;
	@Input() acciones!: boolean;
	@Input() editarFila!: boolean;
	@Input() eliminarFila!: boolean

 	@Input() columns: string[] = [];
	//#region originalRows
	private _originalRows: any[] = [];
	@Input()
	set originalRows(value: any[]) {
		this._originalRows = value;
		this.updateTable();
	}
	get originalRows() {
		return this._originalRows;
	}
	//#endregion
	@Input() columnMappings: Record<string, string> = {}; // Recibe el mapeo desde fuera
	@Input() filterValue = '';

	// Filas originales
	rows: any[] = [];
	currentPage = 1;
	// pageSize = 10;
	totalPages: number = Math.ceil(this.originalRows.length / this.pageSize);
	startIndex = 0;
	endIndex = 0;

	updateTable() {
		this.startIndex = (this.currentPage - 1) * this.pageSize;
		this.endIndex = Math.min(
			this.startIndex + this.pageSize,
			this.originalRows.length,
		);
		this.totalPages = Math.ceil(this.originalRows.length / this.pageSize);
		this.rows = this.originalRows
			.filter((data) =>
				// Recorremos cada valor del objeto data (todas sus propiedades)
				Object.values(data).some(
					(value) =>
						// Convertimos cada valor a string, independientemente de su tipo
						String(value)
							.toLowerCase() // Convertimos a minúsculas para hacer la comparación
							.includes(this.filterValue.toLowerCase()), // Realizamos la comparación con el filtro
				),
			)
			.slice(this.startIndex, this.endIndex);
	}

	applyFilter(event: Event) {
		this.filterValue = (event.target as HTMLInputElement).value;
		this.currentPage = 1;
		this.updateTable();
	}

	changePage(page: number) {
		if (page > 0 && (page - 1) * this.pageSize < this.originalRows.length) {
			this.currentPage = page;
			this.updateTable();
		}
	}

	goToFirstPage() {
		this.currentPage = 1;
		this.updateTable();
	}

	goToLastPage() {
		this.currentPage = this.totalPages;
		this.updateTable();
	}

	private _pageSize = 10;
	get pageSize(): number {
		return this._pageSize;
	}
	@Input()
	set pageSize(value: number) {
		this._pageSize = +value;
		this.currentPage = 1;
		this.updateTable();
	}

	changePageSize(event: Event) {
		const selectElement = event.target as HTMLSelectElement;
		if (selectElement) this.pageSize = +selectElement.value;
	}
}
