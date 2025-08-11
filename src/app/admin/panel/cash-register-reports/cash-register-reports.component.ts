import { Component, inject, OnInit } from '@angular/core';
import { CashRegisterService } from '../../services/cash-register.service';
import { ReporteCaja, ReporteVentas, Sede } from '../../services/cash-register-interfaces';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cash-register-reports',
  imports: [FormsModule],
  templateUrl: './cash-register-reports.component.html',
  styleUrl: './cash-register-reports.component.css'
})
export class CashRegisterReportsComponent implements OnInit {
  private cashService = inject(CashRegisterService)

  // Filtros
  filtros = {
    fechaInicio: "",
    fechaFin: "",
    sede: "",
    tipoReporte: "cierre_caja",
  }

  // Datos
  sedes: Sede[] = []
  reportesCaja: ReporteCaja[] = []
  reportesVentas: ReporteVentas[] = []
  loading = false

  // Totales
  totalIngresos = 0
  totalEgresos = 0
  totalDiferencia = 0

  ngOnInit() {
    this.loadSedes()
    this.setDefaultDates()
  }

  loadSedes() {
    this.cashService.getSedes().subscribe((sedes) => (this.sedes = sedes))
  }

  setDefaultDates() {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)

    this.filtros.fechaInicio = firstDay.toISOString().split("T")[0]
    this.filtros.fechaFin = today.toISOString().split("T")[0]
  }

  generarReporte() {
    if (!this.filtros.fechaInicio || !this.filtros.fechaFin) {
      return
    }

    this.loading = true

    if (this.filtros.tipoReporte === "cierre_caja") {
      this.cashService.getReporteCierreCaja(this.filtros.fechaInicio, this.filtros.fechaFin).subscribe({
        next: (reportes) => {
          this.reportesCaja = reportes
          this.calcularTotalesCaja()
          this.loading = false
        },
        error: () => (this.loading = false),
      })
    } else {
      this.cashService.getReporteVentas(this.filtros).subscribe({
        next: (reportes) => {
          this.reportesVentas = reportes
          this.loading = false
        },
        error: () => (this.loading = false),
      })
    }
  }

  calcularTotalesCaja() {
    this.totalIngresos = this.reportesCaja.reduce((sum, r) => sum + r.total_ingresos, 0)
    this.totalEgresos = this.reportesCaja.reduce((sum, r) => sum + r.total_egresos, 0)
    this.totalDiferencia = this.totalIngresos - this.totalEgresos
  }

  exportarExcel() {
    // Implementar exportación a Excel
    console.log("Exportando a Excel...")
  }

  exportarPDF() {
    // Implementar exportación a PDF
    console.log("Exportando a PDF...")
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(amount)
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("es-PE")
  }
}
