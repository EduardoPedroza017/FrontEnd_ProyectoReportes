'use client'

import { useState } from 'react'
import {
  Share2,
  Link2,
  Mail,
  Copy,
  Check,
  Calendar,
  Shield,
  Eye,
  Download,
  Edit,
  Clock,
  Users,
  Search,
  ChevronDown,
  FileText,
  ExternalLink,
  QrCode,
  Settings2
} from 'lucide-react'

// Mock data
const availableReports = [
  { id: 'RPT-2024-001', name: 'Análisis Fiscal Q4 2024', date: '26 Nov 2024', modules: ['M03', 'M04', 'M08'] },
  { id: 'RPT-2024-002', name: 'Conciliación Bancaria Nov', date: '25 Nov 2024', modules: ['M01'] },
  { id: 'RPT-2024-003', name: 'Nómina Quincenal Nov-2', date: '24 Nov 2024', modules: ['M05', 'M06'] },
  { id: 'RPT-2024-004', name: 'DIOT Octubre 2024', date: '23 Nov 2024', modules: ['M09'] },
]

type Permission = 'view' | 'download' | 'edit'

export default function CompartirReportesPage() {
  const [selectedReport, setSelectedReport] = useState<string>('')
  const [shareMethod, setShareMethod] = useState<'link' | 'email'>('link')
  const [permissions, setPermissions] = useState<Permission[]>(['view'])
  const [expirationDays, setExpirationDays] = useState<number>(7)
  const [requirePassword, setRequirePassword] = useState(false)
  const [password, setPassword] = useState('')
  const [emails, setEmails] = useState('')
  const [personalMessage, setPersonalMessage] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [showReportDropdown, setShowReportDropdown] = useState(false)
  const [searchReport, setSearchReport] = useState('')

  const togglePermission = (perm: Permission) => {
    setPermissions(prev =>
      prev.includes(perm)
        ? prev.filter(p => p !== perm)
        : [...prev, perm]
    )
  }

  const generateShareLink = () => {
    // Simular generación de link
    const linkId = Math.random().toString(36).substring(2, 10)
    setGeneratedLink(`https://app.bechapra.com/shared/${linkId}`)
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filteredReports = availableReports.filter(r =>
    r.name.toLowerCase().includes(searchReport.toLowerCase()) ||
    r.id.toLowerCase().includes(searchReport.toLowerCase())
  )

  const selectedReportData = availableReports.find(r => r.id === selectedReport)

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
                      <p className="font-medium text-bechapra-text-primary">{selectedReportData.name}</p>
                      <p className="text-xs text-bechapra-text-muted">{selectedReportData.id} • {selectedReportData.date}</p>
                    </div>
                  </div>
                ) : (
                  <span className="text-bechapra-text-muted">Selecciona un reporte para compartir</span>
                )}
                <ChevronDown size={18} className={`text-bechapra-text-muted transition-transform ${showReportDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showReportDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowReportDropdown(false)} />
                  <div className="absolute z-50 mt-2 w-full bg-white rounded-bechapra-md shadow-dropdown border border-bechapra-border overflow-hidden">
                    <div className="p-3 border-b border-bechapra-border-light">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-bechapra-text-muted" size={16} />
                        <input
                          type="text"
                          placeholder="Buscar reporte..."
                          value={searchReport}
                          onChange={(e) => setSearchReport(e.target.value)}
                          className="input-bechapra pl-9 py-2 text-sm"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredReports.map((report) => (
                        <button
                          key={report.id}
                          onClick={() => {
                            setSelectedReport(report.id)
                            setShowReportDropdown(false)
                            setSearchReport('')
                          }}
                          className={`w-full p-3 flex items-center gap-3 hover:bg-bechapra-light-3 transition-colors ${
                            selectedReport === report.id ? 'bg-bechapra-light' : ''
                          }`}
                        >
                          <div className="w-8 h-8 rounded bg-bechapra-light flex items-center justify-center flex-shrink-0">
                            <FileText size={16} className="text-bechapra-primary" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="font-medium text-bechapra-text-primary text-sm">{report.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-bechapra-text-muted">{report.id}</span>
                              <span className="text-xs text-bechapra-text-muted">•</span>
                              <span className="text-xs text-bechapra-text-muted">{report.date}</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {report.modules.map((m) => (
                              <span key={m} className="px-1.5 py-0.5 text-[10px] font-medium bg-bechapra-light text-bechapra-primary rounded">
                                {m}
                              </span>
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Share method */}
          <div className="card-bechapra p-6">
            <h2 className="text-lg font-semibold text-bechapra-text-primary mb-4 flex items-center gap-2">
              <Share2 size={20} className="text-bechapra-primary" />
              Método de Compartir
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setShareMethod('link')}
                className={`p-4 rounded-bechapra-md border-2 transition-all ${
                  shareMethod === 'link'
                    ? 'border-bechapra-primary bg-bechapra-light'
                    : 'border-bechapra-border hover:border-bechapra-primary/50'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-bechapra flex items-center justify-center ${
                    shareMethod === 'link' ? 'bg-bechapra-primary text-white' : 'bg-bechapra-light text-bechapra-primary'
                  }`}>
                    <Link2 size={24} />
                  </div>
                  <span className={`font-semibold ${shareMethod === 'link' ? 'text-bechapra-primary' : 'text-bechapra-text-primary'}`}>
                    Generar Enlace
                  </span>
                  <span className="text-xs text-bechapra-text-secondary">
                    Crea un link compartible
                  </span>
                </div>
              </button>

              <button
                onClick={() => setShareMethod('email')}
                className={`p-4 rounded-bechapra-md border-2 transition-all ${
                  shareMethod === 'email'
                    ? 'border-bechapra-primary bg-bechapra-light'
                    : 'border-bechapra-border hover:border-bechapra-primary/50'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-bechapra flex items-center justify-center ${
                    shareMethod === 'email' ? 'bg-bechapra-primary text-white' : 'bg-bechapra-light text-bechapra-primary'
                  }`}>
                    <Mail size={24} />
                  </div>
                  <span className={`font-semibold ${shareMethod === 'email' ? 'text-bechapra-primary' : 'text-bechapra-text-primary'}`}>
                    Enviar por Correo
                  </span>
                  <span className="text-xs text-bechapra-text-secondary">
                    Invita por email directamente
                  </span>
                </div>
              </button>
            </div>

            {/* Email recipients (if email method) */}
            {shareMethod === 'email' && (
              <div className="space-y-4 pt-4 border-t border-bechapra-border-light">
                <div>
                  <label className="block text-sm font-medium text-bechapra-text-primary mb-2">
                    Destinatarios
                  </label>
                  <input
                    type="text"
                    placeholder="correo@ejemplo.com, otro@ejemplo.com"
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    className="input-bechapra"
                  />
                  <p className="text-xs text-bechapra-text-muted mt-1">
                    Separa múltiples correos con comas
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-bechapra-text-primary mb-2">
                    Mensaje personalizado (opcional)
                  </label>
                  <textarea
                    placeholder="Hola, te comparto este reporte..."
                    value={personalMessage}
                    onChange={(e) => setPersonalMessage(e.target.value)}
                    rows={3}
                    className="input-bechapra resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Permissions */}
          <div className="card-bechapra p-6">
            <h2 className="text-lg font-semibold text-bechapra-text-primary mb-4 flex items-center gap-2">
              <Shield size={20} className="text-bechapra-primary" />
              Permisos
            </h2>

            <div className="space-y-3">
              {[
                { key: 'view' as Permission, icon: Eye, label: 'Ver reporte', desc: 'Puede ver el contenido del reporte' },
                { key: 'download' as Permission, icon: Download, label: 'Descargar', desc: 'Puede descargar archivos y PDF' },
                { key: 'edit' as Permission, icon: Edit, label: 'Editar', desc: 'Puede agregar comentarios y notas' },
              ].map(({ key, icon: Icon, label, desc }) => (
                <label
                  key={key}
                  className={`flex items-center gap-4 p-4 rounded-bechapra-md border-2 cursor-pointer transition-all ${
                    permissions.includes(key)
                      ? 'border-bechapra-primary bg-bechapra-light'
                      : 'border-bechapra-border hover:border-bechapra-primary/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={permissions.includes(key)}
                    onChange={() => togglePermission(key)}
                    className="sr-only"
                  />
                  <div className={`w-10 h-10 rounded-bechapra flex items-center justify-center ${
                    permissions.includes(key) ? 'bg-bechapra-primary text-white' : 'bg-bechapra-light text-bechapra-text-muted'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${permissions.includes(key) ? 'text-bechapra-primary' : 'text-bechapra-text-primary'}`}>
                      {label}
                    </p>
                    <p className="text-sm text-bechapra-text-secondary">{desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    permissions.includes(key)
                      ? 'bg-bechapra-primary border-bechapra-primary'
                      : 'border-bechapra-border'
                  }`}>
                    {permissions.includes(key) && <Check size={12} className="text-white" />}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Security options */}
          <div className="card-bechapra p-6">
            <h2 className="text-lg font-semibold text-bechapra-text-primary mb-4 flex items-center gap-2">
              <Settings2 size={20} className="text-bechapra-primary" />
              Opciones de Seguridad
            </h2>

            <div className="space-y-4">
              {/* Expiration */}
              <div>
                <label className="block text-sm font-medium text-bechapra-text-primary mb-2">
                  <Clock size={16} className="inline mr-2" />
                  Expiración del enlace
                </label>
                <select
                  value={expirationDays}
                  onChange={(e) => setExpirationDays(Number(e.target.value))}
                  className="input-bechapra"
                >
                  <option value={1}>1 día</option>
                  <option value={7}>7 días</option>
                  <option value={30}>30 días</option>
                  <option value={90}>90 días</option>
                  <option value={0}>Sin expiración</option>
                </select>
              </div>

              {/* Password protection */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requirePassword}
                    onChange={(e) => setRequirePassword(e.target.checked)}
                    className="w-4 h-4 rounded border-bechapra-border text-bechapra-primary focus:ring-bechapra-primary"
                  />
                  <span className="text-sm font-medium text-bechapra-text-primary">
                    Proteger con contraseña
                  </span>
                </label>

                {requirePassword && (
                  <input
                    type="password"
                    placeholder="Ingresa una contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-bechapra"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={generateShareLink}
            disabled={!selectedReport}
            className="btn-primary w-full py-4 text-lg"
          >
            {shareMethod === 'link' ? (
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
                  <button className="btn-ghost p-3">
                    <QrCode size={18} />
                  </button>
                  <button className="btn-ghost p-3">
                    <ExternalLink size={18} />
                  </button>
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
                  {selectedReportData?.name || '-'}
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
                <div className="flex gap-1">
                  {permissions.map((p) => (
                    <span key={p} className="px-2 py-0.5 text-xs font-medium bg-bechapra-light text-bechapra-primary rounded capitalize">
                      {p === 'view' ? 'Ver' : p === 'download' ? 'Descargar' : 'Editar'}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-bechapra-border-light">
                <span className="text-sm text-bechapra-text-secondary">Expiración</span>
                <span className="text-sm font-medium text-bechapra-text-primary">
                  {expirationDays === 0 ? 'Sin expiración' : `${expirationDays} días`}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-bechapra-text-secondary">Contraseña</span>
                <span className="text-sm font-medium text-bechapra-text-primary">
                  {requirePassword ? 'Sí' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="p-4 bg-bechapra-info-light rounded-bechapra-md">
            <h4 className="font-medium text-blue-800 mb-2 text-sm">💡 Consejos</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Los enlaces con contraseña son más seguros</li>
              <li>• Configura una expiración corta para datos sensibles</li>
              <li>• Puedes revocar el acceso en cualquier momento</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}