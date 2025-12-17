'use client'

import { useEffect, useState } from 'react'
import {
  Loader2,
  Lock,
  Shield,
  AlertCircle,
  Calendar,
  FileText,
  CheckCircle2
} from 'lucide-react'

// Importar componentes de módulos (rutas relativas)
import Modulo01 from '../../reportes/ver/components/Modulo01'
import Modulo03 from '../../reportes/ver/components/Modulo03'
import Modulo04 from '../../reportes/ver/components/Modulo04'
import Modulo05 from '../../reportes/ver/components/Modulo05'
import Modulo06 from '../../reportes/ver/components/Modulo06'
import Modulo07 from '../../reportes/ver/components/Modulo07'
import Modulo08 from '../../reportes/ver/components/Modulo08'
import Modulo11 from '../../reportes/ver/components/Modulo11'

interface ReporteCompartido {
  reporte: {
    id: string
    nombre: string
    datos_reporte: any
    modulos_usados: string[]
    created_at: string
  }
  permisos: {
    puede_ver: boolean
    puede_descargar: boolean
    puede_comentar: boolean
  }
}

const MODULOS_NOMBRES: Record<string, { nombre: string; descripcion: string; icono: string }> = {
  modulo1: { nombre: 'Estados de Cuenta', descripcion: 'Análisis de movimientos bancarios', icono: '💰' },
  modulo3: { nombre: 'XML - Facturas', descripcion: 'Conciliación de facturas emitidas y recibidas', icono: '📋' },
  modulo4: { nombre: 'SUA', descripcion: 'Sistema Único de Autodeterminación', icono: '🏛️' },
  modulo5: { nombre: 'ISN', descripcion: 'Impuesto Sobre Nómina', icono: '💼' },
  modulo6: { nombre: 'Nómina', descripcion: 'Gestión y análisis de nómina empresarial', icono: '👥' },
  modulo7: { nombre: 'FONACOT', descripcion: 'Análisis de créditos y descuentos', icono: '💳' },
  modulo8: { nombre: 'Control Fiscal', descripcion: 'Declaraciones ISR e IVA', icono: '📊' },
  modulo11: { nombre: 'Estados Financieros', descripcion: 'Balance General y Estado de Resultados', icono: '📈' }
}

