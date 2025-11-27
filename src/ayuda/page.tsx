'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  HelpCircle,
  Search,
  Book,
  FileText,
  Video,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  Zap,
  Shield,
  CreditCard,
  Upload,
  Download,
  Share2,
  BarChart3,
  Settings,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqItems: FAQItem[] = [
  {
    category: 'general',
    question: '¿Qué es Bechapra y cómo funciona?',
    answer: 'Bechapra es un sistema de análisis contable con inteligencia artificial diseñado para empresas mexicanas. Procesa automáticamente archivos como estados de cuenta, facturas XML, nóminas y declaraciones fiscales para generar reportes detallados y análisis financieros.'
  },
  {
    category: 'general',
    question: '¿Qué tipos de archivos puedo procesar?',
    answer: 'Puedes procesar PDFs de estados de cuenta bancarios, archivos Excel con información contable, archivos XML de facturas (CFDIs), archivos ZIP con múltiples XMLs, y documentos de nómina en diversos formatos.'
  },
  {
    category: 'reportes',
    question: '¿Cómo genero un nuevo reporte?',
    answer: 'Ve a "Nuevo Reporte" en el menú lateral, selecciona los módulos que necesitas (Estados de Cuenta, XML, SUA, etc.), sube los archivos correspondientes en cada módulo y haz clic en "Procesar y Analizar". El sistema generará automáticamente tu reporte.'
  },
  {
    category: 'reportes',
    question: '¿Puedo procesar múltiples módulos a la vez?',
    answer: 'Sí, puedes seleccionar y cargar archivos en múltiples módulos simultáneamente. El sistema los procesará todos juntos y generará un reporte unificado con la información de cada módulo.'
  },
  {
    category: 'compartir',
    question: '¿Cómo comparto un reporte con alguien?',
    answer: 'Ve a "Compartir > Compartir Reportes", selecciona el reporte, elige el método (enlace o correo), configura los permisos y opciones de seguridad, y genera el enlace o envía la invitación.'
  },
  {
    category: 'compartir',
    question: '¿Puedo proteger los reportes compartidos con contraseña?',
    answer: 'Sí, al compartir un reporte puedes habilitar la opción "Proteger con contraseña" y establecer una contraseña que el destinatario necesitará ingresar para acceder al reporte.'
  },
  {
    category: 'seguridad',
    question: '¿Mis datos están seguros?',
    answer: 'Sí, utilizamos encriptación de nivel bancario para proteger tus datos. Toda la información se transmite mediante HTTPS y se almacena de forma encriptada. Además, puedes configurar autenticación de dos factores para mayor seguridad.'
  },
  {
    category: 'seguridad',
    question: '¿Puedo revocar el acceso a un reporte compartido?',
    answer: 'Sí, en "Compartir > Gestión de Compartidos" puedes ver todos los reportes que has compartido y revocar el acceso en cualquier momento haciendo clic en el botón de revocar.'
  },
]

const categories = [
  { id: 'all', label: 'Todas', icon: HelpCircle },
  { id: 'general', label: 'General', icon: Lightbulb },
  { id: 'reportes', label: 'Reportes', icon: FileText },
  { id: 'compartir', label: 'Compartir', icon: Share2 },
  { id: 'seguridad', label: 'Seguridad', icon: Shield },
]

const guides = [
  {
    title: 'Primeros pasos',
    description: 'Aprende a configurar tu cuenta y generar tu primer reporte',
    icon: Zap,
    link: '#',
    time: '5 min'
  },
  {
    title: 'Procesamiento de XMLs',
    description: 'Guía completa para procesar facturas emitidas y recibidas',
    icon: FileText,
    link: '#',
    time: '10 min'
  },
  {
    title: 'Análisis de Estados de Cuenta',
    description: 'Cómo extraer y analizar información bancaria automáticamente',
    icon: BarChart3,
    link: '#',
    time: '8 min'
  },
  {
    title: 'Compartir reportes de forma segura',
    description: 'Opciones de seguridad y mejores prácticas para compartir',
    icon: Shield,
    link: '#',
    time: '6 min'
  },
]

