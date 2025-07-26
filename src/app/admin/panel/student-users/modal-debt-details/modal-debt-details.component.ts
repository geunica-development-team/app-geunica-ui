import { Component, ElementRef, inject, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DebtInfo, LastPaymentInfo } from '../../../services/payments.service';

@Component({
  selector: 'app-modal-debt-details',
  imports: [],
  templateUrl: './modal-debt-details.component.html',
  styleUrl: './modal-debt-details.component.css'
})
export class ModalDebtDetailsComponent {
  private modalService = inject(NgbModal)
  private router = inject(Router)

  currentStudent: any = null
  hasDebt = false

  @ViewChild("modalDebtDetails") modalDebtDetails!: TemplateRef<ElementRef>

  openModal(studentData: any) {
    this.currentStudent = studentData
    this.hasDebt = this.checkHasDebt()

    try {
      const modalRef = this.modalService.open(this.modalDebtDetails, {
        centered: true,
        size: "lg",
        backdrop: "static",
      })
      console.log("✅ Modal abierto exitosamente")
    } catch (error) {
      console.error("❌ Error al abrir modal:", error)
    }
  }

  checkHasDebt(): boolean {
    const today = new Date()
    if (!this.currentStudent?.student?.levels) return false

    for (const level of this.currentStudent.student.levels) {
      if (level.isCurrent && level.payments) {
        for (const payment of level.payments) {
          if (!payment.paid) {
            const dueDate = new Date(payment.dueDate.split("/").reverse().join("-"))
            if (today > dueDate) {
              return true
            }
          }
        }
      }
    }
    return false
  }

  getDebtInfo(): DebtInfo[] {
    const debts: DebtInfo[] = [] // ✅ TIPO EXPLÍCITO

    // ✅ CORREGIDO: Solo procesar si hay datos reales
    if (!this.currentStudent?.student?.levels || this.currentStudent.student.levels.length === 0) {
      return debts // Retornar array vacío, no inventar datos
    }

    const today = new Date()
    for (const level of this.currentStudent.student.levels) {
      if (level.isCurrent && level.payments && level.payments.length > 0) {
        for (const payment of level.payments) {
          if (!payment.paid) {
            const dueDate = new Date(payment.dueDate.split("/").reverse().join("-"))
            if (today > dueDate) {
              debts.push({
                level: level.levelName,
                month: payment.month,
                year: payment.year,
                dueDate: payment.dueDate,
                daysOverdue: Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)),
                amount: 350,
              })
            }
          }
        }
      }
    }
    return debts
  }

  // ✅ NUEVO: Calcular total de deuda
  getTotalDebtAmount(): number {
    return this.getDebtInfo().reduce((total, debt) => total + debt.amount, 0)
  }

  getLastPayment(): LastPaymentInfo | null {
    // ✅ CORREGIDO: Solo procesar si hay datos reales
    if (!this.currentStudent?.student?.levels || this.currentStudent.student.levels.length === 0) {
      return null // Retornar null, no inventar datos
    }

    let lastPayment: LastPaymentInfo | null = null
    let lastDate = new Date(0)

    for (const level of this.currentStudent.student.levels) {
      if (level.payments && level.payments.length > 0) {
        for (const payment of level.payments) {
          if (payment.paid && payment.paidDate) {
            const paidDate = new Date(payment.paidDate.split("/").reverse().join("-"))
            if (paidDate > lastDate) {
              lastDate = paidDate
              lastPayment = {
                level: level.levelName,
                month: payment.month,
                year: payment.year,
                paidDate: payment.paidDate,
                amount: 350,
              }
            }
          }
        }
      }
    }
    return lastPayment
  }

  formatDate(dateString: string): string {
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
      return dateString
    }
  }

  // ✅ NUEVO: Obtener texto del estado del estudiante
  getStudentStatusText(status: string): string {
    switch (status) {
      case "enrolled":
        return "Matriculado"
      case "conditional":
        return "Condicional"
      case "graduated":
        return "Graduado"
      case "withdrawn":
        return "Retirado"
      default:
        return status || "-"
    }
  }

  // ✅ MODIFICADO: Redirigir al tab de pagos
  showPayments() {
    this.modalService.dismissAll() // Cerrar el modal actual
    this.router.navigate(["/admin/panel/estudiantes-matriculados", this.currentStudent.userId], {
      queryParams: { tab: "pagos" },
    })
  }

  onClose() {
    this.modalService.dismissAll()
  }
}
