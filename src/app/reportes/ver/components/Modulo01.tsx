'use client'

import React, { useState, useEffect } from 'react'
import { FileText, TrendingUp, TrendingDown, BarChart3, DollarSign, PieChart, Filter } from 'lucide-react'
import dynamic from 'next/dynamic'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import { Modulo1Data, DatosConsolidadosModulo01 } from './types'
import { formatCurrency, formatDate, getColorForType } from './utils'

const Chart = dynamic(() => import('react-chartjs-2').then((mod) => mod.Chart), {
  ssr: false,
})

if (typeof window !== 'undefined') {
  ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, ArcElement, Title, Tooltip, Legend, Filler
  )
}

interface Modulo01Props {
  data: Modulo1Data
}

export default function Modulo01({ data }: Modulo01Props) {
  const [activeTab, setActiveTab] = useState<'movimientos' | 'conciliacion' | 'segmentacion' | 'graficas'>('movimientos')
  const [selectedK, setSelectedK] = useState<string>('todos')
  const [selectedL, setSelectedL] = useState<string>('todos')
  const [chartReady, setChartReady] = useState(false)
  const [consolidado, setConsolidado] = useState<DatosConsolidadosModulo01 | null>(null)

  useEffect(() => {
    if (data?.resultados) {
      const datos = procesarDatosConsolidados(data)
      setConsolidado(datos)
      setTimeout(() => setChartReady(true), 500)
    }
  }, [data])

  const procesarDatosConsolidados = (data: Modulo1Data): DatosConsolidadosModulo01 => {
    let allMovements: any[] = []
    let allConciliaciones: any[] = []
    let totalDepositos = 0
    let totalRetiros = 0
    let totalComisiones = 0

    data.resultados.forEach(archivo => {
      if (archivo.success && archivo.datos?.por_hoja) {
        Object.values(archivo.datos.por_hoja).forEach((hoja: any) => {
          if (hoja.movimientos) {
            const movimientos = hoja.movimientos.map((m: any) => ({
              ...m,
              archivo: archivo.filename,
              hoja: hoja.sheet
            }))
            allMovements.push(...movimientos)
          }

          if (hoja.conciliacion) {
            allConciliaciones.push({
              archivo: archivo.filename,
              hoja: hoja.sheet,
              conciliacion: hoja.conciliacion
            })
          }

          if (hoja.resumen) {
            const depositos = parseFloat(hoja.resumen.total_depositos?.replace(/[^0-9.-]/g, '') || '0')
            const retiros = parseFloat(hoja.resumen.total_retiros?.replace(/[^0-9.-]/g, '') || '0')
            const comisiones = parseFloat(hoja.resumen.total_comisiones?.replace(/[^0-9.-]/g, '') || '0')
            
            totalDepositos += depositos
            totalRetiros += retiros
            totalComisiones += comisiones
          }
        })
      }
    })

    const uniqueK = Array.from(new Set(allMovements.map((m: any) => m.k_asociacion || 'Sin dato'))).sort()
    const uniqueL = Array.from(new Set(allMovements.map((m: any) => m.l_tipo || 'Sin dato'))).sort()

    const chartData = procesarDatosParaGraficas(allMovements)

    return {
      allMovements,
      totalDepositos,
      totalRetiros,
      totalComisiones,
      flujoNeto: totalDepositos - totalRetiros,
      allConciliaciones,
      uniqueK,
      uniqueL,
      chartData
    }
  }

  const procesarDatosParaGraficas = (movimientos: any[]) => {
    const byDay = new Map<string, { fecha: string; abonos: number; cargos: number; saldo: number | null }>()
    movimientos.forEach(m => {
      const key = m.fecha || 'N/A'
      if (!byDay.has(key)) {
        byDay.set(key, { fecha: key, abonos: 0, cargos: 0, saldo: null })
      }
      const d = byDay.get(key)!
      d.abonos += Number(m.abono || 0)
      d.cargos += Number(m.cargo || 0)
      if (typeof m.saldo === 'number') d.saldo = m.saldo
    })

    const movimientosPorDia = Array.from(byDay.values()).sort((a, b) => 
      (a.fecha || '').localeCompare(b.fecha || '')
    )

    const byTipo = new Map<string, number>()
    movimientos.forEach(m => {
      const tipo = (m.l_tipo || 'sin dato').toLowerCase()
      const valor = Math.abs(Number(m.cargo || 0)) + Math.abs(Number(m.abono || 0))
      byTipo.set(tipo, (byTipo.get(tipo) || 0) + valor)
    })

    const tiposOrdenados = Array.from(byTipo.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    return {
      movimientosPorDia,
      tiposLabels: tiposOrdenados.map(([tipo]) => tipo),
      tiposData: tiposOrdenados.map(([, valor]) => valor),
      tiposColors: tiposOrdenados.map(([tipo]) => getColorForType(tipo))
    }
  }

  const filtrarMovimientos = () => {
    if (!consolidado) return []
    
    let movimientos = [...consolidado.allMovements]

    if (selectedK !== 'todos') {
      movimientos = movimientos.filter(m => (m.k_asociacion || 'Sin dato') === selectedK)
    }

    if (selectedL !== 'todos') {
      movimientos = movimientos.filter(m => (m.l_tipo || 'Sin dato') === selectedL)
    }

    return movimientos
  }

  if (!data || !data.success) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <p className="text-red-600">❌ Error al cargar el Módulo 01</p>
      </div>
    )
  }

  if (!consolidado) {
    return <div className="text-gray-500">Cargando datos...</div>
  }

  const movimientosFiltrados = filtrarMovimientos()

  // Configuraciones de gráficas
  const flujoConfig = consolidado.chartData && {
    labels: consolidado.chartData.movimientosPorDia.map(d => d.fecha),
    datasets: [
      {
        label: 'Abonos',
        data: consolidado.chartData.movimientosPorDia.map(d => d.abonos),
        backgroundColor: 'rgba(40, 167, 69, 0.8)',
      },
      {
        label: 'Cargos',
        data: consolidado.chartData.movimientosPorDia.map(d => -Math.abs(d.cargos)),
        backgroundColor: 'rgba(220, 53, 69, 0.8)',
      }
    ]
  }

  const tendenciaConfig = consolidado.chartData && {
    labels: consolidado.chartData.movimientosPorDia.map(d => d.fecha),
    datasets: [{
      label: 'Saldo',
      data: consolidado.chartData.movimientosPorDia.map(d => d.saldo),
      tension: 0.35,
      fill: true,
      borderColor: 'rgb(102, 126, 234)',
      backgroundColor: 'rgba(102, 126, 234, 0.12)',
      pointRadius: 2
    }]
  }

  const donaConfig = consolidado.chartData && {
    labels: consolidado.chartData.tiposLabels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
    datasets: [{
      data: consolidado.chartData.tiposData,
      backgroundColor: consolidado.chartData.tiposColors,
      borderColor: consolidado.chartData.tiposColors
    }]
  }

  const barrasConfig = consolidado.chartData && {
    labels: consolidado.chartData.tiposLabels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
    datasets: [{
      label: 'Total',
      data: consolidado.chartData.tiposData,
      backgroundColor: consolidado.chartData.tiposColors,
      borderColor: consolidado.chartData.tiposColors
    }]
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-blue-600 mb-1">Depósitos</p>
              <p className="text-xl font-bold text-blue-700 truncate">{formatCurrency(consolidado.totalDepositos)}</p>
              <p className="text-xs text-blue-600 mt-1">Entrada de efectivo</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4 border border-red-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
              <TrendingDown className="text-red-600" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-red-600 mb-1">Retiros</p>
              <p className="text-xl font-bold text-red-700 truncate">{formatCurrency(consolidado.totalRetiros)}</p>
              <p className="text-xs text-red-600 mt-1">Salida de efectivo</p>
            </div>
          </div>
        </div>

        <div className={`${consolidado.flujoNeto >= 0 ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'} rounded-lg p-4 border`}>
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg ${consolidado.flujoNeto >= 0 ? 'bg-green-100' : 'bg-amber-100'} flex items-center justify-center flex-shrink-0`}>
              <BarChart3 className={consolidado.flujoNeto >= 0 ? 'text-green-600' : 'text-amber-600'} size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs ${consolidado.flujoNeto >= 0 ? 'text-green-600' : 'text-amber-600'} mb-1`}>Flujo Neto</p>
              <p className={`text-xl font-bold ${consolidado.flujoNeto >= 0 ? 'text-green-700' : 'text-amber-700'} truncate`}>
                {formatCurrency(Math.abs(consolidado.flujoNeto))}
              </p>
              <p className={`text-xs ${consolidado.flujoNeto >= 0 ? 'text-green-600' : 'text-amber-600'} mt-1`}>
                {consolidado.flujoNeto >= 0 ? 'Positivo' : 'Negativo'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <DollarSign className="text-purple-600" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-purple-600 mb-1">Comisiones</p>
              <p className="text-xl font-bold text-purple-700 truncate">{formatCurrency(consolidado.totalComisiones)}</p>
              <p className="text-xs text-purple-600 mt-1">Costo bancario</p>
            </div>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-bechapra-border">
        <div className="flex border-b border-bechapra-border">
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'movimientos'
                ? 'border-b-2 border-bechapra-primary text-bechapra-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('movimientos')}
          >
            <FileText className="inline-block w-4 h-4 mr-2" />
            Movimientos
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'conciliacion'
                ? 'border-b-2 border-bechapra-primary text-bechapra-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('conciliacion')}
          >
            <TrendingUp className="inline-block w-4 h-4 mr-2" />
            Conciliación
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'segmentacion'
                ? 'border-b-2 border-bechapra-primary text-bechapra-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('segmentacion')}
          >
            <Filter className="inline-block w-4 h-4 mr-2" />
            Segmentación
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'graficas'
                ? 'border-b-2 border-bechapra-primary text-bechapra-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('graficas')}
          >
            📊 Gráficas
          </button>
        </div>

        {/* Tab Movimientos */}
        {activeTab === 'movimientos' && (
          <div className="p-6">
            <h3 className="text-base font-semibold text-bechapra-text-primary mb-4">
              Movimientos Consolidados ({consolidado.allMovements.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-bechapra-light-3 text-bechapra-text-primary">
                    <th className="px-4 py-3 text-left font-medium">Fecha</th>
                    <th className="px-4 py-3 text-left font-medium">Archivo</th>
                    <th className="px-4 py-3 text-left font-medium">Concepto</th>
                    <th className="px-4 py-3 text-right font-medium">Cargo</th>
                    <th className="px-4 py-3 text-right font-medium">Abono</th>
                    <th className="px-4 py-3 text-right font-medium">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {consolidado.allMovements.slice(0, 50).map((mov, idx) => (
                    <tr key={idx} className="border-t border-bechapra-border hover:bg-gray-50">
                      <td className="px-4 py-3">{mov.fecha}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{mov.archivo}</td>
                      <td className="px-4 py-3">{mov.concepto?.substring(0, 50)}...</td>
                      <td className="px-4 py-3 text-right text-red-600">{mov.cargo ? formatCurrency(mov.cargo) : ''}</td>
                      <td className="px-4 py-3 text-right text-green-600">{mov.abono ? formatCurrency(mov.abono) : ''}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(mov.saldo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {consolidado.allMovements.length > 50 && (
                <p className="text-center text-gray-500 mt-4 text-sm">
                  Mostrando 50 de {consolidado.allMovements.length} movimientos
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tab Conciliación */}
        {activeTab === 'conciliacion' && (
          <div className="p-6">
            <h3 className="text-base font-semibold text-bechapra-text-primary mb-4">
              Conciliación Bancaria
            </h3>
            <div className="space-y-4">
              {consolidado.allConciliaciones.map((conc, idx) => (
                <div key={idx} className="bg-bechapra-light-3 rounded-lg p-4 border border-bechapra-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">{conc.archivo} - {conc.hoja}</span>
                    <span className={`text-sm font-semibold ${
                      Math.abs(conc.conciliacion.diferencia) < 0.01 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      Diferencia: {formatCurrency(conc.conciliacion.diferencia)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Saldo Inicial:</span>
                      <div className="font-medium">{formatCurrency(conc.conciliacion.saldo_inicial)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">+ Depósitos:</span>
                      <div className="font-medium text-green-600">{formatCurrency(conc.conciliacion.mas_depositos)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">- Retiros:</span>
                      <div className="font-medium text-red-600">{formatCurrency(conc.conciliacion.menos_retiros)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Saldo Final:</span>
                      <div className="font-medium">{formatCurrency(conc.conciliacion.saldo_final_archivo)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Segmentación */}
        {activeTab === 'segmentacion' && (
          <div className="p-6 bg-bechapra-light-3">
            <h3 className="text-base font-semibold text-bechapra-text-primary mb-4">
              Análisis por Segmentos
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Columna K (Asociación)
                </label>
                <select
                  value={selectedK}
                  onChange={(e) => setSelectedK(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bechapra-primary"
                >
                  <option value="todos">Todos</option>
                  {consolidado.uniqueK.map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Columna L (Tipo)
                </label>
                <select
                  value={selectedL}
                  onChange={(e) => setSelectedL(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bechapra-primary"
                >
                  <option value="todos">Todos</option>
                  {consolidado.uniqueL.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-bechapra-border p-4 mb-4">
              <div className="text-sm text-gray-600">
                Mostrando <span className="font-semibold text-bechapra-primary">{movimientosFiltrados.length}</span> de {consolidado.allMovements.length} movimientos
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm bg-white rounded-lg border border-bechapra-border">
                <thead>
                  <tr className="bg-bechapra-light-3 text-bechapra-text-primary">
                    <th className="px-4 py-3 text-left font-medium">Fecha</th>
                    <th className="px-4 py-3 text-left font-medium">Archivo</th>
                    <th className="px-4 py-3 text-left font-medium">Concepto</th>
                    <th className="px-4 py-3 text-left font-medium">K (Asociación)</th>
                    <th className="px-4 py-3 text-left font-medium">L (Tipo)</th>
                    <th className="px-4 py-3 text-right font-medium">Cargo</th>
                    <th className="px-4 py-3 text-right font-medium">Abono</th>
                    <th className="px-4 py-3 text-right font-medium">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {movimientosFiltrados.map((mov, idx) => (
                    <tr key={idx} className="border-t border-bechapra-border hover:bg-gray-50">
                      <td className="px-4 py-3">{mov.fecha}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{mov.archivo}</td>
                      <td className="px-4 py-3">{mov.concepto?.substring(0, 40)}...</td>
                      <td className="px-4 py-3 text-xs">{mov.k_asociacion || 'Sin dato'}</td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: getColorForType(mov.l_tipo || 'sin dato') + '20',
                            color: getColorForType(mov.l_tipo || 'sin dato')
                          }}
                        >
                          {mov.l_tipo || 'Sin dato'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-red-600">{mov.cargo ? formatCurrency(mov.cargo) : ''}</td>
                      <td className="px-4 py-3 text-right text-green-600">{mov.abono ? formatCurrency(mov.abono) : ''}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(mov.saldo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Gráficas */}
        {activeTab === 'graficas' && chartReady && consolidado.chartData && (
          <div className="p-6 bg-bechapra-light-3">
            <h3 className="text-base font-semibold text-bechapra-text-primary mb-4">Análisis Gráfico</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg border border-bechapra-border p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Distribución por tipo (Pastel)</h4>
                <div className="h-64">
                  {donaConfig && typeof window !== 'undefined' && (
                    <Chart 
                      type="doughnut"
                      data={donaConfig}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: { legend: { position: 'top' as const } }
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-bechapra-border p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Comparativa por tipo (Barras)</h4>
                <div className="h-64">
                  {barrasConfig && typeof window !== 'undefined' && (
                    <Chart
                      type="bar"
                      data={barrasConfig}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true } }
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border border-bechapra-border p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Flujo de Efectivo Diario</h4>
                <div className="h-64">
                  {flujoConfig && typeof window !== 'undefined' && (
                    <Chart
                      type="bar"
                      data={flujoConfig}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        scales: { y: { beginAtZero: true } }
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-bechapra-border p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Tendencia de Saldos</h4>
                <div className="h-64">
                  {tendenciaConfig && typeof window !== 'undefined' && (
                    <Chart
                      type="line"
                      data={tendenciaConfig}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        scales: { y: { beginAtZero: false } }
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}