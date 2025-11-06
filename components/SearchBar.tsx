'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import OptimizedImage from './OptimizedImage'
import { getArticleUrl } from '@/lib/utils'

interface SearchBarProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Debounced search
  useEffect(() => {
    if (query.length < 3) {
      setResults([])
      return
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`
        )
        const data = await response.json()
        setResults(data.articles || [])
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Search Modal */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-xl">
        <div className="container mx-auto max-w-4xl px-4 py-6">
          {/* Search Input */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar noticias..."
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Cerrar búsqueda"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Search Results */}
          <div className="max-h-[70vh] overflow-y-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-red"></div>
                <p className="mt-4 text-gray-600">Buscando...</p>
              </div>
            ) : query.length < 3 ? (
              <div className="text-center py-12 text-gray-500">
                Ingrese al menos 3 caracteres para buscar
              </div>
            ) : results.length > 0 ? (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  {results.length} resultado{results.length !== 1 ? 's' : ''}{' '}
                  encontrado{results.length !== 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.map((article) => (
                    <Link
                      key={article.id}
                      href={getArticleUrl(
                        article.section_path || article.section,
                        article.slug
                      )}
                      onClick={onClose}
                      className="group flex gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {article.imgUrl && (
                        <div className="relative w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <OptimizedImage
                            src={article.imgUrl}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:opacity-75 transition-opacity"
                            sizes="128px"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-base font-bold text-gray-900 mb-2 line-clamp-2">
                          {article.overline && (
                            <span className="text-primary-red">
                              {article.overline}.{' '}
                            </span>
                          )}
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {article.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                {results.length >= 20 && (
                  <Link
                    href={`/buscar?q=${encodeURIComponent(query)}`}
                    onClick={onClose}
                    className="block mt-6 text-center py-3 text-primary-red hover:text-red-700 font-medium"
                  >
                    Ver todos los resultados →
                  </Link>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-2">
                  No se encontraron resultados
                </p>
                <p className="text-sm text-gray-500">
                  Intente con otras palabras clave
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
