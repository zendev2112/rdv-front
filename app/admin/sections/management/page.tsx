'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type SectionWithCounts = {
  name: string
  path: string
  articleCount: number
  level: number
}

export default function SectionManagementPage() {
  const [sections, setSections] = useState<SectionWithCounts[]>([])
  const [newSectionName, setNewSectionName] = useState('')
  const [parentSection, setParentSection] = useState('')
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null)
  const [editingSectionName, setEditingSectionName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchSections()
  }, [supabase])
  
  async function fetchSections() {
    try {
      setLoading(true)
      
      // Get all articles to analyze the sections
      const { data: articles, error } = await supabase
        .from('articles')
        .select('section')
      
      if (error) throw error
      
      // Count articles by section
      const sectionCounts = new Map<string, number>()
      
      // Add "Sin sección" entry
      sectionCounts.set('Sin sección', 0)
      
      articles?.forEach(article => {
        const sectionName = article.section || 'Sin sección'
        
        if (!sectionCounts.has(sectionName)) {
          sectionCounts.set(sectionName, 0)
        }
        
        sectionCounts.set(sectionName, sectionCounts.get(sectionName)! + 1)
      })
      
      // Convert to hierarchical structure
      const sectionsArray: SectionWithCounts[] = []
      
      // Process sections to create a hierarchical list with proper indentation
      Array.from(sectionCounts.entries()).forEach(([path, count]) => {
        if (path === 'Sin sección') {
          sectionsArray.push({
            name: 'Sin sección',
            path: 'Sin sección',
            articleCount: count,
            level: 0
          })
          return
        }
        
        const parts = path.split(' / ')
        const name = parts[parts.length - 1]
        const level = parts.length - 1
        
        sectionsArray.push({
          name,
          path,
          articleCount: count,
          level
        })
      })
      
      // Sort by path for hierarchical display
      sectionsArray.sort((a, b) => {
        if (a.path === 'Sin sección') return 1
        if (b.path === 'Sin sección') return -1
        return a.path.localeCompare(b.path)
      })
      
      setSections(sectionsArray)
    } catch (err) {
      console.error('Error fetching sections:', err)
      setError('Failed to load sections')
    } finally {
      setLoading(false)
    }
  }
  
  const getTopLevelSections = () => {
    // Get unique top-level section names
    const topLevelSections = new Set<string>()
    sections.forEach(section => {
      if (section.path !== 'Sin sección') {
        const parts = section.path.split(' / ')
        if (parts.length > 0) {
          topLevelSections.add(parts[0])
        }
      }
    })
    return Array.from(topLevelSections)
  }
  
  const handleAddSection = async () => {
    if (!newSectionName.trim()) {
      alert('El nombre de la sección no puede estar vacío')
      return
    }
    
    // Construct the full path
    const fullPath = parentSection 
      ? `${parentSection} / ${newSectionName.trim()}`
      : newSectionName.trim()
    
    if (sections.some(s => s.path.toLowerCase() === fullPath.toLowerCase())) {
      alert('Esta sección ya existe')
      return
    }
    
    // Add to our state only
    const level = fullPath.split(' / ').length - 1
    setSections([
      ...sections.filter(s => s.path !== 'Sin sección'),
      { 
        name: newSectionName.trim(), 
        path: fullPath,
        articleCount: 0,
        level
      },
      ...sections.filter(s => s.path === 'Sin sección')
    ])
    
    setNewSectionName('')
    setParentSection('')
  }
  
  const handleEditSection = async (index: number) => {
    setEditingSectionIndex(index)
    setEditingSectionName(sections[index].name)
  }
  
  const handleUpdateSection = async () => {
    if (!editingSectionName.trim()) {
      alert('El nombre de la sección no puede estar vacío')
      return
    }
    
    const currentSection = sections[editingSectionIndex!]
    const pathParts = currentSection.path.split(' / ')
    
    // Replace just the name part (last part of the path)
    pathParts[pathParts.length - 1] = editingSectionName.trim()
    const newPath = pathParts.join(' / ')
    
    if (sections.some((s, i) => i !== editingSectionIndex && s.path.toLowerCase() === newPath.toLowerCase())) {
      alert('Ya existe una sección con este nombre')
      return
    }
    
    try {
      // Update all articles with the old section path
      const { error } = await supabase
        .from('articles')
        .update({ section: newPath })
        .eq('section', currentSection.path)
      
      if (error) throw error
      
      // Update the section in our state
      const updatedSections = [...sections]
      updatedSections[editingSectionIndex!].name = editingSectionName.trim()
      updatedSections[editingSectionIndex!].path = newPath
      
      setSections(updatedSections)
      setEditingSectionIndex(null)
      setEditingSectionName('')
      
      // Refetch to get accurate counts
      fetchSections()
    } catch (err) {
      console.error('Error updating section:', err)
      alert('Error al actualizar la sección')
    }
  }
  
  const handleDeleteSection = async (index: number) => {
    const section = sections[index]
    
    if (section.path === 'Sin sección') {
      alert('No se puede eliminar la sección "Sin sección"')
      return
    }
    
    if (section.articleCount > 0) {
      const confirmDelete = confirm(
        `Esta sección contiene ${section.articleCount} artículo(s). ¿Quieres mover estos artículos a "Sin sección" y eliminar esta sección?`
      )
      
      if (!confirmDelete) return
      
      try {
        // Update articles to remove the section
        const { error } = await supabase
          .from('articles')
          .update({ section: null })
          .eq('section', section.path)
        
        if (error) throw error
      } catch (err) {
        console.error('Error deleting section:', err)
        alert('Error al eliminar la sección')
        return
      }
    } else {
      if (!confirm('¿Estás seguro de que quieres eliminar esta sección?')) {
        return
      }
    }
    
    // Remove from our state
    const updatedSections = [...sections]
    updatedSections.splice(index, 1)
    setSections(updatedSections)
    
    // Refetch to get accurate counts
    fetchSections()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Secciones</h1>
        <Link
          href="/admin/sections"
          className="text-primary-red hover:underline"
        >
          Ver artículos por sección
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <h2 className="text-lg font-semibold mb-4">Añadir nueva sección</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sección padre (opcional)
            </label>
            <select
              value={parentSection}
              onChange={(e) => setParentSection(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Sin sección padre</option>
              {getTopLevelSections().map(section => (
                <option key={section} value={section}>{section}</option>
              ))}
              {parentSection && sections
                .filter(s => s.path.startsWith(parentSection) && s.path.split(' / ').length === 2)
                .map(section => (
                  <option key={section.path} value={section.path}>
                    {section.path}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la sección
            </label>
            <div className="flex">
              <input
                type="text"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder="Nombre de la sección"
                className="flex-grow p-2 border rounded-l-md"
              />
              <button
                onClick={handleAddSection}
                className="bg-primary-red text-white px-4 py-2 rounded-r-md hover:bg-red-700"
              >
                Añadir
              </button>
            </div>
          </div>
        </div>
        {parentSection && (
          <div className="text-sm text-gray-600">
            Ruta completa: <span className="font-medium">{parentSection} / {newSectionName || '...'}</span>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold">Secciones existentes</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-red mx-auto"></div>
            <p className="mt-2">Cargando secciones...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : sections.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No hay secciones disponibles.
          </div>
        ) : (
          <div className="divide-y">
            {sections.map((section, index) => (
              <div 
                key={index} 
                className={`flex justify-between items-center p-3 ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } ${editingSectionIndex === index ? 'border-2 border-blue-200' : ''}`}
                style={{ paddingLeft: `${(section.level + 1) * 1}rem` }}
              >
                {editingSectionIndex === index ? (
                  <div className="flex-grow flex">
                    <input
                      type="text"
                      value={editingSectionName}
                      onChange={(e) => setEditingSectionName(e.target.value)}
                      className="flex-grow p-2 border rounded-l-md"
                    />
                    <button
                      onClick={handleUpdateSection}
                      className="bg-green-600 text-white px-3 py-2 hover:bg-green-700"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingSectionIndex(null)}
                      className="bg-gray-300 text-gray-700 px-3 py-2 rounded-r-md hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center">
                      <span className="font-medium">{section.name}</span>
                      <span className="ml-2 text-xs text-gray-500">
                        ({section.articleCount} artículos)
                      </span>
                      {section.path !== section.name && (
                        <span className="ml-2 text-xs text-gray-400">
                          Ruta: {section.path}
                        </span>
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/admin/sections/${encodeURIComponent(section.path)}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Ver artículos
                      </Link>
                      
                      {section.path !== 'Sin sección' && (
                        <>
                          <button
                            onClick={() => handleEditSection(index)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteSection(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}