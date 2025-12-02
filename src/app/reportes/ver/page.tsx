'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Download, FileText, Building2 } from 'lucide-react'
import Link from 'next/link'
import Modulo01 from './components/Modulo01'
import Modulo03 from './components/Modulo03'
import Modulo04 from './components/Modulo04'
import { ReporteData } from './components/types'


export default function VerReportePage() {
  const searchParams = useSearchParams()
  const reporteId = searchParams.get('id')
  
  const [reporteData, setReporteData] = useState<ReporteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cargarReporte = async () => {
      // Debug: Mostrar parámetros de URL
      console.log('🔍 URL actual:', window.location.href)
      console.log('🔍 Search params:', searchParams.toString())
      console.log('🔍 Reporte ID:', reporteId)

      try {
        setLoading(true)

        // Estrategia 1: Intentar cargar desde sessionStorage
        const sessionData = sessionStorage.getItem('reporteData')
        if (sessionData) {
          console.log('📦 Cargando datos desde sessionStorage...')
          const data = JSON.parse(sessionData)
          console.log('✅ Datos cargados desde sessionStorage:', data)
          setReporteData(data)
          setLoading(false)
          return
        }

        // Estrategia 2: Intentar cargar desde API con ID
        if (!reporteId) {
          console.error('❌ No se encontró ID en la URL ni datos en sessionStorage')
          setError('No se especificó un ID de reporte. La URL debe incluir ?id=XXXXX')
          setLoading(false)
          return
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const url = `${apiUrl}/get-report/${reporteId}`
        
        console.log('📡 Intentando cargar desde API:', url)
        
        const response = await fetch(url)
        
        console.log('📡 Respuesta del servidor:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ Error del servidor:', errorText)
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        console.log('✅ Datos del reporte cargados desde API:', data)
        
        if (!data || typeof data !== 'object') {
          throw new Error('Respuesta del servidor inválida')
        }
        
        setReporteData(data)
      } catch (err) {
        console.error('❌ Error al cargar reporte:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar el reporte')
      } finally {
        setLoading(false)
      }
    }

    cargarReporte()
  }, [reporteId, searchParams])

  const descargarReportePDF = async () => {
    if (!reporteId) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-full-report/${reporteId}`)
      
      if (!response.ok) {
        throw new Error('Error al generar el PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reporte-completo-${reporteId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Error al descargar PDF:', err)
      alert('Error al descargar el reporte PDF')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bechapra-light-3 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-bechapra-primary mx-auto mb-4"></div>
          <p className="text-bechapra-text-secondary">Cargando reporte...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bechapra-light-3 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg border border-red-200 p-6 max-w-2xl w-full">
          <div className="flex items-start gap-3 mb-4">
            <div className="text-red-600 text-2xl">❌</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar el reporte</h3>
              <p className="text-red-600 font-medium mb-4">{error}</p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">🔍 Información de debugging:</h4>
                <div className="space-y-1 text-sm font-mono">
                  <div><span className="text-gray-600">URL actual:</span> {typeof window !== 'undefined' ? window.location.href : ''}</div>
                  <div><span className="text-gray-600">Reporte ID:</span> {reporteId || '(no especificado)'}</div>
                  <div><span className="text-gray-600">API URL:</span> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}</div>
                  <div>
                    <span className="text-gray-600">SessionStorage:</span> {
                      typeof window !== 'undefined' && sessionStorage.getItem('reporteData') 
                        ? '✅ Tiene datos' 
                        : '❌ Vacío'
                    }
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Posibles soluciones:</h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• <strong>Opción 1:</strong> La URL debe incluir el parámetro <code className="bg-blue-100 px-2 py-1 rounded">?id=XXXXX</code></li>
                  <li>• <strong>Opción 2:</strong> Los datos deben estar en sessionStorage antes de navegar</li>
                  <li>• Verifica que el backend esté corriendo en: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}</li>
                  <li>• Revisa la consola del navegador (F12) para más detalles</li>
                </ul>
              </div>
            </div>
          </div>
          
          <Link
            href="/reportes"
            className="inline-flex items-center gap-2 text-bechapra-primary hover:underline font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a reportes
          </Link>
        </div>
      </div>
    )
  }

  const tieneModulo01 = reporteData?.modulo1?.success
  const tieneModulo03 = reporteData?.modulo3?.success
  const tieneModulo04 = reporteData?.modulo4?.success

  return (
    <div className="min-h-screen bg-bechapra-light-3">
      {/* Header */}
      <div className="bg-white border-b border-bechapra-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/reportes"
                className="flex items-center gap-2 text-bechapra-text-secondary hover:text-bechapra-primary transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">Volver</span>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-bechapra-text-primary">
                  Reporte Completo
                </h1>
                <p className="text-sm text-bechapra-text-secondary mt-1">
                  ID: {reporteId}
                </p>
              </div>
            </div>

            <button
              onClick={descargarReportePDF}
              className="flex items-center gap-2 bg-bechapra-primary hover:bg-bechapra-secondary text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              <Download className="w-5 h-5" />
              Descargar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Módulo 01: Estados de Cuenta */}
          {tieneModulo01 && reporteData.modulo1 && (
            <div className="bg-white rounded-lg border border-bechapra-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-bechapra-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-bechapra-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-bechapra-text-primary">
                    Módulo 01: Estados de Cuenta
                  </h2>
                  <p className="text-sm text-bechapra-text-secondary">
                    Análisis de movimientos bancarios
                  </p>
                </div>
              </div>
              <Modulo01 data={reporteData.modulo1} />
            </div>
          )}

          {/* Módulo 03: XML - Facturas */}
          {tieneModulo03 && reporteData.modulo3 && (
            <div className="bg-white rounded-lg border border-bechapra-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-bechapra-text-primary">
                    Módulo 03: XML - Facturas
                  </h2>
                  <p className="text-sm text-bechapra-text-secondary">
                    Conciliación de facturas emitidas y recibidas
                  </p>
                </div>
              </div>
              <Modulo03 data={reporteData.modulo3} />
            </div>
          )}

          {/* Módulo 04: SUA */}
        {tieneModulo04 && (
        <div className="bg-white rounded-lg border border-bechapra-border p-6">
            <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-bechapra-text-primary">
                Módulo 04: SUA
                </h2>
                <p className="text-sm text-bechapra-text-secondary">
                Sistema Único de Autodeterminación
                </p>
            </div>
            </div>
            <Modulo04 data={reporteData.modulo4} />
        </div>
        )}

          {/* Mensaje si no hay módulos */}
          {!tieneModulo01 && !tieneModulo03 && (
            <div className="bg-white rounded-lg border border-bechapra-border p-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay módulos procesados
              </h3>
              <p className="text-gray-600">
                Este reporte no contiene datos de módulos procesados
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}