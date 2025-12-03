'use client'

import { useState } from 'react'
import {
  CreditCard,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Building2,
  Calendar,
  FileText,
  AlertTriangle,
  Info,
} from 'lucide-react'
import { Modulo07Data } from './types'

interface Modulo07Props {
  data: Modulo07Data
}

export default function Modulo07({ data }: Modulo07Props) {
  const [activeTab, setActiveTab] = useState<'trabajadores' | 'creditos' | 'conciliacion' | 'pago'>('trabajadores')

  if (!data || !data.success) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Error al cargar los datos de FONACOT</span>
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
    { id: 'trabajadores', label: 'Trabajadores', icon: Users },
    { id: 'creditos', label: 'Créditos', icon: CreditCard },
    { id: 'conciliacion', label: 'Conciliación', icon: CheckCircle2 },
    { id: 'pago', label: 'Info de Pago', icon: Building2 },
  ]

  // Agrupar trabajadores (pueden tener múltiples créditos)
  const trabajadoresMap = new Map()
  data.trabajadores.forEach(t => {
    if (!trabajadoresMap.has(t.no_fonacot)) {
      trabajadoresMap.set(t.no_fonacot, {
        no_fonacot: t.no_fonacot,
        nombre: t.nombre,
        rfc: t.rfc,
        nss: t.nss,
        creditos: []
      })
    }
    trabajadoresMap.get(t.no_fonacot).creditos.push(t)
  })
  const trabajadoresUnicos = Array.from(trabajadoresMap.values())

  return (
    <div className="space-y-6">
      {/* Alertas */}
      {data.alertas && data.alertas.length > 0 && (
        <div className="space-y-2">
          {data.alertas.map((alerta, index) => (
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
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : alerta.tipo === 'warning' ? (
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold">{alerta.titulo}</p>
                <p className="text-sm">{alerta.mensaje}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KPIs Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total a Pagar */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-purple-600" />
            <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-medium">
              {data.pago.fecha_limite || 'Sin fecha'}
            </div>
          </div>
          <p className="text-sm text-purple-700 font-medium mb-1">Total a Pagar</p>
          <p className="text-3xl font-bold text-purple-600">{formatCurrency(data.dashboard.kpis.total_a_pagar)}</p>
        </div>

        {/* Trabajadores */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm text-blue-700 font-medium mb-1">Trabajadores</p>
          <p className="text-3xl font-bold text-blue-600">{formatNumber(data.dashboard.kpis.num_trabajadores)}</p>
          <p className="text-xs text-blue-600 mt-2">Con créditos activos</p>
        </div>

        {/* Total Créditos */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <CreditCard className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-sm text-green-700 font-medium mb-1">Total Créditos</p>
          <p className="text-3xl font-bold text-green-600">{formatNumber(data.dashboard.kpis.num_creditos)}</p>
          <p className="text-xs text-green-600 mt-2">Algunos con múltiples</p>
        </div>

        {/* Estado del Pago */}
        <div className={`border-2 rounded-lg p-6 ${
          data.dashboard.kpis.estado_pago === 'ENVIADA' || data.dashboard.kpis.estado_pago === 'PAGADO'
            ? 'bg-green-50 border-green-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            {data.dashboard.kpis.estado_pago === 'ENVIADA' || data.dashboard.kpis.estado_pago === 'PAGADO' ? (
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            ) : (
              <Clock className="w-8 h-8 text-yellow-600" />
            )}
          </div>
          <p className={`text-sm font-medium mb-1 ${
            data.dashboard.kpis.estado_pago === 'ENVIADA' || data.dashboard.kpis.estado_pago === 'PAGADO'
              ? 'text-green-700'
              : 'text-yellow-700'
          }`}>Estado del Pago</p>
          <p className={`text-2xl font-bold ${
            data.dashboard.kpis.estado_pago === 'ENVIADA' || data.dashboard.kpis.estado_pago === 'PAGADO'
              ? 'text-green-600'
              : 'text-yellow-600'
          }`}>{data.dashboard.kpis.estado_pago}</p>
          <p className={`text-xs mt-2 ${
            data.dashboard.kpis.estado_pago === 'ENVIADA' || data.dashboard.kpis.estado_pago === 'PAGADO'
              ? 'text-green-600'
              : 'text-yellow-600'
          }`}>{data.pago.referencia_bancaria || 'Sin referencia'}</p>
        </div>
      </div>

      {/* Tabs de Navegación */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Tab: Trabajadores */}
          {activeTab === 'trabajadores' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detalle de Trabajadores ({trabajadoresUnicos.length})
                </h3>
              </div>
              
              {trabajadoresUnicos.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No hay trabajadores registrados</p>
              ) : (
                <div className="space-y-4">
                  {trabajadoresUnicos.map((trabajador, idx) => {
                    const totalRetencion = trabajador.creditos.reduce((sum: number, c: any) => sum + c.retencion_mensual, 0)
                    return (
                      <div key={idx} className="bg-white border border-gray-200 rounded-lg p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-purple-700">{trabajador.nombre}</h4>
                            <div className="flex gap-4 mt-2 text-sm text-gray-600">
                              <span><strong>RFC:</strong> {trabajador.rfc}</span>
                              <span><strong>NSS:</strong> {trabajador.nss}</span>
                              <span><strong>No. FONACOT:</strong> {trabajador.no_fonacot}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-purple-700">{formatCurrency(totalRetencion)}</p>
                            <p className="text-xs text-gray-500">{trabajador.creditos.length} crédito{trabajador.creditos.length > 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        
                        {/* Detalle de créditos */}
                        <div className="space-y-3 border-t border-gray-200 pt-3">
                          {trabajador.creditos.map((credito: any, creditoIdx: number) => (
                            <div key={creditoIdx} className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div>
                                <p className="text-gray-500">No. Crédito</p>
                                <p className="font-semibold">{credito.no_credito}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Progreso</p>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-purple-600 h-2 rounded-full"
                                      style={{ width: `${credito.progreso}%` }}
                                    />
                                  </div>
                                  <span className="font-semibold">{credito.progreso}%</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {credito.cuotas_pagadas} de {credito.plazo_total} cuotas
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">Saldo Pendiente</p>
                                <p className="font-semibold">{formatCurrency(credito.saldo_pendiente)}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Retención Mensual</p>
                                <p className="font-semibold text-purple-700">{formatCurrency(credito.retencion_mensual)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab: Créditos */}
          {activeTab === 'creditos' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Resumen de Créditos
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Promedio por Empleado</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {formatCurrency(data.resumen.promedio_por_empleado)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Crédito con Mayor Descuento</p>
                      <p className="text-2xl font-bold text-purple-700">
                        {data.resumen.credito_mayor_descuento 
                          ? formatCurrency(data.resumen.credito_mayor_descuento.retencion_mensual)
                          : 'N/A'
                        }
                      </p>
                      {data.resumen.credito_mayor_descuento && (
                        <p className="text-xs text-gray-500 mt-1">
                          {data.resumen.credito_mayor_descuento.nombre}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Próximos a liquidar */}
              {data.resumen.proximos_a_liquidar && data.resumen.proximos_a_liquidar.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Próximos a Liquidar (≤3 cuotas)
                  </h4>
                  <div className="space-y-2">
                    {data.resumen.proximos_a_liquidar.map((trabajador, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white rounded p-3">
                        <div>
                          <p className="font-semibold">{trabajador.nombre}</p>
                          <p className="text-sm text-gray-600">
                            Crédito: {trabajador.no_credito} | {trabajador.cuotas_pagadas}/{trabajador.plazo_total} cuotas
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Quedan</p>
                          <p className="font-bold text-green-700">
                            {trabajador.plazo_total - trabajador.cuotas_pagadas} cuotas
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tabla de todos los créditos */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Nombre</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">No. Crédito</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Cuotas</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Progreso</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Saldo Pendiente</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Retención</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.trabajadores.map((trabajador, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{trabajador.nombre}</td>
                        <td className="px-4 py-3 text-sm">{trabajador.no_credito}</td>
                        <td className="px-4 py-3 text-sm text-center">
                          {trabajador.cuotas_pagadas}/{trabajador.plazo_total}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full"
                                style={{ width: `${trabajador.progreso}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold w-10 text-right">{trabajador.progreso}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium">
                          {formatCurrency(trabajador.saldo_pendiente)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-purple-700">
                          {formatCurrency(trabajador.retencion_mensual)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab: Conciliación */}
          {activeTab === 'conciliacion' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Conciliación de Pagos
              </h3>

              <div className={`border-2 rounded-lg p-6 ${
                data.conciliacion.conciliado 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  {data.conciliacion.conciliado ? (
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  )}
                  <div>
                    <h4 className={`text-xl font-bold ${
                      data.conciliacion.conciliado ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {data.conciliacion.conciliado ? 'Montos Conciliados ✓' : 'Diferencia Detectada'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Comparación entre cédula, ficha y comprobante
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Monto Cédula</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(data.conciliacion.monto_cedula)}
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Monto Ficha</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(data.conciliacion.monto_ficha)}
                    </p>
                  </div>
                  
                  {data.conciliacion.monto_pagado !== undefined && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Monto Pagado</p>
                      <p className="text-2xl font-bold text-green-700">
                        {formatCurrency(data.conciliacion.monto_pagado)}
                      </p>
                    </div>
                  )}
                </div>

                {!data.conciliacion.conciliado && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-red-200">
                    <p className="text-sm font-semibold text-red-900 mb-2">Diferencia:</p>
                    <p className="text-xl font-bold text-red-700">
                      {formatCurrency(Math.abs(data.conciliacion.monto_cedula - data.conciliacion.monto_ficha))}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab: Info de Pago */}
          {activeTab === 'pago' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Información de Pago
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Referencia Bancaria</h4>
                  </div>
                  <p className="text-2xl font-mono font-bold text-blue-700">
                    {data.pago.referencia_bancaria}
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-6 h-6 text-purple-600" />
                    <h4 className="font-semibold text-purple-900">Fecha Programada</h4>
                  </div>
                  <p className="text-xl font-semibold text-purple-700">
                    {data.pago.fecha_programada}
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6 text-yellow-600" />
                    <h4 className="font-semibold text-yellow-900">Fecha Límite</h4>
                  </div>
                  <p className="text-xl font-semibold text-yellow-700">
                    {data.pago.fecha_limite}
                  </p>
                </div>

                {data.pago.fecha_pago_real && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                      <h4 className="font-semibold text-green-900">Fecha de Pago Real</h4>
                    </div>
                    <p className="text-xl font-semibold text-green-700">
                      {data.pago.fecha_pago_real}
                    </p>
                  </div>
                )}
              </div>

              <div className={`rounded-lg p-5 border-2 ${
                data.pago.estado === 'ENVIADA' || data.pago.estado === 'PAGADO'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center gap-3">
                  {data.pago.estado === 'ENVIADA' || data.pago.estado === 'PAGADO' ? (
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  ) : (
                    <Clock className="w-8 h-8 text-yellow-600" />
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Estado del Pago</p>
                    <p className="text-2xl font-bold text-gray-900">{data.pago.estado}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}