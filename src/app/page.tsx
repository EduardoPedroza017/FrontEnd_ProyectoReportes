'use client'

import Link from 'next/link'
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
  Building2,
  Landmark,
  Receipt,
  FileSpreadsheet,
  Users,
  Calculator
} from 'lucide-react'

// Stats cards data
const stats = [
  {
    label: 'Reportes Generados',
    value: '24',
    change: '+12%',
    trend: 'up',
    icon: FileText,
    color: 'from-bechapra-primary to-bechapra-primary-dark'
  },
  {
    label: 'Documentos Procesados',
    value: '156',
    change: '+8%',
    trend: 'up',
    icon: BarChart3,
    color: 'from-bechapra-accent to-bechapra-primary'
  },
  {
    label: 'Reportes Compartidos',
    value: '8',
    change: '+3',
    trend: 'up',
    icon: Share2,
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    label: 'Tiempo Promedio',
    value: '2.4 min',
    change: '-15%',
    trend: 'down',
    icon: Clock,
    color: 'from-amber-500 to-orange-500'
  },
]

// Recent reports mock data
const recentReports = [
  {
    id: 'RPT-2024-001',
    name: 'Análisis Fiscal Q4 2024',
    modules: ['Módulo 03', 'Módulo 04'],
    status: 'completed',
    date: '26 Nov 2024',
    documents: 12
  },
  {
    id: 'RPT-2024-002',
    name: 'Conciliación Bancaria Nov',
    modules: ['Módulo 01'],
    status: 'completed',
    date: '25 Nov 2024',
    documents: 5
  },
  {
    id: 'RPT-2024-003',
    name: 'Nómina Quincenal',
    modules: ['Módulo 05', 'Módulo 06'],
    status: 'processing',
    date: '24 Nov 2024',
    documents: 8
  },
  {
    id: 'RPT-2024-004',
    name: 'DIOT Octubre 2024',
    modules: ['Módulo 09'],
    status: 'pending',
    date: '23 Nov 2024',
    documents: 3
  },
]

// Quick actions
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
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-bechapra-success-light text-green-700">
            <CheckCircle2 size={12} />
            Completado
          </span>
        )
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-bechapra-info-light text-blue-700">
            <Loader2 size={12} className="animate-spin" />
            Procesando
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-bechapra-warning-light text-amber-700">
            <AlertCircle size={12} />
            Pendiente
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-bechapra-text-primary">
            Bienvenido de vuelta, Eduardo
          </h1>
          <p className="text-bechapra-text-secondary mt-1">
            Aquí tienes un resumen de tu actividad reciente
          </p>
        </div>
        <Link
          href="/nuevo-reporte"
          className="btn-primary self-start sm:self-auto"
        >
          <FileUp size={18} />
          Nuevo Reporte
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="card-bechapra p-5 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-12 h-12 rounded-bechapra-md bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-button`}
                >
                  <Icon size={24} />
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-amber-600'
                  }`}
                >
                  {stat.trend === 'up' ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-bechapra-text-primary">{stat.value}</p>
                <p className="text-sm text-bechapra-text-secondary mt-0.5">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon
          return (
            <Link
              key={action.title}
              href={action.href}
              className={`
                group relative overflow-hidden rounded-bechapra-lg p-6
                transition-all duration-300 animate-fade-in-up
                ${action.primary
                  ? 'bg-gradient-to-br from-bechapra-primary to-bechapra-primary-dark text-white shadow-bechapra-lg hover:shadow-bechapra-xl'
                  : 'bg-white border border-bechapra-border-light shadow-card hover:shadow-card-hover hover:border-bechapra-primary/30'
                }
              `}
              style={{ animationDelay: `${(index + 4) * 0.1}s` }}
            >
              {/* Background decoration */}
              {action.primary && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              )}

              <div className="relative">
                <div
                  className={`
                    w-14 h-14 rounded-bechapra-md flex items-center justify-center mb-4
                    transition-transform group-hover:scale-110
                    ${action.primary
                      ? 'bg-white/20'
                      : 'bg-bechapra-light text-bechapra-primary'
                    }
                  `}
                >
                  <Icon size={28} />
                </div>
                <h3
                  className={`text-lg font-semibold mb-1 ${
                    action.primary ? 'text-white' : 'text-bechapra-text-primary'
                  }`}
                >
                  {action.title}
                </h3>
                <p
                  className={`text-sm ${
                    action.primary ? 'text-white/80' : 'text-bechapra-text-secondary'
                  }`}
                >
                  {action.description}
                </p>
                <div
                  className={`
                    mt-4 inline-flex items-center gap-2 text-sm font-medium
                    ${action.primary ? 'text-white' : 'text-bechapra-primary'}
                  `}
                >
                  Ir ahora
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent reports table */}
      <div className="card-bechapra overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
        <div className="p-5 border-b border-bechapra-border-light flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-bechapra-text-primary">Reportes Recientes</h2>
            <p className="text-sm text-bechapra-text-secondary">Últimos análisis generados</p>
          </div>
          <Link
            href="/reportes/historial"
            className="text-sm font-medium text-bechapra-primary hover:underline inline-flex items-center gap-1"
          >
            Ver todos
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="table-bechapra">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre del Reporte</th>
                <th>Módulos</th>
                <th>Documentos</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((report) => (
                <tr key={report.id} className="group">
                  <td>
                    <span className="font-mono text-xs text-bechapra-text-muted">{report.id}</span>
                  </td>
                  <td>
                    <span className="font-medium text-bechapra-text-primary">{report.name}</span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {report.modules.map((mod) => (
                        <span
                          key={mod}
                          className="px-2 py-0.5 text-xs font-medium bg-bechapra-light text-bechapra-primary rounded"
                        >
                          {mod}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className="text-bechapra-text-secondary">{report.documents} archivos</span>
                  </td>
                  <td>{getStatusBadge(report.status)}</td>
                  <td>
                    <span className="text-bechapra-text-secondary">{report.date}</span>
                  </td>
                  <td>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-bechapra hover:bg-bechapra-light text-bechapra-text-muted hover:text-bechapra-primary">
                      <ArrowRight size={16} />
                    </button>
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
