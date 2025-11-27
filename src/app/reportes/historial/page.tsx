'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Share2,
  Calendar,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react'

// Mock data para reportes
const mockReports = [
  {
    id: 'RPT-2024-001',
    name: 'Análisis Fiscal Q4 2024',
    description: 'Análisis completo de facturación del cuarto trimestre',
    modules: ['Módulo 03', 'Módulo 04', 'Módulo 08'],
    status: 'completed',
    createdAt: '2024-11-26T10:30:00',
    completedAt: '2024-11-26T10:45:00',
    documents: 12,
    size: '15.4 MB',
    createdBy: 'Eduardo Castillo'
  },
  {
    id: 'RPT-2024-002',
    name: 'Conciliación Bancaria Noviembre',
    description: 'Revisión de estados de cuenta bancarios',
    modules: ['Módulo 01'],
    status: 'completed',
    createdAt: '2024-11-25T14:00:00',
    completedAt: '2024-11-25T14:12:00',
    documents: 5,
    size: '8.2 MB',
    createdBy: 'Eduardo Castillo'
  },
  {
    id: 'RPT-2024-003',
    name: 'Nómina Quincenal Nov-2',
    description: 'Procesamiento de nómina segunda quincena',
    modules: ['Módulo 05', 'Módulo 06'],
    status: 'processing',
    createdAt: '2024-11-24T09:00:00',
    completedAt: null,
    documents: 8,
    size: '6.1 MB',
    createdBy: 'María López'
  },
  {
    id: 'RPT-2024-004',
    name: 'DIOT Octubre 2024',
    description: 'Declaración informativa de operaciones',
    modules: ['Módulo 09'],
    status: 'completed',
    createdAt: '2024-11-23T16:20:00',
    completedAt: '2024-11-23T16:35:00',
    documents: 3,
    size: '2.4 MB',
    createdBy: 'Eduardo Castillo'
  },
  {
    id: 'RPT-2024-005',
    name: 'ISN Octubre 2024',
    description: 'Impuesto sobre nómina del mes',
    modules: ['Módulo 05'],
    status: 'failed',
    createdAt: '2024-11-22T11:00:00',
    completedAt: null,
    documents: 2,
    size: '1.8 MB',
    createdBy: 'Eduardo Castillo'
  },
  {
    id: 'RPT-2024-006',
    name: 'SUA Bimestre Oct-Nov',
    description: 'Cálculo de cuotas IMSS bimestral',
    modules: ['Módulo 04'],
    status: 'completed',
    createdAt: '2024-11-20T08:30:00',
    completedAt: '2024-11-20T08:55:00',
    documents: 4,
    size: '5.2 MB',
    createdBy: 'María López'
  },
]

