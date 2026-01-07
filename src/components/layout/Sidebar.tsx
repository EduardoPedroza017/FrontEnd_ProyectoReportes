'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebar } from '../../hooks/useSidebar'
import {
  LayoutDashboard,
  FileUp,
  History,
  FileText,
  Share2,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  X,
  FileBarChart,
  FolderOpen,
  Link2,
  UserCheck,
  HelpCircle,
  LogOut
} from 'lucide-react'

interface NavItem {
  label: string
  href?: string
  icon: React.ReactNode
  badge?: string
  children?: NavItem[]
}

const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: 'Nuevo Reporte',
    href: '/nuevo-reporte',
    icon: <FileUp size={20} />,
    badge: 'Principal'
  },
  {
    label: 'Reportes',
    icon: <FileBarChart size={20} />,
    children: [
      {
        label: 'Historial de Reportes',
        href: '/reportes/historial',
        icon: <History size={18} />,
      },
      {
        label: 'Documentos por Reporte',
        href: '/reportes/documentos',
        icon: <FolderOpen size={18} />,
      },
    ]
  },
  {
    label: 'Compartir',
    icon: <Share2 size={20} />,
    children: [
      {
        label: 'Compartir Reportes',
        href: '/compartir/nuevo',
        icon: <Link2 size={18} />,
      },
      {
        label: 'Reportes Compartidos',
        href: '/compartir/gestion',
        icon: <UserCheck size={18} />,
      },
    ]
  },
  {
    label: 'Centro de Documentos',
    href: '/centro-documentos',
    icon: <FolderOpen size={20} />,
    badge: 'Nuevo'
  },
]

const bottomNavItems: NavItem[] = [
  {
    label: 'Configuración',
    href: '/configuracion',
    icon: <Settings size={20} />,
  },
  {
    label: 'Ayuda',
    href: '/ayuda',
    icon: <HelpCircle size={20} />,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isMobileOpen, closeMobile } = useSidebar()
  const [expandedItems, setExpandedItems] = useState<string[]>(['Reportes'])

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    )
  }

  const isActive = (href?: string) => {
    if (!href) return false
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const isParentActive = (children?: NavItem[]) => {
    if (!children) return false
    return children.some(child => child.href && pathname.startsWith(child.href))
  }

  const NavLink = ({ item, isChild = false }: { item: NavItem; isChild?: boolean }) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.label)
    const active = isActive(item.href) || isParentActive(item.children)

    if (hasChildren) {
      return (
        <div className="space-y-1">
          <button
            onClick={() => toggleExpand(item.label)}
            className={`
              w-full flex items-center justify-between px-4 py-3 rounded-bechapra
              font-medium transition-all duration-200
              ${active
                ? 'bg-bechapra-light text-bechapra-primary'
                : 'text-bechapra-text-secondary hover:bg-bechapra-light hover:text-bechapra-primary'
              }
            `}
          >
            <span className="flex items-center gap-3">
              <span className={active ? 'text-bechapra-primary' : ''}>{item.icon}</span>
              <span>{item.label}</span>
            </span>
            {isExpanded ? (
              <ChevronDown size={16} className="text-bechapra-text-muted" />
            ) : (
              <ChevronRight size={16} className="text-bechapra-text-muted" />
            )}
          </button>

          {/* Children dropdown */}
          <div
            className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
            `}
          >
            <div className="ml-4 pl-4 border-l-2 border-bechapra-border space-y-1 py-1">
              {item.children?.map((child) => (
                <NavLink key={child.label} item={child} isChild />
              ))}
            </div>
          </div>
        </div>
      )
    }

    return (
      <Link
        href={item.href || '#'}
        onClick={closeMobile}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-bechapra
          font-medium transition-all duration-200
          ${isChild ? 'py-2.5 text-sm' : ''}
          ${active
            ? 'bg-gradient-to-r from-bechapra-primary to-bechapra-primary-dark text-white shadow-button'
            : 'text-bechapra-text-secondary hover:bg-bechapra-light hover:text-bechapra-primary'
          }
        `}
      >
        <span className={active ? 'text-white' : ''}>{item.icon}</span>
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span className={`
            text-xs px-2 py-0.5 rounded-full font-semibold
            ${active
              ? 'bg-white/20 text-white'
              : 'bg-bechapra-primary/10 text-bechapra-primary'
            }
          `}>
            {item.badge}
          </span>
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-[280px] bg-white
          border-r border-bechapra-border-light shadow-sidebar
          flex flex-col z-50
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo header */}
        <div className="h-[72px] flex items-center justify-between px-6 border-b border-bechapra-border-light">
          <Link href="/" className="flex items-center gap-3">
            {/* Logo Bechapra */}
            <div className="w-10 h-10 rounded-bechapra bg-gradient-to-br from-bechapra-primary to-bechapra-primary-dark flex items-center justify-center shadow-button">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-bechapra-text-primary">Bechapra</h1>
              <p className="text-xs text-bechapra-text-muted -mt-0.5">Análisis Contable</p>
            </div>
          </Link>

          {/* Close button (mobile) */}
          <button
            onClick={closeMobile}
            className="lg:hidden p-2 rounded-bechapra hover:bg-bechapra-light text-bechapra-text-secondary"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navigationItems.map((item) => (
            <NavLink key={item.label} item={item} />
          ))}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-bechapra-border-light space-y-1">
          {bottomNavItems.map((item) => (
            <NavLink key={item.label} item={item} />
          ))}

          {/* User section */}
          <div className="mt-4 pt-4 border-t border-bechapra-border-light">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-bechapra-accent to-bechapra-primary flex items-center justify-center text-white font-semibold">
                EC
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-bechapra-text-primary truncate">
                  Eduardo C.
                </p>
                <p className="text-xs text-bechapra-text-muted truncate">
                  Administrador
                </p>
              </div>
              <button className="p-2 rounded-bechapra hover:bg-bechapra-light text-bechapra-text-muted hover:text-bechapra-error transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}