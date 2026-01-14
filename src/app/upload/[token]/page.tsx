'use client'

import { useState, useEffect } from 'react'
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
  File
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

// Configuración de campos por módulo
const MODULOS_CAMPOS: Record<string, {
  fileSlots: Array<{
    id: string
    label: string
    accept: string
    required: boolean
  }>
}> = {
  'modulo1': {
    fileSlots: [
      { id: 'general', label: 'Estados de Cuenta (PDF o Excel)', accept: '.pdf,.xlsx,.xls', required: true }
    ]
  },
  'modulo3': {
    fileSlots: [
      { id: 'excel', label: 'Excel con acumulado de facturas', accept: '.xlsx,.xls', required: true },
      { id: 'emitidos', label: 'ZIP de XMLs Emitidos', accept: '.zip', required: true },
      { id: 'recibidos', label: 'ZIP de XMLs Recibidos', accept: '.zip', required: true }
    ]
  },
  'modulo4': {
    fileSlots: [
      { id: 'cedula', label: 'Cédula de determinación', accept: '.pdf,.xlsx,.xls', required: true },
      { id: 'resumen', label: 'Resumen', accept: '.pdf,.xlsx,.xls', required: false },
      { id: 'sipare', label: 'SIPARE', accept: '.pdf', required: false },
      { id: 'comprobante', label: 'Comprobante de pago', accept: '.pdf', required: false }
    ]
  },
  'modulo5': {
    fileSlots: [
      { id: 'excel', label: 'Excel de ISN', accept: '.xlsx,.xls', required: true },
      { id: 'linea', label: 'Línea de captura', accept: '.pdf', required: true },
      { id: 'comprobante', label: 'Comprobante de pago', accept: '.pdf', required: false }
    ]
  },
  'modulo6': {
    fileSlots: [] // Dinámico - se genera según tipo de nómina
  },
  'modulo7': {
    fileSlots: [
      { id: 'general', label: 'Documentos FONACOT', accept: '.pdf,.xlsx,.xls', required: true }
    ]
  },
  'modulo8': {
    fileSlots: [
      { id: 'excel', label: 'Excel de Pagos Provisionales', accept: '.xlsx,.xls', required: true },
      { id: 'pdfs', label: 'PDFs de Declaraciones (ZIP)', accept: '.zip', required: false }
    ]
  },
  'modulo11': {
    fileSlots: [
      { id: 'excel', label: 'Excel de Estados Financieros', accept: '.xlsx,.xls', required: true }
    ]
  }
}

// Función helper para detectar módulo
const detectarModulo = (nombreModulo: string | undefined): string | null => {
  if (!nombreModulo) return null

  const nombreLower = nombreModulo.toLowerCase()

  // Mapeo de palabras clave a módulos
  if (nombreLower.includes('xml') || nombreLower.includes('factura')) return 'modulo3'
  if (nombreLower.includes('estado') && nombreLower.includes('cuenta')) return 'modulo1'
  if (nombreLower.includes('sua')) return 'modulo4'
  if (nombreLower.includes('isn') || nombreLower.includes('nómina')) return 'modulo5'
  if (nombreLower.includes('nómina') || nombreLower.includes('nomina')) return 'modulo6'
  if (nombreLower.includes('fonacot')) return 'modulo7'
  if (nombreLower.includes('control') && nombreLower.includes('fiscal')) return 'modulo8'
  if (nombreLower.includes('estado') && nombreLower.includes('financiero')) return 'modulo11'

  return null
}