export default function HistorialReportesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedReports, setSelectedReports] = useState<string[]>([])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-bechapra-success-light text-green-700">
            <CheckCircle2 size={14} />
            Completado
          </span>
        )
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-bechapra-info-light text-blue-700">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Procesando
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-bechapra-error-light text-red-700">
            <AlertCircle size={14} />
            Error
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-bechapra-warning-light text-amber-700">
            <Clock size={14} />
            Pendiente
          </span>
        )
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          report.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const toggleSelectReport = (id: string) => {
    setSelectedReports(prev =>
      prev.includes(id)
        ? prev.filter(r => r !== id)
        : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedReports.length === filteredReports.length) {
      setSelectedReports([])
    } else {
      setSelectedReports(filteredReports.map(r => r.id))
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-bechapra-text-primary">
            Historial de Reportes
          </h1>
          <p className="text-bechapra-text-secondary mt-1">
            Consulta y gestiona todos los reportes generados
          </p>
        </div>

        <Link href="/nuevo-reporte" className="btn-primary self-start">
          <FileText size={18} />
          Nuevo Reporte
        </Link>
      </div>

      {/* Filters bar */}
      <div className="card-bechapra p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-bechapra-text-muted" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre o ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-bechapra pl-11"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-bechapra w-full lg:w-48"
          >
            <option value="all">Todos los estados</option>
            <option value="completed">Completados</option>
            <option value="processing">Procesando</option>
            <option value="failed">Con errores</option>
          </select>

          {/* More filters button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary ${showFilters ? 'bg-bechapra-primary text-white' : ''}`}
          >
            <SlidersHorizontal size={18} />
            Filtros
          </button>
        </div>

        {/* Extended filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-bechapra-border-light">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-bechapra-text-secondary mb-2">
                  Fecha desde
                </label>
                <input type="date" className="input-bechapra" />
              </div>
              <div>
                <label className="block text-sm font-medium text-bechapra-text-secondary mb-2">
                  Fecha hasta
                </label>
                <input type="date" className="input-bechapra" />
              </div>
              <div>
                <label className="block text-sm font-medium text-bechapra-text-secondary mb-2">
                  Módulo
                </label>
                <select className="input-bechapra">
                  <option value="">Todos los módulos</option>
                  <option value="1">Módulo 01: Estados de Cuenta</option>
                  <option value="3">Módulo 03: XML</option>
                  <option value="4">Módulo 04: SUA</option>
                  <option value="5">Módulo 05: ISN</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk actions */}
      {selectedReports.length > 0 && (
        <div className="card-bechapra p-4 bg-bechapra-light border-bechapra-primary animate-slide-up">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-bechapra-primary">
              {selectedReports.length} reporte{selectedReports.length > 1 ? 's' : ''} seleccionado{selectedReports.length > 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-2">
              <button className="btn-ghost text-sm">
                <Download size={16} />
                Descargar
              </button>
              <button className="btn-ghost text-sm">
                <Share2 size={16} />
                Compartir
              </button>
              <button className="btn-ghost text-sm text-bechapra-error hover:bg-bechapra-error-light">
                <Trash2 size={16} />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reports list */}
      <div className="card-bechapra overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-bechapra">
            <thead>
              <tr>
                <th className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedReports.length === filteredReports.length && filteredReports.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-bechapra-border text-bechapra-primary focus:ring-bechapra-primary"
                  />
                </th>
                <th>Reporte</th>
                <th>Módulos</th>
                <th>Documentos</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th className="w-20"></th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="group">
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedReports.includes(report.id)}
                      onChange={() => toggleSelectReport(report.id)}
                      className="w-4 h-4 rounded border-bechapra-border text-bechapra-primary focus:ring-bechapra-primary"
                    />
                  </td>
                  <td>
                    <div>
                      <p className="font-semibold text-bechapra-text-primary">{report.name}</p>
                      <p className="text-xs text-bechapra-text-muted font-mono">{report.id}</p>
                    </div>
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
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-bechapra-text-muted" />
                      <span>{report.documents}</span>
                      <span className="text-bechapra-text-muted text-xs">({report.size})</span>
                    </div>
                  </td>
                  <td>{getStatusBadge(report.status)}</td>
                  <td>
                    <div className="flex items-center gap-2 text-bechapra-text-secondary">
                      <Calendar size={14} />
                      <span className="text-sm">{formatDate(report.createdAt)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-bechapra hover:bg-bechapra-light text-bechapra-text-muted hover:text-bechapra-primary transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 rounded-bechapra hover:bg-bechapra-light text-bechapra-text-muted hover:text-bechapra-primary transition-colors">
                        <Download size={16} />
                      </button>
                      <button className="p-2 rounded-bechapra hover:bg-bechapra-light text-bechapra-text-muted hover:text-bechapra-primary transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-bechapra-border-light flex items-center justify-between">
          <p className="text-sm text-bechapra-text-secondary">
            Mostrando <span className="font-medium">{filteredReports.length}</span> de <span className="font-medium">{mockReports.length}</span> reportes
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-bechapra hover:bg-bechapra-light text-bechapra-text-muted disabled:opacity-50" disabled>
              <ChevronLeft size={18} />
            </button>
            <span className="px-4 py-2 rounded-bechapra bg-bechapra-primary text-white text-sm font-medium">
              1
            </span>
            <button className="px-4 py-2 rounded-bechapra hover:bg-bechapra-light text-bechapra-text-secondary text-sm">
              2
            </button>
            <button className="p-2 rounded-bechapra hover:bg-bechapra-light text-bechapra-text-muted">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {filteredReports.length === 0 && (
        <div className="card-bechapra p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-bechapra-light flex items-center justify-center">
            <FileText className="text-bechapra-text-muted" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-bechapra-text-primary mb-2">
            No se encontraron reportes
          </h3>
          <p className="text-bechapra-text-secondary mb-6">
            {searchQuery
              ? 'Intenta con otros términos de búsqueda'
              : 'Aún no has generado ningún reporte'}
          </p>
          <Link href="/nuevo-reporte" className="btn-primary">
            Crear primer reporte
          </Link>
        </div>
      )}
    </div>
  )
}