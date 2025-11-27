'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  FileUp,
  X,
  ChevronDown,
  ChevronUp,
  FileText,
  FileSpreadsheet,
  Archive,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Play,
  Trash2,
  Info,
  Landmark,
  Receipt,
  Building2,
  Users,
  Briefcase,
  Calculator,
  ClipboardList,
  Fuel,
  CreditCard,
  FileCheck,
  Calendar
} from 'lucide-react'

// Tipos
interface FileWithPreview extends File {
  preview?: string
}

interface ModuleData {
  id: number
  name: string
  subtitle: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  status: 'ready' | 'coming' | 'disabled'
  acceptedTypes: string[]
  fileSlots: FileSlot[]
  files: FileWithPreview[]
}

interface FileSlot {
  id: string
  label: string
  accept: string[]
  required: boolean
  multiple?: boolean
  file?: FileWithPreview | FileWithPreview[]
}

// Configuración de módulos con iconos Lucide
const initialModules: ModuleData[] = [
  {
    id: 1,
    name: 'Módulo 01: Estados de Cuenta',
    subtitle: 'Análisis bancario y conciliación',
    icon: Landmark,
    status: 'ready',
    acceptedTypes: ['.pdf', '.xlsx', '.xls'],
    fileSlots: [],
    files: []
  },
  {
    id: 2,
    name: 'Módulo 02: Reembolsos',
    subtitle: 'Gestión de reembolsos',
    icon: CreditCard,
    status: 'coming',
    acceptedTypes: ['.pdf', '.jpg', '.jpeg', '.png'],
    fileSlots: [],
    files: []
  },
  {
    id: 3,
    name: 'Módulo 03: XML',
    subtitle: 'Facturas emitidas y recibidas',
    icon: Receipt,
    status: 'ready',
    acceptedTypes: ['.xlsx', '.xls', '.zip'],
    fileSlots: [
      { id: 'excel', label: 'Excel con acumulado de facturas', accept: ['.xlsx', '.xls'], required: true },
      { id: 'emitidos', label: 'ZIP de XMLs Emitidos', accept: ['.zip'], required: true },
      { id: 'recibidos', label: 'ZIP de XMLs Recibidos', accept: ['.zip'], required: true },
    ],
    files: []
  },
  {
    id: 4,
    name: 'Módulo 04: SUA',
    subtitle: 'Sistema Único de Autodeterminación',
    icon: Building2,
    status: 'ready',
    acceptedTypes: ['.pdf', '.xlsx', '.xls', '.jpg', '.jpeg', '.png'],
    fileSlots: [
      { id: 'cedula', label: 'Cédula de determinación', accept: ['.pdf', '.xlsx', '.xls'], required: true },
      { id: 'resumen', label: 'Resumen de liquidación', accept: ['.pdf', '.xlsx', '.xls'], required: false },
      { id: 'sipare', label: 'SIPARE (línea de captura)', accept: ['.pdf', '.jpg', '.jpeg', '.png'], required: false },
      { id: 'comprobante', label: 'Comprobante de pago', accept: ['.pdf', '.jpg', '.jpeg', '.png'], required: false },
    ],
    files: []
  },
  {
    id: 5,
    name: 'Módulo 05: ISN',
    subtitle: 'Impuesto Sobre Nómina',
    icon: Briefcase,
    status: 'ready',
    acceptedTypes: ['.xlsx', '.xls', '.pdf'],
    fileSlots: [
      { id: 'excel', label: 'Excel de Nómina (Acumulado Mensual)', accept: ['.xlsx', '.xls'], required: true },
      { id: 'linea', label: 'PDF Línea de Captura', accept: ['.pdf'], required: true },
      { id: 'comprobante', label: 'PDF Comprobante de Pago', accept: ['.pdf'], required: false },
    ],
    files: []
  },
  {
    id: 6,
    name: 'Módulo 06: Nómina',
    subtitle: 'Procesa nómina, CFDI e incidencias',
    icon: Users,
    status: 'ready',
    acceptedTypes: ['.xlsx', '.xls', '.pdf', '.xml'],
    fileSlots: [],
    files: []
  },
  {
    id: 7,
    name: 'Módulo 07: FONACOT',
    subtitle: 'Créditos y descuentos',
    icon: CreditCard,
    status: 'ready',
    acceptedTypes: ['.pdf', '.xlsx', '.xls'],
    fileSlots: [
      { id: 'cedula', label: 'Cédula de Notificación', accept: ['.pdf', '.xlsx', '.xls'], required: true },
      { id: 'ficha', label: 'Ficha de Depósito', accept: ['.pdf'], required: true },
      { id: 'comprobante', label: 'Comprobante de Pago', accept: ['.pdf'], required: false },
    ],
    files: []
  },
  {
    id: 8,
    name: 'Módulo 08: Control Fiscal',
    subtitle: 'Declaraciones ISR e IVA',
    icon: Calculator,
    status: 'ready',
    acceptedTypes: ['.xlsx', '.xls', '.pdf'],
    fileSlots: [
      { id: 'excel', label: 'Excel de Pagos Provisionales', accept: ['.xlsx', '.xls'], required: true },
      { id: 'pdfs', label: 'PDFs de Declaraciones', accept: ['.pdf'], required: false, multiple: true },
    ],
    files: []
  },
  {
    id: 9,
    name: 'Módulo 09: DIOT',
    subtitle: 'Declaración Informativa de Operaciones',
    icon: ClipboardList,
    status: 'ready',
    acceptedTypes: ['.txt', '.xlsx', '.xls'],
    fileSlots: [],
    files: []
  },
  {
    id: 10,
    name: 'Módulo 10: Volumétricos',
    subtitle: 'Reporte de combustibles',
    icon: Fuel,
    status: 'coming',
    acceptedTypes: ['.txt', '.xlsx', '.xls'],
    fileSlots: [],
    files: []
  },
]

