'use client'

import React, { useState } from 'react'
import { FileText, TrendingUp, TrendingDown, Tag, BarChart3, Calendar, Check, X, Filter, Package, DollarSign } from 'lucide-react'
import { Modulo3Data } from './types'
import { formatCurrency, formatDate, truncateText } from './utils'

interface Modulo03Props {
  data: Modulo3Data
}

export default function Modulo03({ data }: Modulo03Props) {
  const [activeTab, setActiveTab] = useState<
    'emitidas' | 'recibidas' | 'complementos' | 'analisis' | 'categorias' | 'predicciones'
  >('emitidas')
  
  const [selectedMonth, setSelectedMonth] = useState<string>('')

  if (!data || !data.success) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <p className="text-red-600">❌ Error al cargar el Módulo 03</p>
      </div>
    )
  }

  const resumen = data.resumen || {
    total_emitidas: 0,
    total_recibidas: 0,
    monto_emitidas: 0,
    monto_recibidas: 0,
    coincidencias: 0,
    porcentaje_match: 0,
    balance: 0
  }
  
  const tieneComplementos = data.tiene_complementos_emitidos || data.tiene_complementos_recibidos

  // Función para filtrar facturas por mes
  const filtrarPorMes = (facturas: any[]) => {
    if (!selectedMonth) return facturas
    return facturas.filter(f => {
      const fecha = f.fecha || ''
      const mes = fecha.split('/')[1] // dd/mm/yyyy → mes
      return mes === selectedMonth
    })
  }

  const emitidas = filtrarPorMes(data.emitidas || [])
  const recibidas = filtrarPorMes(data.recibidas || [])
  const resumenFiltrado = selectedMonth ? {
    total_emitidas: emitidas.length,
    total_recibidas: recibidas.length,
    monto_emitidas: emitidas.reduce((sum, f) => sum + (f.total || 0), 0),
    monto_recibidas: recibidas.reduce((sum, f) => sum + (f.total || 0), 0),
    coincidencias: emitidas.filter(f => f.xml_encontrado).length + recibidas.filter(f => f.xml_encontrado).length,
    porcentaje_match: ((emitidas.filter(f => f.xml_encontrado).length + recibidas.filter(f => f.xml_encontrado).length) / (emitidas.length + recibidas.length) * 100).toFixed(2),
    balance: emitidas.reduce((sum, f) => sum + (f.total || 0), 0) - recibidas.reduce((sum, f) => sum + (f.total || 0), 0)
  } : resumen

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <p className="text-xs text-green-600 mb-1">Facturas Emitidas</p>
          <p className="text-2xl font-bold text-green-700">{resumen.total_emitidas || 0}</p>
          <p className="text-sm text-green-600 mt-1">{formatCurrency(resumen.monto_emitidas || 0)}</p>
        </div>

        <div className="bg-red-50 rounded-lg p-4 border border-red-100">
          <p className="text-xs text-red-600 mb-1">Facturas Recibidas</p>
          <p className="text-2xl font-bold text-red-700">{resumen.total_recibidas || 0}</p>
          <p className="text-sm text-red-600 mt-1">{formatCurrency(resumen.monto_recibidas || 0)}</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <p className="text-xs text-blue-600 mb-1">Coincidencias</p>
          <p className="text-2xl font-bold text-blue-700">{resumen.coincidencias || 0}</p>
          <p className="text-sm text-blue-600 mt-1">{(resumen.porcentaje_match || 0)}% Match</p>
        </div>

        <div className={`${(resumen.balance || 0) >= 0 ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'} rounded-lg p-4 border`}>
          <p className="text-xs text-gray-600 mb-1">Balance</p>
          <p className={`text-2xl font-bold ${(resumen.balance || 0) >= 0 ? 'text-green-700' : 'text-amber-700'}`}>
            {formatCurrency(Math.abs(resumen.balance || 0))}
          </p>
          <p className="text-sm mt-1 flex items-center gap-1">
            {(resumen.balance || 0) >= 0 ? <TrendingUp size={14} className="text-green-600" /> : <TrendingDown size={14} className="text-amber-600" />}
            <span className={(resumen.balance || 0) >= 0 ? 'text-green-600' : 'text-amber-600'}>
              {(resumen.balance || 0) >= 0 ? 'Positivo' : 'Negativo'}
            </span>
          </p>
        </div>
      </div>

      {/* Filtro de Mes */}
      <div className="bg-gradient-to-r from-bechapra-primary to-blue-600 rounded-lg p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="text-white">
            <h3 className="font-semibold flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtrar Tablas por Mes
            </h3>
            <p className="text-sm opacity-90 mt-1">Las predicciones siempre muestran el año completo</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 rounded-lg border-0 font-medium text-gray-700 cursor-pointer"
            >
              <option value="">📅 TODO EL AÑO</option>
              <option value="01">Enero</option>
              <option value="02">Febrero</option>
              <option value="03">Marzo</option>
              <option value="04">Abril</option>
              <option value="05">Mayo</option>
              <option value="06">Junio</option>
              <option value="07">Julio</option>
              <option value="08">Agosto</option>
              <option value="09">Septiembre</option>
              <option value="10">Octubre</option>
              <option value="11">Noviembre</option>
              <option value="12">Diciembre</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-bechapra-border">
        <div className="flex overflow-x-auto border-b border-bechapra-border">
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'emitidas'
                ? 'border-b-2 border-bechapra-primary text-bechapra-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('emitidas')}
          >
            <TrendingUp className="w-4 h-4" />
            Emitidas
          </button>

          <button
            className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'recibidas'
                ? 'border-b-2 border-bechapra-primary text-bechapra-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('recibidas')}
          >
            <TrendingDown className="w-4 h-4" />
            Recibidas
          </button>

          {tieneComplementos && (
            <button
              className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'complementos'
                  ? 'border-b-2 border-bechapra-primary text-bechapra-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('complementos')}
            >
              <DollarSign className="w-4 h-4" />
              Complementos
            </button>
          )}

          <button
            className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'analisis'
                ? 'border-b-2 border-bechapra-primary text-bechapra-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('analisis')}
          >
            <BarChart3 className="w-4 h-4" />
            Análisis
          </button>

          <button
            className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'categorias'
                ? 'border-b-2 border-bechapra-primary text-bechapra-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('categorias')}
          >
            <Tag className="w-4 h-4" />
            Categorías
          </button>

          <button
            className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'predicciones'
                ? 'border-b-2 border-bechapra-primary text-bechapra-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('predicciones')}
          >
            <Calendar className="w-4 h-4" />
            Predicciones
          </button>
        </div>

        {/* Tab Content: Emitidas */}
        {activeTab === 'emitidas' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Facturas Emitidas ({emitidas.length})</h3>
            <TablaFacturas facturas={emitidas} tipo="Emitidas" />
          </div>
        )}

        {/* Tab Content: Recibidas */}
        {activeTab === 'recibidas' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Facturas Recibidas ({recibidas.length})</h3>
            <TablaFacturas facturas={recibidas} tipo="Recibidas" />
          </div>
        )}

        {/* Tab Content: Complementos */}
        {activeTab === 'complementos' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Complementos de Pago
            </h3>

            {data.tiene_complementos_emitidos && (
              <div className="mb-8">
                <h4 className="text-md font-semibold mb-3 text-purple-700 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Complementos Emitidos
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                    {data.complementos_emitidos?.length || 0}
                  </span>
                </h4>
                <p className="text-sm text-gray-600 mb-3">Pagos parciales realizados a proveedores</p>
                <TablaComplementos complementos={data.complementos_emitidos || []} />
              </div>
            )}

            {data.tiene_complementos_recibidos && (
              <div>
                <h4 className="text-md font-semibold mb-3 text-orange-700 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Complementos Recibidos
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                    {data.complementos_recibidos?.length || 0}
                  </span>
                </h4>
                <p className="text-sm text-gray-600 mb-3">Pagos parciales recibidos de clientes</p>
                <TablaComplementos complementos={data.complementos_recibidos || []} />
              </div>
            )}

            {!data.tiene_complementos_emitidos && !data.tiene_complementos_recibidos && (
              <p className="text-gray-500 text-center py-8">No hay complementos de pago</p>
            )}
          </div>
        )}

        {/* Tab Content: Análisis */}
        {activeTab === 'analisis' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Análisis Comparativo
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Comparativa por mes */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-gray-700">Resumen del Período</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-700">Total Ingresos</span>
                    <span className="text-lg font-bold text-green-700">{formatCurrency(resumenFiltrado.monto_emitidas)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm text-gray-700">Total Egresos</span>
                    <span className="text-lg font-bold text-red-700">{formatCurrency(resumenFiltrado.monto_recibidas)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-700">Diferencia</span>
                    <span className={`text-lg font-bold ${resumenFiltrado.balance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {formatCurrency(Math.abs(resumenFiltrado.balance))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-gray-700">Estadísticas</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Promedio por Factura Emitida</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(resumenFiltrado.total_emitidas > 0 ? resumenFiltrado.monto_emitidas / resumenFiltrado.total_emitidas : 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Promedio por Factura Recibida</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(resumenFiltrado.total_recibidas > 0 ? resumenFiltrado.monto_recibidas / resumenFiltrado.total_recibidas : 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Tasa de Coincidencia XML</span>
                    <span className="text-lg font-bold text-blue-700">
                      {resumenFiltrado.porcentaje_match}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Categorías */}
        {activeTab === 'categorias' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Categorías SAT
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Categorías Emitidas */}
              <div>
                <h4 className="text-md font-semibold mb-3 text-green-700 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Top 10 Categorías Emitidas
                </h4>
                <div className="space-y-2">
                  {data.categorias_emitidas?.top_10_general && data.categorias_emitidas.top_10_general.length > 0 ? (
                    data.categorias_emitidas.top_10_general.map((cat: any, idx: number) => (
                      <div key={idx} className="bg-green-50 border border-green-100 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">{cat.nombre || cat.categoria}</span>
                          <span className="text-green-700 font-bold">{formatCurrency(cat.monto)}</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{cat.cantidad} facturas</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No hay datos de categorías</p>
                  )}
                </div>
              </div>

              {/* Categorías Recibidas */}
              <div>
                <h4 className="text-md font-semibold mb-3 text-red-700 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Top 10 Categorías Recibidas
                </h4>
                <div className="space-y-2">
                  {data.categorias_recibidas?.top_10_general && data.categorias_recibidas.top_10_general.length > 0 ? (
                    data.categorias_recibidas.top_10_general.map((cat: any, idx: number) => (
                      <div key={idx} className="bg-red-50 border border-red-100 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">{cat.nombre || cat.categoria}</span>
                          <span className="text-red-700 font-bold">{formatCurrency(cat.monto)}</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{cat.cantidad} facturas</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No hay datos de categorías</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Predicciones */}
        {activeTab === 'predicciones' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Proyecciones Financieras
            </h3>

            {data.predicciones ? (
              <div className="space-y-6">
                {/* Proyecciones de Ingresos */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 text-green-700 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Proyección de Ingresos (Próximos 3 meses)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.predicciones.emitidas?.slice(0, 3).map((pred: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-lg p-3 border border-green-100">
                        <p className="text-xs text-gray-600 mb-1">{pred.mes}</p>
                        <p className="text-xl font-bold text-green-700">{formatCurrency(pred.monto)}</p>
                        <p className="text-xs text-gray-600 mt-1">{pred.cantidad} facturas estimadas</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Proyecciones de Egresos */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 text-red-700 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" />
                    Proyección de Egresos (Próximos 3 meses)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.predicciones.recibidas?.slice(0, 3).map((pred: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-lg p-3 border border-red-100">
                        <p className="text-xs text-gray-600 mb-1">{pred.mes}</p>
                        <p className="text-xl font-bold text-red-700">{formatCurrency(pred.monto)}</p>
                        <p className="text-xs text-gray-600 mt-1">{pred.cantidad} facturas estimadas</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Balance Proyectado */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 text-blue-700 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Balance Proyectado
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.predicciones.balance?.slice(0, 3).map((pred: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-lg p-3 border border-blue-100">
                        <p className="text-xs text-gray-600 mb-1">{pred.mes}</p>
                        <p className={`text-xl font-bold ${pred.monto >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                          {formatCurrency(Math.abs(pred.monto))}
                        </p>
                        <p className={`text-xs mt-1 ${pred.monto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {pred.monto >= 0 ? 'Positivo' : 'Negativo'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-8 text-center">
                <Calendar className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <p className="text-gray-700 font-medium mb-2">No hay datos de predicciones</p>
                <p className="text-gray-600 text-sm">El backend no devolvió información de proyecciones financieras.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Componente auxiliar: Tabla de Facturas
function TablaFacturas({ facturas, tipo }: { facturas: any[], tipo: string }) {
  if (!facturas || facturas.length === 0) {
    return <p className="text-gray-500 text-center py-8">No hay facturas {tipo.toLowerCase()}</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">XML</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Fecha</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Folio</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">RFC {tipo === 'Emitidas' ? 'Receptor' : 'Emisor'}</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Nombre</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Subtotal</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">IVA</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Total</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">UUID</th>
          </tr>
        </thead>
        <tbody>
          {facturas.slice(0, 50).map((factura, idx) => (
            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 text-center">
                {factura.xml_encontrado ? (
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                ) : (
                  <X className="w-5 h-5 text-red-600 mx-auto" />
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{factura.fecha}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{factura.folio}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{factura.rfc}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{truncateText(factura.nombre || factura.razon_social || '', 30)}</td>
              <td className="px-4 py-3 text-sm text-right text-gray-700">{formatCurrency(factura.subtotal)}</td>
              <td className="px-4 py-3 text-sm text-right text-gray-700">{formatCurrency(factura.iva)}</td>
              <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{formatCurrency(factura.total)}</td>
              <td className="px-4 py-3 text-xs text-gray-500 text-center" title={factura.uuid}>
                {factura.uuid ? `${factura.uuid.substring(0, 8)}...` : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {facturas.length > 50 && (
        <p className="text-center text-sm text-gray-500 mt-4">
          Mostrando 50 de {facturas.length} facturas
        </p>
      )}
    </div>
  )
}

// Componente auxiliar: Tabla de Complementos
function TablaComplementos({ complementos }: { complementos: any[] }) {
  if (!complementos || complementos.length === 0) {
    return <p className="text-gray-500 text-center py-4">No hay complementos de pago</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Fecha</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">UUID Complemento</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">UUID Original</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Importe Pagado</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Saldo Insoluto</th>
          </tr>
        </thead>
        <tbody>
          {complementos.map((comp, idx) => (
            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700">{comp.fecha}</td>
              <td className="px-4 py-3 text-xs text-gray-600" title={comp.uuid}>
                {comp.uuid ? `${comp.uuid.substring(0, 8)}...` : 'N/A'}
              </td>
              <td className="px-4 py-3 text-xs text-gray-600" title={comp.uuid_original}>
                {comp.uuid_original ? `${comp.uuid_original.substring(0, 8)}...` : 'N/A'}
              </td>
              <td className="px-4 py-3 text-sm text-right text-green-700 font-semibold">
                {formatCurrency(comp.importe_pagado)}
              </td>
              <td className="px-4 py-3 text-sm text-right text-orange-700 font-semibold">
                {formatCurrency(comp.importe_insoluto)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}