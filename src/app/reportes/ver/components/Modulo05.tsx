'use client'

import { useState } from 'react'
import {
  Users,
  DollarSign,
  AlertCircle,
  TrendingUp,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  CheckCircle2,
  BarChart3,
  Calculator,
  Clock,
} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Modulo05Data } from './types'

// Registrar Chart.js
if (typeof window !== 'undefined') {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  )
}

interface Modulo05Props {
  data: Modulo05Data
}

export default function Modulo05({ data }: Modulo05Props) {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'calculo' | 'nomina' | 'historico' | 'conciliacion' | 'predicciones'
  >('dashboard')
  const [expandedWorker, setExpandedWorker] = useState<number | null>(null)
  const [showAllEmpleados, setShowAllEmpleados] = useState(false)

  if (!data || !data.success) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Error al cargar los datos del módulo ISN</span>
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

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'calculo', label: 'Cálculo', icon: Calculator },
    { id: 'nomina', label: 'Nómina', icon: Users },
    { id: 'historico', label: 'Histórico', icon: TrendingUp },
    { id: 'conciliacion', label: 'Conciliación', icon: CheckCircle2 },
    { id: 'predicciones', label: 'Predicciones', icon: Clock },
  ]

  return (
    <div className="space-y-6">
      {/* Alertas */}
      {data.alertas && data.alertas.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-900 mb-2">Alertas</h4>
              <ul className="space-y-1">
                {data.alertas.map((alerta, index) => (
                  <li key={index} className="text-sm text-yellow-800">
                    {alerta.tipo}: {alerta.mensaje}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tabs de Navegación */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
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
        {/* Tab: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPIs Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* ISN del Mes */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <DollarSign className="w-8 h-8 mb-2 text-purple-600" />
                <p className="text-sm text-purple-700 font-medium mb-1">ISN del Mes</p>
                <p className="text-3xl font-bold text-purple-600">{formatCurrency(data.dashboard?.kpis?.isn_mes || 0)}</p>
                <p className="text-sm text-purple-600 mt-2">{data.dashboard?.kpis?.periodo || 'N/A'}</p>
              </div>

              {/* Base Gravable */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <TrendingUp className="w-8 h-8 mb-2 text-green-600" />
                <p className="text-sm text-green-700 font-medium mb-1">Base Gravable</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(data.dashboard?.kpis?.base_gravable || 0)}</p>
                <p className="text-sm text-green-600 mt-2">Total erogaciones</p>
              </div>

              {/* Empleados */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <Users className="w-8 h-8 mb-2 text-blue-600" />
                <p className="text-sm text-blue-700 font-medium mb-1">Empleados</p>
                <p className="text-3xl font-bold text-blue-600">{data.dashboard?.kpis?.num_empleados || 0}</p>
                <p className="text-sm text-blue-600 mt-2">Activos en nómina</p>
              </div>

              {/* Estado de Pago */}
              <div
                className={`border-2 rounded-lg p-6 ${
                  data.dashboard?.cumplimiento?.estado_pago === 'PAGADO'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <CheckCircle2 className={`w-8 h-8 mb-2 ${
                  data.dashboard?.cumplimiento?.estado_pago === 'PAGADO'
                    ? 'text-green-600'
                    : 'text-yellow-600'
                }`} />
                <p className={`text-sm font-medium mb-1 ${
                  data.dashboard?.cumplimiento?.estado_pago === 'PAGADO'
                    ? 'text-green-700'
                    : 'text-yellow-700'
                }`}>Estado</p>
                <p className={`text-3xl font-bold ${
                  data.dashboard?.cumplimiento?.estado_pago === 'PAGADO'
                    ? 'text-green-600'
                    : 'text-yellow-600'
                }`}>{data.dashboard?.cumplimiento?.estado_pago || 'N/A'}</p>
                <p className={`text-sm mt-2 ${
                  data.dashboard?.cumplimiento?.estado_pago === 'PAGADO'
                    ? 'text-green-600'
                    : 'text-yellow-600'
                }`}> </p>
                <p className="text-sm opacity-75 mt-2">
                  {data.dashboard?.cumplimiento?.dias_anticipacion
                    ? `${data.dashboard.cumplimiento.dias_anticipacion} días anticipación`
                    : data.dashboard?.cumplimiento?.fecha_pago || 'Sin información'}
                </p>
              </div>
            </div>

            {/* Desglose del Pago */}
            {data.dashboard?.desglose && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Desglose del Pago</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium text-gray-700">ISN (3%)</span>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">{formatCurrency(data.dashboard.desglose.isn_3 || 0)}</p>
                      {data.dashboard.desglose.porcentaje_isn && (
                        <p className="text-xs text-gray-500">{data.dashboard.desglose.porcentaje_isn}% del total</p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium text-gray-700">Fomento Educación (15% del ISN)</span>
                    <div className="text-right">
                      <p className="font-semibold text-purple-600">{formatCurrency(data.dashboard.desglose.educacion_15 || 0)}</p>
                      {data.dashboard.desglose.porcentaje_educacion && (
                        <p className="text-xs text-gray-500">{data.dashboard.desglose.porcentaje_educacion}% del total</p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Redondeo</span>
                    <p className="font-semibold text-gray-600">{formatCurrency(data.dashboard.desglose.redondeo || 0)}</p>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg border-2 border-green-300">
                    <span className="font-bold text-gray-900">Total a Pagar</span>
                    <p className="font-bold text-xl text-green-700">{formatCurrency(data.dashboard.desglose.total || 0)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Indicadores de Cumplimiento */}
            {data.dashboard?.cumplimiento && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Indicadores de Cumplimiento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Estado del Pago</p>
                    <p
                      className={`text-lg font-semibold ${
                        data.dashboard.cumplimiento.estado_pago === 'PAGADO' ? 'text-green-600' : 'text-yellow-600'
                      }`}
                    >
                      {data.dashboard.cumplimiento.estado_pago || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Fecha de Pago</p>
                    <p className="text-lg font-semibold text-gray-900">{data.dashboard.cumplimiento.fecha_pago || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Fecha de Vencimiento</p>
                    <p className="text-lg font-semibold text-gray-900">{data.dashboard.cumplimiento.fecha_vencimiento || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Conciliación</p>
                    <p className="text-lg font-semibold text-green-600">{data.dashboard.cumplimiento.conciliacion || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">CFDIs Emitidos</p>
                    <p className="text-lg font-semibold text-gray-900">{data.dashboard.cumplimiento.cfdis_emitidos || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">CFDIs Vigentes</p>
                    <p className="text-lg font-semibold text-green-600">{data.dashboard.cumplimiento.cfdis_vigentes || 0}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Gráfica de Tendencia */}
            {data.dashboard?.tendencia && data.dashboard.tendencia.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia Anual</h3>
                <div className="h-64">
                  <Line
                    data={{
                      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].slice(
                        0,
                        data.dashboard.tendencia.length
                      ),
                      datasets: [
                        {
                          label: 'ISN Mensual',
                          data: data.dashboard.tendencia,
                          borderColor: 'rgb(99, 102, 241)',
                          backgroundColor: 'rgba(99, 102, 241, 0.1)',
                          fill: true,
                          tension: 0.4,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          callbacks: {
                            label: (context) => `ISN: ${formatCurrency(context.parsed.y)}`,
                          },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: (value) => formatCurrency(Number(value)),
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Cálculo */}
        {activeTab === 'calculo' && (
          <div className="space-y-6">
            {/* Validaciones */}
            {data.calculo?.validaciones && data.calculo.validaciones.length > 0 && (
              <div className="space-y-2">
                {data.calculo.validaciones.map((val, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 p-3 rounded-lg ${
                      val.tipo === 'success' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                    }`}
                  >
                    {val.tipo === 'success' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">{val.mensaje}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Percepciones */}
            {data.calculo && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Percepciones</h3>
                <div className="space-y-2 mb-4">
                  {(data.calculo.percepciones || []).slice(0, 10).map((concepto, index) => (
                    <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">{concepto.codigo}</span>
                        <span className="text-sm text-gray-700">{concepto.concepto}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(concepto.monto)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="font-bold text-gray-900">Total Percepciones</span>
                  <span className="font-bold text-xl text-blue-700">{formatCurrency(data.calculo.total_percepciones || 0)}</span>
                </div>
              </div>
            )}

            {/* Deducciones */}
            {data.calculo && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Deducciones</h3>
                <div className="space-y-2 mb-4">
                  {(data.calculo.deducciones || []).slice(0, 10).map((concepto, index) => (
                    <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">{concepto.codigo}</span>
                        <span className="text-sm text-gray-700">{concepto.concepto}</span>
                      </div>
                      <span className="text-sm font-semibold text-red-600">{formatCurrency(concepto.monto)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                  <span className="font-bold text-gray-900">Total Deducciones</span>
                  <span className="font-bold text-xl text-red-700">{formatCurrency(data.calculo.total_deducciones || 0)}</span>
                </div>
              </div>
            )}

            {/* Otras Erogaciones */}
            {data.calculo?.otras_erogaciones && data.calculo.otras_erogaciones.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Otras Erogaciones</h3>
                <div className="space-y-2 mb-4">
                  {data.calculo.otras_erogaciones.map((concepto, index) => (
                    <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">{concepto.codigo}</span>
                        <span className="text-sm text-gray-700">{concepto.concepto}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(concepto.monto)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="font-bold text-gray-900">Total Otras Erogaciones</span>
                  <span className="font-bold text-xl text-purple-700">{formatCurrency(data.calculo.total_otras || 0)}</span>
                </div>
              </div>
            )}

            {/* Cálculo Final */}
            {data.calculo?.calculo_final && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cálculo Final del ISN</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium text-gray-700">Base Gravable</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(data.calculo.calculo_final.base_gravable || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium text-gray-700">ISN (3%)</span>
                    <span className="font-semibold text-blue-600">{formatCurrency(data.calculo.calculo_final.isn_3 || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium text-gray-700">Fomento Educación (15%)</span>
                    <span className="font-semibold text-purple-600">
                      {formatCurrency(data.calculo.calculo_final.educacion_15 || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium text-gray-700">Redondeo</span>
                    <span className="font-semibold text-gray-600">{formatCurrency(data.calculo.calculo_final.redondeo || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-100 rounded-lg border-2 border-green-300">
                    <span className="font-bold text-lg text-gray-900">Total a Pagar</span>
                    <span className="font-bold text-2xl text-green-700">{formatCurrency(data.calculo.calculo_final.total || 0)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Nómina */}
        {activeTab === 'nomina' && (
          <div className="space-y-6">
            {/* Totales */}
            {data.nomina?.totales && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Empleados</p>
                  <p className="text-2xl font-bold text-gray-900">{data.nomina.total_empleados || 0}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-sm text-gray-600 mb-1">Sueldo Total</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(data.nomina.totales.sueldo || 0)}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-sm text-gray-600 mb-1">Neto Total</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(data.nomina.totales.neto || 0)}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-sm text-gray-600 mb-1">ISN Total</p>
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(data.nomina.totales.isn_total || 0)}</p>
                </div>
              </div>
            )}

            {/* Top 10 ISN */}
            {data.nomina?.top_10_isn && data.nomina.top_10_isn.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Empleados por ISN</h3>
                <div className="space-y-2">
                  {data.nomina.top_10_isn.map((emp, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-gray-400">{index + 1}</span>
                        <div>
                          <p className="font-medium text-gray-900">{emp.codigo}</p>
                          <p className="text-sm text-gray-500">{emp.puesto}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-purple-600">{formatCurrency(emp.isn_individual)}</p>
                        <p className="text-sm text-gray-500">ISN</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Distribución por Puesto */}
            {data.nomina?.distribucion_puestos && Object.keys(data.nomina.distribucion_puestos).length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Puesto</h3>
                <div className="space-y-3">
                  {Object.entries(data.nomina.distribucion_puestos).map(([puesto, cantidad]) => (
                    <div key={puesto}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{puesto}</span>
                        <span className="text-sm text-gray-600">{String(cantidad)} empleados</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${((Number(cantidad)) / (data.nomina?.total_empleados || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lista de Empleados */}
            {data.nomina?.empleados && data.nomina.empleados.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Lista de Empleados</h3>
                  {data.nomina.empleados.length > 50 && (
                    <button
                      onClick={() => setShowAllEmpleados(!showAllEmpleados)}
                      className="text-sm text-bechapra-primary hover:text-bechapra-primary/80 font-medium"
                    >
                      {showAllEmpleados ? 'Mostrar menos' : `Mostrar todos (${data.nomina.empleados.length})`}
                    </button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Código</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">RFC</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Puesto</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Sueldo</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Integrado</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Neto</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">ISN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(showAllEmpleados ? data.nomina.empleados : data.nomina.empleados.slice(0, 50)).map((emp, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{emp.codigo}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{emp.rfc}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{emp.puesto}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(emp.sueldo)}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(emp.integrado)}</td>
                          <td className="px-4 py-3 text-sm text-right text-green-600">{formatCurrency(emp.neto)}</td>
                          <td className="px-4 py-3 text-sm text-right text-purple-600">
                            {formatCurrency(emp.isn_individual)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Histórico */}
        {activeTab === 'historico' && (
          <div className="space-y-6">
            {/* KPIs del Año */}
            {data.historico?.acumulado && data.historico?.promedios && data.historico?.proyeccion && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <DollarSign className="w-8 h-8 mb-2 text-blue-600" />
                  <p className="text-sm text-blue-700 font-medium mb-1">ISN Acumulado</p>
                  <p className="text-3xl font-bold text-blue-600">{formatCurrency(data.historico.acumulado.total || 0)}</p>
                  <p className="text-sm text-blue-600 mt-2">{data.historico.acumulado.num_meses} meses</p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <BarChart3 className="w-8 h-8 mb-2 text-green-600" />
                  <p className="text-sm text-green-700 font-medium mb-1">Promedio Mensual</p>
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(data.historico.promedios.mensual || 0)}</p>
                  <p className="text-sm text-green-600 mt-2">{data.historico.promedios.empleados} empleados promedio</p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <TrendingUp className="w-8 h-8 mb-2 text-purple-600" />
                  <p className="text-sm text-purple-700 font-medium mb-1">Proyección Anual</p>
                  <p className="text-3xl font-bold text-purple-600">{formatCurrency(data.historico.proyeccion.anual || 0)}</p>
                  <p className="text-sm text-purple-600 mt-2">Estimado 12 meses</p>
                </div>
              </div>
            )}

            {/* Tabla Histórica */}
            {data.historico?.meses && data.historico.meses.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico Mensual</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Mes</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Base Gravable</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">ISN 3%</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Educación 15%</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Total</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Empleados</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Promedio/Emp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.historico.meses.map((mes, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{mes.mes}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">
                            {formatCurrency(mes.base_gravable)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-blue-600">{formatCurrency(mes.isn_3)}</td>
                          <td className="px-4 py-3 text-sm text-right text-purple-600">
                            {formatCurrency(mes.educacion_15)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                            {formatCurrency(mes.total)}
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-gray-700">{mes.num_empleados}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-600">
                            {formatCurrency(mes.promedio_empleado)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    {data.historico.acumulado && (
                      <tfoot className="bg-gray-100">
                        <tr>
                          <td className="px-4 py-3 text-sm font-bold text-gray-900">TOTAL</td>
                          <td className="px-4 py-3 text-sm text-right font-bold text-gray-900" colSpan={2}>
                            -
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-bold text-purple-700">
                            {formatCurrency(data.historico.acumulado.educacion)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-bold text-green-700">
                            {formatCurrency(data.historico.acumulado.total)}
                          </td>
                          <td className="px-4 py-3" colSpan={2}></td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>
            )}

            {/* Gráfica de Tendencia */}
            {data.historico?.meses && data.historico.meses.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia del ISN</h3>
                <div className="h-80">
                  <Line
                    data={{
                      labels: data.historico.meses.map((m) => m.mes),
                      datasets: [
                        {
                          label: 'ISN Total',
                          data: data.historico.meses.map((m) => m.total),
                          borderColor: 'rgb(99, 102, 241)',
                          backgroundColor: 'rgba(99, 102, 241, 0.1)',
                          fill: true,
                          tension: 0.4,
                        },
                        {
                          label: 'Base Gravable',
                          data: data.historico.meses.map((m) => m.base_gravable),
                          borderColor: 'rgb(34, 197, 94)',
                          backgroundColor: 'rgba(34, 197, 94, 0.1)',
                          fill: true,
                          tension: 0.4,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: true },
                        tooltip: {
                          callbacks: {
                            label: (context) => `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`,
                          },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: (value) => formatCurrency(Number(value)),
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Conciliación */}
        {activeTab === 'conciliacion' && (
          <div className="space-y-6">
            {/* Estado de Conciliación */}
            {data.conciliacion?.estado_conciliacion && data.conciliacion.estado_conciliacion.length > 0 && (
              <div className="space-y-2">
                {data.conciliacion.estado_conciliacion.map((validacion, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 p-3 rounded-lg ${
                      validacion.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                    }`}
                  >
                    <span className="text-sm font-medium">{validacion}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Cuadro de Conciliación */}
            {data.conciliacion?.cuadro_conciliacion && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cuadro de Conciliación</h3>
                <div className="space-y-4">
                  {/* Base Gravable */}
                  {data.conciliacion.cuadro_conciliacion.base_gravable && (
                    <div
                      className={`p-4 rounded-lg ${
                        data.conciliacion.cuadro_conciliacion.base_gravable.ok ? 'bg-green-50' : 'bg-yellow-50'
                      }`}
                    >
                      <p className="font-semibold text-gray-900 mb-2">Base Gravable</p>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Excel</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(data.conciliacion.cuadro_conciliacion.base_gravable.excel)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Línea de Captura</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(data.conciliacion.cuadro_conciliacion.base_gravable.linea)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Diferencia</p>
                          <p
                            className={`text-lg font-semibold ${
                              data.conciliacion.cuadro_conciliacion.base_gravable.ok ? 'text-green-600' : 'text-yellow-600'
                            }`}
                          >
                            {formatCurrency(data.conciliacion.cuadro_conciliacion.base_gravable.diferencia)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ISN 3% */}
                  {data.conciliacion.cuadro_conciliacion.isn_3 && (
                    <div
                      className={`p-4 rounded-lg ${
                        data.conciliacion.cuadro_conciliacion.isn_3.ok ? 'bg-green-50' : 'bg-yellow-50'
                      }`}
                    >
                      <p className="font-semibold text-gray-900 mb-2">ISN (3%)</p>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Excel (Calculado)</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(data.conciliacion.cuadro_conciliacion.isn_3.excel)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Línea de Captura</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(data.conciliacion.cuadro_conciliacion.isn_3.linea)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Diferencia</p>
                          <p
                            className={`text-lg font-semibold ${
                              data.conciliacion.cuadro_conciliacion.isn_3.ok ? 'text-green-600' : 'text-yellow-600'
                            }`}
                          >
                            {formatCurrency(data.conciliacion.cuadro_conciliacion.isn_3.diferencia)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  {data.conciliacion.cuadro_conciliacion.total && (
                    <div
                      className={`p-4 rounded-lg ${
                        data.conciliacion.cuadro_conciliacion.total.ok ? 'bg-green-50' : 'bg-yellow-50'
                      }`}
                    >
                      <p className="font-semibold text-gray-900 mb-2">Total a Pagar</p>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Línea de Captura</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(data.conciliacion.cuadro_conciliacion.total.linea)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Pago Realizado</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(data.conciliacion.cuadro_conciliacion.total.pago)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Diferencia</p>
                          <p
                            className={`text-lg font-semibold ${
                              data.conciliacion.cuadro_conciliacion.total.ok ? 'text-green-600' : 'text-yellow-600'
                            }`}
                          >
                            {formatCurrency(data.conciliacion.cuadro_conciliacion.total.diferencia)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Comprobante de Pago */}
            {data.conciliacion?.comprobante_pago && Object.keys(data.conciliacion.comprobante_pago).length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Comprobante de Pago</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Número de Operación</p>
                    <p className="text-base font-medium text-gray-900">
                      {data.conciliacion.comprobante_pago.numero_operacion || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Aplicación</p>
                    <p className="text-base font-medium text-gray-900">
                      {data.conciliacion.comprobante_pago.fecha_aplicacion || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estado</p>
                    <p
                      className={`text-base font-semibold ${
                        data.conciliacion.comprobante_pago.estado === 'ENVIADA' ? 'text-green-600' : 'text-yellow-600'
                      }`}
                    >
                      {data.conciliacion.comprobante_pago.estado || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Importe</p>
                    <p className="text-base font-semibold text-gray-900">
                      {formatCurrency(data.conciliacion.comprobante_pago.importe || 0)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Validación de CFDIs */}
            {data.conciliacion?.cfdis_validacion && Object.keys(data.conciliacion.cfdis_validacion).length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Validación de CFDIs</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-3xl font-bold text-blue-600">{data.conciliacion.cfdis_validacion.total || 0}</p>
                    <p className="text-sm text-gray-600 mt-1">Total CFDIs</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-3xl font-bold text-green-600">{data.conciliacion.cfdis_validacion.vigentes || 0}</p>
                    <p className="text-sm text-gray-600 mt-1">Vigentes</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-3xl font-bold text-red-600">{data.conciliacion.cfdis_validacion.cancelados || 0}</p>
                    <p className="text-sm text-gray-600 mt-1">Cancelados</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Predicciones */}
        {activeTab === 'predicciones' && (
          <div className="space-y-6">
            {/* Predicción Siguiente Mes */}
            {data.predicciones?.prediccion_siguiente_mes && data.predicciones.prediccion_siguiente_mes.estimado && (
              <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-8">
                <h3 className="text-xl font-semibold text-purple-900 mb-4">Predicción Siguiente Mes</h3>
                <div className="text-center">
                  <p className="text-5xl font-bold text-purple-600 mb-3">
                    {formatCurrency(data.predicciones.prediccion_siguiente_mes.estimado)}
                  </p>
                  <p className="text-lg text-purple-700">
                    Rango: {formatCurrency(data.predicciones.prediccion_siguiente_mes.rango_min)} -{' '}
                    {formatCurrency(data.predicciones.prediccion_siguiente_mes.rango_max)}
                  </p>
                </div>
              </div>
            )}

            {/* Tendencia de Plantilla */}
            {data.predicciones?.tendencia_plantilla && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Tendencia de Plantilla</h4>
                    <p className="text-blue-800">{data.predicciones.tendencia_plantilla}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Recomendaciones */}
            {data.predicciones?.recomendaciones && data.predicciones.recomendaciones.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendaciones</h3>
                <ul className="space-y-3">
                  {data.predicciones.recomendaciones.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-bechapra-primary flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}