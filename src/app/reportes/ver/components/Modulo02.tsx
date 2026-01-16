'use client'

import React, { useState } from 'react'
import {
  CreditCard,
  DollarSign,
  Users,
  Tag,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import { Modulo02Data } from './types'
import { formatCurrency } from './utils'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

interface Modulo02Props {
  data: Modulo02Data
}

export default function Modulo02({ data }: Modulo02Props) {
  const [activeTab, setActiveTab] = useState<
    'resumen' | 'detalle' | 'tipos' | 'empleados' | 'comprobantes' | 'alertas'
  >('resumen')

  if (!data || !data.success) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No hay datos de reembolsos disponibles</p>
      </div>
    )
  }

  const { kpis, reembolsos, por_tipo_gasto, por_empleado, comprobantes, alertas } = data

  const tabs = [
    { id: 'resumen', label: 'Resumen General', icon: TrendingUp },
    { id: 'detalle', label: 'Detalle de Reembolsos', icon: FileText },
    { id: 'tipos', label: 'Por Tipo de Gasto', icon: Tag },
    { id: 'empleados', label: 'Por Empleado', icon: Users },
    { id: 'comprobantes', label: 'Comprobantes', icon: CheckCircle2 },
    { id: 'alertas', label: 'Alertas', icon: AlertTriangle },
  ]

  return (
    <div className="space-y-6">
      {/* Header con KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Reembolsos */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <CreditCard className="w-8 h-8 mb-2 text-blue-600" />
          <p className="text-sm text-blue-700 font-medium mb-1">Total Reembolsos</p>
          <p className="text-3xl font-bold text-blue-600">{kpis?.total_reembolsos || 0}</p>
          <p className="text-sm text-blue-600 mt-2">
            {kpis?.empleados_unicos || 0} empleados
          </p>
        </div>

        {/* Monto Total */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <DollarSign className="w-8 h-8 mb-2 text-green-600" />
          <p className="text-sm text-green-700 font-medium mb-1">Monto Total</p>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(kpis?.monto_total || 0)}</p>
          <p className="text-sm text-green-600 mt-2">
            Máx: {formatCurrency(kpis?.monto_maximo || 0)}
          </p>
        </div>

        {/* Promedio */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <TrendingUp className="w-8 h-8 mb-2 text-purple-600" />
          <p className="text-sm text-purple-700 font-medium mb-1">Promedio</p>
          <p className="text-3xl font-bold text-purple-600">{formatCurrency(kpis?.promedio || 0)}</p>
          <p className="text-sm text-purple-600 mt-2">
            Mín: {formatCurrency(kpis?.monto_minimo || 0)}
          </p>
        </div>

        {/* Tipos de Gasto */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <Tag className="w-8 h-8 mb-2 text-orange-600" />
          <p className="text-sm text-orange-700 font-medium mb-1">Tipos de Gasto</p>
          <p className="text-3xl font-bold text-orange-600">{kpis?.tipos_gasto_unicos || 0}</p>
          <p className="text-sm text-orange-600 mt-2">
            {alertas?.length || 0} alertas
          </p>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Contenido de tabs */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeTab === 'resumen' && <TabResumen data={data} />}
        {activeTab === 'detalle' && <TabDetalle reembolsos={reembolsos} />}
        {activeTab === 'tipos' && <TabTipos por_tipo_gasto={por_tipo_gasto} />}
        {activeTab === 'empleados' && <TabEmpleados por_empleado={por_empleado} />}
        {activeTab === 'comprobantes' && <TabComprobantes comprobantes={comprobantes} />}
        {activeTab === 'alertas' && <TabAlertas alertas={alertas} />}
      </div>
    </div>
  )
}

// ========================================
// TABS
// ========================================

function TabResumen({ data }: { data: Modulo02Data }) {
  const { por_tipo_gasto, por_fecha } = data

  // Preparar datos para gráfico de pastel (tipos de gasto)
  const dataPie = Object.entries(por_tipo_gasto || {}).map(([tipo, datos]) => ({
    name: tipo,
    value: datos.total,
    count: datos.count
  }))

  // Preparar datos para gráfico de barras (por fecha)
  const dataBar = Object.entries(por_fecha || {})
    .map(([fecha, datos]) => ({
      fecha,
      total: datos.total,
      count: datos.count
    }))
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899']

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de Pastel - Tipos de Gasto */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Distribución por Tipo de Gasto</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataPie}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dataPie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Barras - Por Fecha */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Reembolsos por Fecha</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataBar}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="total" fill="#3b82f6" name="Monto Total" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla resumen de tipos */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Resumen por Tipo de Gasto</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Promedio</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(por_tipo_gasto || {}).map(([tipo, datos]) => (
                <tr key={tipo} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{tipo}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-700">{datos.count}</td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-green-700">
                    {formatCurrency(datos.total)}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-gray-700">
                    {formatCurrency(datos.total / datos.count)}
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

function TabDetalle({ reembolsos }: { reembolsos: any[] }) {
  const [busqueda, setBusqueda] = useState('')
  const [ordenPor, setOrdenPor] = useState<'fecha' | 'monto'>('fecha')

  const reembolsosFiltrados = reembolsos
    .filter((r) =>
      r.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.tipo_gasto?.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.motivo?.toLowerCase().includes(busqueda.toLowerCase())
    )
    .sort((a, b) => {
      if (ordenPor === 'monto') {
        return b.monto - a.monto
      }
      return new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    })

  return (
    <div className="space-y-4">
      {/* Controles */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Buscar por empleado, tipo o motivo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={ordenPor}
          onChange={(e) => setOrdenPor(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="fecha">Ordenar por Fecha</option>
          <option value="monto">Ordenar por Monto</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empleado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Solicitud</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reembolsosFiltrados.map((r, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{r.id}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.nombre}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.fecha}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.numero_solicitud}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {r.tipo_gasto}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate" title={r.motivo}>
                  {r.motivo}
                </td>
                <td className="px-4 py-3 text-sm text-right font-semibold text-green-700">
                  {formatCurrency(r.monto)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-gray-500 text-right">
        Mostrando {reembolsosFiltrados.length} de {reembolsos.length} reembolsos
      </p>
    </div>
  )
}

function TabTipos({ por_tipo_gasto }: { por_tipo_gasto: any }) {
  const tipos = Object.entries(por_tipo_gasto || {})
    .map(([tipo, datos]: [string, any]) => ({
      tipo,
      count: datos.count,
      total: datos.total,
      promedio: datos.total / datos.count,
      reembolsos: datos.reembolsos
    }))
    .sort((a, b) => b.total - a.total)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tipos.map((tipo) => (
          <div key={tipo.tipo} className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <Tag className="w-8 h-8 text-blue-600" />
              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                {tipo.count}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{tipo.tipo}</h3>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(tipo.total)}</p>
              <p className="text-sm text-gray-600">Promedio: {formatCurrency(tipo.promedio)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TabEmpleados({ por_empleado }: { por_empleado: any }) {
  const empleados = Object.entries(por_empleado || {})
    .map(([nombre, datos]: [string, any]) => ({
      nombre,
      count: datos.count,
      total: datos.total,
      promedio: datos.total / datos.count
    }))
    .sort((a, b) => b.total - a.total)

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empleado</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Reembolsos</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Promedio</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {empleados.map((emp, idx) => (
            <tr key={emp.nombre} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-500">{idx + 1}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{emp.nombre}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-right text-gray-700">{emp.count}</td>
              <td className="px-6 py-4 text-sm text-right font-semibold text-green-700">
                {formatCurrency(emp.total)}
              </td>
              <td className="px-6 py-4 text-sm text-right text-gray-700">
                {formatCurrency(emp.promedio)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TabComprobantes({ comprobantes }: { comprobantes: any[] }) {
  if (!comprobantes || comprobantes.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No hay comprobantes disponibles</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comprobantes.map((comp, idx) => (
        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-4">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">{comp.nombre}</p>
              <p className="text-xs text-gray-500">Correo: {comp.correo_origen}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">{(comp.tamano_bytes / 1024).toFixed(2)} KB</p>
            <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto mt-1" />
          </div>
        </div>
      ))}
    </div>
  )
}

function TabAlertas({ alertas }: { alertas: any[] }) {
  if (!alertas || alertas.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <p className="text-gray-600">No hay alertas</p>
      </div>
    )
  }

  const getSeverityColor = (severidad: string) => {
    switch (severidad) {
      case 'alta': return 'bg-red-100 border-red-300 text-red-800'
      case 'media': return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      default: return 'bg-blue-100 border-blue-300 text-blue-800'
    }
  }

  const getSeverityIcon = (severidad: string) => {
    switch (severidad) {
      case 'alta': return <AlertTriangle className="w-5 h-5 text-red-600" />
      case 'media': return <AlertCircle className="w-5 h-5 text-yellow-600" />
      default: return <AlertCircle className="w-5 h-5 text-blue-600" />
    }
  }

  return (
    <div className="space-y-3">
      {alertas.map((alerta, idx) => (
        <div key={idx} className={`p-4 rounded-lg border ${getSeverityColor(alerta.severidad)}`}>
          <div className="flex items-start gap-3">
            {getSeverityIcon(alerta.severidad)}
            <div className="flex-1">
              <p className="font-medium">{alerta.mensaje}</p>
              {alerta.detalle && (
                <p className="text-sm mt-1 opacity-90">{alerta.detalle}</p>
              )}
            </div>
            <span className="text-xs font-semibold uppercase">{alerta.severidad}</span>
          </div>
        </div>
      ))}
    </div>
  )
}