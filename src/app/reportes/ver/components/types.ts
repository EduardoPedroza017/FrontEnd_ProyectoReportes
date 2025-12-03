// types.ts - Tipos TypeScript compartidos

export interface ReporteData {
  modulo1?: Modulo1Data
  modulo3?: Modulo3Data
  modulo4?: Modulo04Data
  modulo5?: Modulo05Data
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
  categorias_emitidas: CategoriasResponse
    categorias_recibidas: CategoriasResponse
  complementos_emitidos?: Complemento[]
  complementos_recibidos?: Complemento[]
  tiene_complementos_emitidos?: boolean
  tiene_complementos_recibidos?: boolean

  predicciones?: {
    emitidas?: Array<{
      mes: string
      monto: number
      cantidad: number
    }>
    recibidas?: Array<{
      mes: string
      monto: number
      cantidad: number
    }>
    balance?: Array<{
      mes: string
      monto: number
    }>
  }
}


export interface Modulo04Data {
  success: boolean
  empresa?: {
    registro_patronal?: string
    nombre?: string
    periodo?: string
    delegacion?: string
    prima_rt?: number
    rfc?: string
  }
  resumen?: {
    cuota_fija?: number
    excedente?: number
    prestaciones_dinero?: number
    gastos_medicos?: number
    riesgos_trabajo?: number
    invalidez_vida?: number
    guarderias?: number
    cesantia?: number
    infonavit?: number
    total_pagar?: number
    num_cotizantes?: number
    fecha_pago?: string
    cuotas_patronales?: number
    cuotas_obreras?: number
  }
  trabajadores?: Array<{
    nombre?: string
    nss?: string
    rfc?: string
    sdi?: number
    dias?: number
    cuota_fija?: number
    subtotal_patronal?: number
    subtotal_obrera?: number
  }>
  analisis?: {
    totales?: {
      obrera?: number
      patronal?: number
      cuota_fija?: number
    }
    sdi?: {
      promedio?: number
      minimo?: number
      maximo?: number
      mediana?: number
    }
    distribucion_salarial?: {
      [key: string]: number
    }
    costo_promedio_trabajador?: number
  }
  comprobante?: {
    registro_patronal?: string
    rfc?: string
    linea_captura?: string
    folio_sua?: string
    numero_operacion?: string
    fecha_hora?: string
    importe_imss?: number
    importe_total?: number
  }
  alertas?: Array<{
    tipo: string
    mensaje: string
    trabajador?: string
  }>
}



export interface Modulo05Data {
  success: boolean
  procesamiento?: {
    excel: boolean
    linea_captura: boolean
    comprobante: boolean
  }
  dashboard: {
    kpis: {
      isn_mes: number
      periodo: string
      base_gravable: number
      num_empleados: number
    }
    desglose: {
      isn_3: number
      educacion_15: number
      redondeo: number
      total: number
      porcentaje_isn?: number
      porcentaje_educacion?: number
    }
    cumplimiento: {
      estado_pago: string
      fecha_pago: string
      fecha_vencimiento: string
      dias_anticipacion?: number
      conciliacion: string
      cfdis_emitidos: number
      cfdis_vigentes: number
    }
    tendencia?: number[]
  }
  calculo: {
    percepciones: Array<{ codigo: number; concepto: string; monto: number }>
    total_percepciones: number
    deducciones: Array<{ codigo: number; concepto: string; monto: number }>
    total_deducciones: number
    otras_erogaciones?: Array<{ codigo: number; concepto: string; monto: number }>
    total_otras?: number
    calculo_final?: {
      base_gravable: number
      isn_3: number
      educacion_15: number
      redondeo: number
      total: number
    }
    validaciones?: Array<{ tipo: string; mensaje: string }>
  }
  nomina: {
    empleados: Array<{
      codigo: string
      rfc: string
      puesto: string
      sueldo: number
      integrado: number
      neto: number
      isn_individual: number
    }>
    total_empleados: number
    distribucion_puestos?: { [key: string]: number }
    top_10_isn?: Array<{
      codigo: string
      puesto: string
      isn_individual: number
    }>
    totales?: {
      sueldo: number
      integrado: number
      neto: number
      isn_total: number
    }
  }
  historico: {
    meses: Array<{
      mes: string
      base_gravable: number
      isn_3: number
      educacion_15: number
      total: number
      num_empleados: number
      promedio_empleado: number
    }>
    acumulado?: {
      isn: number
      educacion: number
      total: number
      num_meses: number
    }
    promedios?: {
      mensual: number
      empleados: number
    }
    proyeccion?: {
      anual: number
    }
  }
  conciliacion: {
    cuadro_conciliacion?: {
      base_gravable?: { excel: number; linea: number; diferencia: number; ok: boolean }
      isn_3?: { excel: number; linea: number; diferencia: number; ok: boolean }
      total?: { linea: number; pago: number; diferencia: number; ok: boolean }
    }
    estado_conciliacion?: string[]
    comprobante_pago?: {
      numero_operacion?: string
      fecha_aplicacion?: string
      estado?: string
      importe?: number
    }
    cfdis_validacion?: { total: number; vigentes: number; cancelados: number }
  }
  predicciones: {
    prediccion_siguiente_mes?: {
      estimado: number
      rango_min: number
      rango_max: number
    }
    tendencia_plantilla?: string
    recomendaciones?: string[]
  }
  alertas?: Array<{ tipo: string; mensaje: string }>
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
  categoria?: string
  nombre?: string
  cantidad: number
  monto: number
  clave?: string
  descripcion?: string
}

export interface CategoriasResponse {
  general?: CategoriaFactura[]
  grupo?: CategoriaFactura[]
  detallado?: CategoriaFactura[]
  top_10_general?: CategoriaFactura[]
  top_10_grupo?: CategoriaFactura[]
  top_10_detallado?: CategoriaFactura[]
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
