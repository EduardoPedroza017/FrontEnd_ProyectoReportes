'use client'

import { useState } from 'react'
import {
  Users,
  Building2,
  DollarSign,
  AlertCircle,
  TrendingUp,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  CheckCircle2,
} from 'lucide-react'
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface SUAData {
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

interface Modulo04Props {
  data: SUAData
}

const COLORS = {
  primary: '#667EEA',
  secondary: '#764BA2',
  success: '#28A745',
  warning: '#FFA500',
  danger: '#DC3545',
  info: '#17A2B8',
  purple: '#9B59B6',
  pink: '#E91E63',
  indigo: '#6610F2',
}

const CHART_COLORS = [
  COLORS.primary,
  COLORS.success,
  COLORS.warning,
  COLORS.danger,
  COLORS.info,
  COLORS.purple,
  COLORS.pink,
  COLORS.indigo,
  '#3498DB',
]

export default function Modulo04({ data }: Modulo04Props) {
  const [activeTab, setActiveTab] = useState<'resumen' | 'trabajadores' | 'analisis' | 'comprobante'>('resumen')
  const [expandedWorker, setExpandedWorker] = useState<number | null>(null)

  if (!data || !data.success) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Error al cargar los datos del módulo SUA</span>
        </div>
      </div>
    )
  }

  const empresa = data.empresa || {}
  const resumen = data.resumen || {}
  const trabajadores = data.trabajadores || []
  const analisis = data.analisis || {}
  const comprobante = data.comprobante
  const alertas = data.alertas || []

  // Mapeo de valores del backend a la UI
  const nombreEmpresa = empresa.nombre || 'Sin nombre'
  const rfcEmpresa = empresa.rfc || 'Sin RFC'
  const registroPatronal = empresa.registro_patronal || 'Sin registro'
  const periodo = empresa.periodo || 'Sin periodo'
  const delegacion = empresa.delegacion || ''
  
  const numTrabajadores = resumen.num_cotizantes || trabajadores.length || 0
  const fechaPago = resumen.fecha_pago || 'Sin fecha'
  
  const totalCuotaObrera = analisis.totales?.obrera || resumen.cuotas_obreras || 0
  const totalCuotaPatronal = analisis.totales?.patronal || resumen.cuotas_patronales || 0
  const totalPagar = resumen.total_pagar || 0
  
  const promedioSDI = analisis.sdi?.promedio || 0
  const minimoSDI = analisis.sdi?.minimo || 0
  const maximoSDI = analisis.sdi?.maximo || 0
  
  const costoPromedioTrabajador = analisis.costo_promedio_trabajador || 0
  const distribSalarial = analisis.distribucion_salarial || {}

  // Calcular promedio SDI verificado
  const promedioSDICalculado = trabajadores.length > 0 
    ? trabajadores.reduce((sum, t) => sum + (t.sdi || 0), 0) / trabajadores.length 
    : promedioSDI

  // Preparar datos para gráfica de distribución de conceptos
  const conceptosData = [
    { name: 'Cuota Fija', value: resumen.cuota_fija || 0 },
    { name: 'Excedente', value: resumen.excedente || 0 },
    { name: 'Prest. Dinero', value: resumen.prestaciones_dinero || 0 },
    { name: 'Gastos Médicos', value: resumen.gastos_medicos || 0 },
    { name: 'Riesgos Trabajo', value: resumen.riesgos_trabajo || 0 },
    { name: 'Invalidez y Vida', value: resumen.invalidez_vida || 0 },
    { name: 'Guarderías', value: resumen.guarderias || 0 },
  ].filter(item => item.value > 0)

  // Datos para gráfica Patronal vs Obrera
  const cuotasComparativaData = [
    {
      name: 'Cuotas',
      Patronal: totalCuotaPatronal,
      Obrera: totalCuotaObrera,
    }
  ]

  // Datos para gráfica de distribución salarial
  const distribucionSalarialData = Object.entries(distribSalarial).map(([rango, cantidad]) => ({
    rango,
    cantidad,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-bechapra-border p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-bechapra-text-primary mb-2">
              {nombreEmpresa}
            </h3>
            <div className="flex flex-wrap gap-4 text-sm text-bechapra-text-secondary">
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                RFC: {rfcEmpresa}
              </span>
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Registro: {registroPatronal}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {periodo}
              </span>
              {delegacion && (
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {delegacion}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-bechapra-primary">
              ${totalPagar.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-bechapra-text-muted">Total a pagar</div>
          </div>
        </div>
      </div>

      {/* KPIs - ACTUALIZADOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Trabajadores */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="text-3xl font-bold text-blue-600">{numTrabajadores}</div>
          </div>
          <div className="text-sm text-blue-700 font-medium">Trabajadores</div>
          <div className="text-xs text-blue-600 mt-1">Cotizantes activos</div>
        </div>

        {/* KPI 2: Promedio SDI */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div className="text-3xl font-bold text-purple-600">
              ${promedioSDICalculado.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="text-sm text-purple-700 font-medium">Promedio SDI</div>
          <div className="text-xs text-purple-600 mt-1">Salario Diario Integrado</div>
        </div>

        {/* KPI 3: Cuota Patronal */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Building2 className="w-8 h-8 text-green-600" />
            <div className="text-2xl font-bold text-green-600">
              ${totalCuotaPatronal.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="text-sm text-green-700 font-medium">Cuota Patronal</div>
          </div>

        {/* KPI 4: Cuota Obrera */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-orange-600" />
            <div className="text-2xl font-bold text-orange-600">
              ${totalCuotaObrera.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="text-sm text-orange-700 font-medium">Cuota Obrera</div>
          <div className="text-xs text-orange-600 mt-1">Descuentos trabajadores</div>
        </div>
      </div>

      {/* Alertas */}
      {alertas.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-900 mb-2">Alertas detectadas</h4>
              <ul className="space-y-1 text-sm text-yellow-800">
                {alertas.slice(0, 3).map((alerta, idx) => (
                  <li key={idx}>{alerta.mensaje}</li>
                ))}
              </ul>
              {alertas.length > 3 && (
                <button className="text-xs text-yellow-700 hover:underline mt-2">
                  Ver todas las alertas ({alertas.length})
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-bechapra-border overflow-hidden">
        <div className="border-b border-bechapra-border flex overflow-x-auto">
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'resumen'
                ? 'border-b-2 border-bechapra-primary text-bechapra-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('resumen')}
          >
            <FileText className="w-4 h-4" />
            Resumen
          </button>

          <button
            className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'trabajadores'
                ? 'border-b-2 border-bechapra-primary text-bechapra-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('trabajadores')}
          >
            <Users className="w-4 h-4" />
            Trabajadores ({trabajadores.length})
          </button>

          <button
            className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'analisis'
                ? 'border-b-2 border-bechapra-primary text-bechapra-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('analisis')}
          >
            <TrendingUp className="w-4 h-4" />
            Análisis
          </button>

          {comprobante && (
            <button
              className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'comprobante'
                  ? 'border-b-2 border-bechapra-primary text-bechapra-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('comprobante')}
            >
              <CheckCircle2 className="w-4 h-4" />
              Comprobante
            </button>
          )}
        </div>

        {/* Tab: Resumen */}
        {activeTab === 'resumen' && (
          <div className="p-6 space-y-6">
            {/* Totales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Cuotas Obreras</h4>
                <div className="text-3xl font-bold text-blue-700 mb-2">
                  ${totalCuotaObrera.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-blue-600">Descuentos a trabajadores</div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3">Cuotas Patronales</h4>
                <div className="text-3xl font-bold text-green-700 mb-2">
                  ${totalCuotaPatronal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-green-600">Aportación de la empresa</div>
              </div>
            </div>

            {/* Gráficas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfica 1: Distribución por Tipo de Seguro */}
              {conceptosData.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Distribución por Tipo de Seguro
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={conceptosData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {conceptosData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `$${value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Gráfica 2: Patronal vs Obrera */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Patronal vs Obrera
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cuotasComparativaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`} />
                    <Legend />
                    <Bar dataKey="Patronal" fill={COLORS.success} name="Cuota Patronal" />
                    <Bar dataKey="Obrera" fill={COLORS.warning} name="Cuota Obrera" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Desglose de conceptos */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Desglose de Cuotas</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {resumen.cuota_fija !== undefined && resumen.cuota_fija > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Cuota Fija</div>
                    <div className="font-bold text-bechapra-primary">${resumen.cuota_fija.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                  </div>
                )}
                {resumen.excedente !== undefined && resumen.excedente > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Excedente</div>
                    <div className="font-bold text-bechapra-primary">${resumen.excedente.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                  </div>
                )}
                {resumen.prestaciones_dinero !== undefined && resumen.prestaciones_dinero > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Prestaciones en Dinero</div>
                    <div className="font-bold text-bechapra-primary">${resumen.prestaciones_dinero.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                  </div>
                )}
                {resumen.gastos_medicos !== undefined && resumen.gastos_medicos > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Gastos Médicos</div>
                    <div className="font-bold text-bechapra-primary">${resumen.gastos_medicos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                  </div>
                )}
                {resumen.riesgos_trabajo !== undefined && resumen.riesgos_trabajo > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Riesgos de Trabajo</div>
                    <div className="font-bold text-bechapra-primary">${resumen.riesgos_trabajo.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                  </div>
                )}
                {resumen.invalidez_vida !== undefined && resumen.invalidez_vida > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Invalidez y Vida</div>
                    <div className="font-bold text-bechapra-primary">${resumen.invalidez_vida.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                  </div>
                )}
                {resumen.guarderias !== undefined && resumen.guarderias > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Guarderías</div>
                    <div className="font-bold text-bechapra-primary">${resumen.guarderias.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                  </div>
                )}
                {resumen.cesantia !== undefined && resumen.cesantia > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Cesantía</div>
                    <div className="font-bold text-bechapra-primary">${resumen.cesantia.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                  </div>
                )}
                {resumen.infonavit !== undefined && resumen.infonavit > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">INFONAVIT</div>
                    <div className="font-bold text-bechapra-primary">${resumen.infonavit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Trabajadores */}
        {activeTab === 'trabajadores' && (
          <div className="p-6">
            {trabajadores.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay trabajadores registrados</p>
            ) : (
              <div className="space-y-2">
                {trabajadores.map((trabajador, idx) => {
                  const totalCuotasTrabajador = (trabajador.subtotal_patronal || 0) + (trabajador.subtotal_obrera || 0)
                  
                  return (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:border-bechapra-primary transition-colors"
                    >
                      <button
                        onClick={() => setExpandedWorker(expandedWorker === idx ? null : idx)}
                        className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-bechapra-light flex items-center justify-center text-bechapra-primary font-semibold">
                            {(trabajador.nombre || 'N').charAt(0)}
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">{trabajador.nombre || 'Sin nombre'}</div>
                            <div className="text-sm text-gray-500">NSS: {trabajador.nss || 'N/A'}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-bold text-bechapra-primary">
                              ${totalCuotasTrabajador.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                            </div>
                            <div className="text-xs text-gray-500">Total cuotas</div>
                          </div>
                          {expandedWorker === idx ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </button>

                      {expandedWorker === idx && (
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="text-gray-500">RFC</div>
                              <div className="font-medium">{trabajador.rfc || 'N/A'}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">SDI</div>
                              <div className="font-medium">${(trabajador.sdi || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Días Cotizados</div>
                              <div className="font-medium">{trabajador.dias || 0}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Cuota Fija</div>
                              <div className="font-medium">${(trabajador.cuota_fija || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Subtotal Obrera</div>
                              <div className="font-medium text-orange-600">${(trabajador.subtotal_obrera || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Subtotal Patronal</div>
                              <div className="font-medium text-green-600">${(trabajador.subtotal_patronal || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab: Análisis */}
        {activeTab === 'analisis' && (
          <div className="p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4">Costo Promedio por Trabajador</h4>
              <div className="text-4xl font-bold mb-2">
                ${costoPromedioTrabajador.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-sm opacity-90">
                Incluye cuotas obreras y patronales
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Estadísticas */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Estadísticas Salariales</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Promedio SDI</span>
                    <span className="font-semibold">${promedioSDICalculado.toLocaleString('es-MX', { maximumFractionDigits: 2 })}</span>
                  </div>
                  {minimoSDI > 0 && (
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-gray-600">SDI Mínimo</span>
                      <span className="font-semibold">${minimoSDI.toLocaleString('es-MX', { maximumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  {maximoSDI > 0 && (
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-gray-600">SDI Máximo</span>
                      <span className="font-semibold">${maximoSDI.toLocaleString('es-MX', { maximumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Trabajadores</span>
                    <span className="font-semibold">{numTrabajadores}</span>
                  </div>
                </div>
              </div>

              {/* Desglose de Cuotas */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Desglose de Cuotas</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Total Cuota Obrera</span>
                    <span className="font-semibold text-orange-600">${totalCuotaObrera.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Total Cuota Patronal</span>
                    <span className="font-semibold text-green-600">${totalCuotaPatronal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-semibold">Total a Pagar</span>
                    <span className="font-bold text-bechapra-primary text-lg">${totalPagar.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráfica de Distribución Salarial */}
            {distribucionSalarialData.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Distribución Salarial
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={distribucionSalarialData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rango" />
                    <YAxis />
                    <Tooltip />
                    <Legend formatter={() => 'Trabajadores'} />
                    <Bar dataKey="cantidad" fill={COLORS.primary} name="Trabajadores" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Tab: Comprobante */}
        {activeTab === 'comprobante' && comprobante && (
          <div className="p-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <h4 className="text-lg font-semibold text-green-900">Pago Confirmado</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-green-700 mb-1">Folio SUA</div>
                  <div className="font-semibold text-green-900">{comprobante.folio_sua || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-green-700 mb-1">Número de Operación</div>
                  <div className="font-semibold text-green-900">{comprobante.numero_operacion || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-green-700 mb-1">Fecha y Hora</div>
                  <div className="font-semibold text-green-900">{comprobante.fecha_hora || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-green-700 mb-1">Línea de Captura</div>
                  <div className="font-semibold text-green-900 text-xs break-all">
                    {comprobante.linea_captura || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-green-700 mb-1">Importe IMSS</div>
                  <div className="font-semibold text-green-900">
                    ${(comprobante.importe_imss || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-green-700 mb-1">Importe Total</div>
                  <div className="font-semibold text-green-900">
                    ${(comprobante.importe_total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}