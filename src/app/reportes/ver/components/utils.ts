// utils.ts - Funciones auxiliares compartidas

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2
  }).format(value)
}

export const formatDate = (date: string): string => {
  try {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch {
    return date
  }
}

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const colorMap: { [key: string]: string } = {
  'sin dato': '#9CA3AF',
  'cobranza': '#E53935',
  'acreedor': '#FBC02D',
  'acreedores': '#FBC02D',
  'comision': '#1E88E5',
  'comisión': '#1E88E5',
  'nomina': '#43A047',
  'nómina': '#43A047',
  'fonacot': '#8E24AA',
  'sua': '#26A69A',
  'sat': '#7CB342',
  'traspaso': '#3F51B5',
  'tdc': '#FF7043',
  'no deducibles': '#FF5722',
  'reembolso': '#9C27B0'
}

export const getColorForType = (tipo: string): string => {
  return colorMap[tipo.toLowerCase()] || '#667eea'
}