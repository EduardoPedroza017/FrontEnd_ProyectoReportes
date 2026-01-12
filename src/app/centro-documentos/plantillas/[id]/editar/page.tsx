'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FileText,
  ChevronLeft,
  Save,
  AlertCircle,
  Loader2
} from 'lucide-react'

export default function EditarPlantillaPage() {
  const params = useParams()
  const router = useRouter()
  const plantillaId = params.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

      // TODO: La plantilla se carga exitosamente
      // NOTA: La página completa de edición requiere reutilizar el formulario complejo
      // de nueva/page.tsx. Por ahora, redirigimos con un mensaje.
      
      setError('La edición completa de plantillas está en desarrollo. Por favor, crea una nueva plantilla basada en esta.')
    } catch (err) {
      setError('Error cargando la plantilla')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          <p className="text-gray-600">Cargando plantilla...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center max-w-md w-full">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-amber-600" />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Función en Desarrollo
        </h2>
        
        <p className="text-gray-600 mb-6">
          La edición de plantillas está en desarrollo. Por ahora, puedes:
        </p>

        <div className="space-y-3 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <p className="text-sm font-medium text-gray-900 mb-1">
              ✓ Ver los detalles de la plantilla
            </p>
            <p className="text-xs text-gray-600">
              Revisa la configuración actual, módulos y programaciones
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <p className="text-sm font-medium text-gray-900 mb-1">
              ✓ Crear una nueva plantilla
            </p>
            <p className="text-xs text-gray-600">
              Usa esta plantilla como referencia para crear una nueva
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/centro-documentos/plantillas/${plantillaId}`}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-center"
          >
            Ver Detalles
          </Link>
          <Link
            href="/centro-documentos/plantillas/nueva"
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center"
          >
            Nueva Plantilla
          </Link>
        </div>

        <Link
          href="/centro-documentos/plantillas"
          className="mt-4 text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1"
        >
          <ChevronLeft size={14} />
          Volver a plantillas
        </Link>
      </div>
    </div>
  )
}