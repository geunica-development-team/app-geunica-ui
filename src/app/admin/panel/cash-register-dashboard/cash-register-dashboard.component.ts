import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CashRegisterService } from '../../services/cash-register.service';
import { Caja,
  Sede,
  Usuario,
  ProductoServicio,
  Estudiante,
  Venta,
  Egreso,


} from '../../services/cash-register-interfaces';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cash-register-dashboard',
  imports: [FormsModule],
  templateUrl: './cash-register-dashboard.component.html',
  styleUrl: './cash-register-dashboard.component.css'
})
export class CashRegisterDashboardComponent implements OnInit{
private modalService = inject(NgbModal)
  private toastr = inject(ToastrService)
  private cashService = inject(CashRegisterService)

  // Estado principal
  cajaActiva: Caja | null = null
  sedes: Sede[] = []
  usuarios: Usuario[] = []
  productosServicios: ProductoServicio[] = []
  estudiantes: Estudiante[] = []
  ventasHoy: Venta[] = []
  egresosHoy: Egreso[] = []

  // Formularios
  aperturaForm = {
    sede_id: 0,
    usuario_id: 0,
    monto_apertura: 100,
    observaciones: "",
  }

  cierreForm = {
    monto_cierre: 0,
    observaciones: "",
  }

  ventaForm = {
    estudiante_id: null as number | null,
    tipo_pago: "efectivo" as "efectivo" | "tarjeta" | "yape" | "plin" | "transferencia",
    tipo_documento: "boleta" as "boleta" | "factura" | "sin_documento",
    observaciones: "",
    detalles: [] as Array<{
      producto_servicio_id: number
      cantidad: number
      precio_unitario: number
      subtotal: number
    }>,
  }

  egresoForm = {
    descripcion: "",
    monto: 0,
    tipo: "",
    observaciones: "",
  }

  // Estados de carga
  loading = false
  loadingApertura = false
  loadingCierre = false
  loadingVenta = false
  loadingEgreso = false

  @ViewChild("modalApertura") modalApertura!: TemplateRef<any>
  @ViewChild("modalCierre") modalCierre!: TemplateRef<any>
  @ViewChild("modalVenta") modalVenta!: TemplateRef<any>
  @ViewChild("modalEgreso") modalEgreso!: TemplateRef<any>
  @ViewChild("modalBoleta") modalBoleta!: TemplateRef<any>

  ngOnInit() {
    this.loadInitialData()
  }

  loadInitialData() {
    this.loading = true

    // Cargar datos básicos
    this.cashService.getSedes().subscribe((sedes) => (this.sedes = sedes))
    this.cashService.getUsuarios().subscribe((usuarios) => (this.usuarios = usuarios))
    this.cashService.getProductosServicios().subscribe((productos) => (this.productosServicios = productos))
    this.cashService.getEstudiantes().subscribe((estudiantes) => (this.estudiantes = estudiantes))

    // Cargar caja activa
    this.cashService.getCajaActiva().subscribe((caja) => {
      this.cajaActiva = caja
      if (caja) {
        this.loadMovimientosCaja(caja.id)
      }
      this.loading = false
    })
  }

  loadMovimientosCaja(cajaId: number) {
    this.cashService.getVentasPorCaja(cajaId).subscribe((ventas) => (this.ventasHoy = ventas))
    this.cashService.getEgresosPorCaja(cajaId).subscribe((egresos) => (this.egresosHoy = egresos))
  }

  // Apertura de caja
  openModalApertura() {
    this.aperturaForm = {
      sede_id: 0,
      usuario_id: 0,
      monto_apertura: 100,
      observaciones: "",
    }
    this.modalService.open(this.modalApertura, { centered: true, size: "md" })
  }

  abrirCaja() {
    if (this.aperturaForm.sede_id === 0 || this.aperturaForm.usuario_id === 0) {
      this.toastr.warning("Debe seleccionar sede y usuario", "Datos incompletos")
      return
    }

    this.loadingApertura = true
    this.cashService.abrirCaja(this.aperturaForm).subscribe({
      next: (caja) => {
        this.cajaActiva = caja
        this.toastr.success("Caja abierta exitosamente", "Éxito")
        this.modalService.dismissAll()
        this.loadingApertura = false
      },
      error: (error) => {
        this.toastr.error("Error al abrir caja", "Error")
        this.loadingApertura = false
      },
    })
  }

  // Cierre de caja
  openModalCierre() {
    if (!this.cajaActiva) return

    this.cierreForm = {
      monto_cierre: (this.cajaActiva.monto_apertura || 0) + (this.cajaActiva.diferencia || 0),
      observaciones: "",
    }
    this.modalService.open(this.modalCierre, { centered: true, size: "md" })
  }

  cerrarCaja() {
    if (!this.cajaActiva) return

    this.loadingCierre = true
    this.cashService.cerrarCaja(this.cajaActiva.id, this.cierreForm).subscribe({
      next: (caja) => {
        this.cajaActiva = null
        this.ventasHoy = []
        this.egresosHoy = []
        this.toastr.success("Caja cerrada exitosamente", "Éxito")
        this.modalService.dismissAll()
        this.loadingCierre = false
      },
      error: (error) => {
        this.toastr.error("Error al cerrar caja", "Error")
        this.loadingCierre = false
      },
    })
  }

