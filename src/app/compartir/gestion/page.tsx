'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Share2,
  Link2,
  Users,
  Eye,
  Download,
  Edit,
  Trash2,
  Clock,
  Shield,
  MoreVertical,
  Search,
  Filter,
  Copy,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ExternalLink,
  Mail,
  Calendar,
  Lock,
  Unlock,
  RefreshCw,
  UserX,
  Settings,
  ChevronDown
} from 'lucide-react'

// Mock data
const sharedReports = [
  {
    id: 'SHR-001',
    reportId: 'RPT-2024-001',
    reportName: 'Análisis Fiscal Q4 2024',
    shareType: 'link',
    link: 'https://app.bechapra.com/shared/abc123',
    permissions: ['view', 'download'],
    createdAt: '2024-11-26T10:30:00',
    expiresAt: '2024-12-03T10:30:00',
    accessCount: 12,
    lastAccess: '2024-11-26T15:45:00',
    status: 'active',
    hasPassword: true,
    sharedWith: []
  },
  {
    id: 'SHR-002',
    reportId: 'RPT-2024-002',
    reportName: 'Conciliación Bancaria Nov',
    shareType: 'email',
    link: 'https://app.bechapra.com/shared/def456',
    permissions: ['view'],
    createdAt: '2024-11-25T14:00:00',
    expiresAt: '2024-12-25T14:00:00',
    accessCount: 5,
    lastAccess: '2024-11-26T09:20:00',
    status: 'active',
    hasPassword: false,
    sharedWith: [
      { email: 'contador@empresa.com', name: 'Juan Pérez', accessedAt: '2024-11-26T09:20:00' },
      { email: 'finanzas@empresa.com', name: 'María García', accessedAt: '2024-11-25T16:30:00' },
    ]
  },
  {
    id: 'SHR-003',
    reportId: 'RPT-2024-003',
    reportName: 'Nómina Quincenal Nov-2',
    shareType: 'link',
    link: 'https://app.bechapra.com/shared/ghi789',
    permissions: ['view', 'download', 'edit'],
    createdAt: '2024-11-24T09:00:00',
    expiresAt: '2024-11-25T09:00:00',
    accessCount: 3,
    lastAccess: '2024-11-24T18:00:00',
    status: 'expired',
    hasPassword: false,
    sharedWith: []
  },
  {
    id: 'SHR-004',
    reportId: 'RPT-2024-004',
    reportName: 'DIOT Octubre 2024',
    shareType: 'email',
    link: 'https://app.bechapra.com/shared/jkl012',
    permissions: ['view'],
    createdAt: '2024-11-23T16:20:00',
    expiresAt: null,
    accessCount: 0,
    lastAccess: null,
    status: 'revoked',
    hasPassword: true,
    sharedWith: [
      { email: 'auditor@externo.com', name: 'Carlos Ruiz', accessedAt: null },
    ]
  },
]