export default function ReporteCompartidoPublicoPage({ params }: { params: { token: string } }) {
  const [loading, setLoading] = useState(true)
  const [requierePassword, setRequierePassword] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [reporte, setReporte] = useState<ReporteCompartido | null>(null)
  const [intentandoPassword, setIntentandoPassword] = useState(false)
  const [moduloActivo, setModuloActivo] = useState<string>('')

  const { token } = params

  useEffect(() => {
    cargarReporteCompartido()
  }, [])

  useEffect(() => {
    // Seleccionar primer módulo disponible al cargar
    if (reporte && !moduloActivo && reporte.reporte.modulos_usados.length > 0) {
      setModuloActivo(reporte.reporte.modulos_usados[0])
    }
  }, [reporte, moduloActivo])

  const cargarReporteCompartido = async (passwordIntento?: string) => {
    try {
      setLoading(true)
      setError(null)

      const url = passwordIntento 
        ? `http://localhost:8000/api/reportes/shared/${token}?password=${encodeURIComponent(passwordIntento)}`
        : `http://localhost:8000/api/reportes/shared/${token}`

      console.log('🔍 Accediendo a reporte compartido:', url)

      const response = await fetch(url)
      
      if (!response.ok) {
        const errorData = await response.json()
        
        if (response.status === 403) {
          if (errorData.requiere_password) {
            setRequierePassword(true)
            return
          }
          throw new Error(errorData.detail || 'No tienes permiso para ver este reporte')
        }
        
        if (response.status === 404) {
          throw new Error('Este enlace no existe o ha sido eliminado')
        }
        
        throw new Error(errorData.detail || 'Error al cargar el reporte')
      }

      const data = await response.json()
      
      if (data.requiere_password) {
        setRequierePassword(true)
        return
      }

      console.log('✅ Reporte cargado:', data)
      setReporte(data)
      
    } catch (err: any) {
      console.error('Error al cargar reporte:', err)
      setError(err.message || 'Error desconocido al cargar el reporte')
    } finally {
      setLoading(false)
      setIntentandoPassword(false)
    }
  }

  const verificarPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password) {
      setError('Ingresa la contraseña')
      return
    }

    setIntentandoPassword(true)
    setError(null)
    await cargarReporteCompartido(password)
  }

  const renderModulo = (moduloKey: string) => {
    if (!reporte) return null

    const datos = reporte.reporte.datos_reporte[moduloKey]
    if (!datos) return null

    switch (moduloKey) {
      case 'modulo1':
        return <Modulo01 data={datos} />
      case 'modulo3':
        return <Modulo03 data={datos} />
      case 'modulo4':
        return <Modulo04 data={datos} />
      case 'modulo5':
        return <Modulo05 data={datos} />
      case 'modulo6':
        return <Modulo06 data={datos} />
      case 'modulo7':
        return <Modulo07 data={datos} />
      case 'modulo8':
        return <Modulo08 data={datos} />
      case 'modulo11':
        return <Modulo11 data={datos} />
      default:
        return <p className="text-gray-500">Módulo no soportado</p>
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto text-blue-600 mb-4" size={48} />
          <p className="text-gray-600">Cargando reporte compartido...</p>
        </div>
      </div>
    )
  }

  // Password required
  if (requierePassword && !reporte) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
            <Lock className="text-blue-600" size={32} />
          </div>
          
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Reporte Protegido
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Este reporte está protegido con contraseña
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={verificarPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa la contraseña"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={intentandoPassword}
              />
            </div>

            <button
              type="submit"
              disabled={intentandoPassword}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {intentandoPassword ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Verificando...
                </>
              ) : (
                <>
                  <Shield size={20} />
                  Acceder
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            No se pudo cargar el reporte
          </h1>
          <p className="text-gray-600 mb-6">
            {error}
          </p>

          <div className="text-sm text-gray-500">
            <p>Posibles razones:</p>
            <ul className="mt-2 space-y-1">
              <li>• El enlace ha expirado</li>
              <li>• El enlace ha sido revocado</li>
              <li>• El enlace es incorrecto</li>
              <li>• Se alcanzó el límite de accesos</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  // Success - Show report
  if (!reporte) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
                  <FileText size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {reporte.reporte.nombre}
                  </h1>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>
                        {new Date(reporte.reporte.created_at).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <span>•</span>
                    <span>{reporte.reporte.modulos_usados.length} módulos</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center px-6 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-600 font-medium">Reporte Compartido</p>
              <p className="text-xs text-blue-500 mt-0.5">Vista pública</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Module Selector */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Módulos disponibles:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {reporte.reporte.modulos_usados.map((modulo) => {
                const info = MODULOS_NOMBRES[modulo]
                if (!info) return null
                
                return (
                  <button
                    key={modulo}
                    onClick={() => setModuloActivo(modulo)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      moduloActivo === modulo
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{info.icono}</div>
                    <p className={`text-sm font-medium ${moduloActivo === modulo ? 'text-blue-700' : 'text-gray-900'}`}>
                      {info.nombre}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {info.descripcion}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Module Content */}
          {moduloActivo && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                  {MODULOS_NOMBRES[moduloActivo]?.icono}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {MODULOS_NOMBRES[moduloActivo]?.nombre}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {MODULOS_NOMBRES[moduloActivo]?.descripcion}
                  </p>
                </div>
              </div>

              {/* Render module component */}
              <div>
                {renderModulo(moduloActivo)}
              </div>
            </div>
          )}

          {!moduloActivo && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
                <FileText className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Selecciona un módulo
              </h3>
              <p className="text-gray-600">
                Elige un módulo del selector de arriba para ver su contenido
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-sm text-gray-500">
          <p>Powered by <span className="font-semibold text-gray-700">Bechapra</span></p>
          <p className="mt-1">Sistema de Análisis Contable con IA</p>
        </div>
      </div>
    </div>
  )
}