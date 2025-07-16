import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, Output } from '@angular/core';
import { PanelHeaderComponent } from '../dashboard/shared-components/panel-header/panel-header.component';
import { ActivatedRoute, Router } from '@angular/router';


import { USERS } from '../../admin/utility/db-simulator';
import { UserDataAll } from '../../admin/services/users.service';


@Component({
  selector: 'app-header-dinamic',
  imports: [PanelHeaderComponent, CommonModule],
  templateUrl: './header-dinamic.component.html',
  styleUrl: './header-dinamic.component.css'
})
export class HeaderDinamicComponent implements OnInit  {

  private route = inject(ActivatedRoute)
  private router = inject(Router)

  student: UserDataAll | null = null
  studentId = 0
  activeTab = "ficha" // Tab activo por defecto

  // Datos procesados para pagos
  allPayments: any[] = []
  totalPaid = 0
  totalPending = 0
  hasDebt = false

  // Tabs disponibles
  tabs = [
    { id: "ficha", label: "Ficha Personal", icon: "fas fa-user" },
    { id: "pagos", label: "Pagos", icon: "fas fa-credit-card" },
    { id: "cursos", label: "Cursos", icon: "fas fa-book" },
    { id: "notas", label: "Notas", icon: "fas fa-chart-line" },
    { id: "asistencia", label: "Asistencia", icon: "fas fa-calendar-check" },
    { id: "documentos", label: "Documentos", icon: "fas fa-file-alt" },
  ]

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.studentId = +params["id"]
      this.loadStudentData()
    })

    // Escuchar cambios en query params para el tab
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["tab"]) {
        this.activeTab = queryParams["tab"]
      }
    })
  }

  loadStudentData() {
    this.student = USERS.find((user) => user.userId === this.studentId && user.role === "student") || null

    if (!this.student) {
      console.error("Estudiante no encontrado")
      this.router.navigate(["/admin/panel/estudiantes-matriculados"])
      return
    }

    // Procesar datos de pagos
    this.processPaymentData()
  }

  processPaymentData() {
    if (!this.student) return

    this.allPayments = []
    this.totalPaid = 0
    this.totalPending = 0

    // ✅ SOLO procesar pagos si existen en la base de datos
    if (this.student.student?.levels && this.student.student.levels.length > 0) {
      this.processLevelsPayments()
    }

    this.checkDebtStatus()
    this.sortPayments()
  }

  processLevelsPayments() {
    if (!this.student?.student?.levels) return

    for (const level of this.student.student.levels) {
      if (level.payments && level.payments.length > 0) {
        for (const payment of level.payments) {
          const amount = 350
          const isOverdue = !payment.paid && this.isOverdue(payment.dueDate)

          this.allPayments.push({
            level: level.levelName,
            month: payment.month,
            year: payment.year,
            dueDate: payment.dueDate,
            paid: payment.paid,
            paidDate: payment.paidDate || null,
            amount: amount,
            status: payment.paid ? "Pagado" : "Pendiente",
            isOverdue: isOverdue,
          })

          if (payment.paid) {
            this.totalPaid += amount
          } else {
            this.totalPending += amount
          }
        }
      }
    }
  }

  isOverdue(dueDate: string): boolean {
    const today = new Date()
    const due = new Date(dueDate.split("/").reverse().join("-"))
    return today > due
  }

  checkDebtStatus() {
    this.hasDebt = this.allPayments.some((payment) => !payment.paid && payment.isOverdue)
  }

  sortPayments() {
    this.allPayments.sort((a, b) => {
      const dateA = new Date(a.dueDate.split("/").reverse().join("-"))
      const dateB = new Date(b.dueDate.split("/").reverse().join("-"))
      return dateB.getTime() - dateA.getTime()
    })
  }

  // ✅ MÉTODOS PARA EVITAR ERRORES DE PARSING EN EL TEMPLATE
  getOverduePaymentsTotal(): number {
    return this.overduePayments.reduce((sum, p) => sum + p.amount, 0)
  }

  // Obtener pagos vencidos
  get overduePayments() {
    return this.allPayments.filter((payment) => !payment.paid && payment.isOverdue)
  }

  // Obtener próximos pagos
  get upcomingPayments() {
    return this.allPayments.filter((payment) => !payment.paid && !payment.isOverdue)
  }

  // Obtener pagos realizados
  get completedPayments() {
    return this.allPayments.filter((payment) => payment.paid)
  }

  // Cambiar tab activo
  setActiveTab(tabId: string) {
    this.activeTab = tabId
    // Actualizar URL con query param
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tabId },
      queryParamsHandling: "merge",
    })
  }

  // ✅ MÉTODO SEGURO PARA FORMATEAR FECHA
  formatDate(dateString: string | undefined): string {
    if (!dateString) return "-"

    try {
      const [day, month, year] = dateString.split("/")
      const date = new Date(+year, +month - 1, +day)
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      return dateString || "-"
    }
  }

  // ✅ MÉTODO SEGURO PARA FORMATEAR FECHA Y HORA
  formatDateTime(dateString: string | undefined): string {
    if (!dateString) return "-"

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return dateString || "-"
    }
  }

  // ✅ MÉTODO SEGURO PARA FORMATEAR FECHA DE NACIMIENTO
  formatBirthDate(dateString: string | undefined): string {
    if (!dateString) return "-"

    try {
      // Si viene en formato YYYY-MM-DD, convertir a DD/MM/YYYY
      if (dateString.includes("-")) {
        const reversedDate = dateString.split("-").reverse().join("/")
        return this.formatDate(reversedDate)
      }
      return this.formatDate(dateString)
    } catch (error) {
      return dateString || "-"
    }
  }

  // Calcular días de retraso
  getDaysOverdue(payment: any): number {
    if (payment.paid || !payment.isOverdue) return 0

    const today = new Date()
    const dueDate = new Date(payment.dueDate.split("/").reverse().join("-"))
    return Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
  }
}
