import { Injectable } from "@angular/core"
import { type Observable, of } from "rxjs"
import { delay } from "rxjs/operators"
import type {
  Caja,
  Usuario,
  ProductoServicio,
  Estudiante,
  Venta,
  Egreso,
  Boleta,
  ReporteCaja,
  ReporteVentas,
  DetalleVenta,
  Sede,
} from "./cash-register-interfaces"

@Injectable({
  providedIn: "root",
})
export class CashRegisterService {
  // Datos ficticios
  private sedes: Sede[] = [
    { id: 1, nombre: "Sede Principal", direccion: "Av. Principal 123" },
    { id: 2, nombre: "Sede Norte", direccion: "Av. Norte 456" },
    { id: 3, nombre: "Sede Sur", direccion: "Av. Sur 789" },
  ]

  private usuarios: Usuario[] = [
    { id: 1, nombre: "María García", email: "maria@colegio.com" },
    { id: 2, nombre: "Juan Pérez", email: "juan@colegio.com" },
    { id: 3, nombre: "Ana López", email: "ana@colegio.com" },
  ]

  private productosServicios: ProductoServicio[] = [
    { id: 1, tipo: "servicio", nombre: "Matrícula", descripcion: "Matrícula anual", precio: 350.0, activo: true },
    { id: 2, tipo: "servicio", nombre: "Cuota Mensual", descripcion: "Pensión mensual", precio: 280.0, activo: true },
    {
      id: 3,
      tipo: "producto",
      nombre: "Agenda Escolar",
      descripcion: "Agenda 2024",
      precio: 25.0,
      stock: 50,
      activo: true,
    },
    {
      id: 4,
      tipo: "producto",
      nombre: "Uniforme Completo",
      descripcion: "Uniforme escolar completo",
      precio: 120.0,
      stock: 30,
      activo: true,
    },
    {
      id: 5,
      tipo: "servicio",
      nombre: "Certificado de Estudios",
      descripcion: "Certificado oficial",
      precio: 15.0,
      activo: true,
    },
    {
      id: 6,
      tipo: "producto",
      nombre: "Libros de Texto",
      descripcion: "Set de libros por grado",
      precio: 85.0,
      stock: 25,
      activo: true,
    },
  ]

  private estudiantes: Estudiante[] = [
    { id: 1, nombre: "Carlos", apellido: "Mendoza", documento: "12345678" },
    { id: 2, nombre: "Sofía", apellido: "Rodríguez", documento: "87654321" },
    { id: 3, nombre: "Diego", apellido: "Torres", documento: "11223344" },
    { id: 4, nombre: "Valentina", apellido: "Silva", documento: "44332211" },
    { id: 5, nombre: "Mateo", apellido: "Vargas", documento: "55667788" },
  ]

  private cajas: Caja[] = [
    {
      id: 1,
      sede_id: 1,
      usuario_id: 1,
      fecha_apertura: "2024-01-15T08:00:00",
      monto_apertura: 100.0,
      fecha_cierre: "2024-01-15T18:00:00",
      monto_cierre: 1250.0,
      estado: "cerrada",
      observaciones: "Día normal de operaciones",
      total_ingresos: 1150.0,
      total_egresos: 0.0,
      diferencia: 1150.0,
    },
    {
      id: 2,
      sede_id: 1,
      usuario_id: 2,
      fecha_apertura: "2024-01-16T08:00:00",
      monto_apertura: 100.0,
      estado: "abierta",
      observaciones: "Caja actual",
      total_ingresos: 850.0,
      total_egresos: 45.0,
      diferencia: 805.0,
    },
  ]

  private ventas: Venta[] = [
    {
      id: 1,
      estudiante_id: 1,
      caja_id: 1,
      total: 350.0,
      tipo_pago: "efectivo",
      tipo_documento: "boleta",
      numero_documento: "B001-00001",
      fecha: "2024-01-15T09:30:00",
      observaciones: "Matrícula 2024",
    },
    {
      id: 2,
      estudiante_id: 2,
      caja_id: 1,
      total: 280.0,
      tipo_pago: "yape",
      tipo_documento: "boleta",
      numero_documento: "B001-00002",
      fecha: "2024-01-15T10:15:00",
      observaciones: "Cuota enero",
    },
    {
      id: 3,
      estudiante_id: 3,
      caja_id: 2,
      total: 145.0,
      tipo_pago: "tarjeta",
      tipo_documento: "boleta",
      numero_documento: "B001-00003",
      fecha: "2024-01-16T11:00:00",
      observaciones: "Agenda + Uniforme",
    },
  ]

