'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  Building2,
  Calendar,
  Layers,
  CloudUpload,
  File,
  Trash2,
  AlertTriangle,
  Clock
} from 'lucide-react'

interface TokenInfo {
  valido: boolean
  mensaje: string
  cliente_nombre?: string
  periodo_str?: string
  modulo_nombre?: string
  instrucciones?: string
  ya_subido?: boolean
}

interface ArchivoSubir {
  file: File
  id: string
  progreso: number
  error?: string
}

export default function UploadPublicoPage() {
  const params = useParams()
  const token = params.token as string

  const [loading, setLoading] = useState(true)
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null)
  const [archivos, setArchivos] = useState<ArchivoSubir[]>([])
  const [subiendo, setSubiendo] = useState(false)
  const [notas, setNotas] = useState('')
  const [resultado, setResultado] = useState<{
    success: boolean
    mensaje: string
  } | null>(null)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    validarToken()
  }, [token])

  const validarToken = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `http://localhost:8000/api/centro-documentos/periodos/upload/${token}`
      )
      const data = await res.json()
      setTokenInfo(data)
    } catch (error) {
      setTokenInfo({
        valido: false,
        mensaje: 'Error de conexión. Intenta de nuevo más tarde.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    agregarArchivos(files)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      agregarArchivos(files)
    }
  }

  const agregarArchivos = (files: File[]) => {
    const nuevosArchivos: ArchivoSubir[] = files.map(file => ({
      file,
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      progreso: 0
    }))
    setArchivos(prev => [...prev, ...nuevosArchivos])
  }

  const eliminarArchivo = (id: string) => {
    setArchivos(prev => prev.filter(a => a.id !== id))
  }

  const handleSubmit = async () => {
    if (archivos.length === 0) return

    setSubiendo(true)
    setResultado(null)

    try {
      const formData = new FormData()
      archivos.forEach(archivo => {
        formData.append('files', archivo.file)
      })
      if (notas.trim()) {
        formData.append('notas', notas.trim())
      }

      const res = await fetch(
        `http://localhost:8000/api/centro-documentos/periodos/upload/${token}`,
        {
          method: 'POST',
          body: formData
        }
      )

      const data = await res.json()

      if (res.ok) {
        setResultado({
          success: true,
          mensaje: data.mensaje || 'Archivos subidos exitosamente'
        })
        setArchivos([])
        setNotas('')
        // Revalidar token (ya estará usado)
        validarToken()
      } else {
        setResultado({
          success: false,
          mensaje: data.detail || 'Error al subir archivos'
        })
      }
    } catch (error) {
      setResultado({
        success: false,
        mensaje: 'Error de conexión'
      })
    } finally {
      setSubiendo(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando enlace...</p>
        </div>
      </div>
    )
  }

  // Token Inválido
  if (!tokenInfo?.valido) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {tokenInfo?.ya_subido ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <AlertCircle className="w-8 h-8 text-red-600" />
            )}
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            {tokenInfo?.ya_subido ? 'Documentos ya enviados' : 'Enlace no válido'}
          </h1>
          <p className="text-gray-600">
            {tokenInfo?.mensaje}
          </p>
          {tokenInfo?.ya_subido && (
            <p className="mt-4 text-sm text-gray-500">
              Si necesitas subir documentos adicionales, contacta al administrador.
            </p>
          )}
        </div>
      </div>
    )
  }

  // Success State (después de subir)
  if (resultado?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Documentos enviados!
          </h1>
          <p className="text-gray-600 mb-4">
            {resultado.mensaje}
          </p>
          <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
            <p><strong>Cliente:</strong> {tokenInfo.cliente_nombre}</p>
            <p><strong>Periodo:</strong> {tokenInfo.periodo_str}</p>
            <p><strong>Módulo:</strong> {tokenInfo.modulo_nombre}</p>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            Ya puedes cerrar esta ventana.
          </p>
        </div>
      </div>
    )
  }

  // Upload Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Subir Documentos</h1>
          <p className="text-gray-600">Centro de Concentrado de Documentos</p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Cliente</p>
                <p className="font-medium text-gray-900">{tokenInfo.cliente_nombre}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Periodo</p>
                <p className="font-medium text-gray-900">{tokenInfo.periodo_str}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Layers className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Módulo</p>
                <p className="font-medium text-gray-900">{tokenInfo.modulo_nombre}</p>
              </div>
            </div>
          </div>

          {tokenInfo.instrucciones && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Instrucciones:</strong> {tokenInfo.instrucciones}
              </p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {resultado && !resultado.success && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{resultado.mensaje}</p>
          </div>
        )}

        {/* Upload Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CloudUpload className={`w-8 h-8 ${dragActive ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              <p className="text-gray-700 mb-2">
                <strong>Arrastra tus archivos aquí</strong>
              </p>
              <p className="text-sm text-gray-500 mb-4">o</p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                <FileText size={18} />
                Seleccionar archivos
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-400 mt-4">
                PDF, Excel, XML, Word, ZIP y otros formatos
              </p>
            </div>

            {/* Lista de Archivos */}
            {archivos.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Archivos seleccionados ({archivos.length})
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {archivos.map(archivo => (
                    <div
                      key={archivo.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <File className="w-5 h-5 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {archivo.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(archivo.file.size)}
                        </p>
                      </div>
                      <button
                        onClick={() => eliminarArchivo(archivo.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notas */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas (opcional)
              </label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Agrega algún comentario o nota sobre los documentos..."
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              disabled={archivos.length === 0 || subiendo}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {subiendo ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Subiendo archivos...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Enviar Documentos
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-500 mt-3">
              Los documentos serán asociados automáticamente al periodo correspondiente
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-8">
          Bechapra - Centro de Concentrado de Documentos
        </p>
      </div>
    </div>
  )
}
