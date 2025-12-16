// types.ts - Tipos TypeScript compartidos

export interface ReporteData {
  modulo1?: Modulo1Data
  modulo3?: Modulo3Data
  modulo4?: Modulo04Data
  modulo5?: Modulo05Data
  modulo6?: Modulo6Data
  modulo7?: Modulo07Data
  modulo8?: Modulo08Data 
  modulo11?: Modulo11Data 
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

export interface Modulo6Data {
  success: boolean
  tipo_nomina: 'semanal' | 'quincenal' | 'mensual'
  dashboard: DashboardNomina
  empleados: EmpleadoNomina[]
  calculos: CalculosNomina
  incidencias: IncidenciasNomina
  cfdi: CFDINomina
  dispersion: DispersionNomina
  historico: HistoricoNomina
}

// Dashboard - KPIs principales
export interface DashboardNomina {
  nomina_total: number
  periodo: string
  num_empleados: number
  promedio_empleado: number
  total_deducciones: number
  estado_pago: 'PAGADO' | 'PENDIENTE' | 'PARCIAL'
  fecha_pago: string
  alertas: AlertaNomina[]
}

export interface AlertaNomina {
  tipo: 'error' | 'warning' | 'info'
  mensaje: string
  empleado?: string
  detalle?: string
}

// Empleados
export interface EmpleadoNomina {
  numero: number | string
  nombre: string
  rfc: string
  nss: string
  curp: string
  puesto: string
  departamento: string
  antiguedad: string | number
  salario_diario: number
  sdi: number
  dias_trabajados: number
  percepciones: {
    [concepto: string]: number
  }
  deducciones: {
    [concepto: string]: number
  }
  total_percepciones: number
  total_deducciones: number
  neto: number
  tiene_cfdi?: boolean
  tiene_comprobante?: boolean
}

// Cálculos
export interface CalculosNomina {
  percepciones: {
    [concepto: string]: {
      total: number
      empleados: number
    }
  }
  deducciones: {
    [concepto: string]: {
      total: number
      empleados: number
    }
  }
  totales: TotalesNomina
}

export interface TotalesNomina {
  total_percepciones: number
  total_deducciones: number
  total_neto: number
  num_empleados: number
  promedio_neto: number
}

// Incidencias
export interface IncidenciasNomina {
  total_incidencias: number
  por_tipo: {
    [tipo: string]: number
  }
  detalle: IncidenciaDetalle[]
}

export interface IncidenciaDetalle {
  empleado: string
  tipo: string
  fecha: string
  dias: number
  monto: number
  descripcion: string
}

// CFDI
export interface CFDINomina {
  total_cfdi: number
  timbrados: number
  pendientes: number
  errores: number
  detalle: CFDIDetalle[]
  validacion: ValidacionCFDI
}

export interface CFDIDetalle {
  empleado: string
  uuid: string
  fecha_timbrado: string
  total: number
  pdf_disponible: boolean
  xml_disponible: boolean
  valido: boolean
}

export interface ValidacionCFDI {
  total_validados: number
  coinciden: number
  diferencias: DiferenciaCFDI[]
}

export interface DiferenciaCFDI {
  empleado: string
  monto_nomina: number
  monto_cfdi: number
  diferencia: number
}

// Dispersión Bancaria
export interface DispersionNomina {
  fecha: string
  banco: string
  cuenta: string
  total_dispersado: number
  num_pagos: number
  resumen: ResumenDispersion
  detalle: PagoDispersion[]
}

export interface ResumenDispersion {
  exitosos: number
  pendientes: number
  rechazados: number
  monto_exitoso: number
  monto_pendiente: number
  monto_rechazado: number
}

export interface PagoDispersion {
  empleado: string
  cuenta: string
  banco: string
  monto: number
  referencia: string
  estado: 'EXITOSO' | 'PENDIENTE' | 'RECHAZADO'
  fecha_aplicacion?: string
}

// Histórico
export interface HistoricoNomina {
  periodos: PeriodoHistorico[]
  estadisticas: EstadisticasHistoricas
  tendencias: TendenciasNomina
}

export interface PeriodoHistorico {
  periodo: string
  tipo: 'semanal' | 'quincenal' | 'mensual'
  num_empleados: number
  total_neto: number
  promedio_empleado: number
  fecha_pago: string
}

export interface EstadisticasHistoricas {
  promedio_mensual: number
  desviacion_estandar: number
  crecimiento_anual: number
  rotacion_empleados: number
}

export interface TendenciasNomina {
  meses: string[]
  nomina_total: number[]
  empleados: number[]
  promedio_empleado: number[]
}


// ============================================
// MÓDULO 07: FONACOT
// ============================================

export interface Modulo07Data {
  success: boolean
  trabajadores: TrabajadorFonacot[]
  resumen: ResumenFonacot
  pago: PagoFonacot
  conciliacion: ConciliacionFonacot
  alertas: AlertaFonacot[]
  dashboard: DashboardFonacot
}

export interface TrabajadorFonacot {
  no_fonacot: string
  no_credito: string
  nss: string
  rfc: string
  nombre: string
  cuotas_pagadas: number
  plazo_total: number
  progreso: number
  saldo_pendiente: number
  retencion_mensual: number
}

export interface ResumenFonacot {
  num_trabajadores: number
  num_creditos: number
  total_a_pagar: number
  promedio_por_empleado: number
  credito_mayor_descuento?: TrabajadorFonacot
  proximos_a_liquidar: TrabajadorFonacot[]
}

export interface PagoFonacot {
  referencia_bancaria: string
  fecha_programada: string
  fecha_limite: string
  fecha_pago_real?: string
  estado: string
}

export interface ConciliacionFonacot {
  monto_cedula: number
  monto_ficha: number
  monto_pagado?: number
  conciliado: boolean
}

export interface AlertaFonacot {
  tipo: 'error' | 'warning' | 'info'
  titulo: string
  mensaje: string
}

export interface DashboardFonacot {
  kpis: {
    total_a_pagar: number
    num_trabajadores: number
    num_creditos: number
    estado_pago: string
  }
}

// ============================================
// MÓDULO 08: CONTROL FISCAL
// ============================================

export interface Modulo08Data {
  success: boolean
  excel: ExcelFiscal
  resumen: ResumenFiscalCompleto
  kpis: KPIsFiscales
  declaraciones?: DeclaracionesFiscales
  ejercicio: number
}

export interface ExcelFiscal {
  rfc: string
  razon_social: string
  ejercicio: number
  meses_con_datos: number
}

export interface ResumenFiscalCompleto {
  resumen: ResumenImpuestosData
  kpis?: KPIsFiscales | null
}

export interface ResumenImpuestosData {
  rfc: string
  razon_social: string
  ejercicio: number
  meses: MesFiscal[]
  total_isr: number
  total_iva: number
  total_retenciones: number
  total_anual: number
}

export interface MesFiscal {
  mes: string
  isr_persona_moral: number
  isr_retenciones: number
  iva_mensual: number
  iva_retenciones: number
  total_mes: number
}

export interface KPIsFiscales {
  ejercicio: number
  total_ingresos: number
  total_egresos: number
  total_isr_pagado: number
  total_iva_pagado: number
  total_impuestos: number
  promedio_mensual_ingresos: number
  promedio_mensual_isr: number
  promedio_mensual_iva: number
  carga_fiscal: number
  efectividad_cobro: number
  nivel_deducciones: number
  declaraciones_presentadas: number
  declaraciones_pendientes: number
  porcentaje_cumplimiento: number
  proyeccion_isr_anual: number
  proyeccion_iva_anual: number
  meses_transcurridos: number
}

export interface DeclaracionesFiscales {
  total: number
  declaraciones: DeclaracionPDF[]
}

export interface DeclaracionPDF {
  filename: string
  tipo: string // ACUSE, LINEA_CAPTURA, COMPROBANTE_PAGO
  impuesto: string // ISR, IVA, RETENCIONES
  mes: string
  ejercicio: number
  numero_operacion?: string
  monto?: number
  fecha_presentacion?: string
  fecha_pago?: string
  linea_captura?: string
  ruta_archivo: string
  fecha_carga: string
}

//*---------------------------------------------*//


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


// Agregar al archivo types.ts existente

// ============================================
// MÓDULO 11: ESTADOS FINANCIEROS
// ============================================

export interface Modulo11Data {
  success: boolean
  mensaje: string
  archivo: string
  metodo: 'Vision' | 'Reglas'
  datos: DatosEstadosFinancieros
  ejercicio: number
  informacion_general: InformacionGeneral
}

export interface DatosEstadosFinancieros {
  informacion_general: InformacionGeneral
  kpis: KPIsFinancieros
  balance_general: BalanceGeneral
  estado_resultados: EstadoResultados
  razones_financieras: RazonesFinancieras
  proveedores_top_15: ProveedorCliente[]
  clientes_top_15: ProveedorCliente[]
  detalle_gastos_top_15: DetalleGasto[]
  tendencia_mensual?: TendenciaMensual
}

export interface InformacionGeneral {
  archivo: string
  ejercicio: number
  nombre_empresa: string
  periodo: string
  rfc: string | null
}

export interface KPIsFinancieros {
  activo_total: number
  pasivo_total: number
  capital_total: number
  ingresos_totales: number
  gastos_totales: number
  utilidad_neta: number
  margen_neto: number
  razon_circulante: number
  roe: number
  roa: number
}

export interface BalanceGeneral {
  // Activo Circulante
  activo_circulante: number
  caja_bancos: number
  clientes: number
  inventarios: number
  otros_activos_circulantes: number