  private egresos: Egreso[] = [
    {
      id: 1,
      caja_id: 2,
      usuario_id: 2,
      descripcion: "Compra de útiles de oficina",
      monto: 25.0,
      tipo: "suministros",
      fecha: "2024-01-16T14:30:00",
      observaciones: "Papel, lapiceros, etc.",
    },
    {
      id: 2,
      caja_id: 2,
      usuario_id: 2,
      descripcion: "Pago de delivery",
      monto: 20.0,
      tipo: "servicios",
      fecha: "2024-01-16T12:45:00",
      observaciones: "Almuerzo para personal",
    },
  ]

  // Métodos del servicio
  getSedes(): Observable<Sede[]> {
    return of(this.sedes).pipe(delay(300))
  }

  getUsuarios(): Observable<Usuario[]> {
    return of(this.usuarios).pipe(delay(300))
  }

  getProductosServicios(): Observable<ProductoServicio[]> {
    return of(this.productosServicios).pipe(delay(300))
  }

  getEstudiantes(): Observable<Estudiante[]> {
    return of(this.estudiantes).pipe(delay(300))
  }

  getCajas(): Observable<Caja[]> {
    const cajasConRelaciones = this.cajas.map((caja) => ({
      ...caja,
      sede: this.sedes.find((s) => s.id === caja.sede_id),
      usuario: this.usuarios.find((u) => u.id === caja.usuario_id),
    }))
    return of(cajasConRelaciones).pipe(delay(300))
  }

  getCajaActiva(): Observable<Caja | null> {
    const cajaActiva = this.cajas.find((c) => c.estado === "abierta")
    if (cajaActiva) {
      const cajaConRelaciones = {
        ...cajaActiva,
        sede: this.sedes.find((s) => s.id === cajaActiva.sede_id),
        usuario: this.usuarios.find((u) => u.id === cajaActiva.usuario_id),
      }
      return of(cajaConRelaciones).pipe(delay(300))
    }
    return of(null).pipe(delay(300))
  }

  abrirCaja(data: {
    sede_id: number
    usuario_id: number
    monto_apertura: number
    observaciones?: string
  }): Observable<Caja> {
    const nuevaCaja: Caja = {
      id: this.cajas.length + 1,
      sede_id: data.sede_id,
      usuario_id: data.usuario_id,
      fecha_apertura: new Date().toISOString(),
      monto_apertura: data.monto_apertura,
      estado: "abierta",
      observaciones: data.observaciones,
      total_ingresos: 0,
      total_egresos: 0,
      diferencia: 0,
    }
    this.cajas.push(nuevaCaja)
    return of(nuevaCaja).pipe(delay(500))
  }

  cerrarCaja(cajaId: number, data: { monto_cierre: number; observaciones?: string }): Observable<Caja> {
    const caja = this.cajas.find((c) => c.id === cajaId)
    if (caja) {
      caja.fecha_cierre = new Date().toISOString()
      caja.monto_cierre = data.monto_cierre
      caja.estado = "cerrada"
      caja.observaciones = data.observaciones
    }
    return of(caja!).pipe(delay(500))
  }

  registrarVenta(ventaData: Partial<Venta>, detalles: Partial<DetalleVenta>[]): Observable<Venta> {
    const nuevaVenta: Venta = {
      id: this.ventas.length + 1,
      estudiante_id: ventaData.estudiante_id,
      caja_id: ventaData.caja_id!,
      total: ventaData.total!,
      tipo_pago: ventaData.tipo_pago!,
      tipo_documento: ventaData.tipo_documento!,
      numero_documento: ventaData.numero_documento,
      observaciones: ventaData.observaciones,
      fecha: new Date().toISOString(),
    }
    this.ventas.push(nuevaVenta)

    // Actualizar totales de caja
    const caja = this.cajas.find((c) => c.id === nuevaVenta.caja_id)
    if (caja) {
      caja.total_ingresos = (caja.total_ingresos || 0) + nuevaVenta.total
      caja.diferencia = (caja.total_ingresos || 0) - (caja.total_egresos || 0)
    }

    return of(nuevaVenta).pipe(delay(500))
  }

