'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar,
  ChevronLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  FileText,
  Play,
  RefreshCw,
  Copy,
  ExternalLink,
  Mail,
  User,
  Layers,
  Check,
  X
} from 'lucide-react'

interface EstadoModulo {
  id: string
  modulo: string
  nombre_modulo: string
  responsable_nombre: string | null
  responsable_email: string | null
  estado: string
  num_archivos: number
  subido_at: string | null
}

interface TokenUpload {
  id: string
  token: string
  modulo: string
  nombre_modulo: string
  responsable_nombre: string
  usado: boolean
  expira_at: string
  url_upload: string
}

interface Periodo {
  id: string
  plantilla_id: string
  plantilla_nombre: string
  cliente_nombre: string
  periodo_mes: number
  periodo_anio: number
  fecha_limite: string
  estado: string
  periodo_str: string
  reporte_id: string | null
  estados_modulos: EstadoModulo[]
  created_at: string
  procesado_at: string | null
}

const ESTADOS_PERIODO: Record<string, { bg: string; text: string; label: string }> = {
  pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pendiente' },
  parcial: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Parcial' },
  completo: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completo' },
  procesado: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Procesado' },
  vencido: { bg: 'bg-red-100', text: 'text-red-700', label: 'Vencido' }
}

export default function DetallePeriodoPage() {
  const params = useParams()
  const router = useRouter()
  const periodoId = params.id as string

  const [periodo, setPeriodo] = useState<Periodo | null>(null)
  const [tokens, setTokens] = useState<TokenUpload[]>([])
  const [loading, setLoading] = useState(true)
  const [generando, setGenerando] = useState(false)
  const [regenerando, setRegenerando] = useState(false)
  const [copiadoId, setCopiadoId] = useState<string | null>(null)

  useEffect(() => {
    cargarDatos()
  }, [periodoId])

  const cargarDatos = async () => {
    setLoading(true)
    try {
      const [periodoRes, tokensRes] = await Promise.all([
        fetch(`http://localhost:8000/api/centro-documentos/periodos/${periodoId}`),
        fetch(`http://localhost:8000/api/centro-documentos/periodos/${periodoId}/tokens`)
      ])

      if (periodoRes.ok) {
        setPeriodo(await periodoRes.json())
      }
      if (tokensRes.ok) {
        setTokens(await tokensRes.json())
      }
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const copiarEnlace = async (url: string, id: string) => {
    const fullUrl = `${window.location.origin}${url}`
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopiadoId(id)
      setTimeout(() => setCopiadoId(null), 2000)
    } catch (error) {
      console.error('Error copiando:', error)
    }
  }

  const generarReporte = async () => {
    if (!periodo) return

    const confirmar = confirm(
      `¿Generar reporte para ${periodo.plantilla_nombre}?\n\n` +
      `Periodo: ${periodo.periodo_str}\n` +
      `Módulos completados: ${periodo.estados_modulos.filter(m => m.estado === 'subido').length}/${periodo.estados_modulos.length}`
    )
    
    if (!confirmar) return

    setGenerando(true)
    console.log('🚀 Iniciando generación de reporte...')
    
    try {
      const url = `http://localhost:8000/api/centro-documentos/periodos/${periodoId}/generar`
      console.log('📤 POST a:', url)
      
      const res = await fetch(url, { method: 'POST' })
      
      console.log('📥 Respuesta recibida:', res.status)
      
      if (res.ok) {
        const data = await res.json()
        console.log('✅ Datos:', data)
        
        // Recargar datos
        await cargarDatos()
        
        if (data.reporte_id) {
          alert(
            `✅ Reporte generado exitosamente!\n\n` +
            `ID: ${data.reporte_id}\n` +
            `Módulos procesados: ${data.modulos_procesados.join(', ')}\n\n` +
            `El periodo ahora está marcado como "Procesado"`
          )
          
          // Opcional: Redirigir al reporte
          // router.push(`/reportes/ver?id=${data.reporte_id}`)
        }
      } else {
        const error = await res.json()
        console.error('❌ Error del servidor:', error)
        alert(`Error: ${error.detail || 'No se pudo generar el reporte'}`)
      }
    } catch (error) {
      console.error('❌ Error de red:', error)
      alert('Error de conexión. Verifica que el backend esté corriendo.')
    } finally {
      setGenerando(false)
    }
  }

  const regenerarTokens = async () => {
    setRegenerando(true)
    try {
      const res = await fetch(
        `http://localhost:8000/api/centro-documentos/periodos/${periodoId}/tokens/regenerar`,
        { method: 'POST' }
      )

      if (res.ok) {
        cargarDatos()
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setRegenerando(false)
    }
  }

  const diasRestantes = (fechaLimite: string) => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const limite = new Date(fechaLimite)
    return Math.ceil((limite.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!periodo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Periodo no encontrado</h2>
          <Link href="/centro-documentos/periodos" className="text-indigo-600 hover:underline">
            Volver a periodos
          </Link>
        </div>
      </div>
    )
  }

  const estadoConfig = ESTADOS_PERIODO[periodo.estado] || ESTADOS_PERIODO.pendiente
  const dias = diasRestantes(periodo.fecha_limite)
  const porcentaje = Math.round(
    (periodo.estados_modulos.filter(m => m.estado === 'subido').length / 
     periodo.estados_modulos.length) * 100
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/centro-documentos/periodos"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold text-gray-900">{periodo.plantilla_nombre}</h1>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${estadoConfig.bg} ${estadoConfig.text}`}>
                  {estadoConfig.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Building2 size={14} />
                  {periodo.cliente_nombre}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {periodo.periodo_str}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {periodo.estado === 'completo' && (
                <button
                  onClick={generarReporte}
                  disabled={generando}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {generando ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generando...
                    </>
                  ) : (
                    <>
                      <Play size={18} />
                      Generar Reporte
                    </>
                  )}
                </button>
              )}
              <button
                onClick={cargarDatos}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Recargar"
              >
                <RefreshCw size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Fecha Límite</p>
                <p className="font-semibold text-gray-900">
                  {new Date(periodo.fecha_limite).toLocaleDateString('es-MX', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                {periodo.estado !== 'procesado' && (
                  <p className={`text-xs ${
                    dias < 0 ? 'text-red-600' :
                    dias <= 2 ? 'text-orange-600' :
                    'text-gray-500'
                  }`}>
                    {dias < 0 ? `Vencido hace ${Math.abs(dias)} día(s)` :
                     dias === 0 ? 'Vence hoy' :
                     dias === 1 ? 'Vence mañana' :
                     `${dias} días restantes`}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Layers className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Progreso</p>
                <p className="font-semibold text-gray-900">
                  {periodo.estados_modulos.filter(m => m.estado === 'subido').length} de {periodo.estados_modulos.length} módulos
                </p>
                <div className="h-1.5 bg-gray-200 rounded-full mt-1">
                  <div
                    className={`h-full rounded-full ${porcentaje === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${porcentaje}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Reporte</p>
                {periodo.reporte_id ? (
                  <Link
                    href={`/reportes/${periodo.reporte_id}`}
                    className="font-semibold text-purple-600 hover:underline"
                  >
                    Ver Reporte Generado
                  </Link>
                ) : (
                  <p className="text-gray-500">Pendiente de generar</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Módulos */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Estado de Módulos</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {periodo.estados_modulos.map((modulo) => {
              const token = tokens.find(t => t.modulo === modulo.modulo)
              const esSubido = modulo.estado === 'subido'

              return (
                <div key={modulo.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    {/* Estado */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      esSubido ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {esSubido ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900">{modulo.nombre_modulo}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {modulo.responsable_nombre && (
                          <span className="flex items-center gap-1">
                            <User size={14} />
                            {modulo.responsable_nombre}
                          </span>
                        )}
                        {modulo.responsable_email && (
                          <span className="flex items-center gap-1">
                            <Mail size={14} />
                            {modulo.responsable_email}
                          </span>
                        )}
                      </div>
                      {esSubido && modulo.subido_at && (
                        <p className="text-xs text-green-600 mt-1">
                          Subido el {new Date(modulo.subido_at).toLocaleDateString('es-MX')} 
                          {' '}({modulo.num_archivos} archivo{modulo.num_archivos !== 1 ? 's' : ''})
                        </p>
                      )}
                    </div>

                    {/* Acciones */}
                    {!esSubido && token && !token.usado && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copiarEnlace(token.url_upload, token.id)}
                          className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-colors ${
                            copiadoId === token.id
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {copiadoId === token.id ? (
                            <>
                              <Check size={14} />
                              Copiado
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              Copiar enlace
                            </>
                          )}
                        </button>
                        <Link
                          href={token.url_upload}
                          target="_blank"
                          className="p-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                          title="Abrir página de upload"
                        >
                          <ExternalLink size={16} />
                        </Link>
                      </div>
                    )}
                    {!esSubido && (!token || token.usado) && (
                      <span className="text-sm text-gray-400">Sin enlace disponible</span>
                    )}
                    {esSubido && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                        Completado
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tokens / Enlaces */}
        {tokens.length > 0 && periodo.estado !== 'procesado' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Enlaces de Upload</h2>
              <button
                onClick={regenerarTokens}
                disabled={regenerando}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-1"
              >
                {regenerando ? (
                  <>
                    <div className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                    Regenerando...
                  </>
                ) : (
                  <>
                    <RefreshCw size={14} />
                    Regenerar enlaces
                  </>
                )}
              </button>
            </div>
            <div className="p-4 bg-gray-50">
              <p className="text-sm text-gray-600 mb-4">
                Comparte estos enlaces con los responsables para que suban sus documentos.
                Los enlaces son únicos y expiran después de la fecha límite.
              </p>
              <div className="space-y-2">
                {tokens.map(token => (
                  <div
                    key={token.id}
                    className={`p-3 bg-white rounded-lg border flex items-center gap-3 ${
                      token.usado ? 'border-green-200 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{token.nombre_modulo}</p>
                      <p className="text-xs text-gray-500">{token.responsable_nombre}</p>
                    </div>
                    {token.usado ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Usado</span>
                    ) : (
                      <button
                        onClick={() => copiarEnlace(token.url_upload, token.id)}
                        className={`px-3 py-1 rounded text-xs flex items-center gap-1 ${
                          copiadoId === token.id
                            ? 'bg-green-100 text-green-700'
                            : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                        }`}
                      >
                        {copiadoId === token.id ? (
                          <>
                            <Check size={12} />
                            Copiado
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            Copiar
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
