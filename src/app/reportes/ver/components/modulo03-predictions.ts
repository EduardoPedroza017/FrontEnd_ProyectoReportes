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

  // Determinar mes actual (último mes con datos)
  const mesesOrdenados = Object.keys(datosPorMes).sort()
  const ultimoMesConDatos = mesesOrdenados.length > 0 ? parseInt(mesesOrdenados[mesesOrdenados.length - 1]) : 7

  console.log(`   Último mes con datos: ${ultimoMesConDatos}`)

  // Preparar arrays para los 12 meses
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const ingresos: number[] = []
  const egresos: number[] = []
  const balance: number[] = []

  // Calcular promedios SIN outliers para proyección
  const ingresosHistoricos: number[] = []
  const egresosHistoricos: number[] = []

  for (let i = 1; i <= 12; i++) {
    const mesKey = i.toString().padStart(2, '0')
    const datos = datosPorMes[mesKey]

    if (datos) {
      ingresos.push(datos.ingresos)
      egresos.push(datos.egresos)
      balance.push(datos.ingresos - datos.egresos)

      if (i < ultimoMesConDatos) {
        ingresosHistoricos.push(datos.ingresos)
        egresosHistoricos.push(datos.egresos)
      }
    } else if (i < ultimoMesConDatos) {
      ingresos.push(0)
      egresos.push(0)
      balance.push(0)
    } else {
      // Proyección simple usando promedio
      const promedioIngresos =
        ingresosHistoricos.length > 0
          ? ingresosHistoricos.reduce((a, b) => a + b, 0) / ingresosHistoricos.length
          : 0
      const promedioEgresos =
        egresosHistoricos.length > 0
          ? egresosHistoricos.reduce((a, b) => a + b, 0) / egresosHistoricos.length
          : 0

      ingresos.push(promedioIngresos)
      egresos.push(promedioEgresos)
      balance.push(promedioIngresos - promedioEgresos)
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