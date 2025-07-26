import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table-enrollment',
  imports: [],
  templateUrl: './table-enrollment.component.html',
  styleUrl: './table-enrollment.component.css'
})
export class TableEnrollmentComponent {
  @Input() accionEnviarEvaluacion!: (row: any) => void
  @Input() accionAnularEvaluacion!: (row: any) => void
  @Input() accionRestaurarInscripcion!: (row: any) => void
  @Input() actionContinueRegistration!: (row: any) => void
  @Input() actionMarkPayment!: (row: any) => void
  @Input() actionDeleteEnrollment!: (row: any) => void
  @Input() actionReadEnrollment!: (row: any) => void
  @Input() columns: string[] = []

  // INPUTS PARA FILTROS CON SETTERS
  private _statusFilter = ""
  @Input()
  set statusFilter(value: string) {
    this._statusFilter = value
    this.updateTable()
  }
  get statusFilter(): string {
    return this._statusFilter
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

  //#region originalRows
  private _originalRows: any[] = []
  @Input()
  set originalRows(value: any[]) {
    this._originalRows = value
    this.updateTable()
  }
  get originalRows() {
    return this._originalRows
  }
  //#endregion

  @Input() columnMappings: Record<string, string> = {}
  @Input() filterValue = ""
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
      if (this._statusFilter && this._statusFilter.trim() !== "") {
        statusMatch = data[this.columnMappings["Estado Inscripción"]] === this._statusFilter
      }

      // Filtro por búsqueda
      let searchMatch = true
      if (this._searchFilter && this._searchFilter.trim() !== "") {
        searchMatch = Object.values(data).some((value) =>
          String(value).toLowerCase().includes(this._searchFilter.toLowerCase()),
        )
      }

      return statusMatch && searchMatch
    })

    // 👉 ORDENAR POR ID (de menor a mayor)
    const idKey = this.columnMappings["ID"] || "id" // Ajusta si tu mapeo usa otro nombre
    this.filteredRows.sort((a, b) => a[idKey] - b[idKey])

    // Calcular paginación
    this.totalPages = Math.ceil(this.filteredRows.length / this.pageSize)

    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = 1
    }

    this.startIndex = (this.currentPage - 1) * this.pageSize
    this.endIndex = Math.min(this.startIndex + this.pageSize, this.filteredRows.length)

    this.rows = this.filteredRows.slice(this.startIndex, this.endIndex)
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

  getActionButtonForState(state: string): { text: string; action: string; class: string } | null {
    switch (state) {
      case "Pendiente":
        return { text: "Enviar a evaluación", action: "enviarEvaluacion", class: "btn-enviarEvaluacion" }
      case "Evaluación en proceso":
        return { text: "Anular evaluación", action: "anularEvaluacion", class: "btn-anularEvaluacion" }
      case "Evaluado":
        return { text: "Continuar con la matrícula", action: "continuarMatricula", class: "btn-continuarMatricula" }
      case "Rechazado":
        return { text: "Restaurar inscripción", action: "restaurarInscripcion", class: "btn-restaurarInscripcion" }
      case "Pago pendiente":
        return { text: "Marcar pago", action: "marcarPago", class: "btn-marcarPago" }
      case "Matriculado":
        return null
      default:
        return null
    }
  }

  executeAction(action: string, row: any) {
    switch (action) {
      case "enviarEvaluacion":
        this.accionEnviarEvaluacion(row)
        break
      case "anularEvaluacion":
        this.accionAnularEvaluacion(row)
        break
      case "continuarMatricula":
        this.actionContinueRegistration(row)
        break
      case "restaurarInscripcion":
        this.accionRestaurarInscripcion(row)
        break
      case "marcarPago":
        this.actionMarkPayment(row)
        break
    }
  }

  getStateClass(state: string): string {
    switch (state) {
      case "Pendiente":
        return "badge estadoPendiente"
      case "Evaluación en proceso":
        return "badge estadoEvaluacionEnProceso"
      case "Evaluado":
        return "badge estadoEvaluado"
      case "Rechazado":
        return "badge estadoRechazado"
      case "Pago pendiente":
        return "badge estadoPagoPendiente"
      case "Matriculado":
        return "badge estadoMatriculado"
      default:
        return "badge bg-light text-dark"
    }
  }
}