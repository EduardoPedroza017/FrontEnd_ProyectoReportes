'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FileText,
  ChevronLeft,
  Save,
  X,
  Plus,
  Trash2,
  Building2,
  Users,
  Calendar,
  Layers,
  AlertCircle,
  GripVertical,
  Clock
} from 'lucide-react'

interface Cliente {
  id: string
  nombre: string
}

interface Responsable {
  id: string
  nombre: string
  email: string
}

interface ModuloConfig {
  modulo: string
  responsable_id: string
  obligatorio: boolean
  instrucciones: string
}

interface ProgramacionConfig {
  dia_mes: number
  hora_notificacion: string
  descripcion: string
}

const MODULOS_DISPONIBLES = [
  { id: 'modulo1', nombre: 'Estados de Cuenta', descripcion: 'Módulo 01' },
  { id: 'modulo3', nombre: 'XML - Facturas', descripcion: 'Módulo 03' },
  { id: 'modulo4', nombre: 'SUA', descripcion: 'Módulo 04' },
  { id: 'modulo5', nombre: 'ISN', descripcion: 'Módulo 05' },
  { id: 'modulo6', nombre: 'Nómina', descripcion: 'Módulo 06' },
  { id: 'modulo7', nombre: 'FONACOT', descripcion: 'Módulo 07' },
  { id: 'modulo8', nombre: 'Control Fiscal', descripcion: 'Módulo 08' },
  { id: 'modulo11', nombre: 'Estados Financieros', descripcion: 'Módulo 11' },
]

