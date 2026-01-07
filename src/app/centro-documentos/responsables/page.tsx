'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  ChevronLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Bell,
  BellOff,
  UserCheck,
  UserX,
  Save,
  X
} from 'lucide-react'

interface Responsable {
  id: string
  nombre: string
  email: string
  telefono: string | null
  tipo: 'interno' | 'externo'
  activo: boolean
  recibe_notificaciones: boolean
}

interface FormData {
  nombre: string
  email: string
  telefono: string
  tipo: 'interno' | 'externo'
  recibe_notificaciones: boolean
}

export default function ResponsablesPage() {
  const [responsables, setResponsables] = useState<Responsable[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<string>('')
  const [modalNuevo, setModalNuevo] = useState(false)
  const [modalEliminar, setModalEliminar] = useState<Responsable | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [eliminando, setEliminando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    tipo: 'interno',
    recibe_notificaciones: true
  })

  useEffect(() => {
    cargarResponsables()
  }, [filtroTipo])

  const cargarResponsables = async () => {
    setLoading(true)
    try {
      let url = 'http://localhost:8000/api/centro-documentos/responsables?limit=500'
      if (filtroTipo) {
        url += `&tipo=${filtroTipo}`
      }
      
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setResponsables(data)
      }
    } catch (error) {
      console.error('Error cargando responsables:', error)
    } finally {
      setLoading(false)
    }
  }

  const crearResponsable = async () => {
    if (!formData.nombre.trim() || !formData.email.trim()) {
      setError('Nombre y email son requeridos')
      return
    }

    setGuardando(true)
    setError(null)

    try {
      const res = await fetch('http://localhost:8000/api/centro-documentos/responsables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          email: formData.email.trim().toLowerCase(),
          telefono: formData.telefono.trim() || null,
          tipo: formData.tipo,
          recibe_notificaciones: formData.recibe_notificaciones
        })
      })

      if (res.ok) {
        const nuevo = await res.json()
        setResponsables(prev => [...prev, nuevo])
        setModalNuevo(false)
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          tipo: 'interno',
          recibe_notificaciones: true
        })
      } else {
        const errorData = await res.json()
        setError(errorData.detail || 'Error al crear responsable')
      }
    } catch (error) {
      setError('Error de conexión')
    } finally {
      setGuardando(false)
    }
  }

  const eliminarResponsable = async () => {
    if (!modalEliminar) return

    setEliminando(true)
    try {
      const res = await fetch(
        `http://localhost:8000/api/centro-documentos/responsables/${modalEliminar.id}`,
        { method: 'DELETE' }
      )

      if (res.ok) {
        setResponsables(prev => prev.filter(r => r.id !== modalEliminar.id))
        setModalEliminar(null)
      } else {
        const errorData = await res.json()
        alert(errorData.detail || 'Error al eliminar')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setEliminando(false)
    }
  }

  const responsablesFiltrados = responsables.filter(resp => {
    if (!busqueda) return true
    const busquedaLower = busqueda.toLowerCase()
    return (
      resp.nombre.toLowerCase().includes(busquedaLower) ||
      resp.email.toLowerCase().includes(busquedaLower)
    )
  })

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
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Responsables</h1>
                  <p className="text-sm text-gray-600">Personas encargadas de subir documentos</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setModalNuevo(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors"
            >
              <Plus size={18} />
              Nuevo Responsable
            </button>
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
                placeholder="Buscar por nombre o email..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFiltroTipo('')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroTipo === ''
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFiltroTipo('interno')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  filtroTipo === 'interno'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <UserCheck size={14} />
                Internos
              </button>
              <button
                onClick={() => setFiltroTipo('externo')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  filtroTipo === 'externo'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <UserX size={14} />
                Externos
              </button>
            </div>
          </div>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : responsablesFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay responsables</h3>
            <p className="text-gray-500 mb-4">
              {busqueda
                ? 'No se encontraron responsables con esa búsqueda'
                : 'Comienza agregando tu primer responsable'}
            </p>
            {!busqueda && (
              <button
                onClick={() => setModalNuevo(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Plus size={18} />
                Nuevo Responsable
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {responsablesFiltrados.map((resp) => (
              <div
                key={resp.id}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      resp.tipo === 'interno' ? 'bg-blue-100' : 'bg-orange-100'
                    }`}>
                      <span className={`text-lg font-semibold ${
                        resp.tipo === 'interno' ? 'text-blue-600' : 'text-orange-600'
                      }`}>
                        {resp.nombre.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{resp.nombre}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        resp.tipo === 'interno'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {resp.tipo === 'interno' ? 'Interno' : 'Externo'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {resp.recibe_notificaciones ? (
                      <Bell size={14} className="text-green-500" title="Recibe notificaciones" />
                    ) : (
                      <BellOff size={14} className="text-gray-400" title="No recibe notificaciones" />
                    )}
                    {resp.activo ? (
                      <CheckCircle size={14} className="text-green-500" title="Activo" />
                    ) : (
                      <XCircle size={14} className="text-red-500" title="Inactivo" />
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={14} />
                    <span className="truncate">{resp.email}</span>
                  </div>
                  {resp.telefono && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={14} />
                      <span>{resp.telefono}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => setModalEliminar(resp)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Nuevo Responsable */}
      {modalNuevo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Nuevo Responsable</h3>
                <button
                  onClick={() => {
                    setModalNuevo(false)
                    setError(null)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Nombre completo"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="correo@ejemplo.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, tipo: 'interno' }))}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                      formData.tipo === 'interno'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <UserCheck size={18} className="mx-auto mb-1" />
                    <span className="text-sm">Interno</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, tipo: 'externo' }))}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                      formData.tipo === 'externo'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <UserX size={18} className="mx-auto mb-1" />
                    <span className="text-sm">Externo</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.recibe_notificaciones}
                    onChange={(e) => setFormData(prev => ({ ...prev, recibe_notificaciones: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Recibe notificaciones por email</span>
                </label>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setModalNuevo(false)
                  setError(null)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={crearResponsable}
                disabled={guardando}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50"
              >
                {guardando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Guardar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
              ¿Estás seguro de que deseas eliminar a <strong>{modalEliminar.nombre}</strong>?
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
                onClick={eliminarResponsable}
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
