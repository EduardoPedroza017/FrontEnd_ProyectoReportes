// Funciones de predicción y análisis para Módulo 03
// Portadas desde el backend HTML a TypeScript

interface Factura {
  fecha: string
  total: number
  rfc?: string
  xml_encontrado?: boolean
}

interface PrediccionesResult {
  meses: string[]
  ingresos: number[]
  egresos: number[]
  balance: number[]
  mesActual: number
  facturasGlobalesExcluidas: number
  montoGlobalesExcluido: number
}

interface DatosMensuales {
  [mes: string]: {
    ingresos: number
    egresos: number
    conteoIngresos: number
    conteoEgresos: number
  }
}

/**
 * Extrae el mes de una fecha en formato dd/mm/yyyy
 */
function extraerMes(fecha: string): string | null {
  if (!fecha || fecha === '—' || fecha === '') return null
  try {
    const partes = fecha.split('/')
    if (partes.length >= 2) {
      const mes = partes[1].padStart(2, '0')
      return mes
    }
    return null
  } catch (e) {
    return null
  }
}

/**
 * Calcula el rango Y para las gráficas
 */
export function calcularRangoY(datos: number[]): { min: number; max: number; stepSize: number } {
  const maximo = Math.max(...datos)
  const minimo = Math.min(...datos)
  const rango = maximo - minimo

  let min = Math.floor(minimo - rango * 0.1)
  let max = Math.ceil(maximo + rango * 0.1)

  if (min < 0) min = Math.floor(min / 1000) * 1000
  else min = 0

  max = Math.ceil(max / 1000) * 1000

  const stepSize = Math.ceil((max - min) / 10 / 1000) * 1000

  return { min, max, stepSize }
}

/**
 * Calcula predicciones basadas en datos históricos
 * Portada de la función JavaScript del backend
 */
