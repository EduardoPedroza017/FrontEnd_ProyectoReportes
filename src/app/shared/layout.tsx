import type { Metadata } from 'next'
import './shared.css'

export const metadata: Metadata = {
  title: 'Reporte Compartido - Bechapra',
  description: 'Visualización de reporte compartido',
}

export default function SharedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="shared-route">
      {children}
    </div>
  )
}