export default function AyudaPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  const filteredFAQ = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-bechapra-primary to-bechapra-primary-dark flex items-center justify-center text-white shadow-button">
          <HelpCircle size={32} />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-bechapra-text-primary">
          ¿Cómo podemos ayudarte?
        </h1>
        <p className="text-bechapra-text-secondary mt-2">
          Encuentra respuestas, guías y recursos para aprovechar al máximo Bechapra
        </p>

        {/* Search */}
        <div className="mt-6 relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-bechapra-text-muted" size={20} />
          <input
            type="text"
            placeholder="Buscar en la ayuda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-bechapra pl-12 py-4 text-lg"
          />
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Book, label: 'Documentación', href: '#docs' },
          { icon: Video, label: 'Video tutoriales', href: '#videos' },
          { icon: MessageCircle, label: 'Chat de soporte', href: '#chat' },
          { icon: Mail, label: 'Contacto', href: '#contacto' },
        ].map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.label}
              href={item.href}
              className="card-bechapra p-4 text-center hover:shadow-card-hover transition-all group"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-bechapra bg-bechapra-light flex items-center justify-center text-bechapra-primary group-hover:bg-bechapra-primary group-hover:text-white transition-colors">
                <Icon size={24} />
              </div>
              <p className="font-medium text-bechapra-text-primary">{item.label}</p>
            </a>
          )
        })}
      </div>

      {/* Guides section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-bechapra-text-primary">Guías populares</h2>
          <a href="#" className="text-sm font-medium text-bechapra-primary hover:underline flex items-center gap-1">
            Ver todas
            <ArrowRight size={14} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guides.map((guide) => {
            const Icon = guide.icon
            return (
              <a
                key={guide.title}
                href={guide.link}
                className="card-bechapra p-5 flex items-start gap-4 hover:shadow-card-hover transition-all group"
              >
                <div className="w-12 h-12 rounded-bechapra bg-bechapra-light flex items-center justify-center text-bechapra-primary flex-shrink-0 group-hover:bg-bechapra-primary group-hover:text-white transition-colors">
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-bechapra-text-primary group-hover:text-bechapra-primary transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-bechapra-text-secondary mt-1">{guide.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-bechapra-text-muted">
                    <Clock size={12} />
                    {guide.time} de lectura
                  </div>
                </div>
                <ChevronRight size={20} className="text-bechapra-text-muted group-hover:text-bechapra-primary transition-colors" />
              </a>
            )
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-xl font-semibold text-bechapra-text-primary mb-4">Preguntas frecuentes</h2>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-bechapra-primary text-white shadow-button'
                    : 'bg-bechapra-light text-bechapra-text-secondary hover:bg-bechapra-primary/10 hover:text-bechapra-primary'
                }`}
              >
                <Icon size={16} />
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* FAQ items */}
        <div className="space-y-3">
          {filteredFAQ.map((item, idx) => (
            <div
              key={idx}
              className="card-bechapra overflow-hidden"
            >
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-bechapra-light-3 transition-colors"
              >
                <span className="font-medium text-bechapra-text-primary pr-4">{item.question}</span>
                <ChevronDown
                  size={20}
                  className={`text-bechapra-text-muted flex-shrink-0 transition-transform ${
                    expandedFAQ === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedFAQ === idx ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-5 pb-5 text-bechapra-text-secondary">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFAQ.length === 0 && (
          <div className="card-bechapra p-8 text-center">
            <Search className="mx-auto mb-3 text-bechapra-text-muted" size={32} />
            <p className="text-bechapra-text-secondary">No se encontraron resultados para tu búsqueda</p>
          </div>
        )}
      </div>

      {/* Contact section */}
      <div id="contacto" className="card-bechapra overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-bechapra-primary to-bechapra-primary-dark text-white">
          <h2 className="text-xl font-semibold mb-2">¿Necesitas más ayuda?</h2>
          <p className="text-white/80">Nuestro equipo de soporte está listo para asistirte</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-bechapra bg-bechapra-light flex items-center justify-center text-bechapra-primary">
              <Mail size={24} />
            </div>
            <div>
              <p className="font-medium text-bechapra-text-primary">Email</p>
              <a href="mailto:soporte@bechapra.com" className="text-sm text-bechapra-primary hover:underline">
                soporte@bechapra.com
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-bechapra bg-bechapra-light flex items-center justify-center text-bechapra-primary">
              <Phone size={24} />
            </div>
            <div>
              <p className="font-medium text-bechapra-text-primary">Teléfono</p>
              <a href="tel:+525512345678" className="text-sm text-bechapra-primary hover:underline">
                +52 55 1234 5678
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-bechapra bg-bechapra-light flex items-center justify-center text-bechapra-primary">
              <MessageCircle size={24} />
            </div>
            <div>
              <p className="font-medium text-bechapra-text-primary">Chat en vivo</p>
              <p className="text-sm text-bechapra-text-secondary">Lun-Vie 9:00-18:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