export function calcularPredicciones(
  emitidas: Factura[],
  recibidas: Factura[],
  incluirGlobales: boolean = false
): PrediccionesResult {
  console.log('🔍 CALCULANDO PREDICCIONES')
  console.log(`   Incluir Facturas Globales: ${incluirGlobales ? 'SÍ' : 'NO'}`)

  // Separar facturas globales
  let facturasEmitidasProcesar = emitidas
  let facturasGlobalesExcluidas: Factura[] = []

  if (!incluirGlobales) {
    facturasEmitidasProcesar = emitidas.filter((f) => {
      const rfc = (f.rfc || '').toUpperCase()
      return rfc !== 'XAXX010101000' && rfc !== 'XEXX010101000'
    })

    facturasGlobalesExcluidas = emitidas.filter((f) => {
      const rfc = (f.rfc || '').toUpperCase()
      return rfc === 'XAXX010101000' || rfc === 'XEXX010101000'
    })

    console.log(`   Facturas normales: ${facturasEmitidasProcesar.length}`)
    console.log(`   Facturas globales excluidas: ${facturasGlobalesExcluidas.length}`)
  }

  // Agrupar por mes
  const datosPorMes: DatosMensuales = {}

  facturasEmitidasProcesar.forEach((f) => {
    const mes = extraerMes(f.fecha)
    if (mes) {
      if (!datosPorMes[mes]) {
        datosPorMes[mes] = { ingresos: 0, egresos: 0, conteoIngresos: 0, conteoEgresos: 0 }
      }
      datosPorMes[mes].ingresos += f.total || 0
      datosPorMes[mes].conteoIngresos++
    }
  })

  recibidas.forEach((f) => {
    const mes = extraerMes(f.fecha)
    if (mes) {
      if (!datosPorMes[mes]) {
        datosPorMes[mes] = { ingresos: 0, egresos: 0, conteoIngresos: 0, conteoEgresos: 0 }
      }
      datosPorMes[mes].egresos += f.total || 0
      datosPorMes[mes].conteoEgresos++
    }
  })

  // 🔥 NUEVO: Filtrar meses con menos de 5 facturas (datos insuficientes)
  const MINIMO_FACTURAS = 5
  console.log('\n📊 VALIDACIÓN DE CANTIDAD DE FACTURAS POR MES:')
  
  Object.keys(datosPorMes).forEach((mes) => {
    const datos = datosPorMes[mes]
    const cantIngr = datos.conteoIngresos
    const cantEgr = datos.conteoEgresos
    
    console.log(`   Mes ${mes}: Ingresos=${cantIngr} facturas, Egresos=${cantEgr} facturas`)
    
    if (cantIngr > 0 && cantIngr < MINIMO_FACTURAS) {
      console.log(`   ⚠️ Mes ${mes}: Ingresos con DATOS INSUFICIENTES (${cantIngr} < ${MINIMO_FACTURAS}) - DESCARTANDO`)
      datos.ingresos = 0
      datos.conteoIngresos = 0
    }
    
    if (cantEgr > 0 && cantEgr < MINIMO_FACTURAS) {
      console.log(`   ⚠️ Mes ${mes}: Egresos con DATOS INSUFICIENTES (${cantEgr} < ${MINIMO_FACTURAS}) - DESCARTANDO`)
      datos.egresos = 0
      datos.conteoEgresos = 0
    }
    
    // Si ambos están vacíos, eliminar el mes completamente
    if (datos.ingresos === 0 && datos.egresos === 0) {
      delete datosPorMes[mes]
    }
  })

  // Determinar mes actual (último mes con datos)
  const mesesOrdenados = Object.keys(datosPorMes).sort()
  const ultimoMesConDatos = mesesOrdenados.length > 0 ? parseInt(mesesOrdenados[mesesOrdenados.length - 1]) : 7

  console.log(`   Último mes con datos: ${ultimoMesConDatos}`)

  // Preparar arrays para los 12 meses
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const ingresos: number[] = []
  const egresos: number[] = []
  const balance: number[] = []

  // Calcular predicciones con regresión lineal y variabilidad
  const VENTANA_TENDENCIA = 6
  
  // Obtener valores históricos para regresión (últimos 6 meses con datos)
  const mesesConDatos = Object.keys(datosPorMes).sort()
  const ventanaHistorica = mesesConDatos.slice(-VENTANA_TENDENCIA)
  
  const valoresIngresos = ventanaHistorica.map(mes => datosPorMes[mes].ingresos)
  const valoresEgresos = ventanaHistorica.map(mes => datosPorMes[mes].egresos)
  
  // Calcular regresión lineal
  const regresionIngresos = calcularRegresionLineal(valoresIngresos)
  const regresionEgresos = calcularRegresionLineal(valoresEgresos)
  
  // Calcular desviación estándar para variabilidad
  const desviacionIngresos = calcularDesviacionEstandar(valoresIngresos)
  const desviacionEgresos = calcularDesviacionEstandar(valoresEgresos)
  
  console.log('📈 Regresión Ingresos - Pendiente:', regresionIngresos.pendiente, 'Intercepto:', regresionIngresos.intercepto)
  console.log('📉 Regresión Egresos - Pendiente:', regresionEgresos.pendiente, 'Intercepto:', regresionEgresos.intercepto)
  console.log('📊 Desviación Ingresos:', desviacionIngresos)
  console.log('📊 Desviación Egresos:', desviacionEgresos)

  for (let i = 1; i <= 12; i++) {
    const mesKey = i.toString().padStart(2, '0')
    const datos = datosPorMes[mesKey]

    if (datos && (datos.ingresos > 0 || datos.egresos > 0)) {
      // Datos históricos reales
      ingresos.push(datos.ingresos)
      egresos.push(datos.egresos)
      balance.push(datos.ingresos - datos.egresos)
    } else if (i <= ultimoMesConDatos) {
      // Meses sin datos pero dentro del rango histórico
      ingresos.push(0)
      egresos.push(0)
      balance.push(0)
    } else {
      // Predicción usando regresión lineal + variabilidad
      const posicionEnProyeccion = i - ultimoMesConDatos
      
      // Calcular valor base con regresión lineal
      const valorBaseIngresos = regresionIngresos.intercepto + regresionIngresos.pendiente * (valoresIngresos.length + posicionEnProyeccion - 1)
      const valorBaseEgresos = regresionEgresos.intercepto + regresionEgresos.pendiente * (valoresEgresos.length + posicionEnProyeccion - 1)
      
      // Añadir variabilidad natural (±10% de la desviación estándar)
      const factorVariabilidad = 0.1
      const variacionIngresos = (Math.random() - 0.5) * 2 * desviacionIngresos * factorVariabilidad
      const variacionEgresos = (Math.random() - 0.5) * 2 * desviacionEgresos * factorVariabilidad
      
      const proyeccionIngresos = Math.max(0, valorBaseIngresos + variacionIngresos)
      const proyeccionEgresos = Math.max(0, valorBaseEgresos + variacionEgresos)
      
      ingresos.push(proyeccionIngresos)
      egresos.push(proyeccionEgresos)
      balance.push(proyeccionIngresos - proyeccionEgresos)
    }
  }

  return {
    meses,
    ingresos,
    egresos,
    balance,
    mesActual: ultimoMesConDatos - 1,
    facturasGlobalesExcluidas: facturasGlobalesExcluidas.length,
    montoGlobalesExcluido: facturasGlobalesExcluidas.reduce((sum, f) => sum + (f.total || 0), 0),
  }
}

