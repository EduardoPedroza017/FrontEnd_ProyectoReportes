'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  FolderOpen,
  FileText,
  FileSpreadsheet,
  FileImage,
  Archive,
  Download,
  Eye,
  ChevronRight,
  Filter,
  Clock,
  HardDrive,
  Grid3X3,
  List,
  MoreVertical
} from 'lucide-react'

// Mock data
const reportDocuments = [
  {
    id: 'RPT-2024-001',
    name: 'Análisis Fiscal Q4 2024',
    date: '26 Nov 2024',
    folders: [
      {
        name: 'Módulo 03 - XML',
        documents: [
          { name: 'facturas_emitidas.xlsx', type: 'excel', size: '2.4 MB', date: '26 Nov 2024' },
          { name: 'xmls_emitidos.zip', type: 'zip', size: '5.1 MB', date: '26 Nov 2024' },
          { name: 'xmls_recibidos.zip', type: 'zip', size: '4.8 MB', date: '26 Nov 2024' },
        ]
      },
      {
        name: 'Módulo 04 - SUA',
        documents: [
          { name: 'cedula_determinacion.pdf', type: 'pdf', size: '1.2 MB', date: '26 Nov 2024' },
          { name: 'resumen_liquidacion.pdf', type: 'pdf', size: '890 KB', date: '26 Nov 2024' },
          { name: 'comprobante_pago.jpg', type: 'image', size: '450 KB', date: '26 Nov 2024' },
        ]
      },
      {
        name: 'Módulo 08 - Control Fiscal',
        documents: [
          { name: 'pagos_provisionales.xlsx', type: 'excel', size: '1.8 MB', date: '26 Nov 2024' },
          { name: 'declaracion_isr.pdf', type: 'pdf', size: '520 KB', date: '26 Nov 2024' },
          { name: 'declaracion_iva.pdf', type: 'pdf', size: '480 KB', date: '26 Nov 2024' },
        ]
      },
      {
        name: 'Resultados',
        documents: [
          { name: 'reporte_analisis_q4.pdf', type: 'pdf', size: '3.2 MB', date: '26 Nov 2024' },
          { name: 'resumen_ejecutivo.pdf', type: 'pdf', size: '1.1 MB', date: '26 Nov 2024' },
        ]
      }
    ]
  },
  {
    id: 'RPT-2024-002',
    name: 'Conciliación Bancaria Noviembre',
    date: '25 Nov 2024',
    folders: [
      {
        name: 'Módulo 01 - Estados de Cuenta',
        documents: [
          { name: 'estado_cuenta_bbva.pdf', type: 'pdf', size: '1.8 MB', date: '25 Nov 2024' },
          { name: 'estado_cuenta_santander.pdf', type: 'pdf', size: '2.1 MB', date: '25 Nov 2024' },
          { name: 'movimientos_consolidados.xlsx', type: 'excel', size: '980 KB', date: '25 Nov 2024' },
        ]
      },
      {
        name: 'Resultados',
        documents: [
          { name: 'conciliacion_bancaria.pdf', type: 'pdf', size: '2.5 MB', date: '25 Nov 2024' },
          { name: 'reporte_movimientos.xlsx', type: 'excel', size: '1.4 MB', date: '25 Nov 2024' },
        ]
      }
    ]
  },
  {
    id: 'RPT-2024-003',
    name: 'Nómina Quincenal Nov-2',
    date: '24 Nov 2024',
    folders: [
      {
        name: 'Módulo 05 - ISN',
        documents: [
          { name: 'nomina_quincenal.xlsx', type: 'excel', size: '1.2 MB', date: '24 Nov 2024' },
          { name: 'linea_captura_isn.pdf', type: 'pdf', size: '380 KB', date: '24 Nov 2024' },
        ]
      },
      {
        name: 'Módulo 06 - Nómina',
        documents: [
          { name: 'dispersion_nomina.xlsx', type: 'excel', size: '890 KB', date: '24 Nov 2024' },
          { name: 'cfdi_nomina.zip', type: 'zip', size: '2.4 MB', date: '24 Nov 2024' },
          { name: 'incidencias.xlsx', type: 'excel', size: '340 KB', date: '24 Nov 2024' },
        ]
      }
    ]
  }
]

