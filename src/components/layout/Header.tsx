'use client'

import { useSidebar } from '../../hooks/useSidebar'
import { Menu, Bell, Search, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const { toggleMobile } = useSidebar()
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, title: 'Reporte completado', message: 'El análisis de Módulo 03 está listo', time: 'Hace 5 min', unread: true },
    { id: 2, title: 'Nuevo documento', message: 'Se agregó factura al reporte #1234', time: 'Hace 1 hora', unread: true },
    { id: 3, title: 'Reporte compartido', message: 'Juan Pérez accedió al reporte', time: 'Hace 2 horas', unread: false },
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[280px] h-[72px] bg-white/80 backdrop-blur-md border-b border-bechapra-border-light z-30">
      <div className="h-full px-4 lg:px-8 flex items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={toggleMobile}
            className="lg:hidden p-2 rounded-bechapra hover:bg-bechapra-light text-bechapra-text-secondary transition-colors"
          >
            <Menu size={24} />
          </button>

          {/* Search bar */}
          <div className="hidden md:flex items-center gap-3 bg-bechapra-light rounded-bechapra px-4 py-2.5 w-80 transition-all focus-within:ring-2 focus-within:ring-bechapra-primary/20 focus-within:bg-white focus-within:shadow-bechapra-sm">
            <Search size={18} className="text-bechapra-text-muted" />
            <input
              type="text"
              placeholder="Buscar reportes, documentos..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-bechapra-text-primary placeholder:text-bechapra-text-muted"
            />
            <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 text-xs font-medium text-bechapra-text-muted bg-white rounded border border-bechapra-border">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Quick action button */}
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-bechapra bg-bechapra-light text-bechapra-primary font-medium text-sm hover:bg-bechapra-primary hover:text-white transition-all">
            <span>+ Nuevo Reporte</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-bechapra hover:bg-bechapra-light text-bechapra-text-secondary transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-bechapra-error text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-bechapra-lg shadow-dropdown border border-bechapra-border-light z-50 overflow-hidden animate-scale-in">
                  <div className="p-4 border-b border-bechapra-border-light">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-bechapra-text-primary">Notificaciones</h3>
                      <span className="badge badge-primary text-xs">{unreadCount} nuevas</span>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-bechapra-border-light hover:bg-bechapra-light-3 cursor-pointer transition-colors ${
                          notification.unread ? 'bg-bechapra-light-2' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          {notification.unread && (
                            <span className="w-2 h-2 mt-2 rounded-full bg-bechapra-primary flex-shrink-0" />
                          )}
                          <div className={notification.unread ? '' : 'ml-5'}>
                            <p className="text-sm font-medium text-bechapra-text-primary">
                              {notification.title}
                            </p>
                            <p className="text-xs text-bechapra-text-secondary mt-0.5">
                              {notification.message}
                            </p>
                            <p className="text-xs text-bechapra-text-muted mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-bechapra-light-3">
                    <button className="w-full text-center text-sm font-medium text-bechapra-primary hover:underline">
                      Ver todas las notificaciones
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User menu (mobile) */}
          <div className="lg:hidden">
            <button className="flex items-center gap-2 p-1.5 rounded-bechapra hover:bg-bechapra-light">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-bechapra-accent to-bechapra-primary flex items-center justify-center text-white text-sm font-semibold">
                EC
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}