export default function GestionCompartidosPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedShare, setSelectedShare] = useState<string | null>(null)
  const [showRevokeModal, setShowRevokeModal] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-bechapra-success-light text-green-700">
            <CheckCircle2 size={14} />
            Activo
          </span>
        )
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-bechapra-warning-light text-amber-700">
            <Clock size={14} />
            Expirado
          </span>
        )
      case 'revoked':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-bechapra-error-light text-red-700">
            <XCircle size={14} />
            Revocado
          </span>
        )
      default:
        return null
    }
  }

  const getPermissionIcons = (permissions: string[]) => {
    return (
      <div className="flex gap-1">
        {permissions.includes('view') && (
          <span className="p-1 rounded bg-bechapra-light" title="Ver">
            <Eye size={14} className="text-bechapra-primary" />
          </span>
        )}
        {permissions.includes('download') && (
          <span className="p-1 rounded bg-bechapra-light" title="Descargar">
            <Download size={14} className="text-bechapra-primary" />
          </span>
        )}
        {permissions.includes('edit') && (
          <span className="p-1 rounded bg-bechapra-light" title="Editar">
            <Edit size={14} className="text-bechapra-primary" />
          </span>
        )}
      </div>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const copyLink = async (link: string, id: string) => {
    await navigator.clipboard.writeText(link)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredShares = sharedReports.filter(share => {
    const matchesSearch = share.reportName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          share.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || share.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Stats
  const activeCount = sharedReports.filter(s => s.status === 'active').length
  const totalAccess = sharedReports.reduce((acc, s) => acc + s.accessCount, 0)
  const expiringSoon = sharedReports.filter(s => {
    if (!s.expiresAt || s.status !== 'active') return false
    const daysUntilExpiry = (new Date(s.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    return daysUntilExpiry <= 3 && daysUntilExpiry > 0
  }).length

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-bechapra-text-primary">
            Gestión de Compartidos
          </h1>
          <p className="text-bechapra-text-secondary mt-1">
            Administra y monitorea los reportes que has compartido
          </p>
        </div>

        <Link href="/compartir/nuevo" className="btn-primary self-start">
          <Share2 size={18} />
          Compartir Nuevo
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-bechapra p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-bechapra-md bg-gradient-to-br from-bechapra-primary to-bechapra-primary-dark flex items-center justify-center text-white">
              <Link2 size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-bechapra-text-primary">{activeCount}</p>
              <p className="text-sm text-bechapra-text-secondary">Enlaces activos</p>
            </div>
          </div>
        </div>

        <div className="card-bechapra p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-bechapra-md bg-gradient-to-br from-bechapra-accent to-bechapra-primary flex items-center justify-center text-white">
              <Eye size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-bechapra-text-primary">{totalAccess}</p>
              <p className="text-sm text-bechapra-text-secondary">Accesos totales</p>
            </div>
          </div>
        </div>

        <div className="card-bechapra p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-bechapra-md bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-bechapra-text-primary">{expiringSoon}</p>
              <p className="text-sm text-bechapra-text-secondary">Por expirar (3 días)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card-bechapra p-4">
        <div className="flex flex-col md:flex-row gap-4">
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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-bechapra w-full md:w-48"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="expired">Expirados</option>
            <option value="revoked">Revocados</option>
          </select>
        </div>
      </div>

      {/* Shared reports list */}
      <div className="space-y-4">
        {filteredShares.map((share) => (
          <div key={share.id} className="card-bechapra overflow-hidden">
            <div className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left side - Report info */}
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-bechapra flex items-center justify-center flex-shrink-0 ${
                    share.shareType === 'link'
                      ? 'bg-bechapra-light text-bechapra-primary'
                      : 'bg-bechapra-info-light text-blue-600'
                  }`}>
                    {share.shareType === 'link' ? <Link2 size={24} /> : <Mail size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-bechapra-text-primary">{share.reportName}</h3>
                      {getStatusBadge(share.status)}
                      {share.hasPassword && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-bechapra-muted text-bechapra-text-secondary">
                          <Lock size={10} />
                          Protegido
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-bechapra-text-muted font-mono mt-0.5">{share.id}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-bechapra-text-secondary">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        Creado: {formatDate(share.createdAt)}
                      </span>
                      {share.expiresAt && (
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          Expira: {formatDate(share.expiresAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side - Stats and actions */}
                <div className="flex items-center gap-6">
                  {/* Stats */}
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-bechapra-text-primary">{share.accessCount}</p>
                      <p className="text-xs text-bechapra-text-muted">Accesos</p>
                    </div>
                    <div className="text-center">
                      {getPermissionIcons(share.permissions)}
                      <p className="text-xs text-bechapra-text-muted mt-1">Permisos</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {share.status === 'active' && (
                      <>
                        <button
                          onClick={() => copyLink(share.link, share.id)}
                          className={`p-2 rounded-bechapra transition-colors ${
                            copiedId === share.id
                              ? 'bg-bechapra-success-light text-green-600'
                              : 'hover:bg-bechapra-light text-bechapra-text-muted hover:text-bechapra-primary'
                          }`}
                          title="Copiar enlace"
                        >
                          {copiedId === share.id ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                        </button>
                        <button
                          className="p-2 rounded-bechapra hover:bg-bechapra-light text-bechapra-text-muted hover:text-bechapra-primary transition-colors"
                          title="Abrir enlace"
                        >
                          <ExternalLink size={18} />
                        </button>
                        <button
                          className="p-2 rounded-bechapra hover:bg-bechapra-light text-bechapra-text-muted hover:text-bechapra-primary transition-colors"
                          title="Extender expiración"
                        >
                          <RefreshCw size={18} />
                        </button>
                      </>
                    )}
                    <button
                      className="p-2 rounded-bechapra hover:bg-bechapra-light text-bechapra-text-muted hover:text-bechapra-primary transition-colors"
                      title="Configuración"
                    >
                      <Settings size={18} />
                    </button>
                    {share.status === 'active' && (
                      <button
                        onClick={() => {
                          setSelectedShare(share.id)
                          setShowRevokeModal(true)
                        }}
                        className="p-2 rounded-bechapra hover:bg-bechapra-error-light text-bechapra-text-muted hover:text-bechapra-error transition-colors"
                        title="Revocar acceso"
                      >
                        <UserX size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Shared with users */}
              {share.sharedWith.length > 0 && (
                <div className="mt-4 pt-4 border-t border-bechapra-border-light">
                  <p className="text-sm font-medium text-bechapra-text-secondary mb-3 flex items-center gap-2">
                    <Users size={16} />
                    Compartido con {share.sharedWith.length} persona{share.sharedWith.length > 1 ? 's' : ''}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {share.sharedWith.map((user, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-2 bg-bechapra-light-3 rounded-bechapra"
                      >
                        <div className="w-8 h-8 rounded-full bg-bechapra-primary/20 flex items-center justify-center text-bechapra-primary text-sm font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-bechapra-text-primary">{user.name}</p>
                          <p className="text-xs text-bechapra-text-muted">{user.email}</p>
                        </div>
                        {user.accessedAt && (
                          <span className="ml-2 text-xs text-bechapra-text-muted">
                            Último acceso: {formatDate(user.accessedAt)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredShares.length === 0 && (
        <div className="card-bechapra p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-bechapra-light flex items-center justify-center">
            <Share2 className="text-bechapra-text-muted" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-bechapra-text-primary mb-2">
            No hay reportes compartidos
          </h3>
          <p className="text-bechapra-text-secondary mb-6">
            {searchQuery
              ? 'No se encontraron resultados para tu búsqueda'
              : 'Aún no has compartido ningún reporte'}
          </p>
          <Link href="/compartir/nuevo" className="btn-primary">
            Compartir primer reporte
          </Link>
        </div>
      )}

      {/* Revoke Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-bechapra-lg shadow-bechapra-xl max-w-md w-full p-6 animate-scale-in">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-bechapra-error-light flex items-center justify-center">
              <UserX className="text-bechapra-error" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-bechapra-text-primary text-center mb-2">
              ¿Revocar acceso?
            </h3>
            <p className="text-bechapra-text-secondary text-center mb-6">
              Esta acción desactivará el enlace y nadie podrá acceder al reporte compartido. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRevokeModal(false)
                  setSelectedShare(null)
                }}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Aquí iría la lógica para revocar
                  setShowRevokeModal(false)
                  setSelectedShare(null)
                }}
                className="flex-1 px-6 py-3 rounded-bechapra font-semibold text-white bg-bechapra-error hover:bg-red-600 transition-colors"
              >
                Sí, revocar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
