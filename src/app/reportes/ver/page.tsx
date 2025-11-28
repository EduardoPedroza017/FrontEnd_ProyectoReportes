'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  Share2,
  Building2,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  Users,
  AlertTriangle,
  FileText,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart
} from 'lucide-react'

export default function VerReportePage() {
  const router = useRouter()
  const [reporteData, setReporteData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['modulo1', 'modulo3', 'modulo4'])
  )
  
  const [activeTab01, setActiveTab01] = useState('movimientos')

  useEffect(() => {
    console.log('Buscando datos en sessionStorage...')
    const dataStr = sessionStorage.getItem('ultimo_reporte')
    
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr)
        console.log('Datos encontrados:', data)
        setReporteData(data)
      } catch (error) {
        console.error('Error al parsear datos:', error)
      }
    } else {
      console.warn('No hay datos en sessionStorage')
    }
    
    setLoading(false)
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(value)
  }

  const consolidarDatosModulo01 = () => {
    if (!reporteData.modulo1 || !reporteData.modulo1.resultados) return null

    let allMovements: any[] = []
    let totalDepositos = 0
    let totalRetiros = 0
    let totalComisiones = 0
    let allConciliaciones: any[] = []

    reporteData.modulo1.resultados.forEach((archivo: any) => {
      if (archivo.success && archivo.datos?.por_hoja) {
        Object.entries(archivo.datos.por_hoja).forEach(([hojaName, hojaData]: any) => {
          if (hojaData.conciliacion) {
            totalDepositos += hojaData.conciliacion.mas_depositos || 0
            totalRetiros += hojaData.conciliacion.menos_retiros || 0
            allConciliaciones.push({
              archivo: archivo.filename,
              hoja: hojaName,
              conciliacion: hojaData.conciliacion
            })
          }

          if (Array.isArray(hojaData.movimientos)) {
            const movsConArchivo = hojaData.movimientos.map((m: any) => ({
              ...m,
              archivo: archivo.filename,
              hoja: hojaName
            }))
            allMovements = allMovements.concat(movsConArchivo)
          }

          const comStr = hojaData.resumen?.total_comisiones || '$0.00'
          const comNum = parseFloat((comStr + '').replace(/[$,]/g, ''))
          if (!isNaN(comNum)) totalComisiones += comNum
        })
      }
    })

    const flujoNeto = totalDepositos - totalRetiros

    return {
      allMovements,
      totalDepositos,
      totalRetiros,
      totalComisiones,
      flujoNeto,
      allConciliaciones
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bechapra-light-2 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bechapra-primary mx-auto mb-4"></div>
          <p className="text-bechapra-text-secondary">Cargando reporte...</p>
        </div>
      </div>
    )
  }

  if (!reporteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bechapra-light-2 to-white">
        <div className="bg-white border-b border-bechapra-border">
          <div className="max-w-7xl mx-auto px-6 py-4">
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
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="bg-white rounded-xl border border-bechapra-border p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="text-amber-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-bechapra-text-primary mb-3">
              No hay reporte para mostrar
            </h2>
            <p className="text-bechapra-text-secondary mb-8 max-w-md mx-auto">
              Parece que aún no has procesado ningún archivo. Genera un nuevo reporte para ver los resultados aquí.
            </p>
            <Link
              href="/nuevo-reporte"
              className="inline-flex items-center gap-2 px-6 py-3 bg-bechapra-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileText size={20} />
              <span>Generar Nuevo Reporte</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const datosModulo01 = consolidarDatosModulo01()

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
                <span className="hidden sm:inline">Compartir</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-bechapra-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download size={18} />
                <span className="hidden sm:inline">Descargar PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        
        {/* Módulo 1: Estados de Cuenta */}
        {reporteData.modulo1 && datosModulo01 && (
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
                    Estados de Cuenta
                  </h2>
                  <p className="text-sm text-bechapra-text-secondary">
                    {reporteData.modulo1.total_archivos || reporteData.modulo1.resultados?.length || 0} archivo(s) procesado(s)
                  </p>
                </div>
              </div>
              {expandedSections.has('modulo1') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {expandedSections.has('modulo1') && (
              <div className="border-t border-bechapra-border">
                
                {/* Dashboard */}
                <div className="p-6 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="text-blue-600" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-blue-600 mb-1">Depósitos</p>
                          <p className="text-xl font-bold text-blue-700 truncate">{formatCurrency(datosModulo01.totalDepositos)}</p>
                          <p className="text-xs text-blue-600 mt-1">Entrada de efectivo</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                          <TrendingDown className="text-red-600" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-red-600 mb-1">Retiros</p>
                          <p className="text-xl font-bold text-red-700 truncate">{formatCurrency(datosModulo01.totalRetiros)}</p>
                          <p className="text-xs text-red-600 mt-1">Salida de efectivo</p>
                        </div>
                      </div>
                    </div>

                    <div className={`${datosModulo01.flujoNeto >= 0 ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'} rounded-lg p-4 border`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg ${datosModulo01.flujoNeto >= 0 ? 'bg-green-100' : 'bg-amber-100'} flex items-center justify-center flex-shrink-0`}>
                          <BarChart3 className={datosModulo01.flujoNeto >= 0 ? 'text-green-600' : 'text-amber-600'} size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs ${datosModulo01.flujoNeto >= 0 ? 'text-green-600' : 'text-amber-600'} mb-1`}>Flujo Neto</p>
                          <p className={`text-xl font-bold ${datosModulo01.flujoNeto >= 0 ? 'text-green-700' : 'text-amber-700'} truncate`}>
                            {formatCurrency(Math.abs(datosModulo01.flujoNeto))}
                          </p>
                          <p className={`text-xs ${datosModulo01.flujoNeto >= 0 ? 'text-green-600' : 'text-amber-600'} mt-1`}>
                            {datosModulo01.flujoNeto >= 0 ? 'Positivo' : 'Negativo'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <DollarSign className="text-purple-600" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-purple-600 mb-1">Comisiones</p>
                          <p className="text-xl font-bold text-purple-700 truncate">{formatCurrency(datosModulo01.totalComisiones)}</p>
                          <p className="text-xs text-purple-600 mt-1">Costo bancario</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Tabs */}
                <div className="border-t border-bechapra-border bg-white">
                  <div className="flex gap-1 px-6 pt-3">
                    <button
                      onClick={() => setActiveTab01('movimientos')}
                      className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                        activeTab01 === 'movimientos'
                          ? 'bg-bechapra-light-3 text-bechapra-primary'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <FileText size={16} />
                      <span>Movimientos</span>
                    </button>
                    <button
                      onClick={() => setActiveTab01('conciliacion')}
                      className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                        activeTab01 === 'conciliacion'
                          ? 'bg-bechapra-light-3 text-bechapra-primary'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <BarChart3 size={16} />
                      <span>Conciliación</span>
                    </button>
                    <button
                      onClick={() => setActiveTab01('segmentacion')}
                      className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                        activeTab01 === 'segmentacion'
                          ? 'bg-bechapra-light-3 text-bechapra-primary'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <PieChart size={16} />
                      <span>Segmentación</span>
                    </button>
                  </div>

                  {/* Tab: Movimientos */}
                  {activeTab01 === 'movimientos' && (
                    <div className="p-6 bg-bechapra-light-3">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-bechapra-text-primary">
                          Todos los Movimientos
                        </h3>
                        <span className="text-sm text-bechapra-text-secondary">
                          {datosModulo01.allMovements.length} registros
                        </span>
                      </div>

                      <div className="bg-white rounded-lg border border-bechapra-border overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-gray-50 border-b border-bechapra-border">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">#</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Fecha</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Archivo</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Descripción</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Cargo</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Abono</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Saldo</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-bechapra-border">
                              {datosModulo01.allMovements.slice(0, 100).map((mov: any, idx: number) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                                  <td className="px-4 py-3 text-sm text-gray-900">{mov.fecha || 'N/A'}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600 max-w-[150px] truncate" title={mov.archivo}>
                                    {mov.archivo}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 max-w-[250px] truncate" title={mov.descripcion || mov.concepto || 'N/A'}>
                                    {mov.descripcion || mov.concepto || 'N/A'}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-right font-medium text-red-600">
                                    {mov.cargo ? formatCurrency(Math.abs(mov.cargo)) : '-'}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-right font-medium text-green-600">
                                    {mov.abono ? formatCurrency(Math.abs(mov.abono)) : '-'}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                                    {mov.saldo ? formatCurrency(mov.saldo) : 'N/A'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {datosModulo01.allMovements.length > 100 && (
                        <p className="text-center text-sm text-gray-500 mt-4">
                          Mostrando 100 de {datosModulo01.allMovements.length} movimientos
                        </p>
                      )}
                    </div>
                  )}

                  {/* Tab: Conciliación */}
                  {activeTab01 === 'conciliacion' && (
                    <div className="p-6 space-y-4 bg-bechapra-light-3">
                      <h3 className="text-base font-semibold text-bechapra-text-primary">Conciliación Bancaria</h3>

                      {datosModulo01.allConciliaciones.map((item: any, idx: number) => (
                        <div key={idx} className="bg-white border border-bechapra-border rounded-lg p-5">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <FileText className="text-bechapra-primary" size={20} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{item.archivo}</h4>
                              <p className="text-sm text-gray-500">Hoja: {item.hoja}</p>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Saldo según banco:</span>
                              <span className="font-semibold text-gray-900">{formatCurrency(item.conciliacion.saldo_banco || 0)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-green-600 flex items-center gap-2">
                                <TrendingUp size={14} />
                                Depósitos no reflejados:
                              </span>
                              <span className="font-semibold text-green-600">{formatCurrency(item.conciliacion.mas_depositos || 0)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-red-600 flex items-center gap-2">
                                <TrendingDown size={14} />
                                Retiros no reflejados:
                              </span>
                              <span className="font-semibold text-red-600">{formatCurrency(item.conciliacion.menos_retiros || 0)}</span>
                            </div>
                            <div className="flex justify-between py-3 bg-blue-50 rounded-lg px-3 mt-2">
                              <span className="font-semibold text-blue-900">Saldo Final Calculado:</span>
                              <span className="font-bold text-lg text-blue-700">{formatCurrency(item.conciliacion.saldo_final_calculado || 0)}</span>
                            </div>

                            {Math.abs(item.conciliacion.diferencia || 0) > 0.01 && (
                              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <span className="text-amber-700 font-medium flex items-center gap-2">
                                    <AlertTriangle size={14} />
                                    Diferencia detectada:
                                  </span>
                                  <span className="font-bold text-amber-800">{formatCurrency(Math.abs(item.conciliacion.diferencia || 0))}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab: Segmentación */}
                  {activeTab01 === 'segmentacion' && (
                    <div className="p-6 bg-bechapra-light-3">
                      <h3 className="text-base font-semibold text-bechapra-text-primary mb-4">Análisis por Segmentos</h3>
                      
                      {(() => {
                        const categorias = new Map<string, { count: number; total: number }>()
                        
                        datosModulo01.allMovements.forEach((mov: any) => {
                          const cat = mov.categoria || 'Sin categoría'
                          if (!categorias.has(cat)) {
                            categorias.set(cat, { count: 0, total: 0 })
                          }
                          const current = categorias.get(cat)!
                          current.count++
                          current.total += (mov.cargo || 0) + (mov.abono || 0)
                        })

                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from(categorias.entries()).map(([cat, data]) => (
                              <div key={cat} className="bg-white border border-bechapra-border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                <h4 className="font-semibold text-gray-900 mb-3">{cat}</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Movimientos:</span>
                                    <span className="font-medium text-gray-900">{data.count}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Total:</span>
                                    <span className="font-semibold text-bechapra-primary">{formatCurrency(data.total)}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      })()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Módulo 3: XML */}
        {reporteData.modulo3 && reporteData.modulo3.success && (
          <div className="bg-white rounded-xl border border-bechapra-border overflow-hidden">
            <button
              onClick={() => toggleSection('modulo3')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-bechapra-light-3 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <FileText className="text-green-600" size={20} />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-bold text-bechapra-text-primary">
                    Conciliación XML
                  </h2>
                  <p className="text-sm text-bechapra-text-secondary">
                    {reporteData.modulo3.resumen?.total_emitidas || 0} emitidas • {reporteData.modulo3.resumen?.total_recibidas || 0} recibidas
                  </p>
                </div>
              </div>
              {expandedSections.has('modulo3') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {expandedSections.has('modulo3') && (
              <div className="border-t border-bechapra-border p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <p className="text-xs text-green-600 mb-1">Facturas Emitidas</p>
                    <p className="text-2xl font-bold text-green-700">{reporteData.modulo3.resumen?.total_emitidas || 0}</p>
                    <p className="text-sm text-green-600 mt-1">{formatCurrency(reporteData.modulo3.resumen?.monto_emitidas || 0)}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                    <p className="text-xs text-red-600 mb-1">Facturas Recibidas</p>
                    <p className="text-2xl font-bold text-red-700">{reporteData.modulo3.resumen?.total_recibidas || 0}</p>
                    <p className="text-sm text-red-600 mt-1">{formatCurrency(reporteData.modulo3.resumen?.monto_recibidas || 0)}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <p className="text-xs text-blue-600 mb-1">Coincidencias</p>
                    <p className="text-2xl font-bold text-blue-700">{reporteData.modulo3.resumen?.coincidencias || 0}</p>
                    <p className="text-sm text-blue-600 mt-1">{(reporteData.modulo3.resumen?.porcentaje_match || 0)}% Match</p>
                  </div>
                  <div className={`${(reporteData.modulo3.resumen?.balance || 0) >= 0 ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'} rounded-lg p-4 border`}>
                    <p className="text-xs text-gray-600 mb-1">Balance</p>
                    <p className={`text-2xl font-bold ${(reporteData.modulo3.resumen?.balance || 0) >= 0 ? 'text-green-700' : 'text-amber-700'}`}>
                      {formatCurrency(Math.abs(reporteData.modulo3.resumen?.balance || 0))}
                    </p>
                    <p className="text-sm mt-1 flex items-center gap-1">
                      {(reporteData.modulo3.resumen?.balance || 0) >= 0 ? <TrendingUp size={14} className="text-green-600" /> : <TrendingDown size={14} className="text-amber-600" />}
                      <span className={(reporteData.modulo3.resumen?.balance || 0) >= 0 ? 'text-green-600' : 'text-amber-600'}>
                        {(reporteData.modulo3.resumen?.balance || 0) >= 0 ? 'Positivo' : 'Negativo'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Módulo 4: SUA */}
        {reporteData.modulo4 && reporteData.modulo4.success && (
          <div className="bg-white rounded-xl border border-bechapra-border overflow-hidden">
            <button
              onClick={() => toggleSection('modulo4')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-bechapra-light-3 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Users className="text-purple-600" size={20} />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-bold text-bechapra-text-primary">
                    SUA - IMSS
                  </h2>
                  <p className="text-sm text-bechapra-text-secondary">
                    {reporteData.modulo4.resumen?.num_cotizantes || 0} trabajadores cotizantes
                  </p>
                </div>
              </div>
              {expandedSections.has('modulo4') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {expandedSections.has('modulo4') && (
              <div className="border-t border-bechapra-border p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <p className="text-xs text-blue-600 mb-1">Total a Pagar</p>
                    <p className="text-2xl font-bold text-blue-700">{formatCurrency(reporteData.modulo4.resumen?.total_pagar || 0)}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <p className="text-xs text-green-600 mb-1">Cotizantes</p>
                    <p className="text-2xl font-bold text-green-700">{reporteData.modulo4.resumen?.num_cotizantes || 0}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <p className="text-xs text-purple-600 mb-1">Cuota Patronal</p>
                    <p className="text-2xl font-bold text-purple-700">{formatCurrency(reporteData.modulo4.analisis?.totales?.patronal || 0)}</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                    <p className="text-xs text-amber-600 mb-1">Cuota Obrera</p>
                    <p className="text-2xl font-bold text-amber-700">{formatCurrency(reporteData.modulo4.analisis?.totales?.obrera || 0)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mensaje si no hay módulos */}
        {!reporteData.modulo1 && !reporteData.modulo3 && !reporteData.modulo4 && (
          <div className="bg-white rounded-xl border border-bechapra-border p-12 text-center">
            <AlertTriangle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-lg font-medium text-gray-600">No hay datos procesados</p>
          </div>
        )}
      </div>
    </div>
  )
}