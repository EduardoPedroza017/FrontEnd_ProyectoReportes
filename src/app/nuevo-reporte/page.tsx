'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { useSearchParams } from 'next/navigation'
import { useToast } from './../../hooks/useToast'
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
  Calendar,
  LucideIcon
} from 'lucide-react'

import { api } from '../../lib/api'
import Link from 'next/link'
import router from 'next/dist/shared/lib/router/router'
import { useRouter } from 'next/navigation'



// Tipos
interface FileWithPreview extends File {
  preview?: string
}

interface ModuleData {
  id: number
  name: string
  subtitle: string
  icon: LucideIcon
  status: 'ready' | 'coming' | 'disabled'
  acceptedTypes: string[]
  fileSlots: FileSlot[]
  files: FileWithPreview[]
  isDynamic?: boolean 
}

interface FileSlot {
  id: string
  label: string
  accept: string[]
  required: boolean
  multiple?: boolean
  file?: FileWithPreview | FileWithPreview[]
  options?: string[]
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
    subtitle: 'Análisis de reembolsos empresariales',
    icon: CreditCard,
    status: 'ready',
    acceptedTypes: ['.msg'],
    fileSlots: [
      {
        id: 'archivos_msg',
        label: 'Archivos .msg de Reembolsos',
        accept: ['application/vnd.ms-outlook', '.msg'],
        required: true,
        multiple: true,
        file: [] 
      }
    ],
    files: []  // ← AGREGAR ESTA LÍNEA
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
  subtitle: 'Gestión de nómina y dispersión',
  icon: Users,
  status: 'ready',
  acceptedTypes: ['.zip'],
  fileSlots: [
    {
      id: 'tipo',
      label: 'Tipo de nómina',
      accept: ['select'],
      required: true,
      options: ['mensual', 'quincenal', 'semanal']
    },
    // Los slots de ZIP se generan dinámicamente según el tipo
  ],
  files: [],
  isDynamic: true // Flag para indicar que este módulo genera campos dinámicamente
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

  {
  id: 11,
  name: 'Módulo 11: Estados Financieros',
  subtitle: 'Balance General y Estado de Resultados',
  icon: FileText,
  status: 'ready',
  acceptedTypes: ['.xlsx', '.xls'],
  fileSlots: [
    { 
      id: 'excel', 
      label: 'Excel con Estados Financieros (CONTPAQi)', 
      accept: ['.xlsx', '.xls'], 
      required: true 
    }
  ],
  files: []
},
]

