'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Users,
  ChevronLeft,
  Edit,
  Mail,
  Phone,
  Briefcase,
  CheckCircle,
  XCircle,
  Trash2,
  AlertTriangle,
  Bell,
  Layers,
  Building2,
  FileText
} from 'lucide-react'

interface Responsable {
  id: string
  nombre: string
  email: string
  telefono: string | null
  puesto: string | null
  tipo: string
  activo: boolean
  recibe_notificaciones: boolean
  created_at: string
  updated_at: string
}

interface ModuloAsignado {
  plantilla_id: string
  plantilla_nombre: string
  cliente_nombre: string
  modulo: string
  modulo_nombre: string
  obligatorio: boolean
}

interface Notificacion {
  id: string
  titulo: string
  mensaje: string
  leida: boolean
  created_at: string
}

export default function DetalleResponsablePage() {
  const params = useParams()
  const router = useRouter()
  const responsableId = params.id as string

  const [responsable, setResponsable] = useState<Responsable | null>(null)
  const [modulos, setModulos] = useState<ModuloAsignado[]>([])
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [eliminando, setEliminando] = useState(false)

  useEffect(() => {
    cargarDatos()
  }, [responsableId])

  const cargarDatos = async () => {
    setLoading(true)
    setError(null)

    try {
      const [responsableRes, modulosRes, notificacionesRes] = await Promise.all([
        fetch(`/api/centro-documentos/responsables/${responsableId}`),
        fetch(`/api/centro-documentos/responsables/${responsableId}/modulos-asignados`),
        fetch(`/api/centro-documentos/responsables/${responsableId}/notificaciones?limit=5`)
      ])

      if (!responsableRes.ok) {
        setError('Responsable no encontrado')
        return
      }

      setResponsable(await responsableRes.json())

      if (modulosRes.ok) {
        setModulos(await modulosRes.json())
      }

      if (notificacionesRes.ok) {
        setNotificaciones(await notificacionesRes.json())
      }
    } catch (err) {
      setError('Error cargando los datos')
    } finally {
      setLoading(false)
    }
  }

  const eliminarResponsable = async () => {
    setEliminando(true)
    try {
      const res = await fetch(`/api/centro-documentos/responsables/${responsableId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        router.push('/centro-documentos/responsables')
      } else {
        setError('No se pudo eliminar el responsable')
      }
    } catch (err) {
      setError('Error al eliminar')
    } finally {
      setEliminando(false)
      setModalEliminar(false)
    }
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !responsable) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Responsable no encontrado'}</p>
          <Link
            href="/centro-documentos/responsables"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <ChevronLeft size={18} />
            Volver a Responsables
          </Link>
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
              <Link
                href="/centro-documentos/responsables"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{responsable.nombre}</h1>
                  <p className="text-sm text-gray-500">Detalles del Responsable</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/centro-documentos/responsables/${responsableId}/editar`}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center gap-2"
              >
                <Edit size={18} />
                Editar
              </Link>
              <button
                onClick={() => setModalEliminar(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 size={18} />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Datos del Responsable */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Responsable</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre</label>
                  <p className="text-gray-900 font-medium">{responsable.nombre}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Mail size={16} className="text-gray-400" />
                    <a href={`mailto:${responsable.email}`} className="hover:text-purple-600">
                      {responsable.email}
                    </a>
                  </div>
                </div>

                {responsable.telefono && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Teléfono</label>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Phone size={16} className="text-gray-400" />
                      <a href={`tel:${responsable.telefono}`} className="hover:text-purple-600">
                        {responsable.telefono}
                      </a>
                    </div>
                  </div>
                )}

                {responsable.puesto && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Puesto</label>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Briefcase size={16} className="text-gray-400" />
                      <p>{responsable.puesto}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                      responsable.tipo === 'interno'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {responsable.tipo === 'interno' ? 'Interno' : 'Externo'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Estado</label>
                    <div className="mt-1">
                      {responsable.activo ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          <CheckCircle size={14} />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                          <XCircle size={14} />
                          Inactivo
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Notificaciones</label>
                    <div className="mt-1">
                      {responsable.recibe_notificaciones ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          <Bell size={14} />
                          Activadas
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          <Bell size={14} />
                          Desactivadas
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Módulos Asignados */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                Módulos Asignados ({modulos.length})
              </h2>

              {modulos.length === 0 ? (
                <div className="text-center py-8">
                  <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No tiene módulos asignados</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {modulos.map((modulo, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <FileText size={16} className="text-purple-600" />
                            <h3 className="font-semibold text-gray-900">{modulo.modulo_nombre}</h3>
                            {modulo.obligatorio && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                                Obligatorio
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Building2 size={14} />
                            <span>{modulo.cliente_nombre}</span>
                            <span className="text-gray-400">•</span>
                            <span>{modulo.plantilla_nombre}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notificaciones Recientes */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-purple-600" />
                Notificaciones Recientes
              </h2>

              {notificaciones.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Sin notificaciones</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notificaciones.map((notif) => (
                    <div
                      key={notif.id}
                      className={`border rounded-lg p-3 ${
                        notif.leida
                          ? 'border-gray-200 bg-gray-50'
                          : 'border-purple-200 bg-purple-50'
                      }`}
                    >
                      <h4 className="text-sm font-medium text-gray-900 mb-1">{notif.titulo}</h4>
                      <p className="text-xs text-gray-600 mb-2">{notif.mensaje}</p>
                      <p className="text-xs text-gray-400">
                        {formatearFecha(notif.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <p className="text-sm text-purple-800">
                <strong>Tip:</strong> Los responsables reciben notificaciones automáticas cuando hay documentos pendientes de subir.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Eliminar */}
      {modalEliminar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Eliminar Responsable</h3>
                <p className="text-sm text-gray-500">Esta acción no se puede deshacer</p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar al responsable <strong>{responsable.nombre}</strong>?
              {modulos.length > 0 && (
                <span className="block mt-2 text-amber-600 font-medium">
                  ⚠️ Este responsable tiene {modulos.length} módulo(s) asignado(s).
                </span>
              )}
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setModalEliminar(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={eliminando}
              >
                Cancelar
              </button>
              <button
                onClick={eliminarResponsable}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                disabled={eliminando}
              >
                {eliminando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}