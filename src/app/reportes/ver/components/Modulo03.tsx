'use client'

import React, { useState } from 'react'
import { FileText, TrendingUp, Tag, Sparkles, DollarSign, Check, X } from 'lucide-react'
import { Modulo3Data } from './types'
import { formatCurrency, formatDate, truncateText } from './utils'




interface Modulo03Props {
  data: Modulo3Data
}

export default function Modulo03({ data }: Modulo03Props) {
  const [activeTab, setActiveTab] = useState<
    'resumen' | 'emitidas' | 'recibidas' | 'complementos' | 'analisis' | 'categorias' | 'predicciones'
  >('resumen')

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

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-6 text-white">
          <div className="text-2xl mb-2">📤</div>
          <div className="text-sm font-medium opacity-90">Total Emitidas</div>
          <div className="text-2xl font-bold mt-1">{resumen.total_emitidas || 0}</div>
          <div className="text-xs mt-1 opacity-75">{formatCurrency(resumen.monto_emitidas || 0)}</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg p-6 text-white">
          <div className="text-2xl mb-2">📥</div>
          <div className="text-sm font-medium opacity-90">Total Recibidas</div>
          <div className="text-2xl font-bold mt-1">{resumen.total_recibidas || 0}</div>
          <div className="text-xs mt-1 opacity-75">{formatCurrency(resumen.monto_recibidas || 0)}</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg p-6 text-white">
          <div className="text-2xl mb-2">🎯</div>
          <div className="text-sm font-medium opacity-90">Coincidencias XML</div>
          <div className="text-2xl font-bold mt-1">{resumen.coincidencias || 0}</div>
          <div className="text-xs mt-1 opacity-75">{resumen.porcentaje_match || 0}% Match</div>
        </div>

        <div className={`bg-gradient-to-br ${
          (resumen.balance || 0) >= 0 
            ? 'from-green-500 to-emerald-600' 
            : 'from-red-500 to-rose-600'
        } rounded-lg p-6 text-white`}>
          <div className="text-2xl mb-2">{(resumen.balance || 0) >= 0 ? '📈' : '📉'}</div>
          <div className="text-sm font-medium opacity-90">Balance</div>
          <div className="text-2xl font-bold mt-1">{formatCurrency(Math.abs(resumen.balance || 0))}</div>
          <div className="text-xs mt-1 opacity-75">{(resumen.balance || 0) >= 0 ? 'Positivo' : 'Negativo'}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-bechapra-border">
        <div className="flex overflow-x-auto border-b border-bechapra-border">
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'resumen'
                ? 'border-b-2 border-bechapra-primary text-bechapra-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('resumen')}
          >
            📊 Resumen
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'emitidas'
                ? 'border-b-2 border-bechapra-primary text-bechapra-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('emitidas')}
          >
            📤 Emitidas
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'recibidas'
                ? 'border-b-2 border-bechapra-primary text-bechapra-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('recibidas')}
          >
            📥 Recibidas
          </button>
          {tieneComplementos && (
            <button
              className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'complementos'
                  ? 'border-b-2 border-bechapra-primary text-bechapra-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('complementos')}
            >
              💰 Complementos
            </button>
          )}
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'analisis'
                ? 'border-b-2 border-bechapra-primary text-bechapra-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('analisis')}
          >
            📈 Análisis
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'categorias'
                ? 'border-b-2 border-bechapra-primary text-bechapra-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('categorias')}
          >
            🏷️ Categorías
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'predicciones'
                ? 'border-b-2 border-bechapra-primary text-bechapra-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('predicciones')}
          >
            🔮 Predicciones
          </button>
        </div>

        {/* Tab Resumen */}
        {activeTab === 'resumen' && (
          <div className="p-6">
            <h3 className="text-base font-semibold text-bechapra-text-primary mb-4">📊 Resumen General</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-bechapra-light-3 rounded-lg p-4 border border-bechapra-border">
                <div className="text-sm text-gray-600 mb-2">Balance</div>
                <div className={`text-2xl font-bold ${
                  (resumen.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(resumen.balance || 0)}
                </div>
              </div>
              <div className="bg-bechapra-light-3 rounded-lg p-4 border border-bechapra-border">
                <div className="text-sm text-gray-600 mb-2">Match XML</div>
                <div className="text-2xl font-bold text-bechapra-primary">
                  {resumen.porcentaje_match || 0}%
                </div>
              </div>
              <div className="bg-bechapra-light-3 rounded-lg p-4 border border-bechapra-border">
                <div className="text-sm text-gray-600 mb-2">Total Emitidas</div>
                <div className="text-xl font-bold text-gray-900">
                  {resumen.total_emitidas || 0} facturas
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {formatCurrency(resumen.monto_emitidas || 0)}
                </div>
              </div>
              <div className="bg-bechapra-light-3 rounded-lg p-4 border border-bechapra-border">
                <div className="text-sm text-gray-600 mb-2">Total Recibidas</div>
                <div className="text-xl font-bold text-gray-900">
                  {resumen.total_recibidas || 0} facturas
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {formatCurrency(resumen.monto_recibidas || 0)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Emitidas */}
        {activeTab === 'emitidas' && (
          <TablaFacturas facturas={data.emitidas || []} tipo="Emitidas" />
        )}

        {/* Tab Recibidas */}
        {activeTab === 'recibidas' && (
          <TablaFacturas facturas={data.recibidas || []} tipo="Recibidas" />
        )}

        {/* Tab Complementos */}
        {activeTab === 'complementos' && tieneComplementos && (
          <div className="p-6">
            <h3 className="text-base font-semibold text-bechapra-text-primary mb-4">💰 Complementos de Pago</h3>
            
            {data.tiene_complementos_emitidos && data.complementos_emitidos && data.complementos_emitidos.length > 0 && (
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-purple-600 mb-3 flex items-center gap-2">
                  📤 Complementos Emitidos
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {data.complementos_emitidos.length}
                  </span>
                </h4>
                <p className="text-sm text-gray-600 mb-4">Pagos parciales realizados a proveedores</p>
                <TablaComplementos complementos={data.complementos_emitidos} tipo="emitidos" />
              </div>
            )}

            {data.tiene_complementos_recibidos && data.complementos_recibidos && data.complementos_recibidos.length > 0 && (
              <div className={data.tiene_complementos_emitidos ? 'mt-8 pt-8 border-t-2 border-gray-200' : ''}>
                <h4 className="text-sm font-semibold text-orange-600 mb-3 flex items-center gap-2">
                  📥 Complementos Recibidos
                  <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {data.complementos_recibidos.length}
                  </span>
                </h4>
                <p className="text-sm text-gray-600 mb-4">Pagos parciales recibidos de clientes</p>
                <TablaComplementos complementos={data.complementos_recibidos} tipo="recibidos" />
              </div>
            )}
          </div>
        )}

        {/* Tab Análisis */}
        {activeTab === 'analisis' && (
          <div className="p-6">
            <h3 className="text-base font-semibold text-bechapra-text-primary mb-4">📈 Análisis Estadístico</h3>
            <p className="text-gray-600">Gráficas de análisis (próximamente)</p>
          </div>
        )}

        {/* Tab Categorías */}
        {activeTab === 'categorias' && (
          <div className="p-6">
            <h3 className="text-base font-semibold text-bechapra-text-primary mb-4">🏷️ Categorías SAT</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Categorías Emitidas */}
              <div>
                <h4 className="text-sm font-semibold text-green-600 mb-3">📤 Categorías Emitidas</h4>
                {data.categorias_emitidas && Object.keys(data.categorias_emitidas).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(data.categorias_emitidas)
                      .sort((a, b) => b[1].monto - a[1].monto)
                      .slice(0, 10)
                      .map(([categoria, datos]) => (
                        <div key={categoria} className="bg-white rounded-lg border border-gray-200 p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium text-sm text-gray-900">{categoria}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {datos.cantidad} {datos.cantidad === 1 ? 'factura' : 'facturas'}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-sm text-green-600">
                                {formatCurrency(datos.monto)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No hay categorías disponibles</p>
                )}
              </div>

              {/* Categorías Recibidas */}
              <div>
                <h4 className="text-sm font-semibold text-blue-600 mb-3">📥 Categorías Recibidas</h4>
                {data.categorias_recibidas && Object.keys(data.categorias_recibidas).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(data.categorias_recibidas)
                      .sort((a, b) => b[1].monto - a[1].monto)
                      .slice(0, 10)
                      .map(([categoria, datos]) => (
                        <div key={categoria} className="bg-white rounded-lg border border-gray-200 p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium text-sm text-gray-900">{categoria}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {datos.cantidad} {datos.cantidad === 1 ? 'factura' : 'facturas'}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-sm text-blue-600">
                                {formatCurrency(datos.monto)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No hay categorías disponibles</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab Predicciones */}
        {activeTab === 'predicciones' && (
          <div className="p-6">
            <h3 className="text-base font-semibold text-bechapra-text-primary mb-4">🔮 Predicciones</h3>
            <p className="text-gray-600">Predicciones mensuales (próximamente)</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente auxiliar para tabla de facturas
function TablaFacturas({ facturas, tipo }: { facturas: any[]; tipo: string }) {
  if (!facturas || facturas.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No hay facturas {tipo.toLowerCase()}
      </div>
    )
  }

  const tipoLabel = tipo === 'Emitidas' ? 'Receptor' : 'Emisor'

  return (
    <div className="p-6">
      <h3 className="text-base font-semibold text-bechapra-text-primary mb-4">
        Facturas {tipo} ({facturas.length})
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bechapra-light-3 text-bechapra-text-primary">
              <th className="px-4 py-3 text-center font-medium">XML</th>
              <th className="px-4 py-3 text-left font-medium">Fecha</th>
              <th className="px-4 py-3 text-left font-medium">Folio</th>
              <th className="px-4 py-3 text-left font-medium">RFC {tipoLabel}</th>
              <th className="px-4 py-3 text-left font-medium">Nombre</th>
              <th className="px-4 py-3 text-right font-medium">Subtotal</th>
              <th className="px-4 py-3 text-right font-medium">IVA</th>
              <th className="px-4 py-3 text-right font-medium">Total</th>
              <th className="px-4 py-3 text-left font-medium">UUID</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((factura, idx) => (
              <tr key={idx} className="border-t border-bechapra-border hover:bg-gray-50">
                <td className="px-4 py-3 text-center">
                  {factura.xml_encontrado ? (
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-red-600 mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3">{factura.fecha || '—'}</td>
                <td className="px-4 py-3">{factura.folio || '—'}</td>
                <td className="px-4 py-3 text-xs font-mono">{factura.rfc || '—'}</td>
                <td className="px-4 py-3">{truncateText(factura.nombre || '—', 30)}</td>
                <td className="px-4 py-3 text-right">{formatCurrency(factura.subtotal || 0)}</td>
                <td className="px-4 py-3 text-right">{formatCurrency(factura.iva || 0)}</td>
                <td className="px-4 py-3 text-right font-semibold">{formatCurrency(factura.total || 0)}</td>
                <td className="px-4 py-3 text-xs font-mono">{truncateText(factura.uuid || '', 13)}...</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-center text-gray-600 mt-4 text-sm">
          <strong>Total:</strong> {facturas.length} facturas | 
          <strong> Con XML:</strong> {facturas.filter(f => f.xml_encontrado).length}
        </p>
      </div>
    </div>
  )
}

// Componente auxiliar para tabla de complementos
function TablaComplementos({ complementos, tipo }: { complementos: any[]; tipo: string }) {
  if (!complementos || complementos.length === 0) {
    return <p className="text-gray-500 text-sm">No hay complementos {tipo}</p>
  }

  const tipoLabel = tipo === 'emitidos' ? 'Cliente' : 'Proveedor'

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-bechapra-light-3 text-bechapra-text-primary">
            <th className="px-4 py-3 text-left font-medium">Fecha</th>
            <th className="px-4 py-3 text-left font-medium">Folio UUID</th>
            <th className="px-4 py-3 text-left font-medium">UUID Factura Original</th>
            <th className="px-4 py-3 text-left font-medium">Serie</th>
            <th className="px-4 py-3 text-left font-medium">RFC {tipoLabel}</th>
            <th className="px-4 py-3 text-left font-medium">Nombre {tipoLabel}</th>
            <th className="px-4 py-3 text-right font-medium">Subtotal</th>
            <th className="px-4 py-3 text-right font-medium">IVA</th>
            <th className="px-4 py-3 text-right font-medium">Total</th>
            <th className="px-4 py-3 text-right font-medium">Importe Pagado</th>
            <th className="px-4 py-3 text-right font-medium">Importe Insoluto</th>
          </tr>
        </thead>
        <tbody>
          {complementos.map((comp, idx) => (
            <tr key={idx} className="border-t border-bechapra-border hover:bg-gray-50">
              <td className="px-4 py-3">{comp.fecha || '-'}</td>
              <td className="px-4 py-3 text-xs font-mono" title={comp.uuid}>
                {truncateText(comp.uuid, 20)}...
              </td>
              <td className="px-4 py-3 text-xs font-mono" title={comp.uuid_original || ''}>
                {comp.uuid_original ? `${truncateText(comp.uuid_original, 20)}...` : '-'}
              </td>
              <td className="px-4 py-3">{comp.serie || '-'}</td>
              <td className="px-4 py-3 text-xs font-mono">{comp.rfc || '-'}</td>
              <td className="px-4 py-3">{truncateText(comp.nombre || '-', 25)}</td>
              <td className="px-4 py-3 text-right">{formatCurrency(comp.subtotal || 0)}</td>
              <td className="px-4 py-3 text-right">{formatCurrency(comp.iva || 0)}</td>
              <td className="px-4 py-3 text-right font-semibold">{formatCurrency(comp.total || 0)}</td>
              <td className="px-4 py-3 text-right text-green-600 font-medium">
                {formatCurrency(comp.importe_pagado || 0)}
              </td>
              <td className="px-4 py-3 text-right text-orange-600">
                {formatCurrency(comp.importe_insoluto || 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}