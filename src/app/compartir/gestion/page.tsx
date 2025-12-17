'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Share2,
  Link2,
  Eye,
  Search,
  Filter,
  MoreVertical,
  UserX,
  ExternalLink,
  Copy,
  Loader2,
  Calendar,
  Users,
  Lock,
  Check,
  AlertCircle
} from 'lucide-react'

interface Compartido {
  id: string
  reporte_id: string
  reporte_nombre: string
  enlace: string
  permisos: {
    puede_ver: boolean
    puede_descargar: boolean
    puede_comentar: boolean
  }
  tiene_password: boolean
  fecha_expiracion: string | null
  limite_accesos: number | null
  accesos_realizados: number
  estado: string
  created_at: string
  destinatarios: Array<{
    id: string
    nombre: string
    email: string
    num_accesos: number
    ultimo_acceso: string | null
  }>
}

export default function GestionCompartidosPage() {
  const [compartidos, setCompartidos] = useState<Compartido[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showRevokeModal, setShowRevokeModal] = useState(false)
  const [selectedShare, setSelectedShare] = useState<Compartido | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    cargarCompartidos()
  }, [statusFilter])

  const cargarCompartidos = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== 'all') {
        params.append('estado', statusFilter)
      }
      
      const response = await fetch(`http://localhost:8000/api/reportes/compartir/lista?${params}`)
      
      if (response.ok) {
        const data = await response.json()
        setCompartidos(data.compartidos)
      }
    } catch (error) {
      console.error('Error al cargar compartidos:', error)
    } finally {
      setLoading(false)
    }
  }

  const revocarAcceso = async () => {
    if (!selectedShare) return

    try {
      const response = await fetch(`http://localhost:8000/api/reportes/compartir/${selectedShare.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('✅ Acceso revocado correctamente')
        setShowRevokeModal(false)
        setSelectedShare(null)
        cargarCompartidos()
      } else {
        alert('❌ Error al revocar acceso')
      }
    } catch (error) {
      console.error('Error al revocar:', error)
      alert('❌ Error al revocar acceso')
    }
  }

  const copyToClipboard = async (enlace: string, id: string) => {
    await navigator.clipboard.writeText(enlace)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const filteredShares = compartidos.filter(share =>
    share.reporte_nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    share.enlace.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeCount = compartidos.filter(s => s.estado === 'activo').length
  const totalAccess = compartidos.reduce((sum, s) => sum + s.accesos_realizados, 0)
  const expiringSoon = compartidos.filter(s => {
    if (!s.fecha_expiracion) return false
    const daysUntilExpiry = Math.ceil((new Date(s.fecha_expiracion).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0
  }).length

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'activo':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
            Activo
          </span>
        )
      case 'revocado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
            Revocado
          </span>
        )
      case 'expirado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
            Expirado
          </span>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto text-bechapra-primary mb-4" size={48} />
          <p className="text-bechapra-text-secondary">Cargando compartidos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
              <p className="text-sm text-bechapra-text-secondary">Por expirar</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card-bechapra p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bechapra-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre de reporte o enlace..."
              className="input-bechapra pl-10 w-full"
            />
          </div>

          {/* Status filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-bechapra w-full"
            >
              <option value="all">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="revocado">Revocados</option>
              <option value="expirado">Expirados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shares list */}
      <div className="space-y-4">
        {filteredShares.map((share) => (
          <div
            key={share.id}
            className="card-bechapra p-6 hover:shadow-bechapra-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-bechapra-text-primary">
                    {share.reporte_nombre}
                  </h3>
                  {getStatusBadge(share.estado)}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-bechapra-text-muted">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>Creado: {formatDate(share.created_at)}</span>
                  </div>
                  {share.fecha_expiracion && (
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>Expira: {formatDate(share.fecha_expiracion)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Eye size={14} />
                    <span>{share.accesos_realizados} {share.accesos_realizados === 1 ? 'acceso' : 'accesos'}</span>
                  </div>
                  {share.tiene_password && (
                    <div className="flex items-center gap-1.5">
                      <Lock size={14} />
                      <span>Protegido</span>
                    </div>
                  )}
                </div>
              </div>

              {share.estado === 'activo' && (
                <button
                  onClick={() => {
                    setSelectedShare(share)
                    setShowRevokeModal(true)
                  }}
                  className="btn-ghost text-bechapra-error hover:bg-red-50"
                >
                  <UserX size={18} />
                  Revocar
                </button>
              )}
            </div>

            {/* Link */}
            <div className="mb-4 p-3 bg-bechapra-light rounded-bechapra flex items-center gap-2">
              <Link2 size={16} className="text-bechapra-primary flex-shrink-0" />
              <code className="text-sm text-bechapra-primary flex-1 truncate">{share.enlace}</code>
              <button
                onClick={() => copyToClipboard(share.enlace, share.id)}
                className="btn-ghost p-2"
              >
                {copied === share.id ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
              </button>
              <a
                href={share.enlace}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost p-2"
              >
                <ExternalLink size={16} />
              </a>
            </div>

            {/* Permissions */}
            <div className="flex flex-wrap gap-2 mb-4">
              {share.permisos.puede_ver && (
                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Ver
                </span>
              )}
              {share.permisos.puede_descargar && (
                <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Descargar
                </span>
              )}
              {share.permisos.puede_comentar && (
                <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  Comentar
                </span>
              )}
            </div>

            {/* Recipients */}
            {share.destinatarios.length > 0 && (
              <div>
                <p className="text-sm font-medium text-bechapra-text-primary mb-2">
                  Compartido con {share.destinatarios.length} {share.destinatarios.length === 1 ? 'persona' : 'personas'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {share.destinatarios.map((user, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-2 bg-bechapra-light-3 rounded-bechapra"
                    >
                      <div className="w-8 h-8 rounded-full bg-bechapra-primary/20 flex items-center justify-center text-bechapra-primary text-sm font-semibold">
                        {user.nombre.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-bechapra-text-primary">{user.nombre}</p>
                        <p className="text-xs text-bechapra-text-muted">{user.email}</p>
                      </div>
                      {user.ultimo_acceso && (
                        <span className="ml-2 text-xs text-bechapra-text-muted">
                          Último acceso: {formatDate(user.ultimo_acceso)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
      {showRevokeModal && selectedShare && (
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

            <div className="bg-bechapra-light rounded-bechapra p-4 mb-6">
              <p className="text-sm font-medium text-bechapra-text-primary mb-1">
                {selectedShare.reporte_nombre}
              </p>
              <p className="text-xs text-bechapra-text-muted">
                {selectedShare.accesos_realizados} {selectedShare.accesos_realizados === 1 ? 'acceso realizado' : 'accesos realizados'}
              </p>
            </div>

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
                onClick={revocarAcceso}
                className="btn-primary flex-1 bg-bechapra-error hover:bg-red-700"
              >
                Revocar Acceso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}