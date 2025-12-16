'use client'

import React, { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  PieChart,
  Building2,
  Users,
  FileText,
  Activity,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react'
import { Modulo11Data, BalanceGeneral, EstadoResultados, RazonesFinancieras } from './types'
import { formatCurrency } from './utils'

interface Modulo11Props {
  data: Modulo11Data
}

export default function Modulo11({ data }: Modulo11Props) {
  const [activeTab, setActiveTab] = useState<
    'balance' | 'resultados' | 'razones' | 'proveedores' | 'clientes'
  >('balance')

  if (!data || !data.datos) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No hay datos de estados financieros disponibles</p>
      </div>
    )
  }

  const { datos, informacion_general } = data
  const { kpis, balance_general, estado_resultados, razones_financieras } = datos
  const proveedores = datos.proveedores_top_15 || []
  const clientes = datos.clientes_top_15 || []

  // Helper para obtener valores de razones con estructura anidada o plana
  const getRazonValue = (razones: any, flatKey: string, nestedPath: string) => {
    if (razones[flatKey] !== undefined && razones[flatKey] !== 0) return razones[flatKey]
    const keys = nestedPath.split('.')
    let value = razones
    for (const key of keys) {
      value = value?.[key]
      if (value === undefined) break
    }
    return value || 0
  }

  // Obtener valores correctos para los KPIs
  const razonCirculante = getRazonValue(razones_financieras, 'razon_circulante', 'liquidez.razon_circulante')
  const roe = getRazonValue(razones_financieras, 'roe', 'rentabilidad.roe')
  const roa = getRazonValue(razones_financieras, 'roa', 'rentabilidad.roa')

  return (
    <div className="space-y-6">
      {/* Información General */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              Excel procesado: <span className="font-bold">{informacion_general.nombre_empresa}</span>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              RFC: {informacion_general.rfc || 'N/A'} | Ejercicio: {informacion_general.ejercicio} | 
              Período: {informacion_general.periodo}
            </p>
          </div>
        </div>
      </div>

      {/* KPIs Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Activo Total */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <p className="text-xs text-blue-600 font-medium">Activo Total</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(kpis.activo_total)}</p>
            <p className="text-xs text-gray-500 mt-1">Total de activos</p>
        </div>

        {/* Utilidad Neta */}
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <p className="text-xs text-green-600 font-medium">Utilidad Neta</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(kpis.utilidad_neta)}</p>
            <p className="text-xs text-gray-500 mt-1">Ganancia del período</p>
        </div>

        {/* Margen Neto */}
        <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-cyan-600" />
            <p className="text-xs text-cyan-600 font-medium">Margen Neto</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{(kpis.margen_neto * 100).toFixed(2)}%</p>
            <p className="text-xs text-gray-500 mt-1">Rentabilidad</p>
        </div>

        {/* Razón Circulante */}
        <div className="bg-teal-50 border border-teal-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-teal-600" />
            <p className="text-xs text-teal-600 font-medium">Razón Circulante</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{razonCirculante.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Liquidez</p>
        </div>

        {/* ROE */}
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
            <PieChart className="w-4 h-4 text-purple-600" />
            <p className="text-xs text-purple-600 font-medium">ROE</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{(roe * 100).toFixed(2)}%</p>
            <p className="text-xs text-gray-500 mt-1">Return on Equity</p>
        </div>

        {/* Capital Total */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <p className="text-xs text-indigo-600 font-medium">Capital Total</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(kpis.capital_total)}</p>
            <p className="text-xs text-gray-500 mt-1">Patrimonio</p>
        </div>
        </div>

      {/* Sistema de Tabs */}
      <div className="bg-white rounded-lg border border-bechapra-border overflow-hidden">
        {/* Headers de Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          <TabButton
            active={activeTab === 'balance'}
            onClick={() => setActiveTab('balance')}
            icon={<BarChart3 className="w-4 h-4" />}
            label="Balance General"
          />
          <TabButton
            active={activeTab === 'resultados'}
            onClick={() => setActiveTab('resultados')}
            icon={<DollarSign className="w-4 h-4" />}
            label="Estado de Resultados"
          />
          <TabButton
            active={activeTab === 'razones'}
            onClick={() => setActiveTab('razones')}
            icon={<Activity className="w-4 h-4" />}
            label="Razones Financieras"
          />
          <TabButton
            active={activeTab === 'proveedores'}
            onClick={() => setActiveTab('proveedores')}
            icon={<Building2 className="w-4 h-4" />}
            label="Proveedores"
          />
          <TabButton
            active={activeTab === 'clientes'}
            onClick={() => setActiveTab('clientes')}
            icon={<Users className="w-4 h-4" />}
            label="Clientes"
          />
        </div>

        {/* Contenido de Tabs */}
        <div className="p-6">
          {activeTab === 'balance' && <BalanceGeneralTab balance={balance_general} />}
          {activeTab === 'resultados' && <EstadoResultadosTab resultado={estado_resultados} />}
          {activeTab === 'razones' && <RazonesFinancierasTab razones={razones_financieras} />}
          {activeTab === 'proveedores' && (
            <ProveedoresClientesTab
              datos={proveedores}
              titulo="Top Proveedores"
              empty="No hay datos de proveedores"
            />
          )}
          {activeTab === 'clientes' && (
            <ProveedoresClientesTab
              datos={clientes}
              titulo="Top Clientes"
              empty="No hay datos de clientes"
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ========================================
// COMPONENTES AUXILIARES
// ========================================

interface KPICardProps {
  icon: React.ReactNode
  label: string
  value: string
  gradient: string
}


interface TabButtonProps {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
        active
          ? 'border-purple-600 text-purple-600 bg-purple-50'
          : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

// ========================================
// TAB: BALANCE GENERAL
// ========================================

function BalanceGeneralTab({ balance }: { balance: BalanceGeneral }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Balance General</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ACTIVO */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-600 mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            ACTIVO
          </h4>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 font-medium text-gray-900">Activo Circulante</td>
                <td className="py-2 text-right font-semibold">{formatCurrency(balance.activo_circulante)}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 pl-4 text-gray-600">Caja y Bancos</td>
                <td className="py-2 text-right">{formatCurrency(balance.caja_bancos)}</td>
              </tr>
              <tr>
                <td className="py-2 pl-4 text-gray-600">Clientes</td>
                <td className="py-2 text-right">{formatCurrency(balance.clientes)}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 pl-4 text-gray-600">Inventarios</td>
                <td className="py-2 text-right">{formatCurrency(balance.inventarios)}</td>
              </tr>
              <tr>
                <td className="py-2 pl-4 text-gray-600">Otros Circulantes</td>
                <td className="py-2 text-right">{formatCurrency(balance.otros_activos_circulantes)}</td>
              </tr>
              <tr className="border-t-2 border-gray-300">
                <td className="py-2 font-medium text-gray-900">Activo Fijo</td>
                <td className="py-2 text-right font-semibold">{formatCurrency(balance.activo_fijo)}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 pl-4 text-gray-600">Terrenos/Edificios</td>
                <td className="py-2 text-right">{formatCurrency(balance.terrenos_edificios)}</td>
              </tr>
              <tr>
                <td className="py-2 pl-4 text-gray-600">Maquinaria/Equipo</td>
                <td className="py-2 text-right">{formatCurrency(balance.maquinaria_equipo)}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 pl-4 text-gray-600">Depreciación Acum.</td>
                <td className="py-2 text-right">({formatCurrency(Math.abs(balance.depreciacion_acumulada))})</td>
              </tr>
              <tr className="border-t-2 border-gray-300">
                <td className="py-2 font-medium text-gray-900">Activo Diferido</td>
                <td className="py-2 text-right font-semibold">{formatCurrency(balance.activo_diferido)}</td>
              </tr>
              <tr className="border-t-2 border-blue-500 bg-blue-50">
                <td className="py-2 font-bold text-gray-900">TOTAL ACTIVO</td>
                <td className="py-2 text-right font-bold">{formatCurrency(balance.activo_total)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* PASIVO */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-red-600 mb-4 flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            PASIVO
          </h4>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 font-medium text-gray-900">Pasivo Circulante</td>
                <td className="py-2 text-right font-semibold">{formatCurrency(balance.pasivo_circulante)}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 pl-4 text-gray-600">Proveedores</td>
                <td className="py-2 text-right">{formatCurrency(balance.proveedores)}</td>
              </tr>
              <tr>
                <td className="py-2 pl-4 text-gray-600">Acreedores</td>
                <td className="py-2 text-right">{formatCurrency(balance.acreedores)}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 pl-4 text-gray-600">Impuestos por Pagar</td>
                <td className="py-2 text-right">{formatCurrency(balance.impuestos_por_pagar)}</td>
              </tr>
              <tr>
                <td className="py-2 pl-4 text-gray-600">Otros Circulantes</td>
                <td className="py-2 text-right">{formatCurrency(balance.otros_pasivos_circulantes)}</td>
              </tr>
              <tr className="border-t-2 border-gray-300">
                <td className="py-2 font-medium text-gray-900">Pasivo Largo Plazo</td>
                <td className="py-2 text-right font-semibold">{formatCurrency(balance.pasivo_largo_plazo)}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 pl-4 text-gray-600">Préstamos Bancarios</td>
                <td className="py-2 text-right">{formatCurrency(balance.prestamos_bancarios_lp)}</td>
              </tr>
              <tr>
                <td className="py-2 pl-4 text-gray-600">Documentos por Pagar</td>
                <td className="py-2 text-right">{formatCurrency(balance.documentos_por_pagar_lp)}</td>
              </tr>
              <tr className="border-t-2 border-red-500 bg-red-50">
                <td className="py-2 font-bold text-gray-900">TOTAL PASIVO</td>
                <td className="py-2 text-right font-bold">{formatCurrency(balance.pasivo_total)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* CAPITAL */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-green-600 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            CAPITAL
          </h4>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 font-medium text-gray-900">Capital Social</td>
                <td className="py-2 text-right font-semibold">{formatCurrency(balance.capital_social)}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 pl-4 text-gray-600">Aportaciones</td>
                <td className="py-2 text-right">{formatCurrency(balance.aportaciones_capital)}</td>
              </tr>
              <tr>
                <td className="py-2 pl-4 text-gray-600">Reservas</td>
                <td className="py-2 text-right">{formatCurrency(balance.reservas_capital)}</td>
              </tr>
              <tr className="border-t-2 border-gray-300">
                <td className="py-2 font-medium text-gray-900">Resultados</td>
                <td className="py-2 text-right font-semibold">{formatCurrency(balance.resultados_acumulados)}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 pl-4 text-gray-600">Ejercicios Anteriores</td>
                <td className="py-2 text-right">{formatCurrency(balance.utilidades_acumuladas)}</td>
              </tr>
              <tr>
                <td className="py-2 pl-4 text-gray-600">Resultado del Ejercicio</td>
                <td className="py-2 text-right">{formatCurrency(balance.resultado_ejercicio)}</td>
              </tr>
              <tr className="border-t-2 border-green-500 bg-green-50">
                <td className="py-2 font-bold text-gray-900">TOTAL CAPITAL</td>
                <td className="py-2 text-right font-bold">{formatCurrency(balance.capital_total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Validación de Cuadratura */}
      <div
        className={`flex items-start gap-3 p-4 rounded-lg border ${
          balance.cuadra
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}
      >
        {balance.cuadra ? (
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        )}
        <div>
          <p className="text-sm font-medium text-gray-900">
            {balance.cuadra
              ? `Balance cuadrado: Activo = Pasivo + Capital`
              : `Balance NO cuadra`}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Diferencia: {formatCurrency(Math.abs(balance.diferencia))}
          </p>
        </div>
      </div>
    </div>
  )
}

// ========================================
// TAB: ESTADO DE RESULTADOS
// ========================================

function EstadoResultadosTab({ resultado }: { resultado: EstadoResultados }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Estado de Resultados</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* INGRESOS */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-green-600 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            INGRESOS
          </h4>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 font-medium text-gray-900">Ingresos Operativos</td>
                <td className="py-2 text-right font-semibold">{formatCurrency(resultado.ingresos_totales)}</td>
              </tr>
              {resultado.ventas_netas !== undefined && (
                <tr className="bg-gray-50">
                  <td className="py-2 pl-4 text-gray-600">Ventas/Servicios</td>
                  <td className="py-2 text-right">{formatCurrency(resultado.ventas_netas)}</td>
                </tr>
              )}
              {resultado.otros_ingresos_operativos !== undefined && (
                <tr>
                  <td className="py-2 pl-4 text-gray-600">Otros Ingresos</td>
                  <td className="py-2 text-right">{formatCurrency(resultado.otros_ingresos_operativos)}</td>
                </tr>
              )}
              <tr className="border-t-2 border-gray-300">
                <td className="py-2 font-medium text-gray-900">Ingresos No Operativos</td>
                <td className="py-2 text-right font-semibold">
                  {formatCurrency(resultado.ingresos_no_operativos || resultado.productos_financieros || 0)}
                </td>
              </tr>
              <tr className="border-t-2 border-green-500 bg-green-50">
                <td className="py-2 font-bold text-gray-900">TOTAL INGRESOS</td>
                <td className="py-2 text-right font-bold">{formatCurrency(resultado.ingresos_totales)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* GASTOS */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-red-600 mb-4 flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            GASTOS
          </h4>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              {resultado.costo_ventas !== undefined && resultado.costo_ventas > 0 && (
                <tr>
                  <td className="py-2 font-medium text-gray-900">Costo de Ventas</td>
                  <td className="py-2 text-right font-semibold">{formatCurrency(resultado.costo_ventas)}</td>
                </tr>
              )}
              <tr className="bg-gray-50">
                <td className="py-2 font-medium text-gray-900">Gastos Operativos</td>
                <td className="py-2 text-right font-semibold">{formatCurrency(resultado.gastos_operativos_totales)}</td>
              </tr>
              {resultado.gastos_administracion !== undefined && (
                <tr>
                  <td className="py-2 pl-4 text-gray-600">Gastos de Administración</td>
                  <td className="py-2 text-right">{formatCurrency(resultado.gastos_administracion)}</td>
                </tr>
              )}
              {resultado.gastos_venta !== undefined && (
                <tr className="bg-gray-50">
                  <td className="py-2 pl-4 text-gray-600">Gastos de Venta</td>
                  <td className="py-2 text-right">{formatCurrency(resultado.gastos_venta)}</td>
                </tr>
              )}
              <tr>
                <td className="py-2 pl-4 text-gray-600">Gastos Financieros</td>
                <td className="py-2 text-right">{formatCurrency(resultado.gastos_financieros)}</td>
              </tr>
              {resultado.depreciacion_amortizacion !== undefined && (
                <tr className="bg-gray-50">
                  <td className="py-2 pl-4 text-gray-600">Depreciación/Amortización</td>
                  <td className="py-2 text-right">{formatCurrency(resultado.depreciacion_amortizacion)}</td>
                </tr>
              )}
              {resultado.otros_gastos !== undefined && resultado.otros_gastos > 0 && (
                <tr className="border-t-2 border-gray-300">
                  <td className="py-2 font-medium text-gray-900">Otros Gastos</td>
                  <td className="py-2 text-right font-semibold">{formatCurrency(resultado.otros_gastos)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESULTADOS Y MÁRGENES */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-purple-600 mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          RESULTADOS Y MÁRGENES
        </h4>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 text-left font-semibold text-gray-900">Concepto</th>
              <th className="py-2 text-right font-semibold text-gray-900">Monto</th>
              <th className="py-2 text-right font-semibold text-gray-900">Margen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-2 font-medium text-gray-900">Utilidad Bruta</td>
              <td className="py-2 text-right">{formatCurrency(resultado.utilidad_bruta)}</td>
              <td className="py-2 text-right font-semibold text-green-600">
                {(resultado.margen_bruto * 100).toFixed(2)}%
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="py-2 font-medium text-gray-900">Utilidad Operativa</td>
              <td className="py-2 text-right">{formatCurrency(resultado.utilidad_operativa)}</td>
              <td className="py-2 text-right font-semibold text-green-600">
                {(resultado.margen_operativo * 100).toFixed(2)}%
              </td>
            </tr>
            <tr>
              <td className="py-2 font-medium text-gray-900">Utilidad antes de Impuestos</td>
              <td className="py-2 text-right">{formatCurrency(resultado.utilidad_antes_impuestos)}</td>
              <td className="py-2 text-right">-</td>
            </tr>
            {resultado.isr !== undefined && resultado.isr > 0 && (
              <tr className="bg-gray-50">
                <td className="py-2 pl-4 text-gray-600">ISR</td>
                <td className="py-2 text-right">({formatCurrency(Math.abs(resultado.isr))})</td>
                <td className="py-2 text-right">-</td>
              </tr>
            )}
            <tr className="border-t-2 border-purple-500 bg-purple-50">
              <td className="py-2 font-bold text-gray-900">UTILIDAD NETA</td>
              <td className="py-2 text-right font-bold">{formatCurrency(resultado.utilidad_neta)}</td>
              <td className="py-2 text-right font-bold text-purple-600">
                {(resultado.margen_neto * 100).toFixed(2)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ========================================
// TAB: RAZONES FINANCIERAS
// ========================================

function RazonesFinancierasTab({ razones }: { razones: any }) {
  // Helper para obtener valores con fallback de estructura anidada o plana
  const getValue = (obj: any, flatKey: string, nestedPath: string) => {
    // Intentar primero estructura plana
    if (obj[flatKey] !== undefined) return obj[flatKey]
    
    // Intentar estructura anidada
    const keys = nestedPath.split('.')
    let value = obj
    for (const key of keys) {
      value = value?.[key]
      if (value === undefined) break
    }
    return value || 0
  }

  const getStatus = (value: number, thresholds: { good: number; warning: number }, reverse = false) => {
    if (reverse) {
      if (value <= thresholds.good) return { label: 'Buena', color: 'text-green-600' }
      if (value <= thresholds.warning) return { label: 'Aceptable', color: 'text-yellow-600' }
      return { label: 'Revisar', color: 'text-red-600' }
    } else {
      if (value >= thresholds.good) return { label: 'Buena', color: 'text-green-600' }
      if (value >= thresholds.warning) return { label: 'Aceptable', color: 'text-yellow-600' }
      return { label: 'Baja', color: 'text-red-600' }
    }
  }

  // Obtener valores con fallback
  const razonCirculante = getValue(razones, 'razon_circulante', 'liquidez.razon_circulante')
  const pruebaAcida = getValue(razones, 'prueba_acida', 'liquidez.prueba_acida')
  const capitalTrabajo = getValue(razones, 'capital_trabajo', 'liquidez.capital_trabajo')
  
  const deudaCapital = getValue(razones, 'deuda_capital', 'endeudamiento.deuda_capital')
  const deudaActivo = getValue(razones, 'deuda_activo', 'endeudamiento.deuda_activo')
  const apalancamiento = getValue(razones, 'apalancamiento', 'endeudamiento.apalancamiento')
  
  const roe = getValue(razones, 'roe', 'rentabilidad.roe')
  const roa = getValue(razones, 'roa', 'rentabilidad.roa')
  const margenUtilidadNeta = getValue(razones, 'margen_utilidad_neta', 'rentabilidad.margen_utilidad_neta')
  
  const rotacionActivos = getValue(razones, 'rotacion_activos', 'eficiencia.rotacion_activos')
  const rotacionInventarios = getValue(razones, 'rotacion_inventarios', 'eficiencia.rotacion_inventarios')
  const diasCobro = getValue(razones, 'dias_cobro', 'eficiencia.dias_cobro')
  const diasPago = getValue(razones, 'dias_pago', 'eficiencia.dias_pago')

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Razones Financieras</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LIQUIDEZ */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-cyan-600 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            LIQUIDEZ
          </h4>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 text-gray-900">Razón Circulante</td>
                <td className="py-2 text-right font-semibold">{razonCirculante.toFixed(2)}</td>
                <td className="py-2 text-right">
                  <span className={getStatus(razonCirculante, { good: 2, warning: 1 }).color}>
                    {getStatus(razonCirculante, { good: 2, warning: 1 }).label}
                  </span>
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 text-gray-900">Prueba Ácida</td>
                <td className="py-2 text-right font-semibold">{pruebaAcida.toFixed(2)}</td>
                <td className="py-2 text-right">
                  <span className={getStatus(pruebaAcida, { good: 1, warning: 0.5 }).color}>
                    {getStatus(pruebaAcida, { good: 1, warning: 0.5 }).label}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2 text-gray-900">Capital de Trabajo</td>
                <td className="py-2 text-right font-semibold">{formatCurrency(capitalTrabajo)}</td>
                <td className="py-2 text-right">-</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ENDEUDAMIENTO */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-red-600 mb-4 flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            ENDEUDAMIENTO
          </h4>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 text-gray-900">Deuda / Capital</td>
                <td className="py-2 text-right font-semibold">{deudaCapital.toFixed(2)}</td>
                <td className="py-2 text-right">
                  <span className={getStatus(deudaCapital, { good: 1, warning: 2 }, true).color}>
                    {getStatus(deudaCapital, { good: 1, warning: 2 }, true).label}
                  </span>
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 text-gray-900">Deuda / Activo</td>
                <td className="py-2 text-right font-semibold">{deudaActivo.toFixed(2)}</td>
                <td className="py-2 text-right">-</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-900">Apalancamiento</td>
                <td className="py-2 text-right font-semibold">{apalancamiento.toFixed(2)}</td>
                <td className="py-2 text-right">-</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* RENTABILIDAD */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-green-600 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            RENTABILIDAD
          </h4>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 text-gray-900">ROE (Return on Equity)</td>
                <td className="py-2 text-right font-semibold">{(roe * 100).toFixed(2)}%</td>
                <td className="py-2 text-right">
                  <span className={getStatus(roe, { good: 0.15, warning: 0.10 }).color}>
                    {getStatus(roe, { good: 0.15, warning: 0.10 }).label}
                  </span>
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 text-gray-900">ROA (Return on Assets)</td>
                <td className="py-2 text-right font-semibold">{(roa * 100).toFixed(2)}%</td>
                <td className="py-2 text-right">
                  <span className={getStatus(roa, { good: 0.10, warning: 0.05 }).color}>
                    {getStatus(roa, { good: 0.10, warning: 0.05 }).label}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2 text-gray-900">Margen de Utilidad Neta</td>
                <td className="py-2 text-right font-semibold">{(margenUtilidadNeta * 100).toFixed(2)}%</td>
                <td className="py-2 text-right">-</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* EFICIENCIA */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-purple-600 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            EFICIENCIA
          </h4>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 text-gray-900">Rotación de Activos</td>
                <td className="py-2 text-right font-semibold">{rotacionActivos.toFixed(2)}</td>
                <td className="py-2 text-right">-</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 text-gray-900">Rotación de Inventarios</td>
                <td className="py-2 text-right font-semibold">{rotacionInventarios.toFixed(2)}</td>
                <td className="py-2 text-right">-</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-900">Días de Cobro</td>
                <td className="py-2 text-right font-semibold">{diasCobro.toFixed(0)} días</td>
                <td className="py-2 text-right">-</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 text-gray-900">Días de Pago</td>
                <td className="py-2 text-right font-semibold">{diasPago.toFixed(0)} días</td>
                <td className="py-2 text-right">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ========================================
// TAB: PROVEEDORES / CLIENTES
// ========================================

interface ProveedoresClientesTabProps {
  datos: Array<{ cuenta: string; nombre: string; saldo: number }>
  titulo: string
  empty: string
}

function ProveedoresClientesTab({ datos, titulo, empty }: ProveedoresClientesTabProps) {
  if (!datos || datos.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">{empty}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">{titulo}</h3>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Cuenta</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Nombre / Código</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Saldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {datos.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">{idx + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.cuenta}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.nombre}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-right text-gray-900">
                    {formatCurrency(item.saldo)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}