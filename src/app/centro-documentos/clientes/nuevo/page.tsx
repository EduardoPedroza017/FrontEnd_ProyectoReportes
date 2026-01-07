'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Building2,
  ChevronLeft,
  Save,
  X,
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
}

interface FormErrors {
  nombre?: string
  rfc?: string
  email_contacto?: string
}

export default function NuevoClientePage() {
  const router = useRouter()
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    rfc: '',
    razon_social: '',
    email_contacto: '',
    telefono: '',
    direccion: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})

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
        direccion: formData.direccion.trim() || null
      }
      
      const res = await fetch('http://localhost:8000/api/centro-documentos/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      })
      
      if (res.ok) {
        router.push('/centro-documentos/clientes')
      } else {
        const errorData = await res.json()
        setError(errorData.detail || 'Error al guardar el cliente')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpiar error del campo
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/centro-documentos/clientes"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Nuevo Cliente</h1>
                <p className="text-sm text-gray-600">Registra una nueva empresa</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error General */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Error al guardar</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Información Básica */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h2>
              
              <div className="space-y-4">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Cliente <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Papas San Rafael"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.nombre ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.nombre && (
                    <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                  )}
                </div>

                {/* RFC y Razón Social */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RFC
                    </label>
                    <input
                      type="text"
                      name="rfc"
                      value={formData.rfc}
                      onChange={handleChange}
                      placeholder="Ej: PSR850101ABC"
                      maxLength={13}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase ${
                        errors.rfc ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.rfc && (
                      <p className="mt-1 text-sm text-red-600">{errors.rfc}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Razón Social
                    </label>
                    <input
                      type="text"
                      name="razon_social"
                      value={formData.razon_social}
                      onChange={handleChange}
                      placeholder="Ej: Papas San Rafael S.A. de C.V."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h2>
              
              <div className="space-y-4">
                {/* Email y Teléfono */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        Email de Contacto
                      </div>
                    </label>
                    <input
                      type="email"
                      name="email_contacto"
                      value={formData.email_contacto}
                      onChange={handleChange}
                      placeholder="contacto@empresa.com"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email_contacto ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.email_contacto && (
                      <p className="mt-1 text-sm text-red-600">{errors.email_contacto}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <div className="flex items-center gap-2">
                        <Phone size={14} />
                        Teléfono
                      </div>
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Dirección */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      Dirección
                    </div>
                  </label>
                  <textarea
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Calle, número, colonia, ciudad, estado, CP"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="p-6 bg-gray-50 flex items-center justify-end gap-3">
              <Link
                href="/centro-documentos/clientes"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
              >
                <X size={18} />
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={guardando}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {guardando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Guardar Cliente
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
