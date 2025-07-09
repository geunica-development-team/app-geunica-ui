import { CommonModule } from "@angular/common"
import { Component, Input } from "@angular/core"

@Component({
  selector: "app-table",
  imports: [CommonModule],
  templateUrl: "./table.component.html",
  styleUrl: "./table.component.css",
})
export class TableComponent {
  @Input() accionEditar!: (row: any) => void
  @Input() accionEliminar!: (row: any) => void
  @Input() accionVer!: (row: any) => void
  @Input() accionVerDeuda!: (row: any) => void
  @Input() acciones!: boolean
  @Input() editarFila!: boolean
  @Input() eliminarFila!: boolean
  @Input() verFila!: boolean
  @Input() verPagos = false
  @Input() columns: string[] = []

  // FILTROS OPCIONALES
  private _statusFilter = ""
  @Input()
  set statusFilter(value: string) {
    this._statusFilter = value
    this.updateTable()
  }
  get statusFilter(): string {
    return this._statusFilter
  }

  private _debtFilter = ""
  @Input()
  set debtFilter(value: string) {
    this._debtFilter = value
    this.updateTable()
  }
  get debtFilter(): string {
    return this._debtFilter
  }

  private _searchFilter = ""
  @Input()
  set searchFilter(value: string) {
    this._searchFilter = value
    this.updateTable()
  }
  get searchFilter(): string {
    return this._searchFilter
  }

  @Input() statusColumnKey = ""

  private _originalRows: any[] = []
  @Input()
  set originalRows(value: any[]) {
    this._originalRows = value
    this.updateTable()
  }
  get originalRows() {
    return this._originalRows
  }

  @Input() columnMappings: Record<string, string> = {}
  @Input() filterValue = ""

  // Variables de la tabla
  rows: any[] = []
  filteredRows: any[] = []
  currentPage = 1
  totalPages = 0
  startIndex = 0
  endIndex = 0

  updateTable() {
    // Aplicar filtros
    this.filteredRows = this.originalRows.filter((data) => {
      // Filtro por estado
      let statusMatch = true
      if (this._statusFilter && this._statusFilter.trim() !== "" && this.statusColumnKey) {
        statusMatch = data[this.statusColumnKey] === this._statusFilter
      }

      // Filtro por deuda
      let debtMatch = true
      if (this._debtFilter && this._debtFilter.trim() !== "") {
        if (this._debtFilter === "con-deuda") {
          debtMatch = data.hasDebt === true
        } else if (this._debtFilter === "sin-deuda") {
          debtMatch = data.hasDebt === false
        }
      }

      // Filtro por búsqueda
      let searchMatch = true
      const searchTerm = this._searchFilter || this.filterValue
      if (searchTerm && searchTerm.trim() !== "") {
        searchMatch = Object.values(data).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      return statusMatch && debtMatch && searchMatch
    })

    // Calcular paginación
    this.totalPages = Math.ceil(this.filteredRows.length / this.pageSize)
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = 1
    }
    this.startIndex = (this.currentPage - 1) * this.pageSize
    this.endIndex = Math.min(this.startIndex + this.pageSize, this.filteredRows.length)
    this.rows = this.filteredRows.slice(this.startIndex, this.endIndex)
  }

  // Verificar si una columna es de estado
  isStatusColumn(column: string): boolean {
    return column === "Estado Cuenta" || column === "Estado Estudiante"
  }

  // Verificar si es columna de deuda
  isDebtColumn(column: string): boolean {
    return column === "Deuda"
  }

  // Obtener clase CSS para la columna de estado
  getStatusClass(row: any, column: string): string {
    if (column === "Estado Cuenta") {
      return row.statusClass || "badge bg-light text-dark"
    } else if (column === "Estado Estudiante") {
      return row.studentStatusClass || "badge bg-light text-dark"
    }
    return ""
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value
    this.currentPage = 1
    this.updateTable()
  }

  changePage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page
      this.updateTable()
    }
  }

  goToFirstPage() {
    this.currentPage = 1
    this.updateTable()
  }

  goToLastPage() {
    this.currentPage = this.totalPages
    this.updateTable()
  }

  private _pageSize = 10
  get pageSize(): number {
    return this._pageSize
  }

  @Input()
  set pageSize(value: number) {
    this._pageSize = +value
    this.currentPage = 1
    this.updateTable()
  }

  changePageSize(event: Event) {
    const selectElement = event.target as HTMLSelectElement
    if (selectElement) this.pageSize = +selectElement.value
  }
}

