'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  FileUp,
  History,
  Share2,
  TrendingUp,
  TrendingDown,
  FileText,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Loader2,
} from 'lucide-react'

// Tipos TypeScript
interface Estadisticas {
  total_reportes: number
  total_documentos: number
  total_compartidos: number
  tiempo_promedio_minutos: number
  cambios: {
    reportes: number
    documentos: number
    compartidos: number
  }
  reportes_por_modulo: Record<string, number>
}

interface ReporteReciente {
  id: string
  nombre: string
  descripcion?: string
  modulos_usados: string[]
  estado: string
  created_at: string
  num_archivos: number
}

// Quick actions (mantener igual)
const quickActions = [
  {
    title: 'Nuevo Reporte',
    description: 'Sube archivos y genera un análisis completo',
    icon: FileUp,
    href: '/nuevo-reporte',
    primary: true
  },
  {
    title: 'Ver Historial',
    description: 'Consulta reportes anteriores',
    icon: History,
    href: '/reportes/historial',
    primary: false
  },
  {
    title: 'Compartir',
    description: 'Comparte reportes con tu equipo',
    icon: Share2,
    href: '/compartir/nuevo',
    primary: false
  },
]

export default function DashboardPage() {
  // Estados
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null)
  const [reportesRecientes, setReportesRecientes] = useState<ReporteReciente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      setError(null)

      // Llamar a ambos endpoints en paralelo
      const [estadisticasRes, reportesRes] = await Promise.all([
        fetch('http://localhost:8000/api/reportes/estadisticas'),
        fetch('http://localhost:8000/api/reportes/lista?limit=5')
      ])

      if (!estadisticasRes.ok || !reportesRes.ok) {
        throw new Error('Error al cargar datos del servidor')
      }

      const estadisticasData = await estadisticasRes.json()
      const reportesData = await reportesRes.json()

      setEstadisticas(estadisticasData)
      setReportesRecientes(reportesData)
    } catch (err) {
      console.error('Error al cargar datos:', err)
      setError('No se pudieron cargar los datos. Verifica que el backend esté ejecutándose.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-bechapra-success-light text-green-700">
            <CheckCircle2 size={12} />
            Completado
          </span>
        )
      case 'procesando':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-bechapra-info-light text-blue-700">
            <Loader2 size={12} className="animate-spin" />
            Procesando
          </span>
        )
      case 'pendiente':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-bechapra-warning-light text-amber-700">
            <AlertCircle size={12} />
            Pendiente
          </span>
        )
      case 'error':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <AlertCircle size={12} />
            Error
          </span>
        )
      default:
        return null
    }
  }

  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Si está cargando, mostrar loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto text-bechapra-primary mb-4" size={48} />
          <p className="text-bechapra-text-secondary">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  // Si hay error, mostrar mensaje
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card-bechapra p-12 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-bechapra-text-primary mb-2">
            Error al cargar el dashboard
          </h3>
          <p className="text-bechapra-text-secondary mb-4">{error}</p>
          <button
            onClick={cargarDatos}
            className="btn-bechapra-primary"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  // Si no hay estadísticas, no renderizar nada
  if (!estadisticas) {
    return null
  }

  // Preparar los stats cards con datos reales
  const stats = [
    {
      label: 'Reportes Generados',
      value: estadisticas.total_reportes.toString(),
      change: `${estadisticas.cambios.reportes > 0 ? '+' : ''}${estadisticas.cambios.reportes}%`,
      trend: estadisticas.cambios.reportes >= 0 ? 'up' : 'down',
      icon: FileText,
      color: 'from-bechapra-primary to-bechapra-primary-dark'
    },
    {
      label: 'Documentos Procesados',
      value: estadisticas.total_documentos.toString(),
      change: `${estadisticas.cambios.documentos > 0 ? '+' : ''}${estadisticas.cambios.documentos}%`,
      trend: estadisticas.cambios.documentos >= 0 ? 'up' : 'down',
      icon: BarChart3,
      color: 'from-bechapra-accent to-bechapra-primary'
    },
    {
      label: 'Reportes Compartidos',
      value: estadisticas.total_compartidos.toString(),
      change: `+${estadisticas.cambios.compartidos}`,
      trend: 'up',
      icon: Share2,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      label: 'Tiempo Promedio',
      value: `${estadisticas.tiempo_promedio_minutos} min`,
      change: estadisticas.tiempo_promedio_minutos <= 3 ? 'Óptimo' : 'Normal',
      trend: estadisticas.tiempo_promedio_minutos <= 3 ? 'down' : 'up',
      icon: Clock,
      color: 'from-amber-500 to-orange-500'
    },
  ]

  return (
    <div className="min-h-screen bg-bechapra-light py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-bechapra-text-primary mb-2">
            Bienvenido de vuelta, Eduardo
          </h1>
          <p className="text-bechapra-text-secondary">
            Aquí tienes un resumen de tu actividad reciente
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="card-bechapra p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  {stat.trend === 'up' ? (
                    <span className="text-sm font-medium text-bechapra-success flex items-center gap-1">
                      <TrendingUp size={16} />
                      {stat.change}
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-red-600 flex items-center gap-1">
                      <TrendingDown size={16} />
                      {stat.change}
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold text-bechapra-text-primary mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-bechapra-text-secondary">{stat.label}</p>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link
                key={index}
                href={action.href}
                className={`
                  card-bechapra p-6 hover:shadow-lg transition-all duration-200 group
                  ${action.primary ? 'bg-gradient-to-r from-bechapra-primary to-bechapra-accent text-white' : ''}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`
                    w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
                    ${action.primary ? 'bg-white/20' : 'bg-bechapra-light'}
                  `}>
                    <Icon className={action.primary ? 'text-white' : 'text-bechapra-primary'} size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${action.primary ? 'text-white' : 'text-bechapra-text-primary'}`}>
                      {action.title}
                    </h3>
                    <p className={`text-sm ${action.primary ? 'text-white/90' : 'text-bechapra-text-secondary'}`}>
                      {action.description}
                    </p>
                    <div className={`
                      flex items-center gap-2 mt-3 text-sm font-medium
                      ${action.primary ? 'text-white' : 'text-bechapra-primary'}
                    `}>
                      Ir ahora
                      <ArrowRight 
                        size={16} 
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Reportes Recientes */}
        <div className="card-bechapra overflow-hidden">
          <div className="px-6 py-4 border-b border-bechapra-light-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-bechapra-text-primary">
              Reportes Recientes
            </h2>
            <Link
              href="/reportes/historial"
              className="text-sm text-bechapra-primary hover:text-bechapra-primary-dark font-medium flex items-center gap-1"
            >
              Ver todos
              <ArrowRight size={16} />
            </Link>
          </div>

          {reportesRecientes.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="mx-auto text-bechapra-text-muted mb-4" size={48} />
              <p className="text-bechapra-text-secondary mb-2">
                No hay reportes generados aún
              </p>
              <Link
                href="/nuevo-reporte"
                className="text-sm text-bechapra-primary hover:text-bechapra-primary-dark font-medium"
              >
                Crear tu primer reporte →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bechapra-light">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-bechapra-text-secondary uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-bechapra-text-secondary uppercase tracking-wider">
                      Nombre del Reporte
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-bechapra-text-secondary uppercase tracking-wider">
                      Módulos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-bechapra-text-secondary uppercase tracking-wider">
                      Documentos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-bechapra-text-secondary uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-bechapra-text-secondary uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-bechapra-light-2">
                  {reportesRecientes.map((reporte) => (
                    <tr 
                      key={reporte.id} 
                      className="hover:bg-bechapra-light cursor-pointer transition-colors"
                      onClick={() => window.location.href = `/reportes/ver/${reporte.id}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-bechapra-text-secondary">
                          {reporte.id.slice(0, 8)}...
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-bechapra-text-primary">
                          {reporte.nombre}
                        </div>
                        {reporte.descripcion && (
                          <div className="text-sm text-bechapra-text-secondary truncate max-w-xs">
                            {reporte.descripcion}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {reporte.modulos_usados.slice(0, 3).map((modulo, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-bechapra-light-2 text-bechapra-primary"
                            >
                              {modulo}
                            </span>
                          ))}
                          {reporte.modulos_usados.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-bechapra-light-2 text-bechapra-text-secondary">
                              +{reporte.modulos_usados.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-bechapra-text-secondary">
                          {reporte.num_archivos}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(reporte.estado)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-bechapra-text-secondary">
                        {formatearFecha(reporte.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}