import type { Metadata } from 'next'

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
    <>
      {children}
    </>
  )
}