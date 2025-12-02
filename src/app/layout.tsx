import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '../components/layout/Sidebar'
import { Header } from '../components/layout/Header'
import { SidebarProvider } from '../hooks/useSidebar'

export const metadata: Metadata = {
  title: 'Bechapra | Sistema de Análisis Contable',
  description: 'Sistema inteligente de análisis contable con IA para empresas mexicanas',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <SidebarProvider>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />
            
            {/* Main content area */}
            <div className="flex-1 flex flex-col ml-0 lg:ml-[280px] transition-all duration-300">
              {/* Header */}
              <Header />
              
              {/* Page content */}
              <main className="flex-1 p-6 lg:p-8 pt-[88px] lg:pt-[88px]">
                <div className="max-w-7xl mx-auto">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}