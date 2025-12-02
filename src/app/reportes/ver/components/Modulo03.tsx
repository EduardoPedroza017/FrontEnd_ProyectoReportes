'use client'


import React, { useState } from 'react'
import { FileText, TrendingUp, TrendingDown, Tag, BarChart3, Calendar, Check, X, Filter, Package, DollarSign } from 'lucide-react'
import { Modulo3Data } from './types'
import { formatCurrency, formatDate, truncateText } from './utils'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { calcularPredicciones, agruparPorMes } from './modulo03-predictions'

interface Modulo03Props {
  data: Modulo3Data
}

export default function Modulo03({ data }: Modulo03Props) {
  const [activeTab, setActiveTab] = useState<
    'emitidas' | 'recibidas' | 'complementos' | 'analisis' | 'categorias' | 'predicciones'
  >('emitidas')
  
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [incluirGlobales, setIncluirGlobales] = useState<boolean>(false)

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

  // Datos para análisis (siempre con datos completos, no filtrados)
  const datosAnalisis = agruparPorMes(data.emitidas || [], data.recibidas || [])
  
  // Datos para predicciones (con toggle de globales)
  const datosPredicciones = calcularPredicciones(
    data.emitidas || [],
    data.recibidas || [],
    incluirGlobales
  )
  const resumenFiltrado = selectedMonth ? {
    total_emitidas: emitidas.length,
    total_recibidas: recibidas.length,
    monto_emitidas: emitidas.reduce((sum, f) => sum + (f.total || 0), 0),
    monto_recibidas: recibidas.reduce((sum, f) => sum + (f.total || 0), 0),
    coincidencias: emitidas.filter(f => f.xml_encontrado).length + recibidas.filter(f => f.xml_encontrado).length,
    porcentaje_match: parseFloat(((emitidas.filter(f => f.xml_encontrado).length + recibidas.filter(f => f.xml_encontrado).length) / (emitidas.length + recibidas.length) * 100).toFixed(2)),
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
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Análisis Detallado
            </h3>

            {/* Gráficas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfica de Ingresos vs Gastos */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-gray-700">💰 Ingresos vs Gastos por Mes</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={datosAnalisis.meses.map((mes, idx) => ({
                    mes,
                    Ingresos: datosAnalisis.ingresos[idx],
                    Gastos: datosAnalisis.egresos[idx]
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`} />
                    <Legend />
                    <Bar dataKey="Ingresos" fill="#28a745" />
                    <Bar dataKey="Gastos" fill="#dc3545" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfica de Tendencia */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-gray-700">📈 Tendencia de Facturación (Balance)</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={datosAnalisis.meses.map((mes, idx) => ({
                    mes,
                    Balance: datosAnalisis.balance[idx]
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`} />
                    <Legend />
                    <Line type="monotone" dataKey="Balance" stroke="#667eea" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Insights Clave */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold mb-4 text-blue-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Insights Clave
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Balance neto: <strong className="text-gray-900">{formatCurrency(resumenFiltrado.balance)}</strong></li>
                <li>• Promedio factura emitida: <strong className="text-gray-900">
                  {formatCurrency(resumenFiltrado.total_emitidas > 0 ? resumenFiltrado.monto_emitidas / resumenFiltrado.total_emitidas : 0)}
                </strong></li>
                <li>• Promedio factura recibida: <strong className="text-gray-900">
                  {formatCurrency(resumenFiltrado.total_recibidas > 0 ? resumenFiltrado.monto_recibidas / resumenFiltrado.total_recibidas : 0)}
                </strong></li>
                <li>• Tasa de coincidencia XML: <strong className="text-blue-700">{resumenFiltrado.porcentaje_match}%</strong></li>
              </ul>
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
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Proyecciones Financieras
            </h3>

            {/* Toggle de Facturas Globales */}
            <div className="bg-gradient-to-r from-bechapra-primary to-blue-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h4 className="font-semibold mb-1">⚙️ Configuración de Predicciones</h4>
                  <p className="text-sm opacity-90">
                    Las facturas globales son facturas al "Público en General" (RFC: XAXX010101000) que consolidan múltiples ventas
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="font-semibold">Incluir Facturas Globales:</label>
                  <button
                    onClick={() => setIncluirGlobales(!incluirGlobales)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      incluirGlobales ? 'bg-green-500' : 'bg-white/30'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        incluirGlobales ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Info de facturas globales */}
            {datosPredicciones.facturasGlobalesExcluidas > 0 && (
              <div className={`rounded-lg p-4 border-l-4 ${
                incluirGlobales 
                  ? 'bg-green-50 border-green-500 text-green-800' 
                  : 'bg-orange-50 border-orange-500 text-orange-800'
              }`}>
                <p className="font-semibold">
                  {incluirGlobales ? 'ℹ️ Incluyendo' : '⚠️ Excluyendo'} {datosPredicciones.facturasGlobalesExcluidas} facturas globales
                  ({formatCurrency(datosPredicciones.montoGlobalesExcluido)})
                </p>
                {!incluirGlobales && (
                  <p className="text-sm mt-1">Estas facturas consolidan múltiples ventas pequeñas (Público en General)</p>
                )}
              </div>
            )}

            {/* Alertas */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-amber-900">⚠️ Alertas:</h4>
              <ul className="text-sm text-amber-800 space-y-1">
                {(typeof resumen.porcentaje_match === 'string' ? parseFloat(resumen.porcentaje_match) : resumen.porcentaje_match) < 90 && (
                  <li>• Baja coincidencia XML: revisa documentación faltante.</li>
                )}
                {resumen.balance < 0 && (
                  <li>• Balance negativo: ajusta gastos o mejora cobros.</li>
                )}
                {(typeof resumen.porcentaje_match === 'string' ? parseFloat(resumen.porcentaje_match) : resumen.porcentaje_match) >= 90 && resumen.balance >= 0 && (
                  <li>• Sin alertas críticas - Continúa monitoreando.</li>
                )}
              </ul>
            </div>

            {/* Recomendaciones */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-green-900">✅ Recomendaciones:</h4>
              <ul className="text-sm text-green-800 space-y-1 ml-5 list-disc">
                <li>Revisar facturas sin XML para completar documentación fiscal</li>
                <li>Analizar proveedores con mayor volumen para negociar mejores términos</li>
                <li>Diversificar base de clientes para reducir dependencia</li>
              </ul>
            </div>

            {/* Título de gráficas */}
            <h3 className="text-md font-semibold text-gray-900 mt-6">📈 Proyecciones para el Resto del Año</h3>

            {/* Gráfica 1: Predicción de Ingresos */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-4 text-gray-700">💰 Predicción de Ingresos (Emitidas)</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={datosPredicciones.meses.map((mes, idx) => ({
                  mes,
                  Histórico: idx <= datosPredicciones.mesActual ? datosPredicciones.ingresos[idx] : null,
                  Proyección: idx >= datosPredicciones.mesActual ? datosPredicciones.ingresos[idx] : null
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value: number) => value ? `$${value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : 'N/A'} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Histórico" 
                    stroke="#28a745" 
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    connectNulls={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Proyección" 
                    stroke="#ff9800" 
                    strokeWidth={3}
                    strokeDasharray="10 5"
                    dot={{ r: 5 }}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfica 2: Predicción de Egresos */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-4 text-gray-700">💸 Predicción de Egresos (Recibidas)</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={datosPredicciones.meses.map((mes, idx) => ({
                  mes,
                  Histórico: idx <= datosPredicciones.mesActual ? datosPredicciones.egresos[idx] : null,
                  Proyección: idx >= datosPredicciones.mesActual ? datosPredicciones.egresos[idx] : null
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value: number) => value ? `$${value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : 'N/A'} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Histórico" 
                    stroke="#dc3545" 
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    connectNulls={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Proyección" 
                    stroke="#ff9800" 
                    strokeWidth={3}
                    strokeDasharray="10 5"
                    dot={{ r: 5 }}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfica 3: Predicción de Balance */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-4 text-gray-700">📊 Predicción de Balance</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={datosPredicciones.meses.map((mes, idx) => ({
                  mes,
                  Histórico: idx <= datosPredicciones.mesActual ? datosPredicciones.balance[idx] : null,
                  Proyección: idx >= datosPredicciones.mesActual ? datosPredicciones.balance[idx] : null
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value: number) => value ? `$${value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : 'N/A'} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Histórico" 
                    stroke="#667eea" 
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    connectNulls={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Proyección" 
                    stroke="#ff9800" 
                    strokeWidth={3}
                    strokeDasharray="10 5"
                    dot={{ r: 5 }}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
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