export default function NuevoReportePage() {
  const [modules, setModules] = useState<ModuleData[]>(initialModules)
  const [expandedModules, setExpandedModules] = useState<number[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const handleFileChange = (moduleId: number, slotId: string, files: FileList | null) => {
    if (!files) return

    setModules(prev => prev.map(mod => {
      if (mod.id !== moduleId) return mod

      const updatedSlots = mod.fileSlots.map(slot => {
        if (slot.id !== slotId) return slot
        
        if (slot.multiple) {
          const existingFiles = Array.isArray(slot.file) ? slot.file : []
          return { ...slot, file: [...existingFiles, ...Array.from(files)] }
        }
        return { ...slot, file: files[0] }
      })

      // Si no tiene slots definidos, agregar a files general
      if (mod.fileSlots.length === 0) {
        return {
          ...mod,
          files: [...mod.files, ...Array.from(files)]
        }
      }

      return { ...mod, fileSlots: updatedSlots }
    }))
  }

  const removeFile = (moduleId: number, slotId?: string, fileIndex?: number) => {
    setModules(prev => prev.map(mod => {
      if (mod.id !== moduleId) return mod

      if (slotId) {
        const updatedSlots = mod.fileSlots.map(slot => {
          if (slot.id !== slotId) return slot
          
          if (slot.multiple && Array.isArray(slot.file) && fileIndex !== undefined) {
            const newFiles = [...slot.file]
            newFiles.splice(fileIndex, 1)
            return { ...slot, file: newFiles.length > 0 ? newFiles : undefined }
          }
          return { ...slot, file: undefined }
        })
        return { ...mod, fileSlots: updatedSlots }
      }

      // Remover del array general de files
      if (fileIndex !== undefined) {
        const newFiles = [...mod.files]
        newFiles.splice(fileIndex, 1)
        return { ...mod, files: newFiles }
      }

      return mod
    }))
  }

  const getModuleFileCount = (mod: ModuleData): number => {
    let count = mod.files.length
    mod.fileSlots.forEach(slot => {
      if (slot.file) {
        if (Array.isArray(slot.file)) {
          count += slot.file.length
        } else {
          count += 1
        }
      }
    })
    return count
  }

  const getTotalFiles = (): number => {
    return modules.reduce((acc, mod) => acc + getModuleFileCount(mod), 0)
  }

  const getActiveModules = (): number => {
    return modules.filter(mod => getModuleFileCount(mod) > 0).length
  }

  const processAllModules = async () => {
    setIsProcessing(true)
    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsProcessing(false)
    // Aquí iría la lógica real de envío al backend
  }

  // Componente de área de subida genérica
  const UploadArea = ({ 
    moduleId, 
    slotId, 
    label, 
    accept, 
    multiple = false,
    currentFile 
  }: { 
    moduleId: number
    slotId: string
    label: string
    accept: string[]
    multiple?: boolean
    currentFile?: FileWithPreview | FileWithPreview[]
  }) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
      const dataTransfer = new DataTransfer()
      acceptedFiles.forEach(file => dataTransfer.items.add(file))
      handleFileChange(moduleId, slotId, dataTransfer.files)
    }, [moduleId, slotId])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: accept.reduce((acc, type) => {
        const mimeMap: Record<string, string[]> = {
          '.pdf': ['application/pdf'],
          '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
          '.xls': ['application/vnd.ms-excel'],
          '.zip': ['application/zip'],
          '.txt': ['text/plain'],
          '.xml': ['application/xml', 'text/xml'],
          '.jpg': ['image/jpeg'],
          '.jpeg': ['image/jpeg'],
          '.png': ['image/png'],
        }
        type.split(',').forEach(t => {
          const trimmed = t.trim()
          if (mimeMap[trimmed]) {
            mimeMap[trimmed].forEach(mime => {
              if (!acc[mime]) acc[mime] = []
            })
          }
        })
        return acc
      }, {} as Record<string, string[]>),
      multiple
    })

    const hasFile = currentFile && (Array.isArray(currentFile) ? currentFile.length > 0 : true)

    if (hasFile) {
      const files = Array.isArray(currentFile) ? currentFile : [currentFile]
      return (
        <div className="space-y-2">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-bechapra-success-light rounded-bechapra border border-green-200"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-600" size={20} />
                <div>
                  <p className="text-sm font-medium text-green-800">{file.name}</p>
                  <p className="text-xs text-green-600">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(moduleId, slotId, multiple ? idx : undefined)}
                className="p-1.5 rounded-bechapra hover:bg-green-200 text-green-700 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          {multiple && (
            <div
              {...getRootProps()}
              className="p-3 border-2 border-dashed border-bechapra-border rounded-bechapra text-center cursor-pointer hover:border-bechapra-primary hover:bg-bechapra-light-3 transition-all"
            >
              <input {...getInputProps()} />
              <p className="text-sm text-bechapra-text-secondary">+ Agregar más archivos</p>
            </div>
          )}
        </div>
      )
    }

    return (
      <div
        {...getRootProps()}
        className={`
          upload-zone
          ${isDragActive ? 'dragover' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-3">
          <div className="w-14 h-14 mx-auto rounded-bechapra-lg bg-bechapra-light flex items-center justify-center">
            <FileUp className="text-bechapra-primary" size={28} />
          </div>
          <div>
            <p className="font-semibold text-bechapra-text-primary">{label}</p>
            <p className="text-sm text-bechapra-text-secondary mt-1">
              {isDragActive ? 'Suelta el archivo aquí' : 'Click o arrastra tu archivo'}
            </p>
            <p className="text-xs text-bechapra-text-muted mt-2">
              {accept.join(', ')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-bechapra-text-primary">
            Nuevo Reporte
          </h1>
          <p className="text-bechapra-text-secondary mt-1">
            Selecciona los módulos y sube tus archivos para generar un análisis
          </p>
        </div>

        {/* Period selector for Module 03 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-bechapra-text-muted" />
            <label className="text-sm font-medium text-bechapra-text-secondary">
              Periodo:
            </label>
            <input
              type="month"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="input-bechapra w-auto"
            />
          </div>
        </div>
      </div>

      {/* Modules grid */}
      <div className="space-y-4">
        {modules.map((mod) => {
          const isExpanded = expandedModules.includes(mod.id)
          const fileCount = getModuleFileCount(mod)
          const isDisabled = mod.status === 'coming'
          const ModuleIcon = mod.icon

          return (
            <div
              key={mod.id}
              className={`card-bechapra overflow-hidden transition-all duration-300 ${
                isDisabled ? 'opacity-60' : ''
              }`}
            >
              {/* Module header */}
              <button
                onClick={() => !isDisabled && toggleModule(mod.id)}
                disabled={isDisabled}
                className={`
                  w-full p-5 flex items-center justify-between
                  ${!isDisabled ? 'hover:bg-bechapra-light-3 cursor-pointer' : 'cursor-not-allowed'}
                  transition-colors
                `}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-bechapra-md bg-gradient-to-br from-bechapra-primary to-bechapra-primary-dark flex items-center justify-center text-white shadow-button">
                    <ModuleIcon size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-bechapra-text-primary">{mod.name}</h3>
                    <p className="text-sm text-bechapra-text-secondary">{mod.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {fileCount > 0 && (
                    <span className="badge badge-success">
                      {fileCount} archivo{fileCount > 1 ? 's' : ''}
                    </span>
                  )}
                  {isDisabled ? (
                    <span className="badge bg-bechapra-muted text-bechapra-text-muted">
                      Próximamente
                    </span>
                  ) : (
                    <span className="badge badge-primary flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      Listo
                    </span>
                  )}
                  {!isDisabled && (
                    <span className="text-bechapra-text-muted">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </span>
                  )}
                </div>
              </button>

              {/* Module content (accordion) */}
              <div
                className={`
                  overflow-hidden transition-all duration-300 ease-in-out
                  ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                <div className="p-5 pt-0 border-t border-bechapra-border-light">
                  <div className="pt-5 space-y-4">
                    {mod.fileSlots.length > 0 ? (
                      // Módulos con slots específicos
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mod.fileSlots.map((slot) => (
                          <div key={slot.id} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <label className="text-sm font-medium text-bechapra-text-primary">
                                {slot.label}
                              </label>
                              {slot.required && (
                                <span className="text-xs text-bechapra-error">*</span>
                              )}
                            </div>
                            <UploadArea
                              moduleId={mod.id}
                              slotId={slot.id}
                              label={slot.label}
                              accept={slot.accept}
                              multiple={slot.multiple}
                              currentFile={slot.file}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Módulos con upload genérico
                      <div className="space-y-4">
                        <UploadArea
                          moduleId={mod.id}
                          slotId="general"
                          label="Subir archivos"
                          accept={mod.acceptedTypes}
                          multiple
                          currentFile={mod.files}
                        />
                        {mod.files.length > 0 && (
                          <div className="space-y-2">
                            {mod.files.map((file, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 bg-bechapra-light rounded-bechapra"
                              >
                                <div className="flex items-center gap-3">
                                  <FileText className="text-bechapra-primary" size={18} />
                                  <span className="text-sm font-medium text-bechapra-text-primary">
                                    {file.name}
                                  </span>
                                </div>
                                <button
                                  onClick={() => removeFile(mod.id, undefined, idx)}
                                  className="p-1.5 rounded-bechapra hover:bg-bechapra-border text-bechapra-text-muted hover:text-bechapra-error transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Processing section */}
      <div className="card-bechapra p-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-bechapra-primary">{getActiveModules()}</p>
              <p className="text-sm text-bechapra-text-secondary">Módulos activos</p>
            </div>
            <div className="w-px h-12 bg-bechapra-border hidden sm:block" />
            <div className="text-center">
              <p className="text-3xl font-bold text-bechapra-primary">{getTotalFiles()}</p>
              <p className="text-sm text-bechapra-text-secondary">Archivos totales</p>
            </div>
          </div>

          <button
            onClick={processAllModules}
            disabled={getTotalFiles() === 0 || isProcessing}
            className="btn-primary min-w-[200px]"
          >
            {isProcessing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Play size={18} />
                Procesar y Analizar
              </>
            )}
          </button>
        </div>

        {getTotalFiles() === 0 && (
          <div className="mt-4 flex items-center gap-2 text-bechapra-text-muted">
            <Info size={16} />
            <span className="text-sm">Selecciona al menos un módulo y sube archivos para comenzar</span>
          </div>
        )}
      </div>
    </div>
  )
}
