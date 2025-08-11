// Interfaces para el sistema de caja
export interface Sede {
  id: number
  nombre: string
  direccion: string
}

export interface Usuario {
  id: number
  nombre: string
  email: string
}

export interface Caja {
  id: number
  sede_id: number
  usuario_id: number
  fecha_apertura: string
  monto_apertura: number
  fecha_cierre?: string
  monto_cierre?: number
  observaciones?: string
  estado: "abierta" | "cerrada"
  sede?: Sede
  usuario?: Usuario
  total_ingresos?: number
  total_egresos?: number
  diferencia?: number
}

export interface ProductoServicio {
  id: number
  tipo: "producto" | "servicio"
  nombre: string
  descripcion?: string
  precio: number
  stock?: number
  activo: boolean
}

export interface Estudiante {
  id: number
  nombre: string
  apellido: string
  documento: string
}

export interface Venta {
  id: number
  estudiante_id?: number | null
  caja_id: number
  total: number
  tipo_pago: "efectivo" | "tarjeta" | "yape" | "plin" | "transferencia"
  tipo_documento: "boleta" | "factura" | "sin_documento"
  numero_documento?: string
  observaciones?: string
  fecha: string
  estudiante?: Estudiante
  detalles?: DetalleVenta[]
}

export interface DetalleVenta {
  id: number
  venta_id: number
  producto_servicio_id: number
  cantidad: number
  precio_unitario: number
  subtotal: number
  producto_servicio?: ProductoServicio
}

export interface Egreso {
  id: number
  caja_id: number
  usuario_id: number
  descripcion: string
  monto: number
  tipo: string
  fecha: string
  observaciones?: string
  usuario?: Usuario
}

export interface Boleta {
  id: number
  venta_id: number
  tipo_comprobante: "boleta" | "factura"
  numero: string
  ruc_cliente?: string
  razon_social_cliente?: string
  direccion_cliente?: string
  fecha_emision: string
  venta?: Venta
}

export interface ReporteCaja {
  fecha: string
  sede: string
  total_ingresos: number
  total_egresos: number
  diferencia: number
  numero_ventas: number
  numero_egresos: number
}

export interface ReporteVentas {
  periodo: string
  sede?: string
  tipo_producto?: string
  estudiante?: string
  total_ventas: number
  cantidad_transacciones: number
  promedio_venta: number
}
