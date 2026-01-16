'use client'

import { useState } from 'react'
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Key,
  Mail,
  Smartphone,
  Moon,
  Sun,
  Monitor,
  Check,
  ChevronRight,
  Save,
  AlertCircle,
  Building2,
  CreditCard,
  FileText,
  HardDrive,
  Trash2,
  Download,
  Upload
} from 'lucide-react'

type TabType = 'perfil' | 'notificaciones' | 'seguridad' | 'apariencia' | 'empresa' | 'datos'

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<TabType>('perfil')
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light')
  const [saved, setSaved] = useState(false)

  const tabs = [
    { id: 'perfil' as TabType, label: 'Perfil', icon: User },
    { id: 'empresa' as TabType, label: 'Empresa', icon: Building2 },
    { id: 'notificaciones' as TabType, label: 'Notificaciones', icon: Bell },
    { id: 'seguridad' as TabType, label: 'Seguridad', icon: Shield },
    { id: 'apariencia' as TabType, label: 'Apariencia', icon: Palette },
    { id: 'datos' as TabType, label: 'Datos', icon: Database },
  ]

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-bechapra-text-primary">
          Configuración
        </h1>
        <p className="text-bechapra-text-secondary mt-1">
          Personaliza tu experiencia y administra tu cuenta
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar tabs */}
        <div className="lg:col-span-3">
          <div className="card-bechapra overflow-hidden">
            <nav className="p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-bechapra text-left transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-bechapra-primary to-bechapra-primary-dark text-white shadow-button'
                        : 'text-bechapra-text-secondary hover:bg-bechapra-light hover:text-bechapra-primary'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-9">
          <div className="card-bechapra">
            {/* Perfil */}
            {activeTab === 'perfil' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-bechapra-border-light">
                  <div>
                    <h2 className="text-lg font-semibold text-bechapra-text-primary">Información Personal</h2>
                    <p className="text-sm text-bechapra-text-secondary">Actualiza tu información de perfil</p>
                  </div>
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-bechapra-accent to-bechapra-primary flex items-center justify-center text-white text-2xl font-bold">
                    EC
                  </div>
                  <div>
                    <button className="btn-secondary text-sm">
                      <Upload size={16} />
                      Cambiar foto
                    </button>
                    <p className="text-xs text-bechapra-text-muted mt-2">JPG, PNG. Máximo 2MB</p>
                  </div>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-bechapra-text-primary mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      defaultValue="Eduardo"
                      className="input-bechapra"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-bechapra-text-primary mb-2">
                      Apellido
                    </label>
                    <input
                      type="text"
                      defaultValue="Castillo"
                      className="input-bechapra"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-bechapra-text-primary mb-2">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      defaultValue="eduardo@bechapra.com"
                      className="input-bechapra"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-bechapra-text-primary mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      defaultValue="+52 55 1234 5678"
                      className="input-bechapra"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-bechapra-text-primary mb-2">
                      Cargo
                    </label>
                    <input
                      type="text"
                      defaultValue="Administrador"
                      className="input-bechapra"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-bechapra-border-light">
                  <button onClick={handleSave} className="btn-primary">
                    {saved ? <Check size={18} /> : <Save size={18} />}
                    {saved ? 'Guardado' : 'Guardar cambios'}
                  </button>
                </div>
              </div>
            )}

            {/* Empresa */}
            {activeTab === 'empresa' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-bechapra-border-light">
                  <div>
                    <h2 className="text-lg font-semibold text-bechapra-text-primary">Datos de la Empresa</h2>
                    <p className="text-sm text-bechapra-text-secondary">Información fiscal y de contacto</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-bechapra-text-primary mb-2">
                      Razón Social
                    </label>
                    <input
                      type="text"
                      defaultValue="Bechapra Consulting S.A. de C.V."
                      className="input-bechapra"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-bechapra-text-primary mb-2">
                      RFC
                    </label>
                    <input
                      type="text"
                      defaultValue="BCO123456ABC"
                      className="input-bechapra"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-bechapra-text-primary mb-2">
                      Régimen Fiscal
                    </label>
                    <select className="input-bechapra">
                      <option>601 - General de Ley Personas Morales</option>
                      <option>603 - Personas Morales con Fines no Lucrativos</option>
                      <option>612 - Personas Físicas con Actividades Empresariales</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-bechapra-text-primary mb-2">
                      Dirección Fiscal
                    </label>
                    <textarea
                      defaultValue="Av. Revolución 123, Col. Centro, CDMX, CP 06000"
                      className="input-bechapra resize-none"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-bechapra-border-light">
                  <button onClick={handleSave} className="btn-primary">
                    {saved ? <Check size={18} /> : <Save size={18} />}
                    {saved ? 'Guardado' : 'Guardar cambios'}
                  </button>
                </div>
              </div>
            )}

            {/* Notificaciones */}
            {activeTab === 'notificaciones' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-bechapra-border-light">
                  <div>
                    <h2 className="text-lg font-semibold text-bechapra-text-primary">Preferencias de Notificaciones</h2>
                    <p className="text-sm text-bechapra-text-secondary">Controla cómo y cuándo recibes notificaciones</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: FileText, title: 'Reportes completados', desc: 'Recibe una notificación cuando un reporte termine de procesarse', email: true, push: true },
                    { icon: AlertCircle, title: 'Errores de procesamiento', desc: 'Notificaciones cuando hay errores en el análisis', email: true, push: true },
                    { icon: User, title: 'Acceso a reportes compartidos', desc: 'Cuando alguien accede a un reporte que compartiste', email: false, push: true },
                    { icon: CreditCard, title: 'Facturación', desc: 'Notificaciones sobre pagos y facturación', email: true, push: false },
                    { icon: Shield, title: 'Seguridad', desc: 'Alertas de seguridad y nuevos inicios de sesión', email: true, push: true },
                  ].map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <div key={idx} className="flex items-center justify-between p-4 bg-bechapra-light-3 rounded-bechapra-md">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-bechapra bg-bechapra-light flex items-center justify-center text-bechapra-primary">
                            <Icon size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-bechapra-text-primary">{item.title}</p>
                            <p className="text-sm text-bechapra-text-secondary">{item.desc}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked={item.email}
                              className="w-4 h-4 rounded border-bechapra-border text-bechapra-primary focus:ring-bechapra-primary"
                            />
                            <Mail size={16} className="text-bechapra-text-muted" />
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked={item.push}
                              className="w-4 h-4 rounded border-bechapra-border text-bechapra-primary focus:ring-bechapra-primary"
                            />
                            <Smartphone size={16} className="text-bechapra-text-muted" />
                          </label>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex justify-end pt-4 border-t border-bechapra-border-light">
                  <button onClick={handleSave} className="btn-primary">
                    {saved ? <Check size={18} /> : <Save size={18} />}
                    {saved ? 'Guardado' : 'Guardar cambios'}
                  </button>
                </div>
              </div>
            )}

            {/* Seguridad */}
            {activeTab === 'seguridad' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-bechapra-border-light">
                  <div>
                    <h2 className="text-lg font-semibold text-bechapra-text-primary">Seguridad de la Cuenta</h2>
                    <p className="text-sm text-bechapra-text-secondary">Protege tu cuenta con opciones de seguridad</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Cambiar contraseña */}
                  <div className="p-4 border border-bechapra-border-light rounded-bechapra-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-bechapra bg-bechapra-light flex items-center justify-center text-bechapra-primary">
                          <Key size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-bechapra-text-primary">Contraseña</p>
                          <p className="text-sm text-bechapra-text-secondary">Última actualización hace 30 días</p>
                        </div>
                      </div>
                      <button className="btn-secondary text-sm">
                        Cambiar
                      </button>
                    </div>
                  </div>

                  {/* 2FA */}
                  <div className="p-4 border border-bechapra-border-light rounded-bechapra-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-bechapra bg-bechapra-success-light flex items-center justify-center text-green-600">
                          <Shield size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-bechapra-text-primary">Autenticación de dos factores</p>
                          <p className="text-sm text-green-600">Activada</p>
                        </div>
                      </div>
                      <button className="btn-secondary text-sm">
                        Configurar
                      </button>
                    </div>
                  </div>

                  {/* Sesiones activas */}
                  <div className="p-4 border border-bechapra-border-light rounded-bechapra-md">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-bechapra bg-bechapra-light flex items-center justify-center text-bechapra-primary">
                          <Monitor size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-bechapra-text-primary">Sesiones activas</p>
                          <p className="text-sm text-bechapra-text-secondary">2 dispositivos conectados</p>
                        </div>
                      </div>
                      <button className="text-sm font-medium text-bechapra-error hover:underline">
                        Cerrar todas
                      </button>
                    </div>
                    <div className="space-y-2 pl-14">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-bechapra-text-primary">Chrome en MacOS - Este dispositivo</span>
                        <span className="text-bechapra-text-muted">Activa ahora</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-bechapra-text-primary">Safari en iPhone</span>
                        <span className="text-bechapra-text-muted">Hace 2 horas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Apariencia */}
            {activeTab === 'apariencia' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-bechapra-border-light">
                  <div>
                    <h2 className="text-lg font-semibold text-bechapra-text-primary">Apariencia</h2>
                    <p className="text-sm text-bechapra-text-secondary">Personaliza la apariencia de la aplicación</p>
                  </div>
                </div>

                {/* Theme selector */}
                <div>
                  <label className="block text-sm font-medium text-bechapra-text-primary mb-3">
                    Tema
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'light', label: 'Claro', icon: Sun },
                      { id: 'dark', label: 'Oscuro', icon: Moon },
                      { id: 'system', label: 'Sistema', icon: Monitor },
                    ].map((t) => {
                      const Icon = t.icon
                      return (
                        <button
                          key={t.id}
                          onClick={() => setTheme(t.id as typeof theme)}
                          className={`p-4 rounded-bechapra-md border-2 transition-all ${
                            theme === t.id
                              ? 'border-bechapra-primary bg-bechapra-light'
                              : 'border-bechapra-border hover:border-bechapra-primary/50'
                          }`}
                        >
                          <Icon size={24} className={`mx-auto mb-2 ${theme === t.id ? 'text-bechapra-primary' : 'text-bechapra-text-muted'}`} />
                          <p className={`text-sm font-medium ${theme === t.id ? 'text-bechapra-primary' : 'text-bechapra-text-primary'}`}>
                            {t.label}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-bechapra-text-primary mb-2">
                    <Globe size={16} className="inline mr-2" />
                    Idioma
                  </label>
                  <select className="input-bechapra w-full md:w-64">
                    <option>Español (México)</option>
                    <option>English (US)</option>
                  </select>
                </div>

                <div className="flex justify-end pt-4 border-t border-bechapra-border-light">
                  <button onClick={handleSave} className="btn-primary">
                    {saved ? <Check size={18} /> : <Save size={18} />}
                    {saved ? 'Guardado' : 'Guardar cambios'}
                  </button>
                </div>
              </div>
            )}

            {/* Datos */}
            {activeTab === 'datos' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-bechapra-border-light">
                  <div>
                    <h2 className="text-lg font-semibold text-bechapra-text-primary">Gestión de Datos</h2>
                    <p className="text-sm text-bechapra-text-secondary">Exporta o elimina tus datos</p>
                  </div>
                </div>

                {/* Storage usage */}
                <div className="p-4 bg-bechapra-light-3 rounded-bechapra-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <HardDrive size={20} className="text-bechapra-primary" />
                      <span className="font-medium text-bechapra-text-primary">Almacenamiento usado</span>
                    </div>
                    <span className="text-sm text-bechapra-text-secondary">2.4 GB de 10 GB</span>
                  </div>
                  <div className="w-full h-2 bg-bechapra-border rounded-full overflow-hidden">
                    <div className="h-full w-[24%] bg-gradient-to-r from-bechapra-primary to-bechapra-accent rounded-full" />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Export data */}
                  <div className="p-4 border border-bechapra-border-light rounded-bechapra-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-bechapra bg-bechapra-light flex items-center justify-center text-bechapra-primary">
                          <Download size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-bechapra-text-primary">Exportar todos los datos</p>
                          <p className="text-sm text-bechapra-text-secondary">Descarga una copia de todos tus reportes y documentos</p>
                        </div>
                      </div>
                      <button className="btn-secondary text-sm">
                        Exportar
                      </button>
                    </div>
                  </div>

                  {/* Delete data */}
                  <div className="p-4 border border-bechapra-error-light rounded-bechapra-md bg-bechapra-error-light/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-bechapra bg-bechapra-error-light flex items-center justify-center text-bechapra-error">
                          <Trash2 size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-bechapra-text-primary">Eliminar cuenta</p>
                          <p className="text-sm text-bechapra-text-secondary">Elimina permanentemente tu cuenta y todos los datos</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 rounded-bechapra text-sm font-medium text-bechapra-error border border-bechapra-error hover:bg-bechapra-error hover:text-white transition-colors">
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