  registrarEgreso(egresoData: Partial<Egreso>): Observable<Egreso> {
    const nuevoEgreso: Egreso = {
      id: this.egresos.length + 1,
      caja_id: egresoData.caja_id!,
      usuario_id: egresoData.usuario_id!,
      descripcion: egresoData.descripcion!,
      monto: egresoData.monto!,
      tipo: egresoData.tipo!,
      fecha: new Date().toISOString(),
      observaciones: egresoData.observaciones,
    }
    this.egresos.push(nuevoEgreso)

    // Actualizar totales de caja
    const caja = this.cajas.find((c) => c.id === nuevoEgreso.caja_id)
    if (caja) {
      caja.total_egresos = (caja.total_egresos || 0) + nuevoEgreso.monto
      caja.diferencia = (caja.total_ingresos || 0) - (caja.total_egresos || 0)
    }

    return of(nuevoEgreso).pipe(delay(500))
  }

  getVentasPorCaja(cajaId: number): Observable<Venta[]> {
    const ventasCaja = this.ventas
      .filter((v) => v.caja_id === cajaId)
      .map((venta) => ({
        ...venta,
        estudiante: this.estudiantes.find((e) => e.id === venta.estudiante_id),
      }))
    return of(ventasCaja).pipe(delay(300))
  }

  getEgresosPorCaja(cajaId: number): Observable<Egreso[]> {
    const egresosCaja = this.egresos
      .filter((e) => e.caja_id === cajaId)
      .map((egreso) => ({
        ...egreso,
        usuario: this.usuarios.find((u) => u.id === egreso.usuario_id),
      }))
    return of(egresosCaja).pipe(delay(300))
  }

  generarBoleta(
    ventaId: number,
    datosCliente?: { ruc?: string; razon_social?: string; direccion?: string },
  ): Observable<Boleta> {
    const venta = this.ventas.find((v) => v.id === ventaId)
    if (!venta) throw new Error("Venta no encontrada")

    const boleta: Boleta = {
      id: Date.now(), // Simulando ID único
      venta_id: ventaId,
      tipo_comprobante: datosCliente?.ruc ? "factura" : "boleta",
      numero: `${datosCliente?.ruc ? "F" : "B"}001-${String(Date.now()).slice(-5)}`,
      ruc_cliente: datosCliente?.ruc,
      razon_social_cliente: datosCliente?.razon_social,
      direccion_cliente: datosCliente?.direccion,
      fecha_emision: new Date().toISOString(),
      venta: venta,
    }

    return of(boleta).pipe(delay(500))
  }

  // Métodos para reportes
  getReporteCierreCaja(fechaInicio: string, fechaFin: string): Observable<ReporteCaja[]> {
    const reportes: ReporteCaja[] = [
      {
        fecha: "2024-01-15",
        sede: "Sede Principal",
        total_ingresos: 1150.0,
        total_egresos: 0.0,
        diferencia: 1150.0,
        numero_ventas: 4,
        numero_egresos: 0,
      },
      {
        fecha: "2024-01-16",
        sede: "Sede Principal",
        total_ingresos: 850.0,
        total_egresos: 45.0,
        diferencia: 805.0,
        numero_ventas: 3,
        numero_egresos: 2,
      },
    ]
    return of(reportes).pipe(delay(500))
  }

  getReporteVentas(filtros: any): Observable<ReporteVentas[]> {
    const reportes: ReporteVentas[] = [
      {
        periodo: "Enero 2024",
        sede: "Sede Principal",
        total_ventas: 2000.0,
        cantidad_transacciones: 7,
        promedio_venta: 285.71,
      },
      {
        periodo: "Enero 2024",
        sede: "Sede Norte",
        total_ventas: 1500.0,
        cantidad_transacciones: 5,
        promedio_venta: 300.0,
      },
    ]
    return of(reportes).pipe(delay(500))
  }
}
