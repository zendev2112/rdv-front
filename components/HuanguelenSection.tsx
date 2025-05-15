import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

export default function HuanguelenSection() {
  return (
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Huanguelén</h2>
        <Link 
          href="/huanguelen" 
          className="text-primary-red hover:underline flex items-center text-sm"
        >
          Ver más <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Featured article */}
        <div className="md:col-span-2">
          <div className="bg-gray-50 p-4 rounded-lg">
            <Link href="/huanguelen/article-1" className="block group">
              <div className="relative aspect-[16/9] mb-4 overflow-hidden rounded-md">
                <Image 
                  src="/placeholder.svg?height=400&width=600&text=Huanguelén" 
                  alt="Huanguelén"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 bg-primary-red text-white text-xs px-2 py-1 m-2 rounded">
                  DESTACADO
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary-red transition-colors">
                Huanguelén celebrará su 115º aniversario con una amplia agenda de actividades
              </h3>
              <p className="text-gray-600 mb-2">
                La localidad se prepara para festejar un nuevo aniversario con eventos culturales, deportivos y una gran cena show que reunirá a toda la comunidad.
              </p>
              <span className="text-sm text-gray-500">5 mayo, 2025</span>
            </Link>
          </div>
        </div>
        
        {/* News column */}
        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <h3 className="font-bold text-blue-800 mb-2">Noticias de Huanguelén</h3>
            <p className="text-sm text-gray-600">
              Mantente informado sobre los eventos y novedades de nuestra comunidad
            </p>
          </div>
          
          <Link href="/huanguelen/article-2" className="block group">
            <div className="flex gap-4">
              <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                <Image 
                  src="/placeholder.svg?height=80&width=80&text=Escuela" 
                  alt="Educación"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium group-hover:text-primary-red transition-colors text-sm">
                  La escuela técnica recibió equipamiento nuevo para sus talleres
                </h4>
                <span className="text-xs text-gray-500">4 mayo, 2025</span>
              </div>
            </div>
          </Link>
          
          <Link href="/huanguelen/article-3" className="block group">
            <div className="flex gap-4">
              <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                <Image 
                  src="/placeholder.svg?height=80&width=80&text=Deportes" 
                  alt="Deportes"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium group-hover:text-primary-red transition-colors text-sm">
                  El club Huanguelén obtuvo una importante victoria en el torneo regional
                </h4>
                <span className="text-xs text-gray-500">3 mayo, 2025</span>
              </div>
            </div>
          </Link>
          
          <Link href="/huanguelen/article-4" className="block group">
            <div className="flex gap-4">
              <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                <Image 
                  src="/placeholder.svg?height=80&width=80&text=Salud" 
                  alt="Salud"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium group-hover:text-primary-red transition-colors text-sm">
                  Campaña de vacunación: cronograma completo para mayo
                </h4>
                <span className="text-xs text-gray-500">2 mayo, 2025</span>
              </div>
            </div>
          </Link>
          
          <Link 
            href="/huanguelen" 
            className="block text-center text-sm text-primary-red hover:underline py-2 border-t border-gray-200 mt-4 pt-4"
          >
            Ver todas las noticias
          </Link>
        </div>
      </div>
    </section>
  )
}