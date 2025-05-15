import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

export default function PueblosAlemanesSection() {
  return (
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Pueblos Alemanes</h2>
        <Link 
          href="/pueblos-alemanes" 
          className="text-primary-red hover:underline flex items-center text-sm"
        >
          Ver todos <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
      
      {/* Simplified grid with just three articles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Feature article */}
        <div className="md:col-span-2 bg-gray-50 p-5 rounded-lg">
          <Link href="/pueblos-alemanes/article-1" className="block group">
            <div className="relative aspect-[16/9] mb-4 overflow-hidden rounded-md">
              <Image 
                src="/placeholder.svg?height=400&width=600&text=Pueblos+Alemanes" 
                alt="Pueblos Alemanes"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-primary-red text-xs font-bold mb-1 block">HISTORIA Y TRADICIÓN</span>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary-red transition-colors">
              La histórica ruta alemana: un recorrido por los pueblos de inmigrantes
            </h3>
            <p className="text-gray-600 mb-2 text-sm">
              Descubre la rica herencia cultural de los pueblos fundados por inmigrantes alemanes del Volga en la región pampeana, donde las tradiciones europeas se mantienen vivas en cada rincón.
            </p>
            <span className="text-xs text-gray-500">6 mayo, 2025</span>
          </Link>
        </div>
        
        {/* Sidebar with just two small articles */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-5">
            <Link href="/pueblos-alemanes/article-2" className="block group">
              <div className="flex gap-4">
                <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden">
                  <Image 
                    src="/placeholder.svg?height=100&width=100&text=Gastronomía" 
                    alt="Gastronomía"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="text-primary-red text-xs font-bold mb-1 block">GASTRONOMÍA</span>
                  <h4 className="font-medium group-hover:text-primary-red transition-colors">
                    Platos típicos que se conservan en las familias locales
                  </h4>
                  <span className="text-xs text-gray-500">1 mayo, 2025</span>
                </div>
              </div>
            </Link>
          </div>
          
          <div>
            <Link href="/pueblos-alemanes/article-3" className="block group">
              <div className="flex gap-4">
                <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden">
                  <Image 
                    src="/placeholder.svg?height=100&width=100&text=Tradiciones" 
                    alt="Tradiciones"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="text-primary-red text-xs font-bold mb-1 block">FESTIVIDADES</span>
                  <h4 className="font-medium group-hover:text-primary-red transition-colors">
                    Calendario 2025 de celebraciones alemanas en la región
                  </h4>
                  <span className="text-xs text-gray-500">3 mayo, 2025</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}