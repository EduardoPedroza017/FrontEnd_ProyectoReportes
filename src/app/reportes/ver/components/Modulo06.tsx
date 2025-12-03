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
  CreditCard,
  Building2,
  Briefcase,
  XCircle,
  FileCheck,
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
  ArcElement,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { Modulo6Data } from './types'

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
    Filler,
    ArcElement
  )
}

interface Modulo06Props {
  data: Modulo6Data
}

export default function Modulo06({ data }: Modulo06Props) {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'empleados' | 'calculos' | 'incidencias' | 'cfdi' | 'dispersion' | 'historico'
  >('dashboard')
  const [expandedEmpleado, setExpandedEmpleado] = useState<number | null>(null)
  const [showAllEmpleados, setShowAllEmpleados] = useState(false)

  if (!data || !data.success) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Error al cargar los datos del módulo de nómina</span>
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

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'empleados', label: 'Empleados', icon: Users },
    { id: 'calculos', label: 'Cálculos', icon: Calculator },
    { id: 'incidencias', label: 'Incidencias', icon: Calendar },
    { id: 'cfdi', label: 'CFDI', icon: FileCheck },
    { id: 'dispersion', label: 'Dispersión', icon: CreditCard },
    { id: 'historico', label: 'Histórico', icon: TrendingUp },
  ]

  const tipoNominaLabel = {
    semanal: 'Semanal',
    quincenal: 'Quincenal',
    mensual: 'Mensual'
  }[data.tipo_nomina] || data.tipo_nomina

  return (
    <div className="space-y-6">
      {/* Alertas */}
      {data.dashboard.alertas && data.dashboard.alertas.length > 0 && (
        <div className="space-y-2">
          {data.dashboard.alertas.map((alerta, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-4 rounded-lg border ${
                alerta.tipo === 'error'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : alerta.tipo === 'warning'
                  ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                  : 'bg-blue-50 border-blue-200 text-blue-700'
              }`}
            >
              {alerta.tipo === 'error' ? (
                <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : alerta.tipo === 'warning' ? (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-medium">{alerta.mensaje}</p>
                {alerta.detalle && (
                  <p className="text-sm mt-1 opacity-90">{alerta.detalle}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs de navegación */}
      <div className="bg-white rounded-lg border border-bechapra-border p-1">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-bechapra-primary to-bechapra-accent text-white shadow-md'
                    : 'text-bechapra-text-secondary hover:bg-bechapra-light-2'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Contenido según tab activo */}
      <div className="space-y-6">
        {/* TAB: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPIs principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Nómina Total */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between mb-3">
                  <DollarSign className="w-8 h-8 opacity-80" />
                  <div className="text-right">
                    <div className="text-xs opacity-80 uppercase tracking-wide">Nómina Total</div>
                    <div className="text-2xl font-bold">{formatCurrency(data.dashboard.nomina_total)}</div>
                  </div>
                </div>
                <div className="text-xs opacity-90">Tipo: {tipoNominaLabel}</div>
              </div>

              {/* Empleados */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between mb-3">
                  <Users className="w-8 h-8 opacity-80" />
                  <div className="text-right">
                    <div className="text-xs opacity-80 uppercase tracking-wide">Empleados</div>
                    <div className="text-2xl font-bold">{formatNumber(data.dashboard.num_empleados)}</div>
                  </div>
                </div>
                <div className="text-xs opacity-90">Periodo: {data.dashboard.periodo}</div>
              </div>

              {/* Promedio por Empleado */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between mb-3">
                  <Calculator className="w-8 h-8 opacity-80" />
                  <div className="text-right">
                    <div className="text-xs opacity-80 uppercase tracking-wide">Promedio</div>
                    <div className="text-2xl font-bold">{formatCurrency(data.dashboard.promedio_empleado)}</div>
                  </div>
                </div>
                <div className="text-xs opacity-90">Por empleado</div>
              </div>

              {/* Estado de Pago */}
              <div
                className={`rounded-lg p-6 text-white ${
                  data.dashboard.estado_pago === 'PAGADO'
                    ? 'bg-gradient-to-br from-green-500 to-green-600'
                    : data.dashboard.estado_pago === 'PARCIAL'
                    ? 'bg-gradient-to-br from-yellow-500 to-yellow-600'
                    : 'bg-gradient-to-br from-gray-500 to-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  {data.dashboard.estado_pago === 'PAGADO' ? (
                    <CheckCircle2 className="w-8 h-8 opacity-80" />
                  ) : (
                    <Clock className="w-8 h-8 opacity-80" />
                  )}
                  <div className="text-right">
                    <div className="text-xs opacity-80 uppercase tracking-wide">Estado</div>
                    <div className="text-2xl font-bold">{data.dashboard.estado_pago}</div>
                  </div>
                </div>
                <div className="text-xs opacity-90">
                  {data.dashboard.fecha_pago ? `Fecha: ${data.dashboard.fecha_pago}` : 'Sin fecha'}
                </div>
              </div>
            </div>

            {/* Resumen de Cálculos */}
            {data.calculos && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Percepciones */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Percepciones</h3>
                      <p className="text-sm text-gray-600">Ingresos del periodo</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(data.calculos.percepciones || {})
                      .slice(0, 5)
                      .map(([concepto, datos]) => (
                        <div key={concepto} className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">{concepto}</span>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-gray-900">
                              {formatCurrency(datos.total)}
                            </div>
                            <div className="text-xs text-gray-500">{datos.empleados} empleados</div>
                          </div>
                        </div>
                      ))}
                    <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-green-600">
                        {formatCurrency(data.calculos.totales.total_percepciones)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deducciones */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Calculator className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Deducciones</h3>
                      <p className="text-sm text-gray-600">Descuentos del periodo</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(data.calculos.deducciones || {})
                      .slice(0, 5)
                      .map(([concepto, datos]) => (
                        <div key={concepto} className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">{concepto}</span>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-gray-900">
                              {formatCurrency(datos.total)}
                            </div>
                            <div className="text-xs text-gray-500">{datos.empleados} empleados</div>
                          </div>
                        </div>
                      ))}
                    <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-red-600">
                        {formatCurrency(data.calculos.totales.total_deducciones)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Gráfica de Nómina Neta */}
            {data.calculos && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Composición de Nómina</h3>
                <div className="h-64">
                  <Doughnut
                    data={{
                      labels: ['Percepciones', 'Deducciones', 'Neto'],
                      datasets: [
                        {
                          data: [
                            data.calculos.totales.total_percepciones,
                            data.calculos.totales.total_deducciones,
                            data.calculos.totales.total_neto,
                          ],
                          backgroundColor: [
                            'rgba(34, 197, 94, 0.8)',
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(59, 130, 246, 0.8)',
                          ],
                          borderColor: [
                            'rgb(34, 197, 94)',
                            'rgb(239, 68, 68)',
                            'rgb(59, 130, 246)',
                          ],
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              return context.label + ': ' + formatCurrency(context.parsed)
                            },
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

        {/* TAB: EMPLEADOS */}
        {activeTab === 'empleados' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Lista de Empleados ({data.empleados.length})
                  </h3>
                  <p className="text-sm text-gray-600">Detalle de nómina por empleado</p>
                </div>
                {data.empleados.length > 10 && (
                  <button
                    onClick={() => setShowAllEmpleados(!showAllEmpleados)}
                    className="px-4 py-2 text-sm font-medium text-bechapra-primary border border-bechapra-primary rounded-lg hover:bg-bechapra-light-2 transition-colors"
                  >
                    {showAllEmpleados ? 'Ver menos' : `Ver todos (${data.empleados.length})`}
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {(showAllEmpleados ? data.empleados : data.empleados.slice(0, 10)).map(
                  (empleado, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      {/* Header del empleado */}
                      <div
                        className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() =>
                          setExpandedEmpleado(expandedEmpleado === index ? null : index)
                        }
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-bechapra-primary to-bechapra-accent rounded-full flex items-center justify-center text-white font-bold">
                            {empleado.nombre
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{empleado.nombre}</div>
                            <div className="text-sm text-gray-600">
                              {empleado.puesto} • {empleado.departamento}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm text-gray-600">Neto</div>
                            <div className="text-lg font-bold text-gray-900">
                              {formatCurrency(empleado.neto)}
                            </div>
                          </div>
                          {expandedEmpleado === index ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Detalle del empleado (expandible) */}
                      {expandedEmpleado === index && (
                        <div className="p-4 bg-white border-t border-gray-200">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <div className="text-xs text-gray-600">RFC</div>
                              <div className="text-sm font-medium text-gray-900">
                                {empleado.rfc}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">NSS</div>
                              <div className="text-sm font-medium text-gray-900">
                                {empleado.nss}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">Salario Diario</div>
                              <div className="text-sm font-medium text-gray-900">
                                {formatCurrency(empleado.salario_diario)}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">Días Trabajados</div>
                              <div className="text-sm font-medium text-gray-900">
                                {empleado.dias_trabajados}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Percepciones */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                Percepciones
                              </h4>
                              <div className="space-y-1">
                                {Object.entries(empleado.percepciones).map(([concepto, monto]) => (
                                  <div
                                    key={concepto}
                                    className="flex justify-between text-sm"
                                  >
                                    <span className="text-gray-700">{concepto}</span>
                                    <span className="font-medium text-gray-900">
                                      {formatCurrency(monto)}
                                    </span>
                                  </div>
                                ))}
                                <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200">
                                  <span>Total</span>
                                  <span className="text-green-600">
                                    {formatCurrency(empleado.total_percepciones)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Deducciones */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                Deducciones
                              </h4>
                              <div className="space-y-1">
                                {Object.entries(empleado.deducciones).map(([concepto, monto]) => (
                                  <div
                                    key={concepto}
                                    className="flex justify-between text-sm"
                                  >
                                    <span className="text-gray-700">{concepto}</span>
                                    <span className="font-medium text-gray-900">
                                      {formatCurrency(monto)}
                                    </span>
                                  </div>
                                ))}
                                <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200">
                                  <span>Total</span>
                                  <span className="text-red-600">
                                    {formatCurrency(empleado.total_deducciones)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Indicadores */}
                          <div className="flex gap-2 mt-4">
                            {empleado.tiene_cfdi && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                                <CheckCircle2 className="w-3 h-3" />
                                CFDI
                              </span>
                            )}
                            {empleado.tiene_comprobante && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                <CheckCircle2 className="w-3 h-3" />
                                Pagado
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: CÁLCULOS */}
        {activeTab === 'calculos' && data.calculos && (
          <div className="space-y-6">
            {/* Resumen General */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen General</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Total Percepciones</div>
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(data.calculos.totales.total_percepciones)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Deducciones</div>
                  <div className="text-xl font-bold text-red-600">
                    {formatCurrency(data.calculos.totales.total_deducciones)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Neto</div>
                  <div className="text-xl font-bold text-blue-600">
                    {formatCurrency(data.calculos.totales.total_neto)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Promedio por Empleado</div>
                  <div className="text-xl font-bold text-gray-900">
                    {formatCurrency(data.calculos.totales.promedio_neto)}
                  </div>
                </div>
              </div>
            </div>

            {/* Detalle de Percepciones */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Detalle de Percepciones
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Concepto
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                        Empleados
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                        Total
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                        Promedio
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(data.calculos.percepciones).map(([concepto, datos]) => (
                      <tr key={concepto} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-900">{concepto}</td>
                        <td className="py-3 px-4 text-sm text-right text-gray-900">
                          {datos.empleados}
                        </td>
                        <td className="py-3 px-4 text-sm text-right font-medium text-gray-900">
                          {formatCurrency(datos.total)}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-gray-600">
                          {formatCurrency(datos.total / datos.empleados)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detalle de Deducciones */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Detalle de Deducciones
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Concepto
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                        Empleados
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                        Total
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                        Promedio
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(data.calculos.deducciones).map(([concepto, datos]) => (
                      <tr key={concepto} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-900">{concepto}</td>
                        <td className="py-3 px-4 text-sm text-right text-gray-900">
                          {datos.empleados}
                        </td>
                        <td className="py-3 px-4 text-sm text-right font-medium text-gray-900">
                          {formatCurrency(datos.total)}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-gray-600">
                          {formatCurrency(datos.total / datos.empleados)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: INCIDENCIAS */}
        {activeTab === 'incidencias' && data.incidencias && (
          <div className="space-y-6">
            {/* KPIs de Incidencias */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Total Incidencias</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatNumber(data.incidencias.total_incidencias)}
                    </div>
                  </div>
                </div>
              </div>

              {Object.entries(data.incidencias.por_tipo || {})
                .slice(0, 2)
                .map(([tipo, cantidad]) => (
                  <div key={tipo} className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertCircle className="w-8 h-8 text-yellow-600" />
                      <div>
                        <div className="text-sm text-gray-600">{tipo}</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {formatNumber(cantidad)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Tabla de Incidencias */}
            {data.incidencias.detalle && data.incidencias.detalle.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Detalle de Incidencias
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                          Empleado
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                          Tipo
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                          Fecha
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                          Días
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                          Monto
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                          Descripción
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.incidencias.detalle.map((inc, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-sm text-gray-900">{inc.empleado}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">
                            <span className="inline-flex px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                              {inc.tipo}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900">{inc.fecha}</td>
                          <td className="py-3 px-4 text-sm text-right text-gray-900">
                            {inc.dias}
                          </td>
                          <td className="py-3 px-4 text-sm text-right font-medium text-gray-900">
                            {formatCurrency(inc.monto)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{inc.descripcion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: CFDI */}
        {activeTab === 'cfdi' && data.cfdi && (
          <div className="space-y-6">
            {/* KPIs CFDI */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <FileCheck className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Total CFDI</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatNumber(data.cfdi.total_cfdi)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-600">Timbrados</div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatNumber(data.cfdi.timbrados)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-yellow-600" />
                  <div>
                    <div className="text-sm text-gray-600">Pendientes</div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {formatNumber(data.cfdi.pendientes)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <XCircle className="w-8 h-8 text-red-600" />
                  <div>
                    <div className="text-sm text-gray-600">Errores</div>
                    <div className="text-2xl font-bold text-red-600">
                      {formatNumber(data.cfdi.errores)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Validación CFDI */}
            {data.cfdi.validacion && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Validación CFDI</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600">Total Validados</div>
                    <div className="text-xl font-bold text-gray-900">
                      {formatNumber(data.cfdi.validacion.total_validados)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Coinciden</div>
                    <div className="text-xl font-bold text-green-600">
                      {formatNumber(data.cfdi.validacion.coinciden)}
                    </div>
                  </div>
                </div>

                {data.cfdi.validacion.diferencias &&
                  data.cfdi.validacion.diferencias.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Diferencias</h4>
                      <div className="space-y-2">
                        {data.cfdi.validacion.diferencias.map((dif, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                          >
                            <div>
                              <div className="font-medium text-gray-900">{dif.empleado}</div>
                              <div className="text-sm text-gray-600">
                                Nómina: {formatCurrency(dif.monto_nomina)} | CFDI:{' '}
                                {formatCurrency(dif.monto_cfdi)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">Diferencia</div>
                              <div className="font-bold text-red-600">
                                {formatCurrency(dif.diferencia)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {/* Detalle CFDI */}
            {data.cfdi.detalle && data.cfdi.detalle.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalle de CFDI</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                          Empleado
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                          UUID
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                          Fecha
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                          Total
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.cfdi.detalle.slice(0, 20).map((cfdi, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-sm text-gray-900">{cfdi.empleado}</td>
                          <td className="py-3 px-4 text-sm text-gray-600 font-mono text-xs">
                            {cfdi.uuid.substring(0, 20)}...
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900">
                            {cfdi.fecha_timbrado}
                          </td>
                          <td className="py-3 px-4 text-sm text-right font-medium text-gray-900">
                            {formatCurrency(cfdi.total)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {cfdi.pdf_disponible && (
                                <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                  PDF
                                </span>
                              )}
                              {cfdi.xml_disponible && (
                                <span className="inline-flex px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                                  XML
                                </span>
                              )}
                              {cfdi.valido ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
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

        {/* TAB: DISPERSIÓN */}
        {activeTab === 'dispersion' && data.dispersion && (
          <div className="space-y-6">
            {/* Info de Dispersión */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Información de Dispersión
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Banco</div>
                  <div className="text-base font-medium text-gray-900">{data.dispersion.banco}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Cuenta</div>
                  <div className="text-base font-medium text-gray-900">
                    {data.dispersion.cuenta}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Fecha</div>
                  <div className="text-base font-medium text-gray-900">{data.dispersion.fecha}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Dispersado</div>
                  <div className="text-base font-bold text-gray-900">
                    {formatCurrency(data.dispersion.total_dispersado)}
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen de Dispersión */}
            {data.dispersion.resumen && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                    <div>
                      <div className="text-sm text-gray-600">Exitosos</div>
                      <div className="text-2xl font-bold text-green-600">
                        {formatNumber(data.dispersion.resumen.exitosos)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {formatCurrency(data.dispersion.resumen.monto_exitoso)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-yellow-600" />
                    <div>
                      <div className="text-sm text-gray-600">Pendientes</div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {formatNumber(data.dispersion.resumen.pendientes)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {formatCurrency(data.dispersion.resumen.monto_pendiente)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-3">
                    <XCircle className="w-8 h-8 text-red-600" />
                    <div>
                      <div className="text-sm text-gray-600">Rechazados</div>
                      <div className="text-2xl font-bold text-red-600">
                        {formatNumber(data.dispersion.resumen.rechazados)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {formatCurrency(data.dispersion.resumen.monto_rechazado)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Detalle de Pagos */}
            {data.dispersion.detalle && data.dispersion.detalle.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalle de Pagos</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                          Empleado
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                          Banco
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                          Cuenta
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                          Monto
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                          Referencia
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.dispersion.detalle.map((pago, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-sm text-gray-900">{pago.empleado}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">{pago.banco}</td>
                          <td className="py-3 px-4 text-sm text-gray-900 font-mono">
                            {pago.cuenta}
                          </td>
                          <td className="py-3 px-4 text-sm text-right font-medium text-gray-900">
                            {formatCurrency(pago.monto)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{pago.referencia}</td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                                pago.estado === 'EXITOSO'
                                  ? 'bg-green-100 text-green-700'
                                  : pago.estado === 'PENDIENTE'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {pago.estado}
                            </span>
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

        {/* TAB: HISTÓRICO */}
        {activeTab === 'historico' && data.historico && (
          <div className="space-y-6">
            {/* Estadísticas Históricas */}
            {data.historico.estadisticas && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="text-sm text-gray-600 mb-1">Promedio Mensual</div>
                  <div className="text-xl font-bold text-gray-900">
                    {formatCurrency(data.historico.estadisticas.promedio_mensual)}
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="text-sm text-gray-600 mb-1">Desviación Estándar</div>
                  <div className="text-xl font-bold text-gray-900">
                    {formatCurrency(data.historico.estadisticas.desviacion_estandar)}
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="text-sm text-gray-600 mb-1">Crecimiento Anual</div>
                  <div className="text-xl font-bold text-green-600">
                    {data.historico.estadisticas.crecimiento_anual.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="text-sm text-gray-600 mb-1">Rotación Empleados</div>
                  <div className="text-xl font-bold text-gray-900">
                    {data.historico.estadisticas.rotacion_empleados.toFixed(1)}%
                  </div>
                </div>
              </div>
            )}

            {/* Gráfica de Tendencias */}
            {data.historico.tendencias && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tendencia de Nómina
                </h3>
                <div className="h-80">
                  <Line
                    data={{
                      labels: data.historico.tendencias.meses,
                      datasets: [
                        {
                          label: 'Nómina Total',
                          data: data.historico.tendencias.nomina_total,
                          borderColor: 'rgb(59, 130, 246)',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          tension: 0.4,
                          fill: true,
                        },
                        {
                          label: 'Promedio por Empleado',
                          data: data.historico.tendencias.promedio_empleado,
                          borderColor: 'rgb(34, 197, 94)',
                          backgroundColor: 'rgba(34, 197, 94, 0.1)',
                          tension: 0.4,
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              return context.dataset.label + ': ' + formatCurrency(context.parsed.y)
                            },
                          },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function (value) {
                              return formatCurrency(value as number)
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}

            {/* Tabla de Periodos */}
            {data.historico.periodos && data.historico.periodos.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Periodos</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                          Periodo
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                          Tipo
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                          Empleados
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                          Total Neto
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                          Promedio
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                          Fecha Pago
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.historico.periodos.map((periodo, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-sm text-gray-900">{periodo.periodo}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">
                            <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                              {periodo.tipo}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-right text-gray-900">
                            {formatNumber(periodo.num_empleados)}
                          </td>
                          <td className="py-3 px-4 text-sm text-right font-medium text-gray-900">
                            {formatCurrency(periodo.total_neto)}
                          </td>
                          <td className="py-3 px-4 text-sm text-right text-gray-900">
                            {formatCurrency(periodo.promedio_empleado)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900">{periodo.fecha_pago}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}