import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-enrollment',
  imports: [],
  templateUrl: './table-enrollment.component.html',
  styleUrl: './table-enrollment.component.css'
})
export class TableEnrollmentComponent {
  @Input() accionVer!: (row: any) => void;
  @Input() accionEnviarEvaluacion!: (row: any) => void;

  @Input() actionContinueRegistration!: (row: any) => void;
  @Input() actionMarkPayment!: (row: any) => void;
  @Input() actionCreateCredentials!: (row: any) => void;
  @Input() actionDeleteEnrollment!: (row: any) => void;

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

  @Input() columnMappings: Record<string, string> = {};
  @Input() filterValue = '';

  rows: any[] = [];
  currentPage = 1;
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
        Object.values(data).some(
          (value) =>
            String(value)
              .toLowerCase()
              .includes(this.filterValue.toLowerCase()),
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

  // MÉTODO PARA DETERMINAR QUÉ BOTÓN MOSTRAR SEGÚN EL ESTADO
  getActionButtonForState(state: string): { text: string; action: string; class: string } | null {
    switch (state) {
      case 'Pendiente':
        return { text: 'Enviar a evaluación', action: 'enviarEvaluacion', class: 'btn-warning' };
      case 'Evaluado':
        return { text: 'Continuar con la matrícula', action: 'continuarMatricula', class: 'btn-primary' };
      case 'Rechazado':
        return null; // No mostrar botón
      case 'Ticket generado':
        return { text: 'Marcar pago', action: 'marcarPago', class: 'btn-success' };
      case 'Aprobado':
        return { text: 'Crear credenciales', action: 'crearCredenciales', class: 'btn-info' };
      default:
        return null;
    }
  }

  // MÉTODO PARA EJECUTAR LA ACCIÓN CORRESPONDIENTE
  executeAction(action: string, row: any) {
    switch (action) {
      case 'enviarEvaluacion':
        this.accionEnviarEvaluacion(row);
        break;

      case 'continuarMatricula':
        this.actionContinueRegistration(row);
        break;
      case 'marcarPago':
        this.actionMarkPayment(row);
        break;
      case 'crearCredenciales':
        this.actionCreateCredentials(row);
        break;
      case 'eliminarInscripcion':
      this.actionDeleteEnrollment(row);
      break;
    }
  }

  // MÉTODO PARA OBTENER LA CLASE CSS DEL ESTADO
  getStateClass(state: string): string {
    switch (state) {
      case 'Pendiente':
        return 'badge bg-warning text-dark';
      case 'Evaluado':
        return 'badge bg-info text-white';
      case 'Rechazado':
        return 'badge bg-danger text-white';
      case 'Ticket generado':
        return 'badge bg-primary text-white';
      case 'Aprobado':
        return 'badge bg-success text-white';
      default:
        return 'badge bg-secondary text-white';
    }
  }
}