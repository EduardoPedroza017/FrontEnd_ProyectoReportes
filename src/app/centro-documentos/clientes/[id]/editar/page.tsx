'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Building2,
  ChevronLeft,
  Save,
  Mail,
  Phone,
  MapPin,
  FileText,
  AlertCircle
} from 'lucide-react'

interface FormData {
  nombre: string
  rfc: string
  razon_social: string
  email_contacto: string
  telefono: string
  direccion: string
  activo: boolean
}

interface FormErrors {
  nombre?: string
  rfc?: string
  email_contacto?: string
}

export default function EditarClientePage() {
  const params = useParams()
  const router = useRouter()
  const clienteId = params.id as string

  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    rfc: '',
    razon_social: '',
    email_contacto: '',
    telefono: '',
    direccion: '',
    activo: true
  })

  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    cargarCliente()
  }, [clienteId])

  const cargarCliente = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/centro-documentos/clientes/${clienteId}`)

      if (!res.ok) {
        setError('Cliente no encontrado')
        return
      }

      const cliente = await res.json()
      setFormData({
        nombre: cliente.nombre || '',
        rfc: cliente.rfc || '',
        razon_social: cliente.razon_social || '',
        email_contacto: cliente.email_contacto || '',
        telefono: cliente.telefono || '',
        direccion: cliente.direccion || '',
        activo: cliente.activo
      })
    } catch (err) {
      setError('Error cargando el cliente')
    } finally {
      setLoading(false)
    }
  }

  const validarFormulario = (): boolean => {
    const nuevosErrores: FormErrors = {}

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido'
    }

    if (formData.rfc && !/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i.test(formData.rfc)) {
      nuevosErrores.rfc = 'RFC inválido'
    }

    if (formData.email_contacto && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_contacto)) {
      nuevosErrores.email_contacto = 'Email inválido'
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
        rfc: formData.rfc.trim().toUpperCase() || null,
        razon_social: formData.razon_social.trim() || null,
        email_contacto: formData.email_contacto.trim() || null,
        telefono: formData.telefono.trim() || null,
        direccion: formData.direccion.trim() || null,
        activo: formData.activo
      }

      const res = await fetch(`/api/centro-documentos/clientes/${clienteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      })

      if (res.ok) {
        router.push(`/centro-documentos/clientes/${clienteId}`)
      } else {
        const errorData = await res.json()
        setError(errorData.detail || 'Error al guardar el cliente')
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
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href={`/centro-documentos/clientes/${clienteId}`}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Editar Cliente</h1>
                <p className="text-sm text-gray-500">Actualiza la información del cliente</p>
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
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.nombre ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Empresa de Ejemplo S.A. de C.V."
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                )}
              </div>

              {/* RFC */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RFC</label>
                <input
                  type="text"
                  value={formData.rfc}
                  onChange={(e) => setFormData({ ...formData, rfc: e.target.value.toUpperCase() })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono ${
                    errors.rfc ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="ABC123456XYZ"
                  maxLength={13}
                />
                {errors.rfc && (
                  <p className="mt-1 text-sm text-red-600">{errors.rfc}</p>
                )}
              </div>

              {/* Razón Social */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Razón Social</label>
                <input
                  type="text"
                  value={formData.razon_social}
                  onChange={(e) => setFormData({ ...formData, razon_social: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nombre legal de la empresa"
                />
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h2>

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email de Contacto</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={formData.email_contacto}
                    onChange={(e) => setFormData({ ...formData, email_contacto: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email_contacto ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="contacto@ejemplo.com"
                  />
                </div>
                {errors.email_contacto && (
                  <p className="mt-1 text-sm text-red-600">{errors.email_contacto}</p>
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="55 1234 5678"
                  />
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MapPin className="w-5 h-5 text-gray-400" />
                  </div>
                  <textarea
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Calle, número, colonia, ciudad..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Estado */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado</h2>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">Cliente activo</span>
            </label>
            <p className="mt-2 text-sm text-gray-500">
              Los clientes inactivos no generarán nuevos periodos automáticamente
            </p>
          </div>

          {/* Botones */}
          <div className="flex items-center gap-3">
            <Link
              href={`/centro-documentos/clientes/${clienteId}`}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-center transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={guardando}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors disabled:bg-blue-400"
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