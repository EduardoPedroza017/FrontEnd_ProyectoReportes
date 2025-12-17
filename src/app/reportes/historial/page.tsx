'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  Filter,
  FileText,
  Calendar,
  Eye,
  Trash2,
  Share2,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react'

interface Reporte {
  id: string
  nombre: string
  descripcion: string | null
  modulos_usados: string[]
  estado: string
  created_at: string
  num_archivos: number
}

const MODULOS_NOMBRES: Record<string, string> = {
  modulo1: 'Estados de Cuenta',
  modulo3: 'XML - Facturas',
  modulo4: 'SUA',
  modulo5: 'ISN',
  modulo6: 'Nómina',
  modulo7: 'FONACOT',
  modulo8: 'Control Fiscal',
  modulo11: 'Estados Financieros'
}

export default function HistorialPage() {
  const router = useRouter()
  
  const [reportes, setReportes] = useState<Reporte[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filtros
  const [busqueda, setBusqueda] = useState('')
  const [moduloFiltro, setModuloFiltro] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  
  // Paginación
  const [paginaActual, setPaginaActual] = useState(1)
  const reportesPorPagina = 10

  const cargarReportes = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Construir URL con parámetros de búsqueda
      const params = new URLSearchParams()
      if (busqueda) params.append('buscar', busqueda)
      if (moduloFiltro) params.append('modulo', moduloFiltro)
      if (fechaDesde) params.append('fecha_desde', fechaDesde)
      if (fechaHasta) params.append('fecha_hasta', fechaHasta)
      params.append('limit', '100') // Traer más reportes
      
      const url = `http://localhost:8000/api/reportes/lista?${params.toString()}`
      console.log('🔍 Cargando reportes desde:', url)
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Error al cargar reportes')
      }
      
      const data = await response.json()
      console.log('✅ Reportes cargados:', data.length)
      setReportes(data)
      setPaginaActual(1) // Resetear a primera página al filtrar
      
    } catch (err: any) {
      console.error('Error al cargar reportes:', err)
      setError(err.message || 'Error desconocido al cargar reportes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarReportes()
  }, []) // Cargar al montar el componente

  const aplicarFiltros = () => {
    cargarReportes()
  }

  const limpiarFiltros = () => {
    setBusqueda('')
    setModuloFiltro('')
    setFechaDesde('')
    setFechaHasta('')
    setTimeout(() => cargarReportes(), 100)
  }

  const eliminarReporte = async (id: string, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar el reporte "${nombre}"?`)) {
      return
    }

    try {
      const response = await fetch(`http://localhost:8000/api/reportes/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('✅ Reporte eliminado correctamente')
        cargarReportes() // Recargar la lista
      } else {
        alert('❌ Error al eliminar el reporte')
      }
    } catch (error) {
      console.error('Error al eliminar:', error)
      alert('❌ Error al eliminar el reporte')
    }
  }

  // Paginación
  const indexUltimoReporte = paginaActual * reportesPorPagina
  const indexPrimerReporte = indexUltimoReporte - reportesPorPagina
  const reportesPaginados = reportes.slice(indexPrimerReporte, indexUltimoReporte)
  const totalPaginas = Math.ceil(reportes.length / reportesPorPagina)

  const cambiarPagina = (numeroPagina: number) => {
    setPaginaActual(numeroPagina)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bechapra-light-3 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-bechapra-primary mx-auto mb-4"></div>
          <p className="text-bechapra-text-secondary">Cargando reportes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bechapra-light-3">
      {/* Header */}
      <div className="bg-white border-b border-bechapra-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-bechapra-text-primary mb-2">
                📊 Historial de Reportes
              </h1>
              <p className="text-bechapra-text-secondary">
                {reportes.length} {reportes.length === 1 ? 'reporte guardado' : 'reportes guardados'}
              </p>
            </div>
            <Link
              href="/nuevo-reporte"
              className="flex items-center gap-2 px-6 py-3 bg-bechapra-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileText size={20} />
              Nuevo Reporte
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-xl border border-bechapra-border p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-bechapra-primary" />
            <h2 className="text-lg font-semibold text-bechapra-text-primary">Filtros</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-bechapra-text-primary mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bechapra-text-muted" size={18} />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && aplicarFiltros()}
                  placeholder="Nombre del reporte..."
                  className="w-full pl-10 pr-4 py-2 border border-bechapra-border rounded-lg focus:outline-none focus:ring-2 focus:ring-bechapra-primary"
                />
              </div>
            </div>

            {/* Filtro por Módulo */}
            <div>
              <label className="block text-sm font-medium text-bechapra-text-primary mb-2">
                Módulo
              </label>
              <select
                value={moduloFiltro}
                onChange={(e) => setModuloFiltro(e.target.value)}
                className="w-full px-4 py-2 border border-bechapra-border rounded-lg focus:outline-none focus:ring-2 focus:ring-bechapra-primary"
              >
                <option value="">Todos los módulos</option>
                <option value="modulo1">Estados de Cuenta</option>
                <option value="modulo3">XML - Facturas</option>
                <option value="modulo4">SUA</option>
                <option value="modulo5">ISN</option>
                <option value="modulo6">Nómina</option>
                <option value="modulo7">FONACOT</option>
                <option value="modulo8">Control Fiscal</option>
                <option value="modulo11">Estados Financieros</option>
              </select>
            </div>

            {/* Fecha Desde */}
            <div>
              <label className="block text-sm font-medium text-bechapra-text-primary mb-2">
                Desde
              </label>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="w-full px-4 py-2 border border-bechapra-border rounded-lg focus:outline-none focus:ring-2 focus:ring-bechapra-primary"
              />
            </div>

            {/* Fecha Hasta */}
            <div>
              <label className="block text-sm font-medium text-bechapra-text-primary mb-2">
                Hasta
              </label>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="w-full px-4 py-2 border border-bechapra-border rounded-lg focus:outline-none focus:ring-2 focus:ring-bechapra-primary"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={aplicarFiltros}
              className="flex items-center gap-2 px-4 py-2 bg-bechapra-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Search size={18} />
              Aplicar Filtros
            </button>
            <button
              onClick={limpiarFiltros}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw size={18} />
              Limpiar
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Error al cargar reportes</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Lista de Reportes */}
        {reportesPaginados.length === 0 ? (
          <div className="bg-white rounded-xl border border-bechapra-border p-12 text-center">
            <FileText size={64} className="mx-auto text-bechapra-text-muted mb-4" />
            <h3 className="text-xl font-semibold text-bechapra-text-primary mb-2">
              No hay reportes
            </h3>
            <p className="text-bechapra-text-secondary mb-6">
              {busqueda || moduloFiltro || fechaDesde || fechaHasta
                ? 'No se encontraron reportes con los filtros aplicados'
                : 'Aún no has generado ningún reporte'}
            </p>
            <Link
              href="/nuevo-reporte"
              className="inline-flex items-center gap-2 px-6 py-3 bg-bechapra-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileText size={20} />
              Crear Primer Reporte
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reportesPaginados.map((reporte) => (
              <div
                key={reporte.id}
                className="bg-white rounded-xl border border-bechapra-border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-bechapra-text-primary mb-2">
                      {reporte.nombre}
                    </h3>
                    
                    {reporte.descripcion && (
                      <p className="text-sm text-bechapra-text-secondary mb-3">
                        {reporte.descripcion}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-3">
                      {reporte.modulos_usados.map((modulo) => (
                        <span
                          key={modulo}
                          className="px-3 py-1 bg-bechapra-light-2 text-bechapra-primary text-sm rounded-full"
                        >
                          {MODULOS_NOMBRES[modulo] || modulo}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-bechapra-text-muted">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(reporte.created_at).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText size={16} />
                        {reporte.num_archivos} {reporte.num_archivos === 1 ? 'archivo' : 'archivos'}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => router.push(`/reportes/ver?id=${reporte.id}`)}
                      className="p-2 text-bechapra-primary hover:bg-bechapra-light-2 rounded-lg transition-colors"
                      title="Ver reporte"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => eliminarReporte(reporte.id, reporte.nombre)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar reporte"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              className="p-2 border border-bechapra-border rounded-lg hover:bg-bechapra-light-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numeroPagina) => (
              <button
                key={numeroPagina}
                onClick={() => cambiarPagina(numeroPagina)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  paginaActual === numeroPagina
                    ? 'bg-bechapra-primary text-white'
                    : 'border border-bechapra-border hover:bg-bechapra-light-2'
                }`}
              >
                {numeroPagina}
              </button>
            ))}

            <button
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className="p-2 border border-bechapra-border rounded-lg hover:bg-bechapra-light-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}