export default function NuevoReportePage() {
  const router = useRouter()
  const [modules, setModules] = useState<ModuleData[]>(initialModules)
  const [expandedModules, setExpandedModules] = useState<number[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [tipoNominaSeleccionado, setTipoNominaSeleccionado] = useState<string>('')
  const searchParams = useSearchParams()
  const periodoId = searchParams.get('periodo_id')
  const { showToast, ToastContainer } = useToast()

  // Generar slots dinámicos para módulo 06 según tipo de nómina
  const generarSlotsNomina = (tipo: string) => {
    const numZips = tipo === 'mensual' ? 1 : tipo === 'quincenal' ? 2 : 4
    const slots = [
      {
        id: 'tipo',
        label: 'Tipo de nómina',
        accept: ['select'],
        required: true,
        options: ['mensual', 'quincenal', 'semanal']
      }
    ]

    for (let i = 0; i < numZips; i++) {
      slots.push({
        id: `zip_${i}`,
        label: `ZIP Periodo ${i + 1}${tipo === 'mensual' ? '' : ` (${tipo === 'semanal' ? `Semana ${i + 1}` : `Quincena ${i + 1}`})`}`,
        accept: ['.zip'],
        required: true, 
        options: []
      })
    }

    return slots
  }

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }
  // ==========================================
  // CARGAR ARCHIVOS DESDE PERIODO
  // ==========================================
  useEffect(() => {
    if (periodoId) {
      cargarArchivosDePeriodo(periodoId)
    }
  }, [periodoId])

  const cargarArchivosDePeriodo = async (id: string) => {
    console.log('🔄 Cargando archivos del periodo:', id)
    setIsProcessing(true)
    
    try {
      const res = await fetch(`http://localhost:8000/api/centro-documentos/periodos/${id}/archivos`)
      
      if (!res.ok) {
        throw new Error('Error al obtener archivos del periodo')
      }
      
      const archivos = await res.json()
      console.log('📁 Archivos obtenidos:', archivos)
      
      if (archivos.length === 0) {
        showToast('No hay archivos en este periodo', 'warning')  // ✅ Toast
        setIsProcessing(false)
        return
      }
      
      // Descargar cada archivo y convertirlo a File
      let archivosDescargados = 0
      for (const archivo of archivos) {
        try {
          const fileRes = await fetch(`http://localhost:8000/api/centro-documentos/descargar/${archivo.id}`)
          
          if (!fileRes.ok) {
            console.error(`❌ Error descargando ${archivo.nombre_original}`)
            continue
          }
          
          const blob = await fileRes.blob()
          const file = new File([blob], archivo.nombre_original, { 
            type: archivo.tipo_archivo || 'application/octet-stream' 
          })

          // Crear un FileList válido usando DataTransfer
          const dataTransfer = new DataTransfer()
          dataTransfer.items.add(file)
          const fileList = dataTransfer.files

          const moduloNum = parseInt(archivo.modulo.replace('modulo', ''))
          console.log(`📥 Cargando ${archivo.nombre_original} en módulo ${moduloNum}`)
          handleFileChange(moduloNum, archivo.nombre_original, fileList)  // ✅ Ahora usa FileList
          archivosDescargados++
          
        } catch (error) {
          console.error(`❌ Error procesando ${archivo.nombre_original}:`, error)
        }
      }
      
      if (archivosDescargados > 0) {
        showToast(
          `${archivosDescargados} archivo(s) cargado(s) correctamente.\n\nHaz clic en "Procesar Documentos" para generar el reporte.`,
          'success'
        )  // ✅ Toast
      } else {
        showToast('No se pudo cargar ningún archivo', 'error')  // ✅ Toast
      }
      
    } catch (error) {
      console.error('❌ Error cargando archivos:', error)
      showToast(
        'Error al cargar archivos del periodo.\nVerifica que el backend esté corriendo.',
        'error'
      )  // ✅ Toast
    } finally {
      setIsProcessing(false)
    }
  }


  const handleFileChange = (moduleId: number, slotId: string, files: FileList | null) => {
    if (!files || files.length === 0) {
      console.log('⚠️ No hay archivos para procesar')
      return
    }

    console.log('🔍 handleFileChange:', { moduleId, slotId, files: Array.from(files).map(f => f.name) })

    setModules(prev => {
      return prev.map(mod => {
        // Solo procesar el módulo correcto
        if (mod.id !== moduleId) return mod

        // Si tiene slots definidos
        if (mod.fileSlots.length > 0) {
          const newSlots = mod.fileSlots.map(slot => {
            // Solo actualizar el slot correcto
            if (slot.id !== slotId) return slot

            // Manejo de archivos múltiples
            if (slot.multiple) {
              const existingFiles = Array.isArray(slot.file) ? slot.file : []
              return { 
                ...slot, 
                file: [...existingFiles, ...Array.from(files)] 
              }
            }
            
            // Archivo único
            return { 
              ...slot, 
              file: files[0] 
            }
          })

          console.log('✅ Slots actualizados:', newSlots)
          return { ...mod, fileSlots: newSlots }
        }

        // Si no tiene slots, usar files general
        return {
          ...mod,
          files: [...mod.files, ...Array.from(files)]
        }
      })
    })
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

  // ============================================
  // Construir array de archivos para BD
  // ============================================
  const construirArrayArchivos = () => {
    const archivosArray: any[] = []
    
    // Recorrer todos los módulos activos
    modules.forEach((module) => {
      const moduloId = `modulo${module.id}`
      
      // Procesar fileSlots (módulos con slots definidos)
      module.fileSlots.forEach((slot) => {
        if (slot.file) {
          // Si es múltiple (array)
          if (Array.isArray(slot.file)) {
            slot.file.forEach((file: File) => {
              archivosArray.push(crearArchivoObjeto(file, moduloId, slot.id))
            })
          } else {
            // Archivo único
            archivosArray.push(crearArchivoObjeto(slot.file as File, moduloId, slot.id))
          }
        }
      })
      
      // Procesar files genéricos (módulos sin slots)
      module.files.forEach((file: File) => {
        archivosArray.push(crearArchivoObjeto(file, moduloId, 'archivo_generico'))
      })
    })
    
    console.log('📦 ARCHIVOS A GUARDAR:', archivosArray)
    console.log('📦 TOTAL:', archivosArray.length)
    
    return archivosArray
  }

  // Función auxiliar
  const crearArchivoObjeto = (file: File, modulo: string, tipo_documento: string) => {
    let tipoArchivo = 'unknown'
    
    if (file.name.endsWith('.pdf')) tipoArchivo = 'pdf'
    else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) tipoArchivo = 'excel'
    else if (file.name.endsWith('.zip')) tipoArchivo = 'zip'
    else if (file.name.endsWith('.xml')) tipoArchivo = 'xml'
    else if (file.name.endsWith('.txt')) tipoArchivo = 'txt'
    
    return {
      nombre_original: file.name,
      nombre_guardado: file.name,
      ruta_almacenamiento: `/uploads/${file.name}`,
      tipo_archivo: tipoArchivo,
      tamano_bytes: file.size,
      modulo: modulo,
      tipo_documento: tipo_documento
    }
  }


    
  const processAllModules = async () => {
    setIsProcessing(true)
    
    try {
      const results: any = {}
      
      // Verificar que el backend esté disponible
      try {
        await api.healthCheck()
      } catch (error) {
        alert('⚠️ El backend no está disponible. Por favor inicia el servidor FastAPI.')
        setIsProcessing(false)
        return
      }
      
      // Procesar cada módulo con archivos
      for (const module of modules) {
        const fileCount = getModuleFileCount(module)
        if (fileCount === 0) continue
        
        try {
          switch (module.id) {
            case 1: // Estados de Cuenta
              if (module.files.length > 0) {
                results.modulo1 = await api.uploadEstadosCuenta(module.files)
              }
              break

            case 2: // Reembolsos
              const msgSlot = module.fileSlots.find(s => s.id === 'archivos_msg')
              if (msgSlot && msgSlot.file && Array.isArray(msgSlot.file) && msgSlot.file.length > 0) {
                console.log(`📧 Procesando Módulo 02: ${msgSlot.file.length} archivos .msg`)
                
                const formData = new FormData()
                msgSlot.file.forEach(file => {
                  formData.append('archivos', file)
                })

                try {
                  const response = await fetch('http://localhost:8000/upload-reembolsos', {
                    method: 'POST',
                    body: formData
                  })

                  if (response.ok) {
                    const data = await response.json()
                    results.modulo2 = data
                    console.log('✅ Módulo 02 procesado:', data)
                  } else {
                    const errorText = await response.text()
                    console.error('❌ Error en Módulo 02:', errorText)
                    results.modulo2 = { 
                      success: false, 
                      error: `Error HTTP ${response.status}: ${errorText}` 
                    }
                  }
                } catch (error: any) {
                  console.error('❌ Error procesando Módulo 02:', error)
                  results.modulo2 = { 
                    success: false, 
                    error: error.message 
                  }
                }
              }
              break
              
            case 3:
              // Módulo 03: XML - Facturas
              const excelXmlSlot = module.fileSlots.find(s => s.id === 'excel')
              const emitidosXmlSlot = module.fileSlots.find(s => s.id === 'emitidos')
              const recibidosXmlSlot = module.fileSlots.find(s => s.id === 'recibidos')
              
              if (excelXmlSlot && excelXmlSlot.file && emitidosXmlSlot && emitidosXmlSlot.file && recibidosXmlSlot && recibidosXmlSlot.file) {
                const excel = excelXmlSlot.file as File
                const emitidos = emitidosXmlSlot.file as File
                const recibidos = recibidosXmlSlot.file as File
                
                console.log('📋 Procesando Módulo 03: XML')
                const modulo3Data = await api.uploadXML(excel, emitidos, recibidos)
                results.modulo3 = modulo3Data
                console.log('✅ Módulo 3 completado:', modulo3Data)
              } else {
                console.warn('⚠️ Módulo 3: Faltan archivos obligatorios')
              }
              break
              
            case 4: // SUA
              const cedulaSlot = module.fileSlots.find(s => s.id === 'cedula')
              const resumenSlot = module.fileSlots.find(s => s.id === 'resumen')
              const sipareSlot = module.fileSlots.find(s => s.id === 'sipare')
              const comprobanteSlot = module.fileSlots.find(s => s.id === 'comprobante')
              
              console.log('🔍 Módulo 4 - cedulaSlot:', cedulaSlot)
              
              if (cedulaSlot?.file) {
                console.log('✅ Procesando Módulo 4 (SUA)...')
                results.modulo4 = await api.uploadSUA({
                  cedula: cedulaSlot.file as File,
                  resumen: resumenSlot?.file as File | undefined,
                  sipare: sipareSlot?.file as File | undefined,
                  comprobante: comprobanteSlot?.file as File | undefined
                })
                console.log('✅ Respuesta Módulo 4:', results.modulo4)
              } else {
                console.warn('⚠️ Módulo 4: Falta la cédula de determinación')
              }
              break

            case 5: // ISN
            const excelIsnSlot = module.fileSlots.find(s => s.id === 'excel')
            const lineaSlot = module.fileSlots.find(s => s.id === 'linea')
            const comprobanteIsnSlot = module.fileSlots.find(s => s.id === 'comprobante')
            
            console.log('🔍 Módulo 5 - excelIsnSlot:', excelIsnSlot)
            console.log('🔍 Módulo 5 - lineaSlot:', lineaSlot)
            console.log('🔍 Módulo 5 - comprobanteIsnSlot:', comprobanteIsnSlot)
            
            if (excelIsnSlot?.file && lineaSlot?.file) {
              console.log('✅ Procesando Módulo 5 (ISN)...')
              results.modulo5 = await api.uploadISN(
                excelIsnSlot.file as File,
                lineaSlot.file as File,
                comprobanteIsnSlot?.file as File | undefined
              )
              console.log('✅ Respuesta Módulo 5:', results.modulo5)
            } else {
              console.warn('⚠️ Módulo 5: Faltan archivos (excel o línea de captura)')
            }
            break

            case 6:
              // Módulo 06: Nómina (ZIPs estructurados)
              const tipoNomina = tipoNominaSeleccionado || 'mensual'

              // Recolectar todos los ZIPs
              const zipSlots = module.fileSlots.filter(s => s.id.startsWith('zip_'))
              const archivosZip: File[] = []

              for (const zipSlot of zipSlots) {
                if (zipSlot.file) {
                  // Manejar tanto archivos únicos como arrays
                  if (Array.isArray(zipSlot.file)) {
                    archivosZip.push(...zipSlot.file)  // ✅ Spread para arrays
                  } else {
                    archivosZip.push(zipSlot.file)  // ✅ Push directo para archivo único
                  }
                }
              }

              // Validar que tengamos archivos antes de procesar
              if (archivosZip.length === 0) {
                console.warn('⚠️ Módulo 6: No se encontraron archivos ZIP')
                break
              }

              // Validar que todos sean archivos File válidos
              const todosValidos = archivosZip.every(zip => zip instanceof File && zip.name.endsWith('.zip'))
              if (!todosValidos) {
                console.error('❌ Módulo 6: Algunos archivos no son ZIPs válidos')
                break
              }

              // Validar cantidad según tipo
              const zipEsperados = tipoNomina === 'mensual' ? 1 : tipoNomina === 'quincenal' ? 2 : 4
              if (archivosZip.length !== zipEsperados) {
                console.warn(`⚠️ Módulo 6: Se esperan ${zipEsperados} ZIPs para ${tipoNomina}, se encontraron ${archivosZip.length}`)
                // Puedes decidir si continuar o romper aquí
              }

              console.log('👥 Procesando Módulo 06: Nómina')
              console.log(`📦 Tipo: ${tipoNomina}, ZIPs: ${archivosZip.length}`)
              
              // Debug: mostrar detalles de cada ZIP
              archivosZip.forEach((zip, idx) => {
                console.log(`  📁 ZIP ${idx + 1}: ${zip.name} (${(zip.size / 1024 / 1024).toFixed(2)} MB)`)
              })

              try {
                const modulo6Data = await api.uploadNomina({
                  tipo: tipoNomina,
                  zips: archivosZip
                })
                results.modulo6 = modulo6Data
                console.log('✅ Módulo 6 completado:', modulo6Data)
              } catch (error: any) {
                console.error('❌ Error en Módulo 6:', error.message)
                throw error  // Re-lanzar para que se maneje en el catch principal
              }
              break

              case 7: // FONACOT
              const cedulaFonacotSlot = module.fileSlots.find(s => s.id === 'cedula')
              const fichaFonacotSlot = module.fileSlots.find(s => s.id === 'ficha')
              const comprobanteFonacotSlot = module.fileSlots.find(s => s.id === 'comprobante')
              
              console.log('🔍 Módulo 7 - cedulaFonacotSlot:', cedulaFonacotSlot)
              console.log('🔍 Módulo 7 - fichaFonacotSlot:', fichaFonacotSlot)
              console.log('🔍 Módulo 7 - comprobanteFonacotSlot:', comprobanteFonacotSlot)
              
              if (cedulaFonacotSlot?.file && fichaFonacotSlot?.file) {
                console.log('✅ Procesando Módulo 7 (FONACOT)...')
                results.modulo7 = await api.uploadFonacot(
                  cedulaFonacotSlot.file as File,
                  fichaFonacotSlot.file as File,
                  comprobanteFonacotSlot?.file as File | undefined
                )
                console.log('✅ Respuesta Módulo 7:', results.modulo7)
              } else {
                console.warn('⚠️ Módulo 7: Faltan archivos obligatorios (cédula o ficha)')
              }
              break

              case 8:
              // Módulo 08: Control Fiscal
              const excelFiscalSlot = module.fileSlots.find(s => s.id === 'excel')
              const pdfsFiscalSlot = module.fileSlots.find(s => s.id === 'pdfs')
              
              if (excelFiscalSlot && excelFiscalSlot.file) {
                const excel = excelFiscalSlot.file as File
                const pdfs = pdfsFiscalSlot && Array.isArray(pdfsFiscalSlot.file) ? pdfsFiscalSlot.file as File[] : undefined
                
                console.log('📊 Procesando Módulo 08: Control Fiscal')
                const modulo8Data = await api.uploadFiscal(excel, pdfs)
                results.modulo8 = modulo8Data
                console.log('✅ Módulo 8 completado:', modulo8Data)
              } else {
                console.warn('⚠️ Módulo 8: Falta el archivo Excel')
              }
              break

              case 11: // Estados Financieros
              const excelEstadosSlot = module.fileSlots.find(s => s.id === 'excel')
              
              if (excelEstadosSlot?.file) {
                const excel = excelEstadosSlot.file as File
                
                console.log('📊 Procesando Módulo 11: Estados Financieros')
                const modulo11Data = await api.uploadEstadosFinancieros(excel)
                results.modulo11 = modulo11Data
                console.log('✅ Módulo 11 completado:', modulo11Data)
              } else {
                console.warn('⚠️ Módulo 11: Falta el archivo Excel')
              }
              break

              //*--------------------------------------------*//

          }
        } catch (error: any) {
          console.error(`Error procesando módulo ${module.id}:`, error)
          alert(`Error en ${module.name}: ${error.message}`)
        }
      }
      
      console.log('Resultados de procesamiento:', results)

      // Guardar en sessionStorage (fallback)
      sessionStorage.setItem('reporteData', JSON.stringify(results))
      
      // Intentar guardar en base de datos
      try {
        console.log('💾 Guardando reporte en base de datos...')
        
        const reporteData = {
          nombre: `Reporte ${new Date().toLocaleDateString('es-MX', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}`,
          descripcion: 'Reporte generado automáticamente',
          datos_reporte: results,
          modulos_usados: Object.keys(results),
          num_archivos: getTotalFiles(),
          archivos: construirArrayArchivos()
        }

        const saveResponse = await fetch('http://localhost:8000/api/reportes/guardar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reporteData)
        })

        if (saveResponse.ok) {
          const savedReporte = await saveResponse.json()
          console.log('✅ Reporte guardado con ID:', savedReporte.id)
          
          sessionStorage.setItem('reporteId', savedReporte.id)
          
          setProcessingResults(results)
          setShowResults(true)
          
          // Redirigir automáticamente después de 2 segundos
          setTimeout(() => {
            router.push(`/reportes/ver?id=${savedReporte.id}`)
          }, 2000)
        } else {
          console.error('⚠️ No se pudo guardar en BD, usando sessionStorage')
          setProcessingResults(results)
          setShowResults(true)
        }
      } catch (error) {
        console.error('❌ Error al guardar reporte:', error)
        // Fallback: usar sessionStorage
        setProcessingResults(results)
        setShowResults(true)
      }

      
      // Aquí puedes redirigir al usuario a ver los resultados
      // router.push('/reportes/historial')
      
    } catch (error: any) {
      console.error('Error en procesamiento:', error)
      alert(`Error general: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }


// ✨ AGREGAR AQUÍ - ANTES DE UploadArea
  const ResultsSection = () => {
    const router = useRouter()
    if (!showResults || !processingResults) return null
    
    return (
      <>
      <ToastContainer />  {/* ✅ AGREGAR ESTO */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-bechapra-text-primary">
              📊 Resultados del Procesamiento
            </h2>
            <button
              onClick={() => {
                console.log('🔍 processingResults antes de guardar:', processingResults)
                sessionStorage.setItem('reporteData', JSON.stringify(processingResults))
                console.log('💾 Guardado en sessionStorage')
                router.push('/reportes/ver')
              }}
              className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Ver Reporte Completo
            </button>
          </div>
          
          <div className="space-y-4">
            {Object.entries(processingResults).map(([key, value]: [string, any]) => (
              <div key={key} className="border border-bechapra-border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2 text-bechapra-primary">
                  {key === 'modulo1' && '📄 Estados de Cuenta'}
                  {key === 'modulo3' && '📋 XML - Facturas'}
                  {key === 'modulo4' && '👥 SUA - Seguro Social'}
                  {key === 'modulo5' && '💰 ISN - Impuesto Sobre Nómina'}
                  {key === 'modulo6' && '👥 Nómina'}
                  {key === 'modulo7' && '💳 FONACOT - Créditos'}
                  {key === 'modulo8' && '📊 Control Fiscal'}
                </h3>
                
                {value.success ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 size={20} />
                      <span>Procesado correctamente</span>
                    </div>
                    
                    {key === 'modulo1' && value.por_hoja && (
                      <div className="mt-2 text-sm">
                        <p className="font-medium">Hojas procesadas:</p>
                        <ul className="list-disc list-inside">
                          {Object.keys(value.por_hoja).map((hoja: string) => (
                            <li key={hoja}>{hoja}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {key === 'modulo3' && value.resumen && (
                      <div className="mt-2 text-sm">
                        <p>Total emitidas: {value.resumen.total_emitidas}</p>
                        <p>Total recibidas: {value.resumen.total_recibidas}</p>
                      </div>
                    )}

                    {key === 'modulo4' && '👥 SUA - Seguro Social'}

                    // Y en la parte de visualización de éxito:

                    {key === 'modulo4' && (
                      <div>
                        <div className="flex items-center gap-2 text-green-600 mb-2">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="font-medium">Procesado correctamente</span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>• Empresa: {value.empresa?.nombre}</p>
                          <p>• Trabajadores: {value.resumen?.num_cotizantes}</p>
                          <p>• Total a pagar: ${value.resumen?.total_pagar?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                    )}

                    {key === 'modulo5' && (
                      <div>
                        <div className="flex items-center gap-2 text-green-600 mb-2">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="font-medium">Procesado correctamente</span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>• Periodo: {value.dashboard?.kpis?.periodo}</p>
                          <p>• Empleados: {value.dashboard?.kpis?.num_empleados}</p>
                          <p>• ISN del mes: ${value.dashboard?.kpis?.isn_mes?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                    )}

                    {key === 'modulo6' && (
                      <div>
                        <div className="flex items-center gap-2 text-green-600 mb-2">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="font-medium">Procesado correctamente</span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>• Tipo de nómina: {value.tipo_nomina || 'N/A'}</p>
                          <p>• Periodo: {value.dashboard?.periodo || 'N/A'}</p>
                          <p>• Empleados: {value.dashboard?.num_empleados || 0}</p>
                          <p>• Nómina total: ${value.dashboard?.nomina_total?.toLocaleString('es-MX', { minimumFractionDigits: 2 }) || '0.00'}</p>
                          <p>• Estado: {value.dashboard?.estado_pago || 'PENDIENTE'}</p>
                          {value.dashboard?.alertas && value.dashboard.alertas.length > 0 && (
                            <p className="text-yellow-600">• Alertas: {value.dashboard.alertas.length}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {key === 'modulo7' && (
                      <div>
                        <div className="flex items-center gap-2 text-green-600 mb-2">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="font-medium">Procesado correctamente</span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>• Trabajadores: {value.resumen?.num_trabajadores || 0}</p>
                          <p>• Créditos activos: {value.resumen?.num_creditos || 0}</p>
                          <p>• Total a pagar: ${value.resumen?.total_a_pagar?.toLocaleString('es-MX', { minimumFractionDigits: 2 }) || '0.00'}</p>
                          <p>• Estado: {value.pago?.estado || 'PENDIENTE'}</p>
                          {value.resumen?.proximos_a_liquidar && value.resumen.proximos_a_liquidar.length > 0 && (
                            <p className="text-green-600">• Próximos a liquidar: {value.resumen.proximos_a_liquidar.length}</p>
                          )}
                          {value.alertas && value.alertas.length > 0 && (
                            <p className="text-yellow-600">• Alertas: {value.alertas.length}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {key === 'modulo8' && (
                      <div>
                        <div className="flex items-center gap-2 text-green-600 mb-2">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="font-medium">Procesado correctamente</span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>• Empresa: {value.excel?.razon_social || 'N/A'}</p>
                          <p>• RFC: {value.excel?.rfc || 'N/A'}</p>
                          <p>• Ejercicio: {value.ejercicio || 'N/A'}</p>
                          <p>• Total ISR: ${value.kpis?.total_isr_pagado?.toLocaleString('es-MX', { minimumFractionDigits: 2 }) || '0.00'}</p>
                          <p>• Total IVA: ${value.kpis?.total_iva_pagado?.toLocaleString('es-MX', { minimumFractionDigits: 2 }) || '0.00'}</p>
                          <p>• Total Impuestos: ${value.kpis?.total_impuestos?.toLocaleString('es-MX', { minimumFractionDigits: 2 }) || '0.00'}</p>
                          <p>• Cumplimiento: {value.kpis?.porcentaje_cumplimiento?.toFixed(1) || '0'}%</p>
                          {value.declaraciones && value.declaraciones.total > 0 && (
                            <p className="text-blue-600">• Declaraciones: {value.declaraciones.total} PDFs</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    //*--------------------------------------------*//
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle size={20} />
                    <span>Error: {value.error || 'Error desconocido'}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setShowResults(false)}
              className="flex-1 py-3 bg-bechapra-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Cerrar
            </button>
            <Link
              href="/reportes/historial"
              className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
            >
              Ver Reportes
            </Link>
          </div>
        </div>
      </div>
      </>
    )
  }


  const [processingResults, setProcessingResults] = useState<any>(null)
  const [showResults, setShowResults] = useState(false)
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
    
    // Callback para manejar drop de archivos
    const handleDrop = useCallback((acceptedFiles: File[]) => {
      console.log('📥 Archivos dropeados:', acceptedFiles.map(f => f.name))
      const dataTransfer = new DataTransfer()
      acceptedFiles.forEach(file => dataTransfer.items.add(file))
      handleFileChange(moduleId, slotId, dataTransfer.files)
    }, [moduleId, slotId]) // NO incluir handleFileChange aquí

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: handleDrop,
      accept: {
        'application/pdf': ['.pdf'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        'application/vnd.ms-excel': ['.xls'],
        'application/zip': ['.zip'],
        'application/x-zip-compressed': ['.zip'],
        'text/plain': ['.txt'],
        'application/xml': ['.xml'],
        'text/xml': ['.xml'],
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png'],
        'application/vnd.ms-outlook': ['.msg'],  // ← AGREGAR ESTA LÍNEA
        'application/octet-stream': ['.msg'] 
      },
      multiple
    })

    const hasFile = currentFile && (Array.isArray(currentFile) ? currentFile.length > 0 : true)

    console.log(`🎨 Renderizando ${slotId}:`, { hasFile, currentFile })

    // Si ya hay archivo(s) cargado(s)
    if (hasFile) {
      const files = Array.isArray(currentFile) ? currentFile : [currentFile]
      return (
        <div className="space-y-2">
          {files.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
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

    // Vista de upload vacía
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
                    {/* Módulo 06 - Nómina (Especial) */}
                    {mod.id === 6 ? (
                      <div className="space-y-6">
                        {/* Selector de Tipo de Nómina */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-bechapra-text-primary">
                            Tipo de nómina <span className="text-xs text-bechapra-error">*</span>
                          </label>
                          <select
                            value={tipoNominaSeleccionado}
                            onChange={(e) => {
                              const nuevoTipo = e.target.value
                              setTipoNominaSeleccionado(nuevoTipo)

                              // Regenerar slots según el tipo
                              if (nuevoTipo) {
                                setModules(prev => prev.map(m => {
                                  if (m.id === 6) {
                                    return {
                                      ...m,
                                      fileSlots: generarSlotsNomina(nuevoTipo)
                                    }
                                  }
                                  return m
                                }))
                              }
                            }}
                            className="w-full px-4 py-3 border-2 border-bechapra-border rounded-bechapra focus:border-bechapra-primary focus:outline-none text-lg"
                          >
                            <option value="">Selecciona el tipo de nómina...</option>
                            <option value="mensual">Mensual (1 ZIP)</option>
                            <option value="quincenal">Quincenal (2 ZIPs)</option>
                            <option value="semanal">Semanal (4 ZIPs)</option>
                          </select>
                        </div>

                        {/* Campos de ZIP dinámicos */}
                        {tipoNominaSeleccionado && (
                          <>
                            {/* Instrucciones */}
                            <div className="bg-blue-50 border border-blue-200 rounded-bechapra p-4">
                              <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-blue-900">
                                  <p className="font-semibold mb-2">Estructura de cada ZIP:</p>
                                  <ul className="space-y-1 text-xs">
                                    <li>• Excel_Nomina.xlsx (raíz)</li>
                                    <li>• Carpeta CFDIS/ con PDFs y subcarpeta XMLs/</li>
                                    <li>• Carpeta Comprobantes/ con PDFs</li>
                                    <li>• Carpeta Incidencias/ con Excel (opcional)</li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* Grid de ZIPs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {mod.fileSlots.filter(slot => slot.id !== 'tipo').map((slot) => (
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
                                    key={`upload-${mod.id}-${slot.id}-${slot.file ? Date.now() : 'empty'}`}
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
                          </>
                        )}

                        {!tipoNominaSeleccionado && (
                          <div className="text-center py-8 text-bechapra-text-muted">
                            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Primero selecciona el tipo de nómina</p>
                          </div>
                        )}
                      </div>
                    ) : mod.fileSlots.length > 0 ? (
                      // Otros módulos con slots específicos
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
                              key={`upload-${mod.id}-${slot.id}-${slot.file ? Date.now() : 'empty'}`}
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
              {/* ✨ AGREGAR ESTA LÍNEA AQUÍ */}
              <ResultsSection />
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
