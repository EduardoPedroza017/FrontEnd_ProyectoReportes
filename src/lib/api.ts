// Configuración de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = {
  // Módulo 01: Estados de Cuenta
  uploadEstadosCuenta: async (files: File[]) => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    
    const response = await fetch(`${API_BASE_URL}/upload-multiple`, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) throw new Error('Error al subir archivos')
    return await response.json()
  },

  // Módulo 03: XML
  uploadXML: async (excel: File, emitidos: File, recibidos: File) => {
    const formData = new FormData()
    formData.append('excel', excel)
    formData.append('emitidos', emitidos)
    formData.append('recibidos', recibidos)
    
    const response = await fetch(`${API_BASE_URL}/upload-xml`, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) throw new Error('Error al procesar XML')
    return await response.json()
  },

  // Módulo 04: SUA
  uploadSUA: async (files: { 
    cedula?: File
    resumen?: File
    sipare?: File
    comprobante?: File
  }) => {
    const formData = new FormData()
    if (files.cedula) formData.append('cedula', files.cedula)
    if (files.resumen) formData.append('resumen', files.resumen)
    if (files.sipare) formData.append('sipare', files.sipare)
    if (files.comprobante) formData.append('comprobante', files.comprobante)
    
    const response = await fetch(`${API_BASE_URL}/api/sua/upload-sua`, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) throw new Error('Error al procesar SUA')
    return await response.json()
  },

  // Módulo 05: ISN
  uploadISN: async (excel: File, linea: File, comprobante?: File) => {
    const formData = new FormData()
    formData.append('excel', excel)
    formData.append('linea', linea)
    if (comprobante) formData.append('comprobante', comprobante)
    
    const response = await fetch(`${API_BASE_URL}/upload-isn`, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) throw new Error('Error al procesar ISN')
    return await response.json()
  },

  // Módulo 06: Nómina
  uploadNomina: async (files: {
    tipo: string
    excel?: File
    incidencias?: File
    cfdi_pdfs?: File[]
    cfdi_xmls?: File[]
    comprobantes?: File[]
  }) => {
    const formData = new FormData()
    formData.append('tipo', files.tipo)
    
    if (files.excel) formData.append('excel', files.excel)
    if (files.incidencias) formData.append('incidencias', files.incidencias)
    
    // Archivos múltiples
    if (files.cfdi_pdfs) {
      files.cfdi_pdfs.forEach(file => formData.append('cfdi_pdfs', file))
    }
    if (files.cfdi_xmls) {
      files.cfdi_xmls.forEach(file => formData.append('cfdi_xmls', file))
    }
    if (files.comprobantes) {
      files.comprobantes.forEach(file => formData.append('comprobantes', file))
    }
    
    const response = await fetch(`${API_BASE_URL}/api/nomina/upload`, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) throw new Error('Error al procesar nómina')
    return await response.json()
  },

   // Módulo 07: FONACOT
  uploadFonacot: async (cedula: File, ficha: File, comprobante?: File) => {
    const formData = new FormData()
    formData.append('cedula', cedula)
    formData.append('ficha', ficha)
    if (comprobante) formData.append('comprobante', comprobante)
    
    const response = await fetch(`${API_BASE_URL}/upload-fonacot`, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) throw new Error('Error al procesar FONACOT')
    return await response.json()
  },

  // Generar PDF completo con todos los módulos
  generarPDFCompleto: async (datos: any): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/generar-reporte-completo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    })
    
    if (!response.ok) throw new Error('Error al generar PDF')
    return await response.blob()
  },

  // Verificar salud del backend
  healthCheck: async () => {
    const response = await fetch(`${API_BASE_URL}/health`)
    return await response.json()
  }
}