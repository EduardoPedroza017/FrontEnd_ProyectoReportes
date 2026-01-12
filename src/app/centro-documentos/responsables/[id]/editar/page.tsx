'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Users,
  ChevronLeft,
  Save,
  Mail,
  Phone,
  Briefcase,
  AlertCircle,
  Bell
} from 'lucide-react'

interface FormData {
  nombre: string
  email: string
  telefono: string
  puesto: string
  tipo: string
  activo: boolean
  recibe_notificaciones: boolean
}

interface FormErrors {
  nombre?: string
  email?: string
}

export default function EditarResponsablePage() {
  const params = useParams()
  const router = useRouter()
  const responsableId = params.id as string

  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    puesto: '',
    tipo: 'interno',
    activo: true,
    recibe_notificaciones: true
  })

  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    cargarResponsable()
  }, [responsableId])

  const cargarResponsable = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/centro-documentos/responsables/${responsableId}`)

      if (!res.ok) {
        setError('Responsable no encontrado')
        return
      }

      const responsable = await res.json()
      setFormData({
        nombre: responsable.nombre || '',
        email: responsable.email || '',
        telefono: responsable.telefono || '',
        puesto: responsable.puesto || '',
        tipo: responsable.tipo || 'interno',
        activo: responsable.activo,
        recibe_notificaciones: responsable.recibe_notificaciones
      })
    } catch (err) {
      setError('Error cargando el responsable')
    } finally {
      setLoading(false)
    }
  }

  const validarFormulario = (): boolean => {
    const nuevosErrores: FormErrors = {}

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido'
    }

    if (!formData.email.trim()) {
      nuevosErrores.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nuevosErrores.email = 'Email inválido'
    }

    setErrors(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validarFormulario()) return

    setGuardando(true)
    setError(null)

    try {
      const dataToSend = {
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        telefono: formData.telefono.trim() || null,
        puesto: formData.puesto.trim() || null,
        tipo: formData.tipo,
        activo: formData.activo,
        recibe_notificaciones: formData.recibe_notificaciones
      }

      const res = await fetch(`/api/centro-documentos/responsables/${responsableId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      })

      if (res.ok) {
        router.push(`/centro-documentos/responsables/${responsableId}`)
      } else {
        const errorData = await res.json()
        setError(errorData.detail || 'Error al guardar el responsable')
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error && !formData.nombre) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href={`/centro-documentos/responsables/${responsableId}`}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Editar Responsable</h1>
                <p className="text-sm text-gray-500">Actualiza la información del responsable</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error General */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Información Básica */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h2>

            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.nombre ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Juan Pérez García"
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="responsable@ejemplo.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="55 1234 5678"
                  />
                </div>
              </div>

              {/* Puesto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Puesto</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.puesto}
                    onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ej: Contador, Gerente, etc."
                  />
                </div>
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.tipo === 'interno'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="tipo"
                      value="interno"
                      checked={formData.tipo === 'interno'}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-gray-700 font-medium">Interno</span>
                  </label>
                  <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.tipo === 'externo'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="tipo"
                      value="externo"
                      checked={formData.tipo === 'externo'}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-gray-700 font-medium">Externo</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Configuración */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuración</h2>

            <div className="space-y-4">
              {/* Activo */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="mt-1 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <div>
                  <span className="text-gray-700 font-medium">Responsable activo</span>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Los responsables inactivos no recibirán nuevas asignaciones
                  </p>
                </div>
              </label>

              {/* Notificaciones */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.recibe_notificaciones}
                  onChange={(e) => setFormData({ ...formData, recibe_notificaciones: e.target.checked })}
                  className="mt-1 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Bell size={16} className="text-purple-600" />
                    <span className="text-gray-700 font-medium">Recibir notificaciones</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Enviar emails cuando haya documentos pendientes
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center gap-3">
            <Link
              href={`/centro-documentos/responsables/${responsableId}`}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-center transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={guardando}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 transition-colors disabled:bg-purple-400"
            >
              {guardando ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}