export default function NuevaPlantillaPage() {
  const router = useRouter()
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paso, setPaso] = useState(1)

  // Datos de selección
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [responsables, setResponsables] = useState<Responsable[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // Formulario
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [clienteId, setClienteId] = useState('')
  const [responsableReporteId, setResponsableReporteId] = useState('')
  const [diasAvisoPrevio, setDiasAvisoPrevio] = useState(2)
  const [modulos, setModulos] = useState<ModuloConfig[]>([])
  const [programaciones, setProgramaciones] = useState<ProgramacionConfig[]>([
    { dia_mes: 15, hora_notificacion: '09:00', descripcion: 'Fecha mensual' }
  ])

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoadingData(true)
    try {
      const [clientesRes, responsablesRes] = await Promise.all([
        fetch('http://localhost:8000/api/centro-documentos/clientes?activo=true'),
        fetch('http://localhost:8000/api/centro-documentos/responsables?activo=true')
      ])

      if (clientesRes.ok) {
        setClientes(await clientesRes.json())
      }
      if (responsablesRes.ok) {
        setResponsables(await responsablesRes.json())
      }
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const agregarModulo = (moduloId: string) => {
    if (modulos.find(m => m.modulo === moduloId)) return

    setModulos(prev => [
      ...prev,
      {
        modulo: moduloId,
        responsable_id: '',
        obligatorio: true,
        instrucciones: ''
      }
    ])
  }

  const eliminarModulo = (moduloId: string) => {
    setModulos(prev => prev.filter(m => m.modulo !== moduloId))
  }

  const actualizarModulo = (moduloId: string, campo: keyof ModuloConfig, valor: any) => {
    setModulos(prev => prev.map(m =>
      m.modulo === moduloId ? { ...m, [campo]: valor } : m
    ))
  }

  const agregarProgramacion = () => {
    setProgramaciones(prev => [
      ...prev,
      { dia_mes: 1, hora_notificacion: '09:00', descripcion: '' }
    ])
  }

  const eliminarProgramacion = (index: number) => {
    setProgramaciones(prev => prev.filter((_, i) => i !== index))
  }

  const actualizarProgramacion = (index: number, campo: keyof ProgramacionConfig, valor: any) => {
    setProgramaciones(prev => prev.map((p, i) =>
      i === index ? { ...p, [campo]: valor } : p
    ))
  }

  const validarPaso1 = () => {
    if (!nombre.trim()) {
      setError('El nombre es requerido')
      return false
    }
    if (!clienteId) {
      setError('Debes seleccionar un cliente')
      return false
    }
    setError(null)
    return true
  }

  const validarPaso2 = () => {
    if (modulos.length === 0) {
      setError('Debes agregar al menos un módulo')
      return false
    }
    setError(null)
    return true
  }

  const handleSubmit = async () => {
    if (!validarPaso2()) return

    setGuardando(true)
    setError(null)

    try {
      const data = {
        cliente_id: clienteId,
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || null,
        responsable_reporte_id: responsableReporteId || null,
        dias_aviso_previo: diasAvisoPrevio,
        modulos: modulos.map((m, idx) => ({
          modulo: m.modulo,
          responsable_id: m.responsable_id || null,
          orden: idx,
          obligatorio: m.obligatorio,
          instrucciones: m.instrucciones || null
        })),
        programaciones: programaciones.map(p => ({
          dia_mes: p.dia_mes,
          hora_notificacion: p.hora_notificacion,
          descripcion: p.descripcion || null
        }))
      }

      const res = await fetch('http://localhost:8000/api/centro-documentos/plantillas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        router.push('/centro-documentos/plantillas')
      } else {
        const errorData = await res.json()
        setError(errorData.detail || 'Error al guardar la plantilla')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error de conexión')
    } finally {
      setGuardando(false)
    }
  }

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/centro-documentos/plantillas"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Nueva Plantilla</h1>
                <p className="text-sm text-gray-600">Configura un reporte recurrente</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  paso >= stepNum
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNum}
                </div>
                <span className={`text-sm ${paso >= stepNum ? 'text-gray-900' : 'text-gray-500'}`}>
                  {stepNum === 1 ? 'Información' : stepNum === 2 ? 'Módulos' : 'Programación'}
                </span>
                {stepNum < 3 && (
                  <div className={`w-12 h-0.5 ${paso > stepNum ? 'bg-green-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Paso 1: Información Básica */}
        {paso === 1 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Información de la Plantilla</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente <span className="text-red-500">*</span>
                </label>
                <select
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Selecciona un cliente...</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Plantilla <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Reporte Mensual"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Descripción opcional..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Responsable del Reporte
                  </label>
                  <select
                    value={responsableReporteId}
                    onChange={(e) => setResponsableReporteId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Sin asignar</option>
                    {responsables.map(resp => (
                      <option key={resp.id} value={resp.id}>{resp.nombre}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Quien generará el reporte final</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Días de Aviso Previo
                  </label>
                  <input
                    type="number"
                    value={diasAvisoPrevio}
                    onChange={(e) => setDiasAvisoPrevio(parseInt(e.target.value) || 2)}
                    min={0}
                    max={30}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Días antes de la fecha límite para notificar</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  if (validarPaso1()) setPaso(2)
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Paso 2: Módulos */}
        {paso === 2 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Seleccionar Módulos</h2>
              <p className="text-sm text-gray-600">Elige los módulos que incluirá este reporte</p>
            </div>

            <div className="p-6">
              {/* Módulos Disponibles */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Módulos Disponibles</h3>
                <div className="flex flex-wrap gap-2">
                  {MODULOS_DISPONIBLES.map(mod => {
                    const yaAgregado = modulos.find(m => m.modulo === mod.id)
                    return (
                      <button
                        key={mod.id}
                        onClick={() => !yaAgregado && agregarModulo(mod.id)}
                        disabled={!!yaAgregado}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          yaAgregado
                            ? 'bg-green-100 text-green-700 cursor-default'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span className="font-medium">{mod.descripcion}</span>
                        <span className="text-gray-500 ml-1">- {mod.nombre}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Módulos Seleccionados */}
              {modulos.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Módulos Seleccionados ({modulos.length})
                  </h3>
                  <div className="space-y-3">
                    {modulos.map((mod, idx) => {
                      const moduloInfo = MODULOS_DISPONIBLES.find(m => m.id === mod.modulo)
                      return (
                        <div
                          key={mod.modulo}
                          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-gray-400 cursor-move">
                              <GripVertical size={20} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-gray-900">
                                  {moduloInfo?.descripcion} - {moduloInfo?.nombre}
                                </h4>
                                <button
                                  onClick={() => eliminarModulo(mod.modulo)}
                                  className="p-1 text-gray-400 hover:text-red-600"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Responsable
                                  </label>
                                  <select
                                    value={mod.responsable_id}
                                    onChange={(e) => actualizarModulo(mod.modulo, 'responsable_id', e.target.value)}
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                  >
                                    <option value="">Sin asignar</option>
                                    {responsables.map(resp => (
                                      <option key={resp.id} value={resp.id}>{resp.nombre}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Instrucciones
                                  </label>
                                  <input
                                    type="text"
                                    value={mod.instrucciones}
                                    onChange={(e) => actualizarModulo(mod.modulo, 'instrucciones', e.target.value)}
                                    placeholder="Instrucciones para el responsable..."
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                  />
                                </div>
                              </div>

                              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={mod.obligatorio}
                                  onChange={(e) => actualizarModulo(mod.modulo, 'obligatorio', e.target.checked)}
                                  className="w-4 h-4 rounded border-gray-300 text-green-600"
                                />
                                <span className="text-sm text-gray-600">Módulo obligatorio</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => setPaso(1)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Anterior
              </button>
              <button
                onClick={() => {
                  if (validarPaso2()) setPaso(3)
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Paso 3: Programación */}
        {paso === 3 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Programación</h2>
              <p className="text-sm text-gray-600">Define cuándo se deben entregar los documentos</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {programaciones.map((prog, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Día del mes
                        </label>
                        <select
                          value={prog.dia_mes}
                          onChange={(e) => actualizarProgramacion(idx, 'dia_mes', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(dia => (
                            <option key={dia} value={dia}>{dia}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Hora de notificación
                        </label>
                        <input
                          type="time"
                          value={prog.hora_notificacion}
                          onChange={(e) => actualizarProgramacion(idx, 'hora_notificacion', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Descripción
                        </label>
                        <input
                          type="text"
                          value={prog.descripcion}
                          onChange={(e) => actualizarProgramacion(idx, 'descripcion', e.target.value)}
                          placeholder="Ej: Cierre mensual"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    {programaciones.length > 1 && (
                      <button
                        onClick={() => eliminarProgramacion(idx)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {programaciones.length < 2 && (
                <button
                  onClick={agregarProgramacion}
                  className="mt-4 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:bg-gray-50 flex items-center gap-2 w-full justify-center"
                >
                  <Plus size={18} />
                  Agregar otra fecha (máx. 2)
                </button>
              )}
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => setPaso(2)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Anterior
              </button>
              <button
                onClick={handleSubmit}
                disabled={guardando}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
              >
                {guardando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Crear Plantilla
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
