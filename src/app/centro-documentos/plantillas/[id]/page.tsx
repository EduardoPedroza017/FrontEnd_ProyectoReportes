'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FileText,
  ChevronLeft,
  Edit,
  Building2,
  Users,
  Layers,
  Calendar,
  CheckCircle,
  XCircle,
  Trash2,
  AlertTriangle,
  Clock,
  Bell
} from 'lucide-react'

interface Plantilla {
  id: string
  nombre: string
  descripcion: string | null
  cliente_id: string
  cliente_nombre: string
  responsable_reporte_id: string | null
  responsable_reporte_nombre: string | null
  dias_aviso_previo: number
  activa: boolean
  created_at: string
  modulos: Modulo[]
  programaciones: Programacion[]
}

interface Modulo {
  id: string
  modulo: string
  nombre_modulo: string
  responsable_id: string | null
  responsable_nombre: string | null
  obligatorio: boolean
  orden: number
  instrucciones: string | null
}

interface Programacion {
  id: string
  dia_mes: number
  hora_notificacion: string
  descripcion: string | null
}

const MODULOS_NOMBRES: Record<string, string> = {
  'modulo1': 'Estados de Cuenta',
  'modulo3': 'XML - Facturas',
  'modulo4': 'SUA',
  'modulo5': 'ISN',
  'modulo6': 'Nómina',
  'modulo7': 'FONACOT',
  'modulo8': 'Control Fiscal',
  'modulo11': 'Estados Financieros'
}

export default function DetallePlantillaPage() {
  const params = useParams()
  const router = useRouter()
  const plantillaId = params.id as string

  const [plantilla, setPlantilla] = useState<Plantilla | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [eliminando, setEliminando] = useState(false)

  useEffect(() => {
    cargarPlantilla()
  }, [plantillaId])

  const cargarPlantilla = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/centro-documentos/plantillas/${plantillaId}`)

      if (!res.ok) {
        setError('Plantilla no encontrada')
        return
      }

      const data = await res.json()
      
      // Enriquecer módulos con nombres
      const modulosEnriquecidos = data.modulos.map((mod: Modulo) => ({
        ...mod,
        nombre_modulo: MODULOS_NOMBRES[mod.modulo] || mod.modulo
      }))

      setPlantilla({
        ...data,
        modulos: modulosEnriquecidos
      })
    } catch (err) {
      setError('Error cargando la plantilla')
    } finally {
      setLoading(false)
    }
  }

  const eliminarPlantilla = async () => {
    setEliminando(true)
    try {
      const res = await fetch(`/api/centro-documentos/plantillas/${plantillaId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        router.push('/centro-documentos/plantillas')
      } else {
        setError('No se pudo eliminar la plantilla')
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
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !plantilla) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Plantilla no encontrada'}</p>
          <Link
            href="/centro-documentos/plantillas"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <ChevronLeft size={18} />
            Volver a Plantillas
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
                href="/centro-documentos/plantillas"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{plantilla.nombre}</h1>
                  <p className="text-sm text-gray-500">Detalles de la Plantilla</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/centro-documentos/plantillas/${plantillaId}/editar`}
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
            {/* Datos Generales */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información General</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre</label>
                  <p className="text-gray-900 font-medium">{plantilla.nombre}</p>
                </div>

                {plantilla.descripcion && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Descripción</label>
                    <p className="text-gray-700">{plantilla.descripcion}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">Cliente</label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Building2 size={16} className="text-gray-400" />
                    <Link
                      href={`/centro-documentos/clientes/${plantilla.cliente_id}`}
                      className="hover:text-green-600"
                    >
                      {plantilla.cliente_nombre}
                    </Link>
                  </div>
                </div>

                {plantilla.responsable_reporte_nombre && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Responsable del Reporte</label>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Users size={16} className="text-gray-400" />
                      <p>{plantilla.responsable_reporte_nombre}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">Días de Aviso Previo</label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Bell size={16} className="text-gray-400" />
                    <p>{plantilla.dias_aviso_previo} días antes de la fecha límite</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Estado</label>
                  <div className="mt-1">
                    {plantilla.activa ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        <CheckCircle size={14} />
                        Activa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                        <XCircle size={14} />
                        Inactiva
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Módulos Configurados */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-green-600" />
                Módulos Configurados ({plantilla.modulos.length})
              </h2>

              {plantilla.modulos.length === 0 ? (
                <div className="text-center py-8">
                  <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No hay módulos configurados</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {plantilla.modulos
                    .sort((a, b) => a.orden - b.orden)
                    .map((modulo) => (
                      <div
                        key={modulo.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="w-6 h-6 bg-green-100 rounded flex items-center justify-center text-xs font-bold text-green-700">
                                {modulo.orden + 1}
                              </span>
                              <h3 className="font-semibold text-gray-900">{modulo.nombre_modulo}</h3>
                              {modulo.obligatorio && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                                  Obligatorio
                                </span>
                              )}
                            </div>

                            {modulo.responsable_nombre && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                                <Users size={14} />
                                <span>Responsable: {modulo.responsable_nombre}</span>
                              </div>
                            )}

                            {modulo.instrucciones && (
                              <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                                {modulo.instrucciones}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Programaciones */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Programaciones
              </h2>

              {plantilla.programaciones.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Sin programaciones</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {plantilla.programaciones.map((prog) => (
                    <div
                      key={prog.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-bold text-green-700">{prog.dia_mes}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Día {prog.dia_mes} de cada mes
                          </p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock size={12} />
                            <span>{prog.hora_notificacion}</span>
                          </div>
                        </div>
                      </div>
                      {prog.descripcion && (
                        <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                          {prog.descripcion}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-800">
                <strong>Tip:</strong> Las programaciones determinan cuándo se generarán automáticamente los periodos y se enviarán notificaciones.
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
                <h3 className="text-lg font-semibold text-gray-900">Eliminar Plantilla</h3>
                <p className="text-sm text-gray-500">Esta acción no se puede deshacer</p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar la plantilla <strong>{plantilla.nombre}</strong>?
              <span className="block mt-2 text-amber-600 font-medium">
                ⚠️ Esto también eliminará todos los periodos asociados.
              </span>
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
                onClick={eliminarPlantilla}
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