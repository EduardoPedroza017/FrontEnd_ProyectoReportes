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

  // Verificar salud del backend
  healthCheck: async () => {
    const response = await fetch(`${API_BASE_URL}/health`)
    return await response.json()
  }
}