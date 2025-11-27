'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  Share2,
  Calendar,
  FileText,
  Building2,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

export default function VerReportePage() {
  const router = useRouter()
  const [reporteData, setReporteData] = useState<any>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['modulo1']))

  useEffect(() => {
    const dataStr = sessionStorage.getItem('ultimo_reporte')
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr)
        setReporteData(data)
      } catch (error) {
        console.error('Error al parsear datos:', error)
      }
    }
  }, [])

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  if (!reporteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bechapra-light-2 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bechapra-primary mx-auto mb-4"></div>
          <p className="text-bechapra-text-secondary">Cargando reporte...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bechapra-light-2 to-white">
      {/* Header */}
      <div className="bg-white border-b border-bechapra-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/nuevo-reporte"
                className="p-2 hover:bg-bechapra-light rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-bechapra-text-secondary" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-bechapra-text-primary">
                  Resultados del Análisis
                </h1>
                <p className="text-sm text-bechapra-text-secondary">
                  {new Date().toLocaleDateString('es-MX', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-bechapra-border rounded-lg hover:bg-bechapra-light transition-colors">
                <Share2 size={18} />
                <span>Compartir</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-bechapra-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download size={18} />
                <span>Descargar PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Módulo 1: Estados de Cuenta */}
        {reporteData.modulo1 && (
          <div className="bg-white rounded-xl border border-bechapra-border overflow-hidden">
            <button
              onClick={() => toggleSection('modulo1')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-bechapra-light-3 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Building2 className="text-bechapra-primary" size={20} />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-bold text-bechapra-text-primary">
                    📄 Estados de Cuenta
                  </h2>
                  <p className="text-sm text-bechapra-text-secondary">
                    {reporteData.modulo1.total_archivos} archivo(s) procesado(s)
                  </p>
                </div>
              </div>
              {expandedSections.has('modulo1') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {expandedSections.has('modulo1') && (
              <div className="border-t border-bechapra-border p-6 space-y-6">
                {reporteData.modulo1.resultados?.map((archivo: any, idx: number) => (
                  <div key={idx} className="border border-bechapra-border rounded-lg overflow-hidden">
                    {/* Header del archivo */}
                    <div className="bg-bechapra-light-3 px-4 py-3 border-b border-bechapra-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="text-bechapra-primary" size={20} />
                          <div>
                            <p className="font-semibold text-bechapra-text-primary">
                              {archivo.filename}
                            </p>
                            {archivo.datos?.tipo && (
                              <p className="text-xs text-bechapra-text-secondary">{archivo.datos.tipo}</p>
                            )}
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          ✓ Procesado
                        </span>
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-4 space-y-4">
                      {/* Datos del banco */}
                      {(archivo.datos?.banco || archivo.datos?.numero_cuenta || archivo.datos?.rfc) && (
                        <div className="grid grid-cols-3 gap-4">
                          {archivo.datos.banco && (
                            <div>
                              <p className="text-xs text-bechapra-text-secondary mb-1">Banco</p>
                              <p className="font-semibold text-bechapra-text-primary">{archivo.datos.banco}</p>
                            </div>
                          )}
                          {archivo.datos.numero_cuenta && (
                            <div>
                              <p className="text-xs text-bechapra-text-secondary mb-1">Cuenta</p>
                              <p className="font-semibold text-bechapra-text-primary">{archivo.datos.numero_cuenta}</p>
                            </div>
                          )}
                          {archivo.datos.rfc && (
                            <div>
                              <p className="text-xs text-bechapra-text-secondary mb-1">RFC</p>
                              <p className="font-semibold text-bechapra-text-primary">{archivo.datos.rfc}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Periodo */}
                      {archivo.datos?.periodo && (
                        <div className="flex items-center gap-2 text-sm text-bechapra-text-secondary">
                          <Calendar size={16} />
                          <span>{archivo.datos.periodo}</span>
                        </div>
                      )}

                      {/* Resumen financiero */}
                      <div className="grid grid-cols-4 gap-4">
                        {archivo.datos?.saldo_inicial && (
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-xs text-blue-600 mb-1">Saldo Inicial</p>
                            <p className="text-lg font-bold text-blue-700">{archivo.datos.saldo_inicial}</p>
                          </div>
                        )}
                        {archivo.datos?.total_depositos && (
                          <div className="bg-green-50 rounded-lg p-3">
                            <p className="text-xs text-green-600 mb-1 flex items-center gap-1">
                              <TrendingUp size={14} />
                              Depósitos
                            </p>
                            <p className="text-lg font-bold text-green-700">{archivo.datos.total_depositos}</p>
                          </div>
                        )}
                        {archivo.datos?.total_retiros && (
                          <div className="bg-red-50 rounded-lg p-3">
                            <p className="text-xs text-red-600 mb-1 flex items-center gap-1">
                              <TrendingDown size={14} />
                              Retiros
                            </p>
                            <p className="text-lg font-bold text-red-700">{archivo.datos.total_retiros}</p>
                          </div>
                        )}
                        {archivo.datos?.saldo_final && (
                          <div className="bg-purple-50 rounded-lg p-3">
                            <p className="text-xs text-purple-600 mb-1">Saldo Final</p>
                            <p className="text-lg font-bold text-purple-700">{archivo.datos.saldo_final}</p>
                          </div>
                        )}
                      </div>

                      {/* Tabla de movimientos si existen */}
                      {archivo.datos?.por_hoja && (
                        <div className="mt-4">
                          <p className="font-semibold mb-2">📊 Detalles de movimientos</p>
                          <div className="text-sm text-gray-600">
                            {Object.keys(archivo.datos.por_hoja).map((hoja) => (
                              <p key={hoja}>Hoja: {hoja}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mensaje si no hay datos */}
        {!reporteData.modulo1 && !reporteData.modulo3 && !reporteData.modulo4 && (
          <div className="bg-white rounded-xl border border-bechapra-border p-12 text-center">
            <p className="text-gray-500">No hay datos para mostrar</p>
          </div>
        )}
      </div>
    </div>
  )
}
