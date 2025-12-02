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
    total_cuotas?: number
    num_trabajadores?: number
    fecha_pago?: string
  }
  trabajadores?: Array<{
    nombre: string
    nss: string
    rfc: string
    salario_base: number
    salario_diario_integrado: number
    dias_cotizados: number
    cuota_obrera: number
    cuota_patronal: number
    total_cuotas: number
  }>
  analisis?: {
    totales?: {
      cuota_obrera?: number
      cuota_patronal?: number
      total?: number
    }
    sdi?: {
      promedio?: number
      minimo?: number
      maximo?: number
    }
    distribucion_salarial?: {
      [key: string]: number
    }
    costo_promedio_trabajador?: number
  }
  comprobante?: {
    folio?: string
    fecha_pago?: string
    monto?: number
    referencia?: string
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

export default function Modulo04({ data }: Modulo04Props) {
  const [activeTab, setActiveTab] = useState<'resumen' | 'trabajadores' | 'analisis' | 'comprobante'>('resumen')
  const [expandedWorker, setExpandedWorker] = useState<number | null>(null)

  // Validación de datos
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

  // Extraer datos con mapeo correcto de estructura del backend
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
  
  const numTrabajadores = resumen.num_trabajadores || trabajadores.length
  const totalCuotas = resumen.total_cuotas || 0
  const fechaPago = resumen.fecha_pago || 'Sin fecha'
  
  // Valores de análisis (estructura anidada)
  const totalCuotaObrera = analisis.totales?.cuota_obrera || 0
  const totalCuotaPatronal = analisis.totales?.cuota_patronal || 0
  const totalPagar = analisis.totales?.total || totalCuotas
  
  const promedioSDI = analisis.sdi?.promedio || 0
  const minimoSDI = analisis.sdi?.minimo || 0
  const maximoSDI = analisis.sdi?.maximo || 0
  
  const costoPromedioTrabajador = analisis.costo_promedio_trabajador || 0
  const distribSalarial = analisis.distribucion_salarial || {}

  // Calcular promedio salario base desde trabajadores
  const promedioSalarioBase = trabajadores.length > 0 
    ? trabajadores.reduce((sum, t) => sum + (t.salario_base || 0), 0) / trabajadores.length 
    : 0

  return (
    <div className="space-y-6">
      {/* Header con información de empresa */}
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

      {/* KPIs Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 opacity-80" />
            <div className="text-3xl font-bold">{numTrabajadores}</div>
          </div>
          <div className="text-sm opacity-90">Trabajadores</div>
          <div className="text-xs opacity-75 mt-1">Cotizantes activos</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 opacity-80" />
            <div className="text-3xl font-bold">
              ${promedioSalarioBase.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="text-sm opacity-90">Promedio Salario Base</div>
          <div className="text-xs opacity-75 mt-1">Por trabajador</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <div className="text-3xl font-bold">
              ${promedioSDI.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="text-sm opacity-90">Promedio SDI</div>
          <div className="text-xs opacity-75 mt-1">Salario Diario Integrado</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 opacity-80" />
            <div className="text-2xl font-bold">{fechaPago}</div>
          </div>
          <div className="text-sm opacity-90">Fecha Límite</div>
          <div className="text-xs opacity-75 mt-1">Pago de cuotas</div>
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
                  <li key={idx}>• {alerta.mensaje}</li>
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

      {/* Tabs de navegación */}
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

        {/* Tab Content: Resumen */}
        {activeTab === 'resumen' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cuotas Obreras */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Cuotas Obreras</h4>
                <div className="text-3xl font-bold text-blue-700 mb-2">
                  ${totalCuotaObrera.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-blue-600">
                  Descuentos a trabajadores
                </div>
              </div>

              {/* Cuotas Patronales */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3">Cuotas Patronales</h4>
                <div className="text-3xl font-bold text-green-700 mb-2">
                  ${totalCuotaPatronal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-green-600">
                  Aportación de la empresa
                </div>
              </div>
            </div>

            {/* Desglose de conceptos */}
            {resumen && Object.keys(resumen).length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Desglose de Cuotas</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {resumen.cuota_fija && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Cuota Fija</div>
                      <div className="font-bold text-bechapra-primary">${resumen.cuota_fija.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                    </div>
                  )}
                  {resumen.excedente && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Excedente</div>
                      <div className="font-bold text-bechapra-primary">${resumen.excedente.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                    </div>
                  )}
                  {resumen.prestaciones_dinero && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Prestaciones en Dinero</div>
                      <div className="font-bold text-bechapra-primary">${resumen.prestaciones_dinero.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                    </div>
                  )}
                  {resumen.gastos_medicos && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Gastos Médicos</div>
                      <div className="font-bold text-bechapra-primary">${resumen.gastos_medicos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                    </div>
                  )}
                  {resumen.riesgos_trabajo && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Riesgos de Trabajo</div>
                      <div className="font-bold text-bechapra-primary">${resumen.riesgos_trabajo.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                    </div>
                  )}
                  {resumen.invalidez_vida && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Invalidez y Vida</div>
                      <div className="font-bold text-bechapra-primary">${resumen.invalidez_vida.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                    </div>
                  )}
                  {resumen.guarderias && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Guarderías</div>
                      <div className="font-bold text-bechapra-primary">${resumen.guarderias.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                    </div>
                  )}
                  {resumen.cesantia && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Cesantía</div>
                      <div className="font-bold text-bechapra-primary">${resumen.cesantia.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                    </div>
                  )}
                  {resumen.infonavit && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">INFONAVIT</div>
                      <div className="font-bold text-bechapra-primary">${resumen.infonavit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Distribución Salarial */}
            {Object.keys(distribSalarial).length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Distribución Salarial</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(distribSalarial).map(([rango, cantidad]) => (
                    <div key={rango} className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-bechapra-primary">{cantidad}</div>
                      <div className="text-xs text-gray-600 mt-1">${rango}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Trabajadores */}
        {activeTab === 'trabajadores' && (
          <div className="p-6">
            {trabajadores.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay trabajadores registrados</p>
            ) : (
              <div className="space-y-2">
                {trabajadores.map((trabajador, idx) => (
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
                            ${(trabajador.total_cuotas || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
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
                            <div className="text-gray-500">Salario Base</div>
                            <div className="font-medium">${(trabajador.salario_base || 0).toLocaleString('es-MX')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">SDI</div>
                            <div className="font-medium">${(trabajador.salario_diario_integrado || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Días Cotizados</div>
                            <div className="font-medium">{trabajador.dias_cotizados || 0}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Cuota Obrera</div>
                            <div className="font-medium text-blue-600">${(trabajador.cuota_obrera || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Cuota Patronal</div>
                            <div className="font-medium text-green-600">${(trabajador.cuota_patronal || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Análisis */}
        {activeTab === 'analisis' && (
          <div className="p-6 space-y-6">
            <div className="bg-gradient-to-br from-bechapra-primary to-bechapra-primary-dark rounded-lg p-6 text-white">
              <h4 className="text-lg font-semibold mb-4">Costo Promedio por Trabajador</h4>
              <div className="text-4xl font-bold mb-2">
                ${costoPromedioTrabajador.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-sm opacity-90">
                Incluye cuotas obreras y patronales
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Estadísticas Salariales</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Promedio Salario Base</span>
                    <span className="font-semibold">${promedioSalarioBase.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Promedio SDI</span>
                    <span className="font-semibold">${promedioSDI.toLocaleString('es-MX', { maximumFractionDigits: 2 })}</span>
                  </div>
                  {minimoSDI > 0 && (
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-gray-600">SDI Mínimo</span>
                      <span className="font-semibold">${minimoSDI.toLocaleString('es-MX', { maximumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  {maximoSDI > 0 && (
                    <div className="flex justify-between items-center">
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

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Desglose de Cuotas</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Total Cuota Obrera</span>
                    <span className="font-semibold text-blue-600">${totalCuotaObrera.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
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
          </div>
        )}

        {/* Tab Content: Comprobante */}
        {activeTab === 'comprobante' && comprobante && (
          <div className="p-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <h4 className="text-lg font-semibold text-green-900">Pago Confirmado</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-green-700 mb-1">Folio</div>
                  <div className="font-semibold text-green-900">{comprobante.folio || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-green-700 mb-1">Fecha de Pago</div>
                  <div className="font-semibold text-green-900">{comprobante.fecha_pago || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-green-700 mb-1">Monto Pagado</div>
                  <div className="font-semibold text-green-900">
                    ${(comprobante.monto || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-green-700 mb-1">Referencia</div>
                  <div className="font-semibold text-green-900">{comprobante.referencia || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}