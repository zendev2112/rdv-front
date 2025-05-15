import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

export default function LaSextaSection() {
  return (
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">La Sexta</h2>
        <Link 
          href="/la-sexta" 
          className="text-primary-red hover:underline flex items-center text-sm"
        >
          Ver todo <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main article */}
        <div className="md:col-span-5">
          <Link href="/la-sexta/article-1" className="block group">
            <div className="relative aspect-[4/3] mb-4 overflow-hidden rounded-md">
              <Image 
                src="/placeholder.svg?height=400&width=500&text=La+Sexta" 
                alt="La Sexta"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary-red transition-colors">
              Se inauguró el nuevo centro cultural en La Sexta: "Un espacio para todos"
            </h3>
            <p className="text-gray-600 mb-2">
              Con una gran muestra de artistas locales y regionales, el nuevo espacio busca convertirse en un punto de encuentro para todas las expresiones culturales de la comunidad.
            </p>
            <span className="text-sm text-gray-500">5 mayo, 2025</span>
          </Link>
        </div>
        
        {/* Secondary articles */}
        <div className="md:col-span-4 space-y-4">
          <Link href="/la-sexta/article-2" className="block group">
            <div className="flex gap-4">
              <div className="relative w-28 h-24 flex-shrink-0 rounded overflow-hidden">
                <Image 
                  src="/placeholder.svg?height=100&width=120&text=Infraestructura" 
                  alt="Infraestructura"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium group-hover:text-primary-red transition-colors">
                  Avanzan las obras de pavimentación en los accesos principales
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  Los trabajos tienen un 70% de avance y se espera su finalización para junio.
                </p>
                <span className="text-xs text-gray-500">4 mayo, 2025</span>
              </div>
            </div>
          </Link>
          
          <Link href="/la-sexta/article-3" className="block group">
            <div className="flex gap-4">
              <div className="relative w-28 h-24 flex-shrink-0 rounded overflow-hidden">
                <Image 
                  src="/placeholder.svg?height=100&width=120&text=Agricultura" 
                  alt="Agricultura"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium group-hover:text-primary-red transition-colors">
                  Productores locales presentarán sus productos en la feria regional
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  Más de 30 emprendedores de La Sexta participarán del evento.
                </p>
                <span className="text-xs text-gray-500">3 mayo, 2025</span>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Events calendar */}
        <div className="md:col-span-3 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-3 border-b border-gray-200 pb-2">Próximos eventos</h3>
          <div className="space-y-3">
            <div>
              <div className="flex gap-3 items-start">
                <span className="bg-primary-red text-white text-xs font-bold px-2 py-1 rounded">10 MAY</span>
                <div>
                  <h4 className="font-medium text-sm">Festival de Danzas Tradicionales</h4>
                  <p className="text-xs text-gray-600">Centro Cultural, 19:00hs</p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex gap-3 items-start">
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">12 MAY</span>
                <div>
                  <h4 className="font-medium text-sm">Taller de Huerta Comunitaria</h4>
                  <p className="text-xs text-gray-600">Plaza Central, 10:00hs</p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex gap-3 items-start">
                <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">15 MAY</span>
                <div>
                  <h4 className="font-medium text-sm">Torneo de Fútbol Infantil</h4>
                  <p className="text-xs text-gray-600">Polideportivo Municipal, 14:00hs</p>
                </div>
              </div>
            </div>
            
            <Link 
              href="/la-sexta/eventos" 
              className="block text-center text-sm text-primary-red hover:underline py-2 mt-2"
            >
              Ver calendario completo
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}