export default function DocumentosReportePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="text-red-500" size={20} />
      case 'excel':
        return <FileSpreadsheet className="text-green-600" size={20} />
      case 'zip':
        return <Archive className="text-amber-500" size={20} />
      case 'image':
        return <FileImage className="text-blue-500" size={20} />
      default:
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

  const filteredReports = reportDocuments.filter(report =>
    report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedReportData = selectedReport
    ? reportDocuments.find(r => r.id === selectedReport)
    : null

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Reports sidebar */}
        <div className="lg:col-span-4">
          <div className="card-bechapra overflow-hidden">
            <div className="p-4 border-b border-bechapra-border-light">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-bechapra-text-muted" size={18} />
                <input
                  type="text"
                  placeholder="Buscar reporte..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-bechapra pl-10 py-2.5"
                />
              </div>
            </div>

            <div className="max-h-[600px] overflow-y-auto">
              {filteredReports.map((report) => {
                const totalDocs = report.folders.reduce((acc, f) => acc + f.documents.length, 0)
                const isSelected = selectedReport === report.id

                return (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`
                      w-full p-4 text-left border-b border-bechapra-border-light
                      transition-all duration-200
                      ${isSelected
                        ? 'bg-bechapra-light border-l-4 border-l-bechapra-primary'
                        : 'hover:bg-bechapra-light-3'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        w-10 h-10 rounded-bechapra flex items-center justify-center flex-shrink-0
                        ${isSelected ? 'bg-bechapra-primary text-white' : 'bg-bechapra-light text-bechapra-primary'}
                      `}>
                        <FolderOpen size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold truncate ${isSelected ? 'text-bechapra-primary' : 'text-bechapra-text-primary'}`}>
                          {report.name}
                        </p>
                        <p className="text-xs text-bechapra-text-muted font-mono">{report.id}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-bechapra-text-secondary">
                          <span className="flex items-center gap-1">
                            <FileText size={12} />
                            {totalDocs} documentos
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {report.date}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={16} className={`text-bechapra-text-muted flex-shrink-0 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Documents viewer */}
        <div className="lg:col-span-8">
          {selectedReportData ? (
            <div className="card-bechapra overflow-hidden">
              {/* Header */}
              <div className="p-5 border-b border-bechapra-border-light">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-bechapra-text-primary">
                      {selectedReportData.name}
                    </h2>
                    <p className="text-sm text-bechapra-text-secondary mt-0.5">
                      {selectedReportData.folders.length} carpetas • {selectedReportData.folders.reduce((acc, f) => acc + f.documents.length, 0)} documentos
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-bechapra transition-colors ${viewMode === 'grid' ? 'bg-bechapra-primary text-white' : 'hover:bg-bechapra-light text-bechapra-text-muted'}`}
                    >
                      <Grid3X3 size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-bechapra transition-colors ${viewMode === 'list' ? 'bg-bechapra-primary text-white' : 'hover:bg-bechapra-light text-bechapra-text-muted'}`}
                    >
                      <List size={18} />
                    </button>
                    <button className="btn-secondary py-2">
                      <Download size={16} />
                      Descargar Todo
                    </button>
                  </div>
                </div>
              </div>

              {/* Folders and files */}
              <div className="p-5 space-y-4">
                {selectedReportData.folders.map((folder, folderIndex) => {
                  const folderId = `${selectedReportData.id}-${folderIndex}`
                  const isExpanded = expandedFolders.includes(folderId)

                  return (
                    <div key={folderId} className="border border-bechapra-border-light rounded-bechapra-md overflow-hidden">
                      {/* Folder header */}
                      <button
                        onClick={() => toggleFolder(folderId)}
                        className="w-full p-4 flex items-center justify-between bg-bechapra-light-3 hover:bg-bechapra-light transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FolderOpen className="text-bechapra-primary" size={20} />
                          <span className="font-medium text-bechapra-text-primary">{folder.name}</span>
                          <span className="text-sm text-bechapra-text-muted">({folder.documents.length} archivos)</span>
                        </div>
                        <ChevronRight
                          size={18}
                          className={`text-bechapra-text-muted transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        />
                      </button>

                      {/* Files */}
                      {isExpanded && (
                        <div className={viewMode === 'grid' ? 'p-4 grid grid-cols-2 md:grid-cols-3 gap-3' : 'divide-y divide-bechapra-border-light'}>
                          {folder.documents.map((doc, docIndex) => (
                            viewMode === 'grid' ? (
                              <div
                                key={docIndex}
                                className="group p-4 bg-white border border-bechapra-border-light rounded-bechapra hover:border-bechapra-primary/30 hover:shadow-card transition-all cursor-pointer"
                              >
                                <div className="flex flex-col items-center text-center">
                                  <div className="w-12 h-12 rounded-bechapra bg-bechapra-light flex items-center justify-center mb-3">
                                    {getFileIcon(doc.type)}
                                  </div>
                                  <p className="text-sm font-medium text-bechapra-text-primary truncate w-full">
                                    {doc.name}
                                  </p>
                                  <p className="text-xs text-bechapra-text-muted mt-1">{doc.size}</p>
                                </div>
                                <div className="mt-3 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="p-1.5 rounded hover:bg-bechapra-light text-bechapra-text-muted hover:text-bechapra-primary">
                                    <Eye size={14} />
                                  </button>
                                  <button className="p-1.5 rounded hover:bg-bechapra-light text-bechapra-text-muted hover:text-bechapra-primary">
                                    <Download size={14} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div
                                key={docIndex}
                                className="group flex items-center justify-between p-4 hover:bg-bechapra-light-3 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  {getFileIcon(doc.type)}
                                  <div>
                                    <p className="text-sm font-medium text-bechapra-text-primary">{doc.name}</p>
                                    <div className="flex items-center gap-3 text-xs text-bechapra-text-muted mt-0.5">
                                      <span className="flex items-center gap-1">
                                        <HardDrive size={10} />
                                        {doc.size}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Clock size={10} />
                                        {doc.date}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                            )
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