/**
 * Agrupa facturas por mes para análisis
 */
export function agruparPorMes(emitidas: Factura[], recibidas: Factura[]): {
  meses: string[]
  ingresos: number[]
  egresos: number[]
  balance: number[]
} {
  const datosPorMes: DatosMensuales = {}

  emitidas.forEach((f) => {
    const mes = extraerMes(f.fecha)
    if (mes) {
      if (!datosPorMes[mes]) {
        datosPorMes[mes] = { ingresos: 0, egresos: 0, conteoIngresos: 0, conteoEgresos: 0 }
      }
      datosPorMes[mes].ingresos += f.total || 0
    }
  })

  recibidas.forEach((f) => {
    const mes = extraerMes(f.fecha)
    if (mes) {
      if (!datosPorMes[mes]) {
        datosPorMes[mes] = { ingresos: 0, egresos: 0, conteoIngresos: 0, conteoEgresos: 0 }
      }
      datosPorMes[mes].egresos += f.total || 0
    }
  })

  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const ingresos: number[] = []
  const egresos: number[] = []
  const balance: number[] = []

  for (let i = 1; i <= 12; i++) {
    const mesKey = i.toString().padStart(2, '0')
    const datos = datosPorMes[mesKey]

    if (datos) {
      ingresos.push(datos.ingresos)
      egresos.push(datos.egresos)
      balance.push(datos.ingresos - datos.egresos)
    } else {
      ingresos.push(0)
      egresos.push(0)
      balance.push(0)
    }
  }

  return { meses, ingresos, egresos, balance }
}

/**
 * Calcula regresión lineal simple
 */
function calcularRegresionLineal(valores: number[]): { pendiente: number; intercepto: number } {
  const n = valores.length
  if (n < 2) return { pendiente: 0, intercepto: valores[0] || 0 }

  let sumaX = 0
  let sumaY = 0
  let sumaXY = 0
  let sumaX2 = 0

  valores.forEach((y, x) => {
    sumaX += x
    sumaY += y
    sumaXY += x * y
    sumaX2 += x * x
  })

  const pendiente = (n * sumaXY - sumaX * sumaY) / (n * sumaX2 - sumaX * sumaX)
  const intercepto = (sumaY - pendiente * sumaX) / n

  return { pendiente, intercepto }
}

/**
 * Calcula desviación estándar
 */
function calcularDesviacionEstandar(valores: number[]): number {
  if (valores.length < 2) return 0

  const promedio = valores.reduce((a, b) => a + b, 0) / valores.length
  const sumaCuadrados = valores.reduce((sum, val) => sum + Math.pow(val - promedio, 2), 0)

  return Math.sqrt(sumaCuadrados / valores.length)
}