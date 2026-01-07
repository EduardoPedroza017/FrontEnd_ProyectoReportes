'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FolderOpen,
  Plus,
  Building2,
  Users,
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Bell,
  TrendingUp
} from 'lucide-react'

interface Cliente {
  id: string
  nombre: string
  rfc: string | null
  activo: boolean
  num_plantillas: number
}

interface Plantilla {
  id: string
  nombre: string
  cliente_id: string
  cliente_nombre: string
  activa: boolean
  num_modulos: number
  proxima_fecha: string | null
}

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

interface EstadisticasGenerales {
  total_clientes: number
  total_plantillas: number
  periodos_pendientes: number
  periodos_completos: number
}

const ESTADOS_COLORES: Record<string, { bg: string; text: string; icon: any }> = {
  pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
  parcial: { bg: 'bg-blue-100', text: 'text-blue-700', icon: AlertCircle },
  completo: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2 },
  procesado: { bg: 'bg-purple-100', text: 'text-purple-700', icon: CheckCircle2 },
  vencido: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle }
}

export default function CentroDocumentosPage() {
  const [loading, setLoading] = useState(true)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [plantillas, setPlantillas] = useState<Plantilla[]>([])
  const [periodos, setPeriodos] = useState<Periodo[]>([])
  const [stats, setStats] = useState<EstadisticasGenerales | null>(null)
  const [filtroEstado, setFiltroEstado] = useState<string>('')
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    try {
      const [clientesRes, plantillasRes, periodosRes] = await Promise.all([
        fetch('http://localhost:8000/api/centro-documentos/clientes?limit=10'),
        fetch('http://localhost:8000/api/centro-documentos/plantillas?limit=10'),
        fetch('http://localhost:8000/api/centro-documentos/periodos?limit=20')
      ])

      if (clientesRes.ok) {
        const clientesData = await clientesRes.json()
        setClientes(clientesData)
      }

      if (plantillasRes.ok) {
        const plantillasData = await plantillasRes.json()
        setPlantillas(plantillasData)
      }

      if (periodosRes.ok) {
        const periodosData = await periodosRes.json()
        setPeriodos(periodosData)
      }

      // Calcular estadísticas
      setStats({
        total_clientes: clientes.length,
        total_plantillas: plantillas.length,
        periodos_pendientes: periodos.filter(p => ['pendiente', 'parcial'].includes(p.estado)).length,
        periodos_completos: periodos.filter(p => p.estado === 'completo').length
      })

    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const periodosFiltrados = periodos.filter(periodo => {
    if (filtroEstado && periodo.estado !== filtroEstado) return false
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase()
      return (
        periodo.cliente_nombre.toLowerCase().includes(busquedaLower) ||
        periodo.plantilla_nombre.toLowerCase().includes(busquedaLower)
      )
    }
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando Centro de Documentos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Centro de Documentos</h1>
                <p className="text-gray-600">Gestión centralizada de documentos y reportes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/centro-documentos/clientes/nuevo"
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <Building2 size={18} />
                Nuevo Cliente
              </Link>
              <Link
                href="/centro-documentos/plantillas/nueva"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                <Plus size={18} />
                Nueva Plantilla
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{clientes.length}</span>
            </div>
            <p className="text-gray-600 text-sm">Clientes Activos</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{plantillas.length}</span>
            </div>
            <p className="text-gray-600 text-sm">Plantillas Configuradas</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {periodos.filter(p => ['pendiente', 'parcial'].includes(p.estado)).length}
              </span>
            </div>
            <p className="text-gray-600 text-sm">Periodos Pendientes</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {periodos.filter(p => p.estado === 'completo').length}
              </span>
            </div>
            <p className="text-gray-600 text-sm">Listos para Generar</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/centro-documentos/clientes"
            className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Clientes</h3>
                  <p className="text-sm text-gray-500">Gestionar empresas</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </Link>

          <Link
            href="/centro-documentos/responsables"
            className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Responsables</h3>
                  <p className="text-sm text-gray-500">Asignar encargados</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>
          </Link>

          <Link
            href="/centro-documentos/plantillas"
            className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Plantillas</h3>
                  <p className="text-sm text-gray-500">Configurar reportes</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
            </div>
          </Link>
        </div>

        {/* Periodos Section */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Periodos de Documentos</h2>
              <Link
                href="/centro-documentos/periodos"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Ver todos
              </Link>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por cliente o plantilla..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="parcial">Parcial</option>
                <option value="completo">Completo</option>
                <option value="procesado">Procesado</option>
                <option value="vencido">Vencido</option>
              </select>
            </div>
          </div>

          {/* Lista de Periodos */}
          <div className="divide-y divide-gray-100">
            {periodosFiltrados.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay periodos</h3>
                <p className="text-gray-500 mb-4">
                  {busqueda || filtroEstado
                    ? 'No se encontraron periodos con los filtros aplicados'
                    : 'Crea una plantilla para comenzar a generar periodos'}
                </p>
                {!busqueda && !filtroEstado && (
                  <Link
                    href="/centro-documentos/plantillas/nueva"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus size={18} />
                    Nueva Plantilla
                  </Link>
                )}
              </div>
            ) : (
              periodosFiltrados.map((periodo) => {
                const estadoConfig = ESTADOS_COLORES[periodo.estado] || ESTADOS_COLORES.pendiente
                const IconEstado = estadoConfig.icon
                const porcentaje = Math.round((periodo.modulos_completados / periodo.modulos_total) * 100)

                return (
                  <div
                    key={periodo.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Info Principal */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {periodo.plantilla_nombre}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoConfig.bg} ${estadoConfig.text} flex items-center gap-1`}>
                            <IconEstado size={12} />
                            {periodo.estado.charAt(0).toUpperCase() + periodo.estado.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Building2 size={14} />
                            {periodo.cliente_nombre}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {periodo.periodo_str}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            Límite: {new Date(periodo.fecha_limite).toLocaleDateString('es-MX')}
                          </span>
                        </div>
                      </div>

                      {/* Progreso */}
                      <div className="w-32">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-500">Progreso</span>
                          <span className="font-medium text-gray-900">
                            {periodo.modulos_completados}/{periodo.modulos_total}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              porcentaje === 100 ? 'bg-green-500' :
                              porcentaje > 0 ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                            style={{ width: `${porcentaje}%` }}
                          />
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center gap-2">
                        {periodo.estado === 'completo' && (
                          <button
                            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Generar Reporte
                          </button>
                        )}
                        <Link
                          href={`/centro-documentos/periodos/${periodo.id}`}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Eye size={18} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
