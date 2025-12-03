'use client'

import { useState } from 'react'
import {
  Calculator,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  FileText,
  AlertCircle,
  Calendar,
  BarChart3,
} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { Modulo08Data } from './types'

// Registrar Chart.js
if (typeof window !== 'undefined') {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
  )
}

interface Modulo08Props {
  data: Modulo08Data
}

export default function Modulo08({ data }: Modulo08Props) {
  const [activeTab, setActiveTab] = useState<'resumen' | 'declaraciones' | 'graficas'>('resumen')

  if (!data || !data.success) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Error al cargar los datos del módulo fiscal</span>
        </div>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(value || 0)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-MX').format(value || 0)
  }

  const resumen = data.resumen?.resumen
  const kpis = data.kpis
  const meses = resumen.meses || []

  // Preparar datos para gráficas
  const mesesNombres = meses.map((m) => m.mes)
  const isrData = meses.map((m) => m.isr_persona_moral + m.isr_retenciones)
  const ivaData = meses.map((m) => m.iva_mensual + m.iva_retenciones)
  const totalData = meses.map((m) => m.total_mes)

  const tabs = [
    { id: 'resumen', label: 'Resumen Mensual', icon: BarChart3 },
    { id: 'declaraciones', label: 'Declaraciones', icon: FileText },
    { id: 'graficas', label: 'Gráficas', icon: TrendingUp },
  ]

  return (
    <div className="space-y-6">
      {/* Información del Excel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-700">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">
            Excel procesado: {data.excel?.razon_social || 'Empresa'} - RFC:{' '}
            {data.excel?.rfc || 'N/A'}
          </span>
        </div>
      </div>

      {/* KPIs Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total ISR */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-lg p-6">
          <DollarSign className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Total ISR Pagado</p>
          <p className="text-3xl font-bold">{formatCurrency(kpis.total_isr_pagado || 0)}</p>
          <p className="text-sm opacity-75 mt-2">
            Promedio: {formatCurrency(kpis.promedio_mensual_isr || 0)}/mes
          </p>
        </div>

        {/* Total IVA */}
        <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-lg p-6">
          <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Total IVA Pagado</p>
          <p className="text-3xl font-bold">{formatCurrency(kpis.total_iva_pagado || 0)}</p>
          <p className="text-sm opacity-75 mt-2">
            Promedio: {formatCurrency(kpis.promedio_mensual_iva || 0)}/mes
          </p>
        </div>

        {/* Total Impuestos */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-lg p-6">
          <Calculator className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Total Impuestos</p>
          <p className="text-3xl font-bold">{formatCurrency(kpis.total_impuestos || 0)}</p>
          <p className="text-sm opacity-75 mt-2">
            Carga fiscal: {(kpis.carga_fiscal || 0).toFixed(2)}%
          </p>
        </div>

        {/* Cumplimiento */}
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 text-white rounded-lg p-6">
          <CheckCircle2 className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Cumplimiento</p>
          <p className="text-3xl font-bold">
            {(kpis.porcentaje_cumplimiento || 0).toFixed(1)}%
          </p>
          <p className="text-sm opacity-75 mt-2">
            {kpis.declaraciones_presentadas || 0} declaraciones
          </p>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-bechapra-primary text-bechapra-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Contenido de Tabs */}
      <div className="min-h-[400px]">
        {/* TAB: RESUMEN MENSUAL */}
        {activeTab === 'resumen' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-bechapra-primary to-bechapra-secondary text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Mes</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">ISR PM</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">ISR Ret.</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">IVA</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">IVA Ret.</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Total Mes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meses.map((mes, idx) => (
                      <tr
                        key={idx}
                        className={`border-b border-gray-100 ${
                          mes.total_mes > 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                        }`}
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {mes.mes}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">
                          {formatCurrency(mes.isr_persona_moral)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">
                          {formatCurrency(mes.isr_retenciones)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">
                          {formatCurrency(mes.iva_mensual)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">
                          {formatCurrency(mes.iva_retenciones)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-bechapra-primary">
                          {formatCurrency(mes.total_mes)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr className="font-bold">
                      <td className="px-4 py-3 text-sm text-gray-900">TOTAL ANUAL</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">-</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {formatCurrency(resumen.total_isr || 0)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {formatCurrency(resumen.total_iva || 0)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {formatCurrency(resumen.total_retenciones || 0)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-bechapra-primary">
                        {formatCurrency(resumen.total_anual || 0)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: DECLARACIONES */}
        {activeTab === 'declaraciones' && (
          <div className="space-y-6">
            {data.declaraciones && data.declaraciones.total > 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    PDFs de Declaraciones ({data.declaraciones.total})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Archivo
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Tipo
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Impuesto
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Mes
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                          Monto
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Fecha
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.declaraciones.declaraciones.map((dec, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{dec.filename}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {dec.tipo}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                dec.impuesto === 'ISR'
                                  ? 'bg-purple-100 text-purple-800'
                                  : dec.impuesto === 'IVA'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {dec.impuesto}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{dec.mes}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">
                            {dec.monto ? formatCurrency(dec.monto) : '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {dec.fecha_presentacion
                              ? new Date(dec.fecha_presentacion).toLocaleDateString('es-MX')
                              : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No se han cargado declaraciones en PDF</p>
                <p className="text-sm text-gray-500 mt-1">
                  Los PDFs son opcionales. El análisis se basa en el Excel.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB: GRÁFICAS */}
        {activeTab === 'graficas' && (
          <div className="space-y-6">
            {/* Gráfica de Impuestos por Mes */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Impuestos Pagados por Mes
              </h3>
              <div className="h-80">
                <Bar
                  data={{
                    labels: mesesNombres,
                    datasets: [
                      {
                        label: 'ISR',
                        data: isrData,
                        backgroundColor: 'rgba(102, 126, 234, 0.8)',
                        borderColor: 'rgba(102, 126, 234, 1)',
                        borderWidth: 1,
                      },
                      {
                        label: 'IVA',
                        data: ivaData,
                        backgroundColor: 'rgba(40, 167, 69, 0.8)',
                        borderColor: 'rgba(40, 167, 69, 1)',
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                      title: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function (value) {
                            return '$' + value.toLocaleString('es-MX')
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Gráfica de Tendencia Total */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tendencia Total de Impuestos
              </h3>
              <div className="h-80">
                <Line
                  data={{
                    labels: mesesNombres,
                    datasets: [
                      {
                        label: 'Total Mensual',
                        data: totalData,
                        borderColor: 'rgba(102, 126, 234, 1)',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                      title: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function (value) {
                            return '$' + value.toLocaleString('es-MX')
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}