  // Registro de ventas
  openModalVenta() {
    if (!this.cajaActiva) {
      this.toastr.warning("Debe abrir una caja primero", "Caja cerrada")
      return
    }

    this.ventaForm = {
      estudiante_id: null,
      tipo_pago: "efectivo",
      tipo_documento: "boleta",
      observaciones: "",
      detalles: [],
    }
    this.agregarDetalleVenta()
    this.modalService.open(this.modalVenta, { centered: true, size: "lg" })
  }

  agregarDetalleVenta() {
    this.ventaForm.detalles.push({
      producto_servicio_id: 0,
      cantidad: 1,
      precio_unitario: 0,
      subtotal: 0,
    })
  }

  eliminarDetalleVenta(index: number) {
    this.ventaForm.detalles.splice(index, 1)
  }

  onProductoChange(detalle: any) {
    const producto = this.productosServicios.find((p) => p.id === detalle.producto_servicio_id)
    if (producto) {
      detalle.precio_unitario = producto.precio
      this.calcularSubtotal(detalle)
    }
  }

  calcularSubtotal(detalle: any) {
    detalle.subtotal = detalle.cantidad * detalle.precio_unitario
  }

  getTotalVenta(): number {
    return this.ventaForm.detalles.reduce((total, detalle) => total + detalle.subtotal, 0)
  }

  registrarVenta() {
    if (!this.cajaActiva || this.ventaForm.detalles.length === 0) {
      this.toastr.warning("Debe agregar al menos un producto/servicio", "Datos incompletos")
      return
    }

    const ventaData = {
      estudiante_id: this.ventaForm.estudiante_id,
      caja_id: this.cajaActiva.id,
      total: this.getTotalVenta(),
      tipo_pago: this.ventaForm.tipo_pago,
      tipo_documento: this.ventaForm.tipo_documento,
      numero_documento:
        this.ventaForm.tipo_documento !== "sin_documento" ? `B001-${Date.now().toString().slice(-5)}` : undefined,
      observaciones: this.ventaForm.observaciones,
    }

    this.loadingVenta = true
    this.cashService.registrarVenta(ventaData, this.ventaForm.detalles).subscribe({
      next: (venta) => {
        this.toastr.success("Venta registrada exitosamente", "Éxito")
        this.loadMovimientosCaja(this.cajaActiva!.id)
        this.modalService.dismissAll()
        this.loadingVenta = false

        // Preguntar si desea generar boleta
        if (venta.tipo_documento !== "sin_documento") {
          this.generarBoleta(venta.id)
        }
      },
      error: (error) => {
        this.toastr.error("Error al registrar venta", "Error")
        this.loadingVenta = false
      },
    })
  }

  // Registro de egresos
  openModalEgreso() {
    if (!this.cajaActiva) {
      this.toastr.warning("Debe abrir una caja primero", "Caja cerrada")
      return
    }

    this.egresoForm = {
      descripcion: "",
      monto: 0,
      tipo: "",
      observaciones: "",
    }
    this.modalService.open(this.modalEgreso, { centered: true, size: "md" })
  }

  registrarEgreso() {
    if (!this.cajaActiva || !this.egresoForm.descripcion || this.egresoForm.monto <= 0) {
      this.toastr.warning("Complete todos los campos obligatorios", "Datos incompletos")
      return
    }

    const egresoData = {
      caja_id: this.cajaActiva.id,
      usuario_id: this.cajaActiva.usuario_id,
      descripcion: this.egresoForm.descripcion,
      monto: this.egresoForm.monto,
      tipo: this.egresoForm.tipo,
      observaciones: this.egresoForm.observaciones,
    }

    this.loadingEgreso = true
    this.cashService.registrarEgreso(egresoData).subscribe({
      next: (egreso) => {
        this.toastr.success("Egreso registrado exitosamente", "Éxito")
        this.loadMovimientosCaja(this.cajaActiva!.id)
        this.modalService.dismissAll()
        this.loadingEgreso = false
      },
      error: (error) => {
        this.toastr.error("Error al registrar egreso", "Error")
        this.loadingEgreso = false
      },
    })
  }

  // Generación de boletas
  generarBoleta(ventaId: number) {
    this.cashService.generarBoleta(ventaId).subscribe({
      next: (boleta) => {
        this.toastr.success(`Boleta ${boleta.numero} generada exitosamente`, "Éxito")
        // Aquí podrías abrir un modal para mostrar la boleta o descargarla
      },
      error: (error) => {
        this.toastr.error("Error al generar boleta", "Error")
      },
    })
  }

  // Métodos helper
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(amount)
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString("es-PE")
  }

  getEstudianteNombre(estudianteId?: number): string {
    if (!estudianteId) return "Cliente general"
    const estudiante = this.estudiantes.find((e) => e.id === estudianteId)
    return estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : "Estudiante no encontrado"
  }

  getProductoNombre(productoId: number): string {
    const producto = this.productosServicios.find((p) => p.id === productoId)
    return producto ? producto.nombre : "Producto no encontrado"
  }

  canCloseCaja(): boolean {
    if (!this.cajaActiva) return false
    // Verificar que todo esté cuadrado (opcional: agregar más validaciones)
    return true
  }
}
