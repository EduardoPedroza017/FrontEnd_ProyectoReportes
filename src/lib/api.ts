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

  // Módulo 06: Nómina (ZIPs estructurados)
  uploadNomina: async (files: {
    tipo: string
    zips: File[]
  }) => {
    const formData = new FormData()
    formData.append('tipo', files.tipo)

    // Agregar cada ZIP con el nombre correcto
    files.zips.forEach(zip => {
      formData.append('archivos_zip', zip)  // ✅ Debe ser 'archivos_zip' (plural)
    })

    console.log('📤 Enviando:', { tipo: files.tipo, zips: files.zips.length })

    const response = await fetch(`${API_BASE_URL}/api/nomina/upload`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ Error del backend:', errorData)
      throw new Error('Error al procesar nómina')
    }
    
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

  // Módulo 08: Control Fiscal
  uploadFiscal: async (excel: File, pdfs?: File[]) => {
    // 1. Subir Excel
    const formDataExcel = new FormData()
    formDataExcel.append('file', excel)
    
    const excelResponse = await fetch(`${API_BASE_URL}/api/fiscal/upload-excel`, {
      method: 'POST',
      body: formDataExcel
    })
    
    if (!excelResponse.ok) throw new Error('Error al procesar Excel fiscal')
    const excelData = await excelResponse.json()
    
    // 2. Subir PDFs si existen
    if (pdfs && pdfs.length > 0) {
      for (const pdf of pdfs) {
        const formDataPDF = new FormData()
        formDataPDF.append('file', pdf)
        
        await fetch(`${API_BASE_URL}/api/fiscal/upload-declaracion`, {
          method: 'POST',
          body: formDataPDF
        })
      }
    }
    
    // 3. Obtener datos completos
    const ejercicio = excelData.data?.ejercicio || new Date().getFullYear()
    
    const [resumenResp, kpisResp, declaracionesResp] = await Promise.all([
      fetch(`${API_BASE_URL}/api/fiscal/resumen/${ejercicio}`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/fiscal/kpis/${ejercicio}`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/fiscal/declaraciones`).then(r => r.json())
    ])
    
    return {
      success: true,
      excel: excelData.data,
      resumen: resumenResp.data,
      kpis: kpisResp.data,
      declaraciones: declaracionesResp.data,
      ejercicio
    }
  },

  // Módulo 11: Estados Financieros
  uploadEstadosFinancieros: async (excel: File) => {
    const formData = new FormData()
    formData.append('file', excel)
    
    const response = await fetch(`${API_BASE_URL}/api/estados-financieros/upload-excel`, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) throw new Error('Error al procesar Estados Financieros')
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