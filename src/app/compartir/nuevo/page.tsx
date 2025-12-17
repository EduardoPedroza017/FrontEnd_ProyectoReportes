'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FileText,
  Mail,
  Link2,
  Shield,
  Clock,
  Users,
  ChevronDown,
  Check,
  Copy,
  QrCode,
  ExternalLink,
  Search,
  Calendar,
  Eye,
  Download,
  MessageCircle,
  Lock,
  AlertCircle,
  Loader2
} from 'lucide-react'

interface Reporte {
  id: string
  nombre: string
  created_at: string
  modulos_usados: string[]
  num_archivos: number
}

export default function CompartirNuevoPage() {
  // Estados de reportes
  const [reportes, setReportes] = useState<Reporte[]>([])
  const [loadingReportes, setLoadingReportes] = useState(true)
  
  // Estados del formulario
  const [selectedReport, setSelectedReport] = useState('')
  const [showReportDropdown, setShowReportDropdown] = useState(false)
  const [searchReport, setSearchReport] = useState('')
  const [shareMethod, setShareMethod] = useState<'link' | 'email'>('link')
  
  // Permisos
  const [permissions, setPermissions] = useState<string[]>(['view'])
  
  // Seguridad
  const [requirePassword, setRequirePassword] = useState(false)
  const [password, setPassword] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [accessLimit, setAccessLimit] = useState('')
  const [notifyAccess, setNotifyAccess] = useState(false)
  
  // Destinatarios (para email)
  const [recipients, setRecipients] = useState([{ name: '', email: '' }])
  
  // Estado de generación
  const [generatedLink, setGeneratedLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Cargar reportes al montar
  useEffect(() => {
    cargarReportes()
  }, [])

  const cargarReportes = async () => {
    try {
      setLoadingReportes(true)
      const response = await fetch('http://localhost:8000/api/reportes/lista?limit=100')
      
      if (response.ok) {
        const data = await response.json()
        setReportes(data)
      }
    } catch (error) {
      console.error('Error al cargar reportes:', error)
    } finally {
      setLoadingReportes(false)
    }
  }

  const togglePermission = (perm: string) => {
    setPermissions(prev =>
      prev.includes(perm)
        ? prev.filter(p => p !== perm)
        : [...prev, perm]
    )
  }

  const addRecipient = () => {
    setRecipients([...recipients, { name: '', email: '' }])
  }

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index))
  }

  const updateRecipient = (index: number, field: 'name' | 'email', value: string) => {
    const updated = [...recipients]
    updated[index][field] = value
    setRecipients(updated)
  }

  const generateShareLink = async () => {
    if (!selectedReport) {
      setError('Selecciona un reporte para compartir')
      return
    }

    // Validaciones
    if (shareMethod === 'email') {
      const validRecipients = recipients.filter(r => r.email.trim() !== '')
      if (validRecipients.length === 0) {
        setError('Agrega al menos un destinatario con email válido')
        return
      }
    }

    if (requirePassword && !password) {
      setError('Ingresa una contraseña')
      return
    }

    try {
      setLoading(true)
      setError('')

      const requestData = {
        reporte_id: selectedReport,
        metodo: shareMethod,
        puede_ver: permissions.includes('view'),
        puede_descargar: permissions.includes('download'),
        puede_comentar: permissions.includes('comment'),
        requiere_password: requirePassword,
        password: requirePassword ? password : null,
        fecha_expiracion: expirationDate || null,
        limite_accesos: accessLimit ? parseInt(accessLimit) : null,
        notificar_acceso: notifyAccess,
        ...(shareMethod === 'email' && {
          emails: recipients.map(r => r.email).filter(e => e.trim() !== ''),
          nombres: recipients.map(r => r.name || r.email.split('@')[0]).filter(n => n.trim() !== '')
        })
      }

      console.log('📤 Enviando request:', requestData)

      const response = await fetch('http://localhost:8000/api/reportes/compartir/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Respuesta:', data)
        setGeneratedLink(data.enlace)
        
        if (shareMethod === 'email') {
          alert('✅ Invitaciones enviadas correctamente')
        }
      } else {
        const errorData = await response.json()
        console.error('❌ Error del servidor:', errorData)
        
        // Manejar errores de validación de FastAPI
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            // Error de validación con múltiples campos
            const errores = errorData.detail.map((e: any) => `${e.loc.join('.')}: ${e.msg}`).join(', ')
            setError(`Errores de validación: ${errores}`)
          } else if (typeof errorData.detail === 'string') {
            // Error simple con mensaje de texto
            setError(errorData.detail)
          } else {
            // Error con estructura de objeto
            setError('Error al generar el enlace. Revisa los datos ingresados.')
          }
        } else {
          setError('Error al generar el enlace')
        }
      }
    } catch (error: any) {
      console.error('Error al compartir:', error)
      setError(error.message || 'Error al compartir el reporte')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filteredReports = reportes.filter(r =>
    r.nombre.toLowerCase().includes(searchReport.toLowerCase()) ||
    r.id.toLowerCase().includes(searchReport.toLowerCase())
  )

  const selectedReportData = reportes.find(r => r.id === selectedReport)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-bechapra-text-primary">
          Compartir Reportes
        </h1>
        <p className="text-bechapra-text-secondary mt-1">
          Genera enlaces seguros o envía reportes por correo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Select report */}
          <div className="card-bechapra p-6">
            <h2 className="text-lg font-semibold text-bechapra-text-primary mb-4 flex items-center gap-2">
              <FileText size={20} className="text-bechapra-primary" />
              Seleccionar Reporte
            </h2>

            {loadingReportes ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin text-bechapra-primary" size={32} />
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowReportDropdown(!showReportDropdown)}
                  className="input-bechapra w-full flex items-center justify-between text-left"
                >
                  {selectedReportData ? (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-bechapra-light flex items-center justify-center">
                        <FileText size={16} className="text-bechapra-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-bechapra-text-primary">{selectedReportData.nombre}</p>
                        <p className="text-xs text-bechapra-text-muted">
                          {new Date(selectedReportData.created_at).toLocaleDateString('es-MX')} • {selectedReportData.num_archivos} archivos
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-bechapra-text-muted">Selecciona un reporte para compartir</span>
                  )}
                  <ChevronDown size={18} className={`text-bechapra-text-muted transition-transform ${showReportDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showReportDropdown && (
                  <div className="absolute z-10 w-full mt-2 bg-white rounded-bechapra border border-bechapra-border shadow-bechapra-lg max-h-80 overflow-y-auto">
                    <div className="p-3 border-b border-bechapra-border-light">
                      <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bechapra-text-muted" />
                        <input
                          type="text"
                          value={searchReport}
                          onChange={(e) => setSearchReport(e.target.value)}
                          placeholder="Buscar reporte..."
                          className="w-full pl-10 pr-4 py-2 border border-bechapra-border-light rounded-bechapra focus:outline-none focus:ring-2 focus:ring-bechapra-primary"
                        />
                      </div>
                    </div>

                    {filteredReports.length === 0 ? (
                      <div className="p-8 text-center text-bechapra-text-muted">
                        No se encontraron reportes
                      </div>
                    ) : (
                      filteredReports.map((report) => (
                        <button
                          key={report.id}
                          onClick={() => {
                            setSelectedReport(report.id)
                            setShowReportDropdown(false)
                            setSearchReport('')
                          }}
                          className="w-full p-4 hover:bg-bechapra-light transition-colors flex items-center gap-3 border-b border-bechapra-border-light last:border-b-0"
                        >
                          <div className="w-10 h-10 rounded bg-bechapra-light flex items-center justify-center flex-shrink-0">
                            <FileText size={18} className="text-bechapra-primary" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-medium text-bechapra-text-primary">{report.nombre}</p>
                            <p className="text-sm text-bechapra-text-muted">
                              {new Date(report.created_at).toLocaleDateString('es-MX')} • {report.modulos_usados.length} módulos
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Share method */}
          <div className="card-bechapra p-6">
            <h2 className="text-lg font-semibold text-bechapra-text-primary mb-4">Método de Compartir</h2>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShareMethod('link')}
                className={`p-4 rounded-bechapra border-2 transition-all ${
                  shareMethod === 'link'
                    ? 'border-bechapra-primary bg-bechapra-light'
                    : 'border-bechapra-border hover:border-bechapra-primary/50'
                }`}
              >
                <Link2 size={24} className={shareMethod === 'link' ? 'text-bechapra-primary' : 'text-bechapra-text-muted'} />
                <p className="mt-2 font-medium text-bechapra-text-primary">Enlace</p>
                <p className="text-sm text-bechapra-text-muted mt-1">Comparte mediante URL</p>
              </button>

              <button
                onClick={() => setShareMethod('email')}
                className={`p-4 rounded-bechapra border-2 transition-all ${
                  shareMethod === 'email'
                    ? 'border-bechapra-primary bg-bechapra-light'
                    : 'border-bechapra-border hover:border-bechapra-primary/50'
                }`}
              >
                <Mail size={24} className={shareMethod === 'email' ? 'text-bechapra-primary' : 'text-bechapra-text-muted'} />
                <p className="mt-2 font-medium text-bechapra-text-primary">Email</p>
                <p className="text-sm text-bechapra-text-muted mt-1">Envía invitaciones</p>
              </button>
            </div>
          </div>

          {/* Recipients (email only) */}
          {shareMethod === 'email' && (
            <div className="card-bechapra p-6">
              <h2 className="text-lg font-semibold text-bechapra-text-primary mb-4 flex items-center gap-2">
                <Users size={20} className="text-bechapra-primary" />
                Destinatarios
              </h2>

              <div className="space-y-3">
                {recipients.map((recipient, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={recipient.name}
                      onChange={(e) => updateRecipient(index, 'name', e.target.value)}
                      placeholder="Nombre"
                      className="input-bechapra flex-1"
                    />
                    <input
                      type="email"
                      value={recipient.email}
                      onChange={(e) => updateRecipient(index, 'email', e.target.value)}
                      placeholder="correo@ejemplo.com"
                      className="input-bechapra flex-1"
                    />
                    {recipients.length > 1 && (
                      <button
                        onClick={() => removeRecipient(index)}
                        className="btn-ghost text-bechapra-error"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button onClick={addRecipient} className="btn-secondary mt-3">
                + Agregar destinatario
              </button>
            </div>
          )}

          {/* Permissions */}
          <div className="card-bechapra p-6">
            <h2 className="text-lg font-semibold text-bechapra-text-primary mb-4 flex items-center gap-2">
              <Shield size={20} className="text-bechapra-primary" />
              Permisos
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.includes('view')}
                  onChange={() => togglePermission('view')}
                  className="w-5 h-5 rounded border-bechapra-border text-bechapra-primary focus:ring-2 focus:ring-bechapra-primary"
                />
                <div className="flex items-center gap-2">
                  <Eye size={18} className="text-bechapra-text-muted" />
                  <span className="text-bechapra-text-primary">Ver reporte</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.includes('download')}
                  onChange={() => togglePermission('download')}
                  className="w-5 h-5 rounded border-bechapra-border text-bechapra-primary focus:ring-2 focus:ring-bechapra-primary"
                />
                <div className="flex items-center gap-2">
                  <Download size={18} className="text-bechapra-text-muted" />
                  <span className="text-bechapra-text-primary">Descargar archivos</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.includes('comment')}
                  onChange={() => togglePermission('comment')}
                  className="w-5 h-5 rounded border-bechapra-border text-bechapra-primary focus:ring-2 focus:ring-bechapra-primary"
                />
                <div className="flex items-center gap-2">
                  <MessageCircle size={18} className="text-bechapra-text-muted" />
                  <span className="text-bechapra-text-primary">Agregar comentarios</span>
                </div>
              </label>
            </div>
          </div>

          {/* Security */}
          <div className="card-bechapra p-6">
            <h2 className="text-lg font-semibold text-bechapra-text-primary mb-4 flex items-center gap-2">
              <Lock size={20} className="text-bechapra-primary" />
              Seguridad
            </h2>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requirePassword}
                  onChange={(e) => setRequirePassword(e.target.checked)}
                  className="w-5 h-5 mt-1 rounded border-bechapra-border text-bechapra-primary"
                />
                <div className="flex-1">
                  <p className="text-bechapra-text-primary">Proteger con contraseña</p>
                  <p className="text-sm text-bechapra-text-muted mt-1">Los usuarios necesitarán una contraseña para acceder</p>
                  
                  {requirePassword && (
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingresa una contraseña"
                      className="input-bechapra mt-3"
                    />
                  )}
                </div>
              </label>

              <div>
                <label className="block text-sm font-medium text-bechapra-text-primary mb-2">
                  Fecha de expiración (opcional)
                </label>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="input-bechapra"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-bechapra-text-primary mb-2">
                  Límite de accesos (opcional)
                </label>
                <input
                  type="number"
                  value={accessLimit}
                  onChange={(e) => setAccessLimit(e.target.value)}
                  placeholder="Ej: 10"
                  className="input-bechapra"
                  min="1"
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyAccess}
                  onChange={(e) => setNotifyAccess(e.target.checked)}
                  className="w-5 h-5 mt-1 rounded border-bechapra-border text-bechapra-primary"
                />
                <div>
                  <p className="text-bechapra-text-primary">Notificar accesos</p>
                  <p className="text-sm text-bechapra-text-muted mt-1">Recibe un correo cada vez que alguien acceda al reporte</p>
                </div>
              </label>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-bechapra p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Generate button */}
          <button
            onClick={generateShareLink}
            disabled={loading || !selectedReport}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Generando...
              </>
            ) : shareMethod === 'link' ? (
              <>
                <Link2 size={20} />
                Generar Enlace Compartible
              </>
            ) : (
              <>
                <Mail size={20} />
                Enviar Invitación por Correo
              </>
            )}
          </button>
        </div>

        {/* Preview sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Link preview */}
          {generatedLink && (
            <div className="card-bechapra p-6 animate-scale-in">
              <h3 className="font-semibold text-bechapra-text-primary mb-4 flex items-center gap-2">
                <Check className="text-green-500" size={20} />
                ¡Enlace Generado!
              </h3>

              <div className="space-y-4">
                <div className="p-3 bg-bechapra-light rounded-bechapra">
                  <p className="text-sm text-bechapra-primary font-mono break-all">{generatedLink}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className={`btn-secondary flex-1 ${copied ? 'bg-green-100 border-green-500 text-green-700' : ''}`}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copiado' : 'Copiar'}
                  </button>
                  <a
                    href={generatedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost p-3"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="card-bechapra p-6">
            <h3 className="font-semibold text-bechapra-text-primary mb-4">Resumen</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-bechapra-border-light">
                <span className="text-sm text-bechapra-text-secondary">Reporte</span>
                <span className="text-sm font-medium text-bechapra-text-primary">
                  {selectedReportData?.nombre || '-'}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-bechapra-border-light">
                <span className="text-sm text-bechapra-text-secondary">Método</span>
                <span className="text-sm font-medium text-bechapra-text-primary capitalize">
                  {shareMethod === 'link' ? 'Enlace' : 'Correo'}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-bechapra-border-light">
                <span className="text-sm text-bechapra-text-secondary">Permisos</span>
                <span className="text-sm font-medium text-bechapra-text-primary">
                  {permissions.length} activos
                </span>
              </div>

              {requirePassword && (
                <div className="flex items-center justify-between py-2 border-b border-bechapra-border-light">
                  <span className="text-sm text-bechapra-text-secondary">Contraseña</span>
                  <span className="text-sm font-medium text-green-600">✓ Activada</span>
                </div>
              )}

              {expirationDate && (
                <div className="flex items-center justify-between py-2 border-b border-bechapra-border-light">
                  <span className="text-sm text-bechapra-text-secondary">Expira</span>
                  <span className="text-sm font-medium text-bechapra-text-primary">
                    {new Date(expirationDate).toLocaleDateString('es-MX')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}