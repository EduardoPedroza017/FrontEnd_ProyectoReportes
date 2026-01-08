import type { Metadata } from 'next'
import './upload.css'

export const metadata: Metadata = {
  title: 'Subir Documentos - Bechapra',
  description: 'Centro de Concentrado de Documentos',
}

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="upload-route">
      {children}
    </div>
  )
}