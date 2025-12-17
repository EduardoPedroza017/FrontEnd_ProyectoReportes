'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  FolderOpen,
  FileText,
  FileSpreadsheet,
  Archive,
  FileImage,
  Eye,
  Download,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react'

// Interfaces
interface Reporte {
  id: string
  nombre: string
  descripcion: string | null
  num_archivos: number
  created_at: string
}

interface Archivo {
  id: string
  nombre_original: string
  tipo_archivo: string | null
  tamano_legible: string
  created_at: string
}

interface ArchivosPorModulo {
  [modulo: string]: Archivo[]
}

interface ReporteArchivos {
  reporte: Reporte
  archivos_por_modulo: ArchivosPorModulo
  total_archivos: number
  tamano_total_legible: string
}

// Nombres de módulos
const MODULOS_NOMBRES: Record<string, string> = {
  modulo1: 'Módulo 01 - Estados de Cuenta',
  modulo3: 'Módulo 03 - XML Facturas',
  modulo4: 'Módulo 04 - SUA',
  modulo5: 'Módulo 05 - ISN',
  modulo6: 'Módulo 06 - Nómina',
  modulo7: 'Módulo 07 - FONACOT',
  modulo8: 'Módulo 08 - Control Fiscal',
  modulo11: 'Módulo 11 - Estados Financieros',
  sin_modulo: 'Otros Archivos'
}

