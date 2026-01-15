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
    'dashboard' | 'empleados' | 'percepciones' | 'deducciones' | 'calculos' | 'incidencias' | 'cfdi' | 'dispersion' | 'validaciones' | 'historico'
  >('dashboard')
  const [expandedEmpleado, setExpandedEmpleado] = useState<number | null>(null)
  const [showAllEmpleados, setShowAllEmpleados] = useState(false)
  const [selectedPeriodoIndex, setSelectedPeriodoIndex] = useState(0)

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

  // Determinar si es multi-periodo o periodo único (backward compatibility)
  const isMultiPeriodo = data.periodos && data.periodos.length > 0
  const periodoActual = isMultiPeriodo
    ? data.periodos[selectedPeriodoIndex]
    : data

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
    { id: 'percepciones', label: 'Percepciones', icon: TrendingUp },
    { id: 'deducciones', label: 'Deducciones', icon: DollarSign },
    { id: 'calculos', label: 'Carga Patronal', icon: Calculator },
    { id: 'incidencias', label: 'Incidencias', icon: Calendar },
    { id: 'cfdi', label: 'CFDI', icon: FileCheck },
    { id: 'dispersion', label: 'Dispersión', icon: CreditCard },
    { id: 'validaciones', label: 'Validaciones', icon: CheckCircle2 },
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
      {periodoActual.alertas && periodoActual.alertas.length > 0 && (
        <div className="space-y-2">
          {periodoActual.alertas.map((alerta, index) => (
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

      {/* Header con información de empresa y periodo */}
      {periodoActual.empresa && periodoActual.periodo && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{periodoActual.empresa.nombre}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm opacity-90">
                <span>RFC: {periodoActual.empresa.rfc}</span>
                {periodoActual.empresa.registro_patronal && (
                  <span>• Registro Patronal: {periodoActual.empresa.registro_patronal}</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90 uppercase">Tipo de Nómina</div>
              <div className="text-2xl font-bold">{tipoNominaLabel}</div>
              <div className="text-sm opacity-90 mt-1">{periodoActual.periodo.descripcion}</div>
            </div>
          </div>
        </div>
      )}

      {/* Selector de periodos (multi-periodo) */}
      {isMultiPeriodo && data.periodos.length > 1 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Seleccionar Periodo:</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {data.periodos?.map((periodo, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPeriodoIndex(index)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedPeriodoIndex === index
                      ? 'bg-green-600 text-white shadow-sm border-2 border-green-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  {periodo.periodo.descripcion || `Periodo ${index + 1}`}
                </button>
              ))}
            </div>
          </div>
          {isMultiPeriodo && data.resumen_global && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Total Percepciones</div>
                  <div className="font-bold text-green-600">
                    {formatCurrency(data.resumen_global.total_percepciones)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Total Deducciones</div>
                  <div className="font-bold text-red-600">
                    {formatCurrency(data.resumen_global.total_deducciones)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Neto Global</div>
                  <div className="font-bold text-blue-600">
                    {formatCurrency(data.resumen_global.total_neto)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Carga Patronal</div>
                  <div className="font-bold text-purple-600">
                    {formatCurrency(data.resumen_global.carga_patronal.total)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Costo Total</div>
                  <div className="font-bold text-gray-900">
                    {formatCurrency(data.resumen_global.costo_total_nomina)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabs de navegación */}
      <div className="bg-white rounded-lg border border-bechapra-border p-1">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-bechapra-primary text-white shadow-sm'
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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                  <div className="text-3xl font-bold text-blue-600">
                    {formatCurrency(periodoActual.dashboard.nomina_total)}
                  </div>
                </div>
                <div className="text-sm text-blue-700 font-medium">Nómina Total</div>
                <div className="text-xs text-blue-600 mt-1">Tipo: {tipoNominaLabel}</div>
              </div>

              {/* Empleados */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-purple-600" />
                  <div className="text-3xl font-bold text-purple-600">
                    {formatNumber(periodoActual.dashboard.num_empleados)}
                  </div>
                </div>
                <div className="text-sm text-purple-700 font-medium">Empleados</div>
                <div className="text-xs text-purple-600 mt-1">Periodo: {periodoActual.dashboard.periodo}</div>
              </div>

              {/* Promedio por Empleado */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <Calculator className="w-8 h-8 text-green-600" />
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(periodoActual.dashboard.promedio_empleado)}
                  </div>
                </div>
                <div className="text-sm text-green-700 font-medium">Promedio</div>
                <div className="text-xs text-green-600 mt-1">Por empleado</div>
              </div>

              {/* Estado de Pago */}
              <div
                className={`border-2 rounded-lg p-6 ${
                  periodoActual.dashboard.estado_pago === 'PAGADO'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Clock className={`w-8 h-8 ${
                    periodoActual.dashboard.estado_pago === 'PAGADO' ? 'text-green-600' : 'text-gray-600'
                  }`} />
                  <div className={`text-3xl font-bold ${
                    periodoActual.dashboard.estado_pago === 'PAGADO' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {periodoActual.dashboard.estado_pago}
                  </div>
                </div>
                <div className={`text-sm font-medium ${
                  periodoActual.dashboard.estado_pago === 'PAGADO' ? 'text-green-700' : 'text-gray-700'
                }`}>Estado de Pago</div>
                <div className={`text-xs mt-1 ${
                  periodoActual.dashboard.estado_pago === 'PAGADO' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {periodoActual.dashboard.fecha_pago || 'Sin fecha'}
                </div>
              </div>
              </div>

            {/* Resumen de Cálculos */}
            {periodoActual.calculos && (
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
                    {Object.entries(periodoActual.calculos.percepciones || {})
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
                        {formatCurrency(periodoActual.calculos.totales.total_percepciones)}
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
                    {Object.entries(periodoActual.calculos.deducciones || {})
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
                        {formatCurrency(periodoActual.calculos.totales.total_deducciones)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Gráfica de Nómina Neta */}
            {periodoActual.calculos && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Composición de Nómina</h3>
                <div className="h-64">
                  <Doughnut
                    data={{
                      labels: ['Percepciones', 'Deducciones', 'Neto'],
                      datasets: [
                        {
                          data: [
                            periodoActual.calculos.totales.total_percepciones,
                            periodoActual.calculos.totales.total_deducciones,
                            periodoActual.calculos.totales.total_neto,
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
                    Lista de Empleados ({periodoActual.empleados.length})
                  </h3>
                  <p className="text-sm text-gray-600">Detalle de nómina por empleado</p>
                </div>
                {periodoActual.empleados.length > 10 && (
                  <button
                    onClick={() => setShowAllEmpleados(!showAllEmpleados)}
                    className="px-4 py-2 text-sm font-medium text-bechapra-primary border border-bechapra-primary rounded-lg hover:bg-bechapra-light-2 transition-colors"
                  >
                    {showAllEmpleados ? 'Ver menos' : `Ver todos (${periodoActual.empleados.length})`}
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {(showAllEmpleados ? periodoActual.empleados : periodoActual.empleados.slice(0, 10)).map(
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

        {/* TAB: PERCEPCIONES */}
        {activeTab === 'percepciones' && periodoActual.percepciones_detalle && (
          <div className="space-y-6">
            {/* KPIs de Percepciones */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-600">Total Percepciones</div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(periodoActual.resumen?.total_percepciones || 0)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Conceptos Activos</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {Object.keys(periodoActual.percepciones_detalle).length}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <Calculator className="w-8 h-8 text-purple-600" />
                  <div>
                    <div className="text-sm text-gray-600">Promedio por Empleado</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency((periodoActual.resumen?.total_percepciones || 0) / (periodoActual.resumen?.num_empleados || 1))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-orange-600" />
                  <div>
                    <div className="text-sm text-gray-600">Empleados Afectados</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {periodoActual.resumen?.num_empleados || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de Percepciones */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Detalle de Percepciones por Concepto
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Código
                      </th>
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
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                        % del Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(periodoActual.percepciones_detalle)
                      .sort(([, a], [, b]) => b.total - a.total)
                      .map(([codigo, datos]) => (
                        <tr key={codigo} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-mono text-gray-900">{datos.codigo}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">{datos.nombre}</td>
                          <td className="py-3 px-4 text-sm text-right text-gray-900">
                            {datos.empleados}
                          </td>
                          <td className="py-3 px-4 text-sm text-right font-medium text-green-600">
                            {formatCurrency(datos.total)}
                          </td>
                          <td className="py-3 px-4 text-sm text-right text-gray-600">
                            {formatCurrency(datos.total / datos.empleados)}
                          </td>
                          <td className="py-3 px-4 text-sm text-right text-gray-600">
                            {((datos.total / (periodoActual.resumen?.total_percepciones || 1)) * 100).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-300 font-bold">
                      <td colSpan={3} className="py-3 px-4 text-sm text-gray-900">TOTAL</td>
                      <td className="py-3 px-4 text-sm text-right text-green-600">
                        {formatCurrency(periodoActual.resumen?.total_percepciones || 0)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-600">
                        {formatCurrency((periodoActual.resumen?.total_percepciones || 0) / (periodoActual.resumen?.num_empleados || 1))}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-600">100.00%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Gráfica de Percepciones */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Distribución de Percepciones
              </h3>
              <div className="h-80">
                <Doughnut
                  data={{
                    labels: Object.values(periodoActual.percepciones_detalle).map((p) => `${p.codigo} - ${p.nombre}`),
                    datasets: [
                      {
                        data: Object.values(periodoActual.percepciones_detalle).map((p) => p.total),
                        backgroundColor: [
                          'rgba(34, 197, 94, 0.8)',
                          'rgba(59, 130, 246, 0.8)',
                          'rgba(168, 85, 247, 0.8)',
                          'rgba(249, 115, 22, 0.8)',
                          'rgba(236, 72, 153, 0.8)',
                          'rgba(14, 165, 233, 0.8)',
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
          </div>
        )}

        {/* TAB: DEDUCCIONES */}
        {activeTab === 'deducciones' && periodoActual.deducciones_detalle && (
          <div className="space-y-6">
            {/* KPIs de Deducciones */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-red-600" />
                  <div>
                    <div className="text-sm text-gray-600">Total Deducciones</div>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(periodoActual.resumen?.total_deducciones || 0)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-orange-600" />
                  <div>
                    <div className="text-sm text-gray-600">ISR Retenido</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(periodoActual.resumen?.isr_retenido || 0)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <Calculator className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">IMSS Obrero</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(periodoActual.resumen?.imss_obrero || 0)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-purple-600" />
                  <div>
                    <div className="text-sm text-gray-600">INFONAVIT + FONACOT</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency((periodoActual.resumen?.infonavit_empleados || 0) + (periodoActual.resumen?.fonacot_empleados || 0))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de Deducciones */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Detalle de Deducciones por Concepto
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Código
                      </th>
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
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                        % del Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(periodoActual.deducciones_detalle)
                      .sort(([, a], [, b]) => b.total - a.total)
                      .map(([codigo, datos]) => (
                        <tr key={codigo} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-mono text-gray-900">{datos.codigo}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">{datos.nombre}</td>
                          <td className="py-3 px-4 text-sm text-right text-gray-900">
                            {datos.empleados}
                          </td>
                          <td className="py-3 px-4 text-sm text-right font-medium text-red-600">
                            {formatCurrency(datos.total)}
                          </td>
                          <td className="py-3 px-4 text-sm text-right text-gray-600">
                            {formatCurrency(datos.total / datos.empleados)}
                          </td>
                          <td className="py-3 px-4 text-sm text-right text-gray-600">
                            {((datos.total / (periodoActual.resumen?.total_deducciones || 1)) * 100).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-300 font-bold">
                      <td colSpan={3} className="py-3 px-4 text-sm text-gray-900">TOTAL</td>
                      <td className="py-3 px-4 text-sm text-right text-red-600">
                        {formatCurrency(periodoActual.resumen?.total_deducciones || 0)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-600">
                        {formatCurrency((periodoActual.resumen?.total_deducciones || 0) / (periodoActual.resumen?.num_empleados || 1))}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-600">100.00%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Gráfica de Deducciones */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Distribución de Deducciones
              </h3>
              <div className="h-80">
                <Doughnut
                  data={{
                    labels: Object.values(periodoActual.deducciones_detalle).map((d) => `${d.codigo} - ${d.nombre}`),
                    datasets: [
                      {
                        data: Object.values(periodoActual.deducciones_detalle).map((d) => d.total),
                        backgroundColor: [
                          'rgba(239, 68, 68, 0.8)',
                          'rgba(249, 115, 22, 0.8)',
                          'rgba(168, 85, 247, 0.8)',
                          'rgba(59, 130, 246, 0.8)',
                          'rgba(236, 72, 153, 0.8)',
                          'rgba(14, 165, 233, 0.8)',
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
          </div>
        )}

        {/* TAB: CARGA PATRONAL (Provisiones 8XX) */}
        {activeTab === 'calculos' && periodoActual.resumen?.carga_patronal && (
          <div className="space-y-6">
            {/* KPIs de Carga Patronal */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">IMSS Patronal</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(periodoActual.resumen.carga_patronal.imss_patronal)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <Calculator className="w-8 h-8 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-600">SAR</div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(periodoActual.resumen.carga_patronal.sar)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-purple-600" />
                  <div>
                    <div className="text-sm text-gray-600">INFONAVIT Patronal</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(periodoActual.resumen.carga_patronal.infonavit_patronal)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                  <div>
                    <div className="text-sm text-gray-600">ISN</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(periodoActual.resumen.carga_patronal.isn)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-blue-700" />
                  <div>
                    <div className="text-sm text-gray-700 font-medium">TOTAL CARGA PATRONAL</div>
                    <div className="text-2xl font-bold text-blue-700">
                      {formatCurrency(periodoActual.resumen.carga_patronal.total)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen comparativo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Neto a Empleados</h4>
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(periodoActual.resumen?.total_neto || 0)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Dispersado a {periodoActual.resumen?.num_empleados} empleados</div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Carga Patronal Total</h4>
                <div className="text-3xl font-bold text-blue-600">
                  {formatCurrency(periodoActual.resumen.carga_patronal.total)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {((periodoActual.resumen.carga_patronal.total / (periodoActual.resumen?.total_neto || 1)) * 100).toFixed(2)}% del neto
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 bg-gradient-to-r from-purple-50 to-purple-100">
                <h4 className="text-sm font-medium text-purple-700 mb-2">Costo Total de Nómina</h4>
                <div className="text-3xl font-bold text-purple-700">
                  {formatCurrency((periodoActual.resumen?.total_neto || 0) + periodoActual.resumen.carga_patronal.total)}
                </div>
                <div className="text-xs text-purple-600 mt-1">Neto + Carga Patronal</div>
              </div>
            </div>

            {/* Tabla detallada de provisiones */}
            {periodoActual.provisiones_patronales && Object.keys(periodoActual.provisiones_patronales).length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Detalle de Provisiones Patronales (Códigos 8XX)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Código</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Concepto</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Categoría</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Total</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">% del Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(periodoActual.provisiones_patronales)
                        .sort(([, a], [, b]) => b.total - a.total)
                        .map(([codigo, datos]) => (
                          <tr key={codigo} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm font-mono text-gray-900">{datos.codigo}</td>
                            <td className="py-3 px-4 text-sm text-gray-900">{datos.nombre}</td>
                            <td className="py-3 px-4 text-sm">
                              <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                                datos.categoria === 'imss' ? 'bg-blue-100 text-blue-700' :
                                datos.categoria === 'sar' ? 'bg-green-100 text-green-700' :
                                datos.categoria === 'infonavit' ? 'bg-purple-100 text-purple-700' :
                                datos.categoria === 'isn' ? 'bg-orange-100 text-orange-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {datos.categoria.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-right font-medium text-blue-600">
                              {formatCurrency(datos.total)}
                            </td>
                            <td className="py-3 px-4 text-sm text-right text-gray-600">
                              {((datos.total / periodoActual.resumen.carga_patronal.total) * 100).toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-300 font-bold">
                        <td colSpan={3} className="py-3 px-4 text-sm text-gray-900">TOTAL CARGA PATRONAL</td>
                        <td className="py-3 px-4 text-sm text-right text-blue-700">
                          {formatCurrency(periodoActual.resumen.carga_patronal.total)}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-gray-600">100.00%</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* Gráfica de distribución */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Distribución de Carga Patronal por Categoría
              </h3>
              <div className="h-80">
                <Doughnut
                  data={{
                    labels: ['IMSS Patronal', 'SAR', 'INFONAVIT Patronal', 'ISN'],
                    datasets: [
                      {
                        data: [
                          periodoActual.resumen.carga_patronal.imss_patronal,
                          periodoActual.resumen.carga_patronal.sar,
                          periodoActual.resumen.carga_patronal.infonavit_patronal,
                          periodoActual.resumen.carga_patronal.isn,
                        ],
                        backgroundColor: [
                          'rgba(59, 130, 246, 0.8)',
                          'rgba(34, 197, 94, 0.8)',
                          'rgba(168, 85, 247, 0.8)',
                          'rgba(249, 115, 22, 0.8)',
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
          </div>
        )}

        {/* TAB: INCIDENCIAS */}
        {activeTab === 'incidencias' && periodoActual.incidencias && (
          <div className="space-y-6">
            {/* KPIs de Incidencias */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Total Incidencias</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatNumber(periodoActual.incidencias.total_incidencias)}
                    </div>
                  </div>
                </div>
              </div>

              {Object.entries(periodoActual.incidencias.por_tipo || {})
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
            {periodoActual.incidencias.detalle && periodoActual.incidencias.detalle.length > 0 && (
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
                      </tr>
                    </thead>
                    <tbody>
                      {periodoActual.incidencias.detalle.map((inc, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-900">{inc.empleado}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">
                            <span className="inline-flex px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                              {inc.tipo}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900">{inc.fecha || 'N/A'}</td>
                          <td className="py-3 px-4 text-sm text-right text-gray-900">
                            {inc.dias}
                          </td>
                          <td className="py-3 px-4 text-sm text-right font-medium text-gray-900">
                            {formatCurrency(inc.monto)}
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

        {/* TAB: CFDI */}
        {activeTab === 'cfdi' && periodoActual.cfdi && (
          <div className="space-y-6">
            {/* KPIs CFDI */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <FileCheck className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Total CFDI</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatNumber(periodoActual.cfdi.total_cfdi)}
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
                      {formatNumber(periodoActual.cfdi.timbrados)}
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
                      {formatNumber(periodoActual.cfdi.pendientes)}
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
                      {formatNumber(periodoActual.cfdi.errores)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Validación CFDI */}
            {periodoActual.cfdi.validacion && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Validación CFDI</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600">Total Validados</div>
                    <div className="text-xl font-bold text-gray-900">
                      {formatNumber(periodoActual.cfdi.validacion.total_validados)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Coinciden</div>
                    <div className="text-xl font-bold text-green-600">
                      {formatNumber(periodoActual.cfdi.validacion.coinciden)}
                    </div>
                  </div>
                </div>

                {periodoActual.cfdi.validacion.diferencias &&
                  periodoActual.cfdi.validacion.diferencias.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Diferencias</h4>
                      <div className="space-y-2">
                        {periodoActual.cfdi.validacion.diferencias.map((dif, index) => (
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
            {periodoActual.cfdi.detalle && periodoActual.cfdi.detalle.length > 0 && (
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
                      {periodoActual.cfdi.detalle.slice(0, 20).map((cfdi, index) => (
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
        {activeTab === 'dispersion' && periodoActual.dispersion && (
          <div className="space-y-6">
            {/* Info de Dispersión */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Información de Dispersión
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Banco</div>
                  <div className="text-base font-medium text-gray-900">{periodoActual.dispersion.banco}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Cuenta</div>
                  <div className="text-base font-medium text-gray-900">
                    {periodoActual.dispersion.cuenta}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Fecha</div>
                  <div className="text-base font-medium text-gray-900">{periodoActual.dispersion.fecha}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Dispersado</div>
                  <div className="text-base font-bold text-gray-900">
                    {formatCurrency(periodoActual.dispersion.total_dispersado)}
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen de Dispersión */}
            {periodoActual.dispersion.resumen && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                    <div>
                      <div className="text-sm text-gray-600">Exitosos</div>
                      <div className="text-2xl font-bold text-green-600">
                        {formatNumber(periodoActual.dispersion.resumen.exitosos)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {formatCurrency(periodoActual.dispersion.resumen.monto_exitoso)}
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
                        {formatNumber(periodoActual.dispersion.resumen.pendientes)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {formatCurrency(periodoActual.dispersion.resumen.monto_pendiente)}
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
                        {formatNumber(periodoActual.dispersion.resumen.rechazados)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {formatCurrency(periodoActual.dispersion.resumen.monto_rechazado)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Detalle de Pagos */}
            {periodoActual.dispersion.detalle && periodoActual.dispersion.detalle.length > 0 && (
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
                      {periodoActual.dispersion.detalle.map((pago, index) => (
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

        {/* TAB: VALIDACIONES */}
        {activeTab === 'validaciones' && (
          <div className="space-y-6">
            {/* Resumen de Validaciones */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-600">Validaciones OK</div>
                    <div className="text-3xl font-bold text-green-600">
                      {(periodoActual.validaciones || []).filter(v => v.tipo === 'ok').length}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-12 h-12 text-yellow-600" />
                  <div>
                    <div className="text-sm text-gray-600">Advertencias</div>
                    <div className="text-3xl font-bold text-yellow-600">
                      {(periodoActual.validaciones || []).filter(v => v.tipo === 'warning').length}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <XCircle className="w-12 h-12 text-red-600" />
                  <div>
                    <div className="text-sm text-gray-600">Errores</div>
                    <div className="text-3xl font-bold text-red-600">
                      {(periodoActual.validaciones || []).filter(v => v.tipo === 'error').length}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Validaciones */}
            {periodoActual.validaciones && periodoActual.validaciones.length > 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Detalle de Validaciones
                </h3>
                <div className="space-y-3">
                  {periodoActual.validaciones.map((validacion, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-4 rounded-lg border ${
                        validacion.tipo === 'ok'
                          ? 'bg-green-50 border-green-200'
                          : validacion.tipo === 'warning'
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {validacion.tipo === 'ok' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : validacion.tipo === 'warning' ? (
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                            validacion.tipo === 'ok'
                              ? 'bg-green-100 text-green-700'
                              : validacion.tipo === 'warning'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {validacion.categoria.toUpperCase()}
                          </span>
                          <span className={`text-xs font-medium ${
                            validacion.tipo === 'ok'
                              ? 'text-green-700'
                              : validacion.tipo === 'warning'
                              ? 'text-yellow-700'
                              : 'text-red-700'
                          }`}>
                            {validacion.tipo === 'ok' ? 'VALIDADO' : validacion.tipo === 'warning' ? 'ADVERTENCIA' : 'ERROR'}
                          </span>
                        </div>
                        <p className={`text-sm font-medium ${
                          validacion.tipo === 'ok'
                            ? 'text-green-900'
                            : validacion.tipo === 'warning'
                            ? 'text-yellow-900'
                            : 'text-red-900'
                        }`}>
                          {validacion.mensaje}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No hay validaciones disponibles</p>
              </div>
            )}

            {/* Alertas del Sistema */}
            {data.alertas && data.alertas.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Alertas del Sistema
                </h3>
                <div className="space-y-3">
                  {data.alertas.map((alerta, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-4 rounded-lg border ${
                        alerta.tipo === 'error'
                          ? 'bg-red-50 border-red-200'
                          : alerta.tipo === 'warning'
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {alerta.tipo === 'error' ? (
                          <XCircle className="w-5 h-5 text-red-600" />
                        ) : alerta.tipo === 'warning' ? (
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          alerta.tipo === 'error'
                            ? 'text-red-900'
                            : alerta.tipo === 'warning'
                            ? 'text-yellow-900'
                            : 'text-blue-900'
                        }`}>
                          {alerta.mensaje}
                        </p>
                        {alerta.detalle && (
                          <p className={`text-xs mt-1 ${
                            alerta.tipo === 'error'
                              ? 'text-red-700'
                              : alerta.tipo === 'warning'
                              ? 'text-yellow-700'
                              : 'text-blue-700'
                          }`}>
                            {alerta.detalle}
                          </p>
                        )}
                        {alerta.empleado && (
                          <p className="text-xs mt-1 text-gray-600">
                            Empleado: <span className="font-medium">{alerta.empleado}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recomendaciones */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">Recomendaciones</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Revisa las alertas de deducciones altas para verificar que sean correctas</li>
                    <li>• Verifica que todos los empleados tengan CFDI timbrado</li>
                    <li>• Concilia los montos de dispersión con el neto total</li>
                    <li>• Revisa que las incidencias estén reflejadas en las deducciones/percepciones</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: HISTÓRICO */}
        {activeTab === 'historico' && periodoActual.historico && (
          <div className="space-y-6">
            {/* Estadísticas Históricas */}
            {periodoActual.historico.estadisticas && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="text-sm text-gray-600 mb-1">Promedio Mensual</div>
                  <div className="text-xl font-bold text-gray-900">
                    {formatCurrency(periodoActual.historico.estadisticas.promedio_mensual)}
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="text-sm text-gray-600 mb-1">Desviación Estándar</div>
                  <div className="text-xl font-bold text-gray-900">
                    {formatCurrency(periodoActual.historico.estadisticas.desviacion_estandar)}
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="text-sm text-gray-600 mb-1">Crecimiento Anual</div>
                  <div className="text-xl font-bold text-green-600">
                    {periodoActual.historico.estadisticas.crecimiento_anual.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="text-sm text-gray-600 mb-1">Rotación Empleados</div>
                  <div className="text-xl font-bold text-gray-900">
                    {periodoActual.historico.estadisticas.rotacion_empleados.toFixed(1)}%
                  </div>
                </div>
              </div>
            )}

            {/* Gráfica de Tendencias */}
            {periodoActual.historico.tendencias && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tendencia de Nómina
                </h3>
                <div className="h-80">
                  <Line
                    data={{
                      labels: periodoActual.historico.tendencias.meses,
                      datasets: [
                        {
                          label: 'Nómina Total',
                          data: periodoActual.historico.tendencias.nomina_total,
                          borderColor: 'rgb(59, 130, 246)',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          tension: 0.4,
                          fill: true,
                        },
                        {
                          label: 'Promedio por Empleado',
                          data: periodoActual.historico.tendencias.promedio_empleado,
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
            {periodoActual.historico.periodos && periodoActual.historico.periodos.length > 0 && (
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
                      {periodoActual.historico.periodos.map((periodo, index) => (
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