'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeftRight, TrendingUp, TrendingDown, Percent, DollarSign, Landmark, Receipt, Users, FileText } from 'lucide-react'
import { formatCurrency } from './utils'
import Modulo01 from './Modulo01'
import Modulo03 from './Modulo03'
import Modulo05 from './Modulo05'
import Modulo06 from './Modulo06'
import Modulo08 from './Modulo08'
import Modulo11 from './Modulo11'

interface VistaComparacionProps {
  reporteData: any
}

export default function VistaComparacion({ reporteData }: VistaComparacionProps) {
  const [periodoIzq, setPeriodoIzq] = useState('01')
  const [periodoDer, setPeriodoDer] = useState('07')
  const [moduloActivo, setModuloActivo] = useState<string | null>(null)
  
  // Detectar módulos disponibles
  const modulosDisponibles = [
    { id: 'modulo01', nombre: 'Estados de Cuenta', icon: Landmark, data: reporteData.modulo1, component: Modulo01, backend: false },
    { id: 'modulo03', nombre: 'Facturas XML', icon: Receipt, data: reporteData.modulo3, component: Modulo03, backend: false },
    { id: 'modulo05', nombre: 'ISN', icon: DollarSign, data: reporteData.modulo5, component: Modulo05, backend: false },
    { id: 'modulo06', nombre: 'Nómina', icon: Users, data: reporteData.modulo6, component: Modulo06, backend: false },
    { id: 'modulo08', nombre: 'Control Fiscal', icon: FileText, data: reporteData.modulo8, component: Modulo08, backend: true },
    { id: 'modulo11', nombre: 'Estados Financieros', icon: FileText, data: reporteData.modulo11, component: Modulo11, backend: false },
  ].filter(m => m.data) // Solo módulos con datos

  // Seleccionar primer módulo disponible por defecto
  useEffect(() => {
    if (!moduloActivo && modulosDisponibles.length > 0) {
      setModuloActivo(modulosDisponibles[0].id)
    }
  }, [modulosDisponibles])

  const moduloSeleccionado = modulosDisponibles.find(m => m.id === moduloActivo)

  return (
    <div className="space-y-4 w-full">
      {/* Header con Selectores Globales */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-4 shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <ArrowLeftRight className="w-6 h-6" />
          <div>
            <h2 className="text-xl font-bold">Modo Comparación</h2>
            <p className="text-blue-100 text-sm">Compara datos de diferentes periodos lado a lado</p>
          </div>
        </div>

        {/* Selectores de Periodo Globales */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-semibold text-sm">Periodo Izquierdo:</label>
            <select
              value={periodoIzq}
              onChange={(e) => setPeriodoIzq(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-gray-900 bg-white border-2 border-white focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
            >
              {getMesesOptions()}
            </select>
          </div>
          
          <div>
            <label className="block mb-2 font-semibold text-sm">Periodo Derecho:</label>
            <select
              value={periodoDer}
              onChange={(e) => setPeriodoDer(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-gray-900 bg-white border-2 border-white focus:outline-none focus:ring-2 focus:ring-purple-300 text-base"
            >
              {getMesesOptions()}
            </select>
          </div>
        </div>
      </div>

      {/* Selector de Módulo */}
      {modulosDisponibles.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Selecciona el módulo a comparar:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {modulosDisponibles.map((modulo) => {
              const Icon = modulo.icon
              const isActive = moduloActivo === modulo.id
              
              return (
                <button
                  key={modulo.id}
                  onClick={() => setModuloActivo(modulo.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isActive
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <p className={`text-xs font-medium text-center ${isActive ? 'text-blue-700' : 'text-gray-600'}`}>
                    {modulo.nombre}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Comparación del Módulo Seleccionado */}
      {moduloSeleccionado && (
        <ComparacionModulo
          modulo={moduloSeleccionado}
          periodoIzq={periodoIzq}
          periodoDer={periodoDer}
        />
      )}

      {/* Mensaje si no hay módulos */}
      {modulosDisponibles.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <p className="text-yellow-800 font-semibold mb-2">No hay módulos disponibles para comparar</p>
          <p className="text-yellow-700 text-sm">Este reporte no contiene módulos con datos temporales</p>
        </div>
      )}
    </div>
  )
}

// ============================================
// COMPONENTE: Comparación de Módulo Individual
// ============================================

interface ComparacionModuloProps {
  modulo: any
  periodoIzq: string
  periodoDer: string
}

function ComparacionModulo({ modulo, periodoIzq, periodoDer }: ComparacionModuloProps) {
  const [datosIzq, setDatosIzq] = useState<any>(null)
  const [datosDer, setDatosDer] = useState<any>(null)
  const [comparacion, setComparacion] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    cargarDatos()
  }, [modulo.id, periodoIzq, periodoDer])

  const cargarDatos = async () => {
    setLoading(true)
    setError(null)
    
    try {
      if (modulo.backend && modulo.id === 'modulo08') {
        // Backend para Módulo 08
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const response = await fetch(
          `${API_BASE_URL}/api/comparacion/modulo08?periodo1=${periodoIzq}&periodo2=${periodoDer}`
        )
        
        if (!response.ok) throw new Error('Error al obtener datos')
        
        const data = await response.json()
        if (data.success) {
          setDatosIzq(data.periodo1)
          setDatosDer(data.periodo2)
          setComparacion(data.comparacion)
        }
      } else {
        // Frontend para otros módulos
        const filtrados = filtrarDatosEnFrontend(modulo.data, periodoIzq, periodoDer, modulo.id)
        setDatosIzq(filtrados.izquierda)
        setDatosDer(filtrados.derecha)
        setComparacion(filtrados.comparacion)
      }
    } catch (err) {
      console.error('Error en comparación:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Cargando comparación...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
        <p className="text-red-700 font-semibold text-center">❌ {error}</p>
      </div>
    )
  }

  const ModuloComponent = modulo.component

  return (
    <div className="space-y-4">
      {/* Métricas de Comparación */}
      {comparacion && Object.keys(comparacion).length > 0 && (
        <MetricasComparacion comparacion={comparacion} moduloId={modulo.id} />
      )}

      {/* Paneles Lado a Lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Panel Izquierdo */}
        <div className="border-4 border-blue-300 rounded-xl bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 sticky top-0">
            <h3 className="text-lg font-bold text-center">{getMesNombre(periodoIzq)}</h3>
          </div>
          <div className="p-4">
            {datosIzq ? (
              <ModuloComponent data={datosIzq} />
            ) : (
              <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
            )}
          </div>
        </div>

        {/* Panel Derecho */}
        <div className="border-4 border-purple-300 rounded-xl bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 sticky top-0">
            <h3 className="text-lg font-bold text-center">{getMesNombre(periodoDer)}</h3>
          </div>
          <div className="p-4">
            {datosDer ? (
              <ModuloComponent data={datosDer} />
            ) : (
              <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// COMPONENTE: Métricas de Comparación
// ============================================

function MetricasComparacion({ comparacion, moduloId }: any) {
  const getMetricas = () => {
    switch (moduloId) {
      case 'modulo08':
        return [
          { label: 'Facturación', key: 'facturacion', icon: DollarSign },
          { label: 'Cobros', key: 'cobros', icon: TrendingUp },
          { label: 'Gastos', key: 'gastos', icon: TrendingDown },
        ]
      case 'modulo03':
        return [
          { label: 'Ingresos (Emitidas)', key: 'ingresos', icon: DollarSign },
          { label: 'Egresos (Recibidas)', key: 'egresos', icon: TrendingDown },
          { label: 'Balance', key: 'balance', icon: TrendingUp },
        ]
      case 'modulo01':
        return [
          { label: 'Depósitos', key: 'depositos', icon: TrendingUp },
          { label: 'Retiros', key: 'retiros', icon: TrendingDown },
        ]
      default:
        return []
    }
  }

  const metricas = getMetricas().filter(m => comparacion[m.key])

  if (metricas.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metricas.map((metrica) => {
        const datos = comparacion[metrica.key]
        const Icon = metrica.icon
        const esPositivo = datos?.direccion === 'aumento'
        const esCambio = datos?.direccion !== 'sin_cambio'

        return (
          <div
            key={metrica.key}
            className={`rounded-xl p-6 border-2 shadow-lg ${
              esCambio
                ? esPositivo
                  ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300'
                  : 'bg-gradient-to-br from-red-50 to-red-100 border-red-300'
                : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-gray-700">{metrica.label}</span>
              <Icon
                className={`w-7 h-7 ${
                  esCambio
                    ? esPositivo
                      ? 'text-green-600'
                      : 'text-red-600'
                    : 'text-gray-500'
                }`}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {esPositivo ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : esCambio ? (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                ) : (
                  <Percent className="w-5 h-5 text-gray-500" />
                )}
                <span
                  className={`text-3xl font-bold ${
                    esCambio
                      ? esPositivo
                        ? 'text-green-700'
                        : 'text-red-700'
                      : 'text-gray-700'
                  }`}
                >
                  {Math.abs(datos?.porcentual || 0).toFixed(1)}%
                </span>
              </div>
              
              {datos?.absoluta !== undefined && (
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-gray-600">Diferencia:</span>
                  <span className={`text-sm font-semibold ${
                    esCambio
                      ? esPositivo
                        ? 'text-green-700'
                        : 'text-red-700'
                      : 'text-gray-700'
                  }`}>
                    {esPositivo ? '+' : esCambio ? '-' : ''}{formatCurrency(Math.abs(datos.absoluta))}
                  </span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ============================================
// FUNCIONES DE FILTRADO
// ============================================

function filtrarDatosEnFrontend(datos: any, mes1: string, mes2: string, moduloId: string) {
  switch (moduloId) {
    case 'modulo01':
      return filtrarModulo01(datos, mes1, mes2)
    case 'modulo03':
      return filtrarModulo03(datos, mes1, mes2)
    case 'modulo05':
      return { izquierda: datos, derecha: datos, comparacion: {} }
    case 'modulo06':
      return filtrarModulo06(datos, mes1, mes2)
    case 'modulo11':
      return { izquierda: datos, derecha: datos, comparacion: {} }
    default:
      return { izquierda: datos, derecha: datos, comparacion: {} }
  }
}

function filtrarModulo01(datos: any, mes1: string, mes2: string) {
  const filtrarMovimientos = (movimientos: any[], mes: string) => {
    return movimientos.filter((m: any) => {
      const fecha = m.fecha || ''
      let mesMov = ''
      if (fecha.includes('/')) {
        mesMov = fecha.split('/')[1]
      } else if (fecha.includes('-')) {
        mesMov = fecha.split('-')[1]
      }
      return mesMov === mes
    })
  }

  const todosMovimientos: any[] = []
  if (datos.resultados) {
    datos.resultados.forEach((archivo: any) => {
      if (archivo.datos?.por_hoja) {
        Object.values(archivo.datos.por_hoja).forEach((hoja: any) => {
          if (hoja.movimientos) {
            todosMovimientos.push(...hoja.movimientos)
          }
        })
      }
    })
  }

  const movsIzq = filtrarMovimientos(todosMovimientos, mes1)
  const movsDer = filtrarMovimientos(todosMovimientos, mes2)

  const calcularTotales = (movs: any[]) => ({
    depositos: movs.reduce((sum, m) => sum + (m.abono || 0), 0),
    retiros: movs.reduce((sum, m) => sum + (m.cargo || 0), 0),
    cantidad: movs.length
  })

  const totalesIzq = calcularTotales(movsIzq)
  const totalesDer = calcularTotales(movsDer)

  return {
    izquierda: { ...datos, movimientos_filtrados: movsIzq },
    derecha: { ...datos, movimientos_filtrados: movsDer },
    comparacion: {
      depositos: {
        absoluta: totalesDer.depositos - totalesIzq.depositos,
        porcentual: totalesIzq.depositos ? ((totalesDer.depositos - totalesIzq.depositos) / totalesIzq.depositos * 100) : 0,
        direccion: totalesDer.depositos > totalesIzq.depositos ? 'aumento' : 'disminucion'
      },
      retiros: {
        absoluta: totalesDer.retiros - totalesIzq.retiros,
        porcentual: totalesIzq.retiros ? ((totalesDer.retiros - totalesIzq.retiros) / totalesIzq.retiros * 100) : 0,
        direccion: totalesDer.retiros > totalesIzq.retiros ? 'aumento' : 'disminucion'
      }
    }
  }
}

function filtrarModulo03(datos: any, mes1: string, mes2: string) {
  const filtrarFacturas = (facturas: any[], mes: string) => {
    return facturas.filter((f: any) => {
      const fecha = f.fecha || ''
      const mesFact = fecha.split('/')[1]
      return mesFact === mes
    })
  }

  const emitidas = datos.emitidas || []
  const recibidas = datos.recibidas || []

  const emitIzq = filtrarFacturas(emitidas, mes1)
  const emitDer = filtrarFacturas(emitidas, mes2)
  const recIzq = filtrarFacturas(recibidas, mes1)
  const recDer = filtrarFacturas(recibidas, mes2)

  const sumarTotal = (facturas: any[]) => facturas.reduce((sum, f) => sum + (f.total || 0), 0)

  const totalesIzq = {
    ingresos: sumarTotal(emitIzq),
    egresos: sumarTotal(recIzq),
    balance: sumarTotal(emitIzq) - sumarTotal(recIzq)
  }

  const totalesDer = {
    ingresos: sumarTotal(emitDer),
    egresos: sumarTotal(recDer),
    balance: sumarTotal(emitDer) - sumarTotal(recDer)
  }

  return {
    izquierda: {
      ...datos,
      emitidas: emitIzq,
      recibidas: recIzq,
      resumen: {
        ...datos.resumen,
        total_emitidas: emitIzq.length,
        total_recibidas: recIzq.length,
        monto_emitidas: totalesIzq.ingresos,
        monto_recibidas: totalesIzq.egresos,
        balance: totalesIzq.balance
      }
    },
    derecha: {
      ...datos,
      emitidas: emitDer,
      recibidas: recDer,
      resumen: {
        ...datos.resumen,
        total_emitidas: emitDer.length,
        total_recibidas: recDer.length,
        monto_emitidas: totalesDer.ingresos,
        monto_recibidas: totalesDer.egresos,
        balance: totalesDer.balance
      }
    },
    comparacion: {
      ingresos: {
        absoluta: totalesDer.ingresos - totalesIzq.ingresos,
        porcentual: totalesIzq.ingresos ? ((totalesDer.ingresos - totalesIzq.ingresos) / totalesIzq.ingresos * 100) : 0,
        direccion: totalesDer.ingresos > totalesIzq.ingresos ? 'aumento' : 'disminucion'
      },
      egresos: {
        absoluta: totalesDer.egresos - totalesIzq.egresos,
        porcentual: totalesIzq.egresos ? ((totalesDer.egresos - totalesIzq.egresos) / totalesIzq.egresos * 100) : 0,
        direccion: totalesDer.egresos > totalesIzq.egresos ? 'aumento' : 'disminucion'
      },
      balance: {
        absoluta: totalesDer.balance - totalesIzq.balance,
        porcentual: totalesIzq.balance ? ((totalesDer.balance - totalesIzq.balance) / Math.abs(totalesIzq.balance) * 100) : 0,
        direccion: totalesDer.balance > totalesIzq.balance ? 'aumento' : 'disminucion'
      }
    }
  }
}

function filtrarModulo06(datos: any, mes1: string, mes2: string) {
  const filtrarPeriodos = (periodos: any[], mes: string) => {
    return periodos.filter((p: any) => {
      const meses: { [key: string]: string } = {
        'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04',
        'mayo': '05', 'junio': '06', 'julio': '07', 'agosto': '08',
        'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
      }
      
      const periodoLower = (p.periodo || '').toLowerCase()
      for (const [nombre, num] of Object.entries(meses)) {
        if (periodoLower.includes(nombre) && num === mes) {
          return true
        }
      }
      return false
    })
  }

  const periodos = datos.historico?.periodos || []
  const periodosIzq = filtrarPeriodos(periodos, mes1)
  const periodosDer = filtrarPeriodos(periodos, mes2)

  return {
    izquierda: {
      ...datos,
      historico: {
        ...datos.historico,
        periodos: periodosIzq
      }
    },
    derecha: {
      ...datos,
      historico: {
        ...datos.historico,
        periodos: periodosDer
      }
    },
    comparacion: {}
  }
}

// ============================================
// UTILIDADES
// ============================================

function getMesesOptions() {
  return [
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
  ].map(mes => (
    <option key={mes.value} value={mes.value}>
      {mes.label}
    </option>
  ))
}

function getMesNombre(mes: string): string {
  const meses: { [key: string]: string } = {
    '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril',
    '05': 'Mayo', '06': 'Junio', '07': 'Julio', '08': 'Agosto',
    '09': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre'
  }
  return meses[mes] || 'Desconocido'
}