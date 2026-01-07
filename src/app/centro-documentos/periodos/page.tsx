'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Calendar,
  Search,
  ChevronLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  FileText,
  Eye,
  Play,
  RefreshCw,
  Filter
} from 'lucide-react'

interface Periodo {
  id: string
  plantilla_nombre: string
  cliente_nombre: string
  periodo_str: string
  fecha_limite: string
  estado: string
  modulos_completados: number
  modulos_total: number
}

const ESTADOS_CONFIG: Record<string, { bg: string; text: string; label: string; icon: any }> = {
  pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pendiente', icon: Clock },
  parcial: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Parcial', icon: AlertCircle },
  completo: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completo', icon: CheckCircle2 },
  procesado: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Procesado', icon: CheckCircle2 },
  vencido: { bg: 'bg-red-100', text: 'text-red-700', label: 'Vencido', icon: AlertCircle }
}

export default function PeriodosPage() {
  const [periodos, setPeriodos] = useState<Periodo[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [generando, setGenerando] = useState<string | null>(null)

  useEffect(() => {
    cargarPeriodos()
  }, [filtroEstado])

  const cargarPeriodos = async () => {
    setLoading(true)
    try {
      let url = 'http://localhost:8000/api/centro-documentos/periodos?limit=500'
      if (filtroEstado) {
        url += `&estado=${filtroEstado}`
      }

      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setPeriodos(data)
      }
    } catch (error) {
      console.error('Error cargando periodos:', error)
    } finally {
      setLoading(false)
    }
  }

  const generarReporte = async (periodoId: string) => {
    setGenerando(periodoId)
    try {
      const res = await fetch(
        `http://localhost:8000/api/centro-documentos/periodos/${periodoId}/generar`,
        { method: 'POST' }
      )

      if (res.ok) {
        // Recargar periodos
        cargarPeriodos()
      } else {
        const error = await res.json()
        alert(error.detail || 'Error al generar reporte')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setGenerando(null)
    }
  }

  const periodosFiltrados = periodos.filter(periodo => {
    if (!busqueda) return true
    const busquedaLower = busqueda.toLowerCase()
    return (
      periodo.cliente_nombre.toLowerCase().includes(busquedaLower) ||
      periodo.plantilla_nombre.toLowerCase().includes(busquedaLower) ||
      periodo.periodo_str.toLowerCase().includes(busquedaLower)
    )
  })

  const diasRestantes = (fechaLimite: string) => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const limite = new Date(fechaLimite)
    const diff = Math.ceil((limite.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/centro-documentos"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Periodos de Documentos</h1>
                  <p className="text-sm text-gray-600">Gestiona la recopilación de documentos</p>
                </div>
              </div>
            </div>
            <button
              onClick={cargarPeriodos}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Recargar"
            >
              <RefreshCw size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por cliente, plantilla o periodo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setFiltroEstado('')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroEstado === ''
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              {Object.entries(ESTADOS_CONFIG).map(([key, config]) => {
                const Icon = config.icon
                return (
                  <button
                    key={key}
                    onClick={() => setFiltroEstado(key)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                      filtroEstado === key
                        ? `${config.bg} ${config.text}`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={14} />
                    {config.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : periodosFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay periodos</h3>
            <p className="text-gray-500">
              {busqueda || filtroEstado
                ? 'No se encontraron periodos con los filtros aplicados'
                : 'Los periodos se generan automáticamente según las plantillas configuradas'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plantilla / Cliente
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Periodo
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Límite
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progreso
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {periodosFiltrados.map((periodo) => {
                    const estadoConfig = ESTADOS_CONFIG[periodo.estado] || ESTADOS_CONFIG.pendiente
                    const IconEstado = estadoConfig.icon
                    const porcentaje = Math.round(
                      (periodo.modulos_completados / periodo.modulos_total) * 100
                    )
                    const dias = diasRestantes(periodo.fecha_limite)

                    return (
                      <tr key={periodo.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{periodo.plantilla_nombre}</p>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Building2 size={14} />
                              {periodo.cliente_nombre}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900">{periodo.periodo_str}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-gray-900">
                              {new Date(periodo.fecha_limite).toLocaleDateString('es-MX', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                            {periodo.estado !== 'procesado' && periodo.estado !== 'vencido' && (
                              <p className={`text-xs ${
                                dias < 0 ? 'text-red-600' :
                                dias <= 2 ? 'text-orange-600' :
                                'text-gray-500'
                              }`}>
                                {dias < 0
                                  ? `Vencido hace ${Math.abs(dias)} día(s)`
                                  : dias === 0
                                  ? 'Vence hoy'
                                  : dias === 1
                                  ? 'Vence mañana'
                                  : `${dias} días restantes`}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-32 mx-auto">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-500">
                                {periodo.modulos_completados}/{periodo.modulos_total}
                              </span>
                              <span className="font-medium text-gray-900">{porcentaje}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  porcentaje === 100
                                    ? 'bg-green-500'
                                    : porcentaje > 0
                                    ? 'bg-blue-500'
                                    : 'bg-gray-300'
                                }`}
                                style={{ width: `${porcentaje}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${estadoConfig.bg} ${estadoConfig.text}`}>
                            <IconEstado size={12} />
                            {estadoConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {periodo.estado === 'completo' && (
                              <button
                                onClick={() => generarReporte(periodo.id)}
                                disabled={generando === periodo.id}
                                className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                              >
                                {generando === periodo.id ? (
                                  <>
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Generando...
                                  </>
                                ) : (
                                  <>
                                    <Play size={14} />
                                    Generar
                                  </>
                                )}
                              </button>
                            )}
                            <Link
                              href={`/centro-documentos/periodos/${periodo.id}`}
                              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Ver detalles"
                            >
                              <Eye size={18} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