export default function DocumentosReportePage() {
  // Estados para reportes
  const [reportes, setReportes] = useState<Reporte[]>([])
  const [loadingReportes, setLoadingReportes] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Estados para archivos del reporte seleccionado
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [reporteArchivos, setReporteArchivos] = useState<ReporteArchivos | null>(null)
  const [loadingArchivos, setLoadingArchivos] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Estados para UI
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])

  // Cargar lista de reportes al montar
  useEffect(() => {
    cargarReportes()
  }, [])

  const cargarReportes = async () => {
    try {
      setLoadingReportes(true)
      setError(null)
      
      const response = await fetch('http://localhost:8000/api/reportes/lista?limit=100')
      
      if (!response.ok) {
        throw new Error('Error al cargar reportes')
      }
      
      const data = await response.json()
      setReportes(data)
      
    } catch (err: any) {
      console.error('Error al cargar reportes:', err)
      setError(err.message || 'Error desconocido al cargar reportes')
    } finally {
      setLoadingReportes(false)
    }
  }

  const cargarArchivosReporte = async (reporteId: string) => {
    try {
      setLoadingArchivos(true)
      setError(null)
      setSelectedReportId(reporteId)
      
      console.log('🔍 Cargando archivos del reporte:', reporteId)
      
      const response = await fetch(`http://localhost:8000/api/reportes/${reporteId}/archivos`)
      
      if (!response.ok) {
        throw new Error('Error al cargar archivos del reporte')
      }
      
      const data = await response.json()
      console.log('✅ Archivos cargados:', data)
      
      if (data.success) {
        setReporteArchivos(data)
        // Auto-expandir todos los módulos al cargar
        setExpandedFolders(Object.keys(data.archivos_por_modulo))
      }
      
    } catch (err: any) {
      console.error('Error al cargar archivos:', err)
      setError(err.message || 'Error al cargar archivos del reporte')
      setReporteArchivos(null)
    } finally {
      setLoadingArchivos(false)
    }
  }

  const getFileIcon = (type: string | null) => {
    const fileType = (type || '').toLowerCase()
    
    if (fileType === 'pdf') {
      return <FileText className="text-red-500" size={20} />
    } else if (fileType === 'xlsx' || fileType === 'xls' || fileType === 'excel') {
      return <FileSpreadsheet className="text-green-600" size={20} />
    } else if (fileType === 'zip') {
      return <Archive className="text-amber-500" size={20} />
    } else if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg') {
      return <FileImage className="text-blue-500" size={20} />
    } else {
      return <FileText className="text-bechapra-text-muted" size={20} />
    }
  }

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(f => f !== folderId)
        : [...prev, folderId]
    )
  }

  const filteredReports = reportes.filter(report =>
    report.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-bechapra-text-primary">
          Documentos por Reporte
        </h1>
        <p className="text-bechapra-text-secondary mt-1">
          Explora y descarga los documentos de cada reporte
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar: Lista de reportes */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card-bechapra p-4">
            <h3 className="font-semibold text-bechapra-text-primary mb-4">Reportes</h3>
            
            {/* Buscador */}
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-bechapra-text-muted"
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar reporte..."
                className="input-bechapra pl-10"
              />
            </div>

            {/* Lista de reportes */}
            {loadingReportes ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin text-bechapra-primary" size={32} />
              </div>
            ) : filteredReports.length === 0 ? (
              <p className="text-center text-bechapra-text-muted py-8">
                No hay reportes disponibles
              </p>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredReports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => cargarArchivosReporte(report.id)}
                    className={`w-full text-left p-3 rounded-bechapra border-2 transition-all ${
                      selectedReportId === report.id
                        ? 'border-bechapra-primary bg-bechapra-light shadow-md'
                        : 'border-bechapra-border hover:border-bechapra-primary hover:bg-bechapra-light-2'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <FolderOpen
                        className={selectedReportId === report.id ? 'text-bechapra-primary' : 'text-bechapra-text-muted'}
                        size={20}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-bechapra-text-primary truncate">
                          {report.nombre}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-bechapra-text-muted">
                          <span>{report.id.slice(0, 8)}</span>
                          <span>•</span>
                          <span>{report.num_archivos} {report.num_archivos === 1 ? 'documento' : 'documentos'}</span>
                        </div>
                        <p className="text-xs text-bechapra-text-muted mt-1">
                          {new Date(report.created_at).toLocaleDateString('es-MX', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main: Archivos del reporte seleccionado */}
        <div className="lg:col-span-2">
          {loadingArchivos ? (
            <div className="card-bechapra p-12 text-center">
              <Loader2 className="animate-spin mx-auto text-bechapra-primary mb-4" size={48} />
              <p className="text-bechapra-text-secondary">Cargando documentos...</p>
            </div>
          ) : error ? (
            <div className="card-bechapra p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="text-red-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-bechapra-text-primary mb-2">
                Error al cargar documentos
              </h3>
              <p className="text-bechapra-text-secondary">{error}</p>
            </div>
          ) : reporteArchivos ? (
            <div className="card-bechapra p-6">
              {/* Header del reporte */}
              <div className="mb-6 pb-4 border-b border-bechapra-border">
                <h2 className="text-xl font-bold text-bechapra-text-primary mb-2">
                  {reporteArchivos.reporte.nombre}
                </h2>
                <div className="flex items-center gap-4 text-sm text-bechapra-text-muted">
                  <span>{reporteArchivos.total_archivos} archivos</span>
                  <span>•</span>
                  <span>{reporteArchivos.tamano_total_legible}</span>
                  <span>•</span>
                  <span>
                    {new Date(reporteArchivos.reporte.created_at).toLocaleDateString('es-MX', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Árbol de carpetas por módulo */}
              <div className="space-y-3">
                {Object.entries(reporteArchivos.archivos_por_modulo).map(([modulo, archivos]) => {
                  const isExpanded = expandedFolders.includes(modulo)
                  const moduloNombre = MODULOS_NOMBRES[modulo] || modulo
                  
                  return (
                    <div key={modulo} className="border border-bechapra-border rounded-bechapra overflow-hidden">
                      {/* Header de la carpeta */}
                      <button
                        onClick={() => toggleFolder(modulo)}
                        className="w-full flex items-center justify-between p-4 bg-bechapra-light hover:bg-bechapra-light-2 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FolderOpen className="text-bechapra-primary" size={20} />
                          <span className="font-medium text-bechapra-text-primary">{moduloNombre}</span>
                          <span className="px-2 py-0.5 bg-bechapra-primary/10 text-bechapra-primary text-xs rounded-full">
                            {archivos.length}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="text-bechapra-text-muted" size={20} />
                        ) : (
                          <ChevronRight className="text-bechapra-text-muted" size={20} />
                        )}
                      </button>

                      {/* Lista de archivos (expandible) */}
                      {isExpanded && (
                        <div className="bg-white">
                          {archivos.map((archivo, index) => (
                            <div
                              key={archivo.id}
                              className={`flex items-center justify-between p-4 hover:bg-bechapra-light-2 transition-colors ${
                                index !== archivos.length - 1 ? 'border-b border-bechapra-border-light' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                {getFileIcon(archivo.tipo_archivo)}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-bechapra-text-primary truncate">
                                    {archivo.nombre_original}
                                  </p>
                                  <p className="text-xs text-bechapra-text-muted mt-0.5">
                                    {archivo.tamano_legible} • {new Date(archivo.created_at).toLocaleDateString('es-MX', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric'
                                    })}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1">
                                <button className="p-2 rounded-bechapra hover:bg-bechapra-light text-bechapra-text-muted hover:text-bechapra-primary transition-colors">
                                  <Eye size={16} />
                                </button>
                                <button className="p-2 rounded-bechapra hover:bg-bechapra-light text-bechapra-text-muted hover:text-bechapra-primary transition-colors">
                                  <Download size={16} />
                                </button>
                                <button className="p-2 rounded-bechapra hover:bg-bechapra-light text-bechapra-text-muted hover:text-bechapra-primary transition-colors">
                                  <MoreVertical size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            // Empty state
            <div className="card-bechapra p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-bechapra-light flex items-center justify-center">
                <FolderOpen className="text-bechapra-text-muted" size={40} />
              </div>
              <h3 className="text-lg font-semibold text-bechapra-text-primary mb-2">
                Selecciona un reporte
              </h3>
              <p className="text-bechapra-text-secondary max-w-md mx-auto">
                Elige un reporte de la lista izquierda para ver todos los documentos asociados
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}