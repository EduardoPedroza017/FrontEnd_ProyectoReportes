'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  FileText,
  MoreVertical,
  ChevronLeft,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'

interface Cliente {
  id: string
  nombre: string
  rfc: string | null
  razon_social: string | null
  email_contacto: string | null
  telefono: string | null
  activo: boolean
  num_plantillas: number
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroActivo, setFiltroActivo] = useState<boolean | null>(null)
  const [modalEliminar, setModalEliminar] = useState<Cliente | null>(null)
  const [eliminando, setEliminando] = useState(false)

  useEffect(() => {
    cargarClientes()
  }, [filtroActivo])

  const cargarClientes = async () => {
    setLoading(true)
    try {
      let url = 'http://localhost:8000/api/centro-documentos/clientes?limit=500'
      if (filtroActivo !== null) {
        url += `&activo=${filtroActivo}`
      }
      
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setClientes(data)
      }
    } catch (error) {
      console.error('Error cargando clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const eliminarCliente = async () => {
    if (!modalEliminar) return
    
    setEliminando(true)
    try {
      const res = await fetch(
        `http://localhost:8000/api/centro-documentos/clientes/${modalEliminar.id}`,
        { method: 'DELETE' }
      )
      
      if (res.ok) {
        setClientes(prev => prev.filter(c => c.id !== modalEliminar.id))
        setModalEliminar(null)
      }
    } catch (error) {
      console.error('Error eliminando cliente:', error)
    } finally {
      setEliminando(false)
    }
  }

  const clientesFiltrados = clientes.filter(cliente => {
    if (!busqueda) return true
    const busquedaLower = busqueda.toLowerCase()
    return (
      cliente.nombre.toLowerCase().includes(busquedaLower) ||
      cliente.rfc?.toLowerCase().includes(busquedaLower) ||
      cliente.razon_social?.toLowerCase().includes(busquedaLower)
    )
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/centro-documentos"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Clientes</h1>
                  <p className="text-sm text-gray-600">Gestiona las empresas del sistema</p>
                </div>
              </div>
            </div>
            <Link
              href="/centro-documentos/clientes/nuevo"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <Plus size={18} />
              Nuevo Cliente
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, RFC o razón social..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFiltroActivo(null)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroActivo === null
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFiltroActivo(true)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroActivo === true
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Activos
              </button>
              <button
                onClick={() => setFiltroActivo(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroActivo === false
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Inactivos
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Clientes */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : clientesFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay clientes</h3>
            <p className="text-gray-500 mb-4">
              {busqueda
                ? 'No se encontraron clientes con esa búsqueda'
                : 'Comienza agregando tu primer cliente'}
            </p>
            {!busqueda && (
              <Link
                href="/centro-documentos/clientes/nuevo"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus size={18} />
                Nuevo Cliente
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      RFC
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plantillas
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {clientesFiltrados.map((cliente) => (
                    <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{cliente.nombre}</p>
                          {cliente.razon_social && (
                            <p className="text-sm text-gray-500">{cliente.razon_social}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700 font-mono text-sm">
                          {cliente.rfc || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {cliente.email_contacto && (
                            <p className="text-gray-700">{cliente.email_contacto}</p>
                          )}
                          {cliente.telefono && (
                            <p className="text-gray-500">{cliente.telefono}</p>
                          )}
                          {!cliente.email_contacto && !cliente.telefono && (
                            <span className="text-gray-400">Sin contacto</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                          <FileText size={14} />
                          {cliente.num_plantillas}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {cliente.activo ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            <CheckCircle size={14} />
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                            <XCircle size={14} />
                            Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/centro-documentos/clientes/${cliente.id}`}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver detalles"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            href={`/centro-documentos/clientes/${cliente.id}/editar`}
                            className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => setModalEliminar(cliente)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Eliminar */}
      {modalEliminar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Eliminar Cliente</h3>
                <p className="text-sm text-gray-500">Esta acción no se puede deshacer</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar al cliente <strong>{modalEliminar.nombre}</strong>?
              {modalEliminar.num_plantillas > 0 && (
                <span className="block mt-2 text-red-600 text-sm">
                  Este cliente tiene {modalEliminar.num_plantillas} plantilla(s) asociada(s) que también serán eliminadas.
                </span>
              )}
            </p>
            
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setModalEliminar(null)}
                disabled={eliminando}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={eliminarCliente}
                disabled={eliminando}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                {eliminando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
