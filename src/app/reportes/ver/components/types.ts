// types.ts - Tipos TypeScript compartidos

export interface ReporteData {
  modulo1?: Modulo1Data
  modulo3?: Modulo3Data
  modulo4?: Modulo4Data
}

export interface Modulo1Data {
  success: boolean
  total_archivos: number
  resultados: ArchivoEstadoCuenta[]
}

export interface ArchivoEstadoCuenta {
  success: boolean
  filename: string
  datos: {
    tipo: string
    banco: string
    numero_cuenta: string
    rfc: string
    periodo: string
    saldo_inicial: string
    total_depositos: string
    total_retiros: string
    saldo_final: string
    por_hoja: {
      [key: string]: HojaEstadoCuenta
    }
  }
}

export interface HojaEstadoCuenta {
  sheet: string
  resumen: {
    banco: string
    numero_cuenta: string
    periodo: string
    total_comisiones: string
    saldo_inicial: string
    total_depositos: string
    total_retiros: string
    saldo_final: string
  }
  conciliacion: {
    saldo_banco: number
    saldo_inicial: number
    mas_depositos: number
    menos_retiros: number
    saldo_final_calculado: number
    saldo_final_archivo: number
    diferencia: number
  }
  movimientos: Movimiento[]
  alertas: any[]
}

export interface Movimiento {
  fecha: string
  concepto: string
  referencia?: string
  cargo: number
  abono: number
  saldo: number
  k_asociacion?: string
  l_tipo?: string
  archivo?: string
  hoja?: string
}

export interface DatosConsolidadosModulo01 {
  allMovements: Movimiento[]
  totalDepositos: number
  totalRetiros: number
  totalComisiones: number
  flujoNeto: number
  allConciliaciones: Conciliacion[]
  uniqueK: string[]
  uniqueL: string[]
  chartData: ChartData
}

export interface Conciliacion {
  archivo: string
  hoja: string
  conciliacion: {
    saldo_banco: number
    saldo_inicial: number
    mas_depositos: number
    menos_retiros: number
    saldo_final_calculado: number
    saldo_final_archivo: number
    diferencia: number
  }
}

export interface ChartData {
  movimientosPorDia: {
    fecha: string
    abonos: number
    cargos: number
    saldo: number | null
  }[]
  tiposLabels: string[]
  tiposData: number[]
  tiposColors: string[]
}

// Módulo 03: XML
export interface Modulo3Data {
  success: boolean
  resumen: {
    total_emitidas: number
    total_recibidas: number
    monto_emitidas: number
    monto_recibidas: number
    coincidencias: number
    porcentaje_match: number
    balance: number
  }
  emitidas: Factura[]
  recibidas: Factura[]
  categorias_emitidas: { [key: string]: CategoriaFactura }
  categorias_recibidas: { [key: string]: CategoriaFactura }
  complementos_emitidos?: Complemento[]
  complementos_recibidos?: Complemento[]
  tiene_complementos_emitidos?: boolean
  tiene_complementos_recibidos?: boolean
}

export interface Factura {
  fecha: string
  folio: string
  uuid: string
  rfc: string
  nombre: string
  razon_social?: string
  subtotal: number
  iva: number
  total: number
  xml_encontrado: boolean
  categoria?: string
}

export interface CategoriaFactura {
  cantidad: number
  monto: number
}

export interface Complemento {
  fecha: string
  uuid: string
  uuid_original: string
  serie: string
  rfc: string
  nombre: string
  subtotal: number
  iva: number
  total: number
  importe_pagado: number
  importe_insoluto: number
}

// Módulo 04: SUA
export interface Modulo4Data {
  success: boolean
  resumen: {
    total_pagar: number
    num_cotizantes: number
  }
  analisis: {
    totales: {
      patronal: number
      obrera: number
    }
  }
}