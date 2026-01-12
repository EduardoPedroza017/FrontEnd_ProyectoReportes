'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Building2,
  ChevronLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Trash2,
  AlertTriangle
} from 'lucide-react'

interface Cliente {
  id: string
  nombre: string
  rfc: string | null
  razon_social: string | null
  email_contacto: string | null
  telefono: string | null
  direccion: string | null
  activo: boolean
  created_at: string
  updated_at: string
}

interface Estadisticas {
  cliente_id: string
  cliente_nombre: string
  num_plantillas: number
  periodos: {
    pendientes: number
    parciales: number
    completos: number
    procesados: number
    vencidos: number
  }
}

export default function DetalleClientePage() {
  const params = useParams()
  const router = useRouter()
  const clienteId = params.id as string

  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [eliminando, setEliminando] = useState(false)

  useEffect(() => {
    cargarDatos()
  }, [clienteId])

  const cargarDatos = async () => {
    setLoading(true)
    setError(null)

    try {
      const [clienteRes, statsRes] = await Promise.all([
        fetch(`/api/centro-documentos/clientes/${clienteId}`),
        fetch(`/api/centro-documentos/clientes/${clienteId}/estadisticas`)
      ])

      if (!clienteRes.ok) {
        setError('Cliente no encontrado')
        return
      }

      setCliente(await clienteRes.json())

      if (statsRes.ok) {
        setEstadisticas(await statsRes.json())
      }
    } catch (err) {
      setError('Error cargando los datos')
    } finally {
      setLoading(false)
    }
  }

  const eliminarCliente = async () => {
    setEliminando(true)
    try {
      const res = await fetch(`/api/centro-documentos/clientes/${clienteId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        router.push('/centro-documentos/clientes')
      } else {
        setError('No se pudo eliminar el cliente')
      }
    } catch (err) {
      setError('Error al eliminar')
    } finally {
      setEliminando(false)
      setModalEliminar(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !cliente) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Cliente no encontrado'}</p>
          <Link
            href="/centro-documentos/clientes"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ChevronLeft size={18} />
            Volver a Clientes
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
                href="/centro-documentos/clientes"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{cliente.nombre}</h1>
                  <p className="text-sm text-gray-500">Detalles del Cliente</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/centro-documentos/clientes/${clienteId}/editar`}
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
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre</label>
                  <p className="text-gray-900 font-medium">{cliente.nombre}</p>
                </div>

                {cliente.razon_social && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Razón Social</label>
                    <p className="text-gray-900">{cliente.razon_social}</p>
                  </div>
                )}

                {cliente.rfc && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">RFC</label>
                    <p className="text-gray-900 font-mono">{cliente.rfc}</p>
                  </div>
                )}

                {cliente.email_contacto && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Mail size={16} className="text-gray-400" />
                      <a href={`mailto:${cliente.email_contacto}`} className="hover:text-blue-600">
                        {cliente.email_contacto}
                      </a>
                    </div>
                  </div>
                )}

                {cliente.telefono && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Teléfono</label>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Phone size={16} className="text-gray-400" />
                      <a href={`tel:${cliente.telefono}`} className="hover:text-blue-600">
                        {cliente.telefono}
                      </a>
                    </div>
                  </div>
                )}

                {cliente.direccion && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Dirección</label>
                    <div className="flex items-start gap-2 text-gray-900">
                      <MapPin size={16} className="text-gray-400 mt-0.5" />
                      <p>{cliente.direccion}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">Estado</label>
                  <div className="mt-1">
                    {cliente.activo ? (
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
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="space-y-6">
            {estadisticas && (
              <>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">Plantillas</span>
                      </div>
                      <span className="text-2xl font-bold text-purple-600">
                        {estadisticas.num_plantillas}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Periodos</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Pendientes</span>
                          <span className="font-semibold text-yellow-600">
                            {estadisticas.periodos.pendientes}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Parciales</span>
                          <span className="font-semibold text-blue-600">
                            {estadisticas.periodos.parciales}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Completos</span>
                          <span className="font-semibold text-green-600">
                            {estadisticas.periodos.completos}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Procesados</span>
                          <span className="font-semibold text-purple-600">
                            {estadisticas.periodos.procesados}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Vencidos</span>
                          <span className="font-semibold text-red-600">
                            {estadisticas.periodos.vencidos}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Puedes crear plantillas para este cliente desde la sección de Plantillas.
                  </p>
                </div>
              </>
            )}
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
                <h3 className="text-lg font-semibold text-gray-900">Eliminar Cliente</h3>
                <p className="text-sm text-gray-500">Esta acción no se puede deshacer</p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar al cliente <strong>{cliente.nombre}</strong>?
              {estadisticas && estadisticas.num_plantillas > 0 && (
                <span className="block mt-2 text-amber-600 font-medium">
                  ⚠️ Este cliente tiene {estadisticas.num_plantillas} plantilla(s) asociada(s).
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
                onClick={eliminarCliente}
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