  // Activo Fijo
  activo_fijo: number
  terrenos_edificios: number
  maquinaria_equipo: number
  depreciacion_acumulada: number

  // Activo Diferido
  activo_diferido: number

  // Total Activo
  activo_total: number

  // Pasivo Circulante
  pasivo_circulante: number
  proveedores: number
  acreedores: number
  impuestos_por_pagar: number
  otros_pasivos_circulantes: number

  // Pasivo Largo Plazo
  pasivo_largo_plazo: number
  prestamos_bancarios_lp: number
  documentos_por_pagar_lp: number

  // Total Pasivo
  pasivo_total: number

  // Capital
  capital_social: number
  aportaciones_capital: number
  reservas_capital: number
  resultados_acumulados: number
  utilidades_acumuladas: number
  resultado_ejercicio: number
  capital_total: number

  // Validación
  cuadra: boolean
  diferencia: number
  suma_pasivo_capital: number
}

export interface EstadoResultados {
  // Ingresos
  ingresos_totales: number
  mantenimiento_mensual?: number
  ventas_netas?: number
  otros_ingresos_operativos?: number
  ingresos_no_operativos?: number
  productos_financieros?: number

  // Gastos
  costo_ventas?: number
  gastos_operativos_totales: number
  gastos_administracion?: number
  gastos_venta?: number
  gastos_financieros: number
  comisiones_bancarias?: number
  depreciacion_amortizacion?: number
  otros_gastos?: number

  // Utilidades
  utilidad_bruta: number
  utilidad_operativa: number
  utilidad_antes_impuestos: number
  isr?: number
  utilidad_neta: number

  // Márgenes (en decimal, ej: 0.15 = 15%)
  margen_bruto: number
  margen_operativo: number
  margen_neto: number
}

export interface RazonesFinancieras {
  // Liquidez
  razon_circulante: number
  prueba_acida: number
  capital_trabajo: number

  // Endeudamiento
  deuda_capital: number
  deuda_activo: number
  apalancamiento: number

  // Rentabilidad
  roe: number
  roa: number
  margen_utilidad_neta: number

  // Eficiencia
  rotacion_activos: number
  rotacion_inventarios: number
  dias_cobro: number
  dias_pago: number
}

export interface ProveedorCliente {
  cuenta: string
  nombre: string
  codigo?: string
  saldo: number
  porcentaje?: number
}

export interface DetalleGasto {
  cuenta: string
  nombre: string
  monto: number
  porcentaje_total: number
}

export interface TendenciaMensual {
  [mes: string]: {
    activo_total: number
    pasivo_total: number
    capital_total: number
    ingresos: number
    utilidad: number
  }
}