export default function UploadPublicoPage() {
  const params = useParams()
  const token = params.token as string

  const [loading, setLoading] = useState(true)
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null)
  const [archivos, setArchivos] = useState<Record<string, File | null>>({})
  const [tipoNomina, setTipoNomina] = useState<string>('')
  const [subiendo, setSubiendo] = useState(false)
  const [notas, setNotas] = useState('')
  const [resultado, setResultado] = useState<{
    success: boolean
    mensaje: string
  } | null>(null)

  useEffect(() => {
    validarToken()
  }, [token])

  const validarToken = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/centro-documentos/periodos/upload/${token}`
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

  const handleSubmit = async () => {
    const archivosArray = Object.values(archivos).filter(f => f !== null) as File[]

    if (archivosArray.length === 0) {
      alert('Por favor selecciona al menos un archivo')
      return
    }

    // Validación especial para módulo 06
    const moduloClave = detectarModulo(tokenInfo?.modulo_nombre)
    if (moduloClave === 'modulo6') {
      if (!tipoNomina) {
        alert('Por favor selecciona el tipo de nómina')
        return
      }

      const expectedZips = tipoNomina === 'mensual' ? 1 : tipoNomina === 'quincenal' ? 2 : 4
      if (archivosArray.length !== expectedZips) {
        alert(`Para nómina ${tipoNomina} debes subir ${expectedZips} ZIP(s)`)
        return
      }
    }

    setSubiendo(true)
    setResultado(null)

    try {
      const formData = new FormData()

      // Para módulo 06, agregar tipo de nómina
      if (moduloClave === 'modulo6') {
        formData.append('tipo_nomina', tipoNomina)
      }

      archivosArray.forEach(archivo => {
        formData.append('files', archivo)
      })
      if (notas.trim()) {
        formData.append('notas', notas.trim())
      }

      const res = await fetch(
        `/api/centro-documentos/periodos/upload/${token}`,
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
        setArchivos({})
        setNotas('')
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

  // Success State
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

  // Detectar módulo desde tokenInfo
  const moduloClave = detectarModulo(tokenInfo.modulo_nombre)
  const configuracion = moduloClave ? MODULOS_CAMPOS[moduloClave] : null

  // Upload Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
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
                <p className="font-semibold text-gray-900">{tokenInfo.cliente_nombre}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Periodo</p>
                <p className="font-semibold text-gray-900">{tokenInfo.periodo_str}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Layers className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Módulo</p>
                <p className="font-semibold text-gray-900">{tokenInfo.modulo_nombre}</p>
              </div>
            </div>
          </div>

          {tokenInfo.instrucciones && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Instrucciones:</strong> {tokenInfo.instrucciones}
              </p>
            </div>
          )}
        </div>

        {/* Instrucciones especiales para Módulo 06 - Nómina */}
        {moduloClave === 'modulo6' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Estructura de los archivos ZIP
            </h3>
            <p className="text-sm text-blue-800 mb-3">
              Cada ZIP debe contener la siguiente estructura de carpetas:
            </p>
            <div className="bg-white rounded-lg p-4 text-xs font-mono text-gray-700 mb-3">
              <div>📁 PERIODO_X.zip</div>
              <div className="ml-4">├── 📄 Excel_Nomina.xlsx</div>
              <div className="ml-4">├── 📁 CFDIS/</div>
              <div className="ml-8">│   ├── 📄 Factura1.pdf</div>
              <div className="ml-8">│   ├── 📄 Factura2.pdf</div>
              <div className="ml-8">│   └── 📁 XMLs/</div>
              <div className="ml-12">│       ├── 📄 empleado1.xml</div>
              <div className="ml-12">│       └── 📄 empleado2.xml</div>
              <div className="ml-4">├── 📁 Comprobantes/</div>
              <div className="ml-8">│   ├── 📄 Comprobante_Pago.pdf</div>
              <div className="ml-8">│   └── 📄 Comprobante_Nomina.pdf</div>
              <div className="ml-4">└── 📁 Incidencias/</div>
              <div className="ml-8">    └── 📄 Incidencias.xlsx</div>
            </div>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li><strong>Semanal:</strong> Sube 4 ZIPs (uno por semana)</li>
              <li><strong>Quincenal:</strong> Sube 2 ZIPs (uno por quincena)</li>
              <li><strong>Mensual:</strong> Sube 1 ZIP (periodo completo)</li>
            </ul>
          </div>
        )}

        {/* Upload Areas por Módulo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Documentos Requeridos</h3>

          {/* Módulo 06 - Nómina (Interfaz especial) */}
          {moduloClave === 'modulo6' ? (
            <div className="space-y-6">
              {/* Selector de Tipo de Nómina */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">
                  Tipo de Nómina <span className="text-red-600">*</span>
                </label>
                <select
                  value={tipoNomina}
                  onChange={(e) => {
                    setTipoNomina(e.target.value)
                    setArchivos({}) // Limpiar archivos al cambiar tipo
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                >
                  <option value="">Selecciona el tipo de nómina...</option>
                  <option value="mensual">Mensual (1 ZIP)</option>
                  <option value="quincenal">Quincenal (2 ZIPs)</option>
                  <option value="semanal">Semanal (4 ZIPs)</option>
                </select>
              </div>

              {/* Campos de ZIP dinámicos */}
              {tipoNomina && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: tipoNomina === 'mensual' ? 1 : tipoNomina === 'quincenal' ? 2 : 4 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <label className="text-sm font-medium text-gray-900">
                        ZIP Periodo {index + 1} {tipoNomina === 'mensual' ? '' : `(${tipoNomina === 'semanal' ? `Semana ${index + 1}` : `Quincena ${index + 1}`})`}
                        <span className="text-red-600 ml-1">*</span>
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            setArchivos(prev => ({...prev, [`zip_${index}`]: file}))
                          }}
                          className="hidden"
                          id={`zip-input-${index}`}
                          accept=".zip"
                        />
                        <label htmlFor={`zip-input-${index}`} className="cursor-pointer block">
                          {archivos[`zip_${index}`] ? (
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <File className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <span className="text-sm text-gray-900 truncate">
                                  {(archivos[`zip_${index}`] as File)?.name}
                                </span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  setArchivos(prev => ({...prev, [`zip_${index}`]: null}))
                                }}
                                className="p-1 hover:bg-red-100 rounded text-red-600"
                                type="button"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <CloudUpload className="w-8 h-8 text-gray-400 mx-auto" />
                              <p className="text-sm text-gray-600">Click para seleccionar ZIP</p>
                              <p className="text-xs text-gray-400">.zip</p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!tipoNomina && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Primero selecciona el tipo de nómina</p>
                </div>
              )}
            </div>
          ) : configuracion ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {configuracion.fileSlots.map((slot) => {
                // Check if it's a select field
                const isSelect = slot.accept.startsWith('select:')

                if (isSelect) {
                  const options = slot.accept.replace('select:', '').split(',')
                  return (
                    <div key={slot.id} className="space-y-2 md:col-span-3">
                      <label className="text-sm font-medium text-gray-900">
                        {slot.label}
                        {slot.required && <span className="text-red-600 ml-1">*</span>}
                      </label>
                      <select
                        value={(archivos[slot.id] as any) || ''}
                        onChange={(e) => {
                          setArchivos(prev => ({...prev, [slot.id]: e.target.value as any}))
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">Selecciona una opción...</option>
                        {options.map(opt => (
                          <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  )
                }

                return (
                  <div key={slot.id} className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">
                      {slot.label}
                      {slot.required && <span className="text-red-600 ml-1">*</span>}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          setArchivos(prev => ({...prev, [slot.id]: file}))
                        }}
                        className="hidden"
                        id={`file-input-${slot.id}`}
                        accept={slot.accept}
                      />
                      <label htmlFor={`file-input-${slot.id}`} className="cursor-pointer block">
                        {archivos[slot.id] ? (
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <File className="w-5 h-5 text-green-600 flex-shrink-0" />
                              <span className="text-sm text-gray-900 truncate">
                                {(archivos[slot.id] as File)?.name}
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                setArchivos(prev => ({...prev, [slot.id]: null}))
                              }}
                              className="p-1 hover:bg-red-100 rounded text-red-600"
                              type="button"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <CloudUpload className="w-8 h-8 text-gray-400 mx-auto" />
                            <p className="text-sm text-gray-600">Click para seleccionar</p>
                            <p className="text-xs text-gray-400">{slot.accept}</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="border-2 border-dashed rounded-xl p-8 text-center">
              <CloudUpload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <input
                type="file"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  const newArchivos: Record<string, File> = {}
                  files.forEach((file, idx) => {
                    newArchivos[`file_${idx}`] = file
                  })
                  setArchivos(newArchivos)
                }}
                className="hidden"
                id="file-input-generic"
                accept=".pdf,.xlsx,.xls,.xml,.zip"
              />
              <label htmlFor="file-input-generic" className="cursor-pointer">
                <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block">
                  Seleccionar archivos
                </span>
              </label>
              <p className="text-sm text-gray-500 mt-3">
                PDF, Excel, XML, Word, ZIP y otros formatos
              </p>
            </div>
          )}
        </div>

        {/* Notas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Notas (opcional)
          </label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Agrega algún comentario o nota sobre los documentos..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={subiendo || Object.values(archivos).filter(f => f !== null).length === 0}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {subiendo ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Enviando documentos...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Enviar Documentos
            </>
          )}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Los documentos serán asociados automáticamente al periodo correspondiente
        </p>
      </div>
    </div>
  )
}