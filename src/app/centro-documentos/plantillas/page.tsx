'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Building2,
  Calendar,
  Users,
  Layers
} from 'lucide-react'

interface Plantilla {
  id: string
  nombre: string
  cliente_id: string
  cliente_nombre: string
  activa: boolean
  num_modulos: number
  proxima_fecha: string | null
}

export default function PlantillasPage() {
  const [plantillas, setPlantillas] = useState<Plantilla[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroActiva, setFiltroActiva] = useState<boolean | null>(null)
  const [modalEliminar, setModalEliminar] = useState<Plantilla | null>(null)
  const [eliminando, setEliminando] = useState(false)

  useEffect(() => {
    cargarPlantillas()
  }, [filtroActiva])

  const cargarPlantillas = async () => {
    setLoading(true)
    try {
      let url = 'http://localhost:8000/api/centro-documentos/plantillas?limit=500'
      if (filtroActiva !== null) {
        url += `&activa=${filtroActiva}`
      }

      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setPlantillas(data)
      }
    } catch (error) {
      console.error('Error cargando plantillas:', error)
    } finally {
      setLoading(false)
    }
  }

  const eliminarPlantilla = async () => {
    if (!modalEliminar) return

    setEliminando(true)
    try {
      const res = await fetch(
        `http://localhost:8000/api/centro-documentos/plantillas/${modalEliminar.id}`,
        { method: 'DELETE' }
      )

      if (res.ok) {
        setPlantillas(prev => prev.filter(p => p.id !== modalEliminar.id))
        setModalEliminar(null)
      }
    } catch (error) {
      console.error('Error eliminando plantilla:', error)
    } finally {
      setEliminando(false)
    }
  }

  const plantillasFiltradas = plantillas.filter(plantilla => {
    if (!busqueda) return true
    const busquedaLower = busqueda.toLowerCase()
    return (
      plantilla.nombre.toLowerCase().includes(busquedaLower) ||
      plantilla.cliente_nombre.toLowerCase().includes(busquedaLower)
    )
  })

  const formatearFecha = (fechaStr: string | null) => {
    if (!fechaStr) return null
    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
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
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Plantillas de Reporte</h1>
                  <p className="text-sm text-gray-600">Configura reportes recurrentes</p>
                </div>
              </div>
            </div>
            <Link
              href="/centro-documentos/plantillas/nueva"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
            >
              <Plus size={18} />
              Nueva Plantilla
            </Link>
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
                placeholder="Buscar por nombre o cliente..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFiltroActiva(null)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroActiva === null
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFiltroActiva(true)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroActiva === true
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Activas
              </button>
              <button
                onClick={() => setFiltroActiva(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroActiva === false
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Inactivas
              </button>
            </div>
          </div>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : plantillasFiltradas.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay plantillas</h3>
            <p className="text-gray-500 mb-4">
              {busqueda
                ? 'No se encontraron plantillas con esa búsqueda'
                : 'Comienza creando tu primera plantilla de reporte'}
            </p>
            {!busqueda && (
              <Link
                href="/centro-documentos/plantillas/nueva"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus size={18} />
                Nueva Plantilla
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plantillasFiltradas.map((plantilla) => (
              <div
                key={plantilla.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{plantilla.nombre}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Building2 size={14} />
                        <span>{plantilla.cliente_nombre}</span>
                      </div>
                    </div>
                    {plantilla.activa ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                        <CheckCircle size={12} />
                        Activa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
                        <XCircle size={12} />
                        Inactiva
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Layers size={14} />
                      <span>{plantilla.num_modulos} módulos</span>
                    </div>
                    {plantilla.proxima_fecha && (
                      <div className="flex items-center gap-1 text-blue-600">
                        <Calendar size={14} />
                        <span>Próxima: {formatearFecha(plantilla.proxima_fecha)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
                  <Link
                    href={`/centro-documentos/plantillas/${plantilla.id}`}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Ver detalles"
                  >
                    <Eye size={18} />
                  </Link>
                  <Link
                    href={`/centro-documentos/plantillas/${plantilla.id}/editar`}
                    className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => setModalEliminar(plantilla)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
              ¿Estás seguro de que deseas eliminar la plantilla <strong>{modalEliminar.nombre}</strong>?
              <span className="block mt-2 text-sm text-red-600">
                Se eliminarán todos los periodos y documentos asociados.
              </span>
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setModalEliminar(null)}
                disabled={eliminando}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={eliminarPlantilla}
                disabled={eliminando}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
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
