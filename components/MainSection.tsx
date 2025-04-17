'use client'

import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'

export default function MainSection() {
  return (
    <main className="container mx-auto px-4 py-6">
      {/* Custom grid layout with reduced height */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Main article (40% width) */}
        <div className="md:w-2/5">
          {/* Badge for important/breaking news - keeping this outside */}
          <div className="mb-4 flex items-center">
            <span className="bg-primary-red text-white text-xs font-bold px-2 py-1 rounded">
              DESTACADO
            </span>
            <span className="ml-2 text-dark-gray text-xs">
              Actualizado hace 10 min
            </span>
          </div>

          {/* Main article card - now includes the title and intro text */}
          <div className="relative overflow-hidden rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 group">
            <a 
              href="#" 
              className="block cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                console.log('Main article clicked');
              }}
            >
              {/* Title with red highlighting - now inside the clickable area */}
              <div className="p-4 bg-white">
                <h1 className="text-3xl font-bold mb-3 leading-tight">
                  <span className="text-primary-red font-bold">
                    "Título principal".
                  </span>{' '}
                  Las bolsas asiáticas y europeas se desploman y caen los futuros de
                  EE.UU
                </h1>
                <p className="text-dark-gray mb-3 text-base">
                  Bajada de nota con más detalle. Se utiliza para ampliar el
                  contexto de forma concisa y legible.
                </p>
              </div>
              
              {/* Image container with fixed aspect ratio */}
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  alt="Nota Principal"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Hover effect with gray overlay */}
                <div className="absolute inset-0 bg-gray-800 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              
              {/* Content area for main article */}
              <div className="p-4 bg-white">
                <h3 className="text-lg font-bold mb-2 leading-tight text-[#292929] line-clamp-3">
                  <span className="text-primary-red font-bold">
                    Economía.
                  </span>{' '}
                  Las bolsas asiáticas y europeas se desploman y caen los futuros de EE.UU
                </h3>
                
                <p className="text-sm text-dark-gray mb-2 line-clamp-2">
                  Bajada de nota con más detalle. Se utiliza para ampliar el contexto de forma concisa y legible.
                </p>
                
                <p className="text-sm text-dark-gray">
                  Por Redacción
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Right column (60% width) with cream background */}
        <div className="md:w-3/5 bg-cream p-4 rounded-md">
          {/* Top row (50% height) with two equal cards - updated to match MasNoticias styling */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Second article (30% of total width) */}
            <div className="md:w-1/2">
              <a 
                href="#" 
                className="block bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group h-full"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Second article clicked');
                }}
              >
                {/* Image container with fixed aspect ratio */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=190&width=350"
                    alt="Nota 2"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Hover effect with gray overlay */}
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                </div>
                
                {/* Content area */}
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2 leading-tight text-[#292929] line-clamp-3">
                    <span className="text-primary-red font-bold">
                      Sociedad.
                    </span>{' '}
                    Segunda nota destacada
                  </h3>
                  <p className="text-sm text-dark-gray">
                    Por Autor/a Placeholder
                  </p>
                </div>
              </a>
            </div>

            {/* Third article (30% of total width) */}
            <div className="md:w-1/2 mt-4 md:mt-0">
              <a 
                href="#" 
                className="block bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group h-full"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Third article clicked');
                }}
              >
                {/* Image container with fixed aspect ratio */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=190&width=350"
                    alt="Nota 3"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Hover effect with gray overlay */}
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                </div>
                
                {/* Content area */}
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2 leading-tight text-[#292929] line-clamp-3">
                    <span className="text-primary-red font-bold">
                      Internacional.
                    </span>{' '}
                    Tercera nota destacada
                  </h3>
                  <p className="text-sm text-dark-gray">
                    Por Autor/a Placeholder
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Simple gray divider */}
          <div className="h-px bg-gray-200 my-4"></div>

          {/* Bottom row (50% height) with three equal cards - updated to match MasNoticias styling */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Fourth article (20% of total width) */}
            <div className="md:w-1/3">
              <a 
                href="#" 
                className="block bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group h-full"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Fourth article clicked');
                }}
              >
                {/* Image container with fixed aspect ratio */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=140&width=200"
                    alt="Nota 4"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Hover effect with gray overlay */}
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                </div>
                
                {/* Content area */}
                <div className="p-4">
                  <h3 className="text-lg font-bold leading-tight text-[#292929] line-clamp-3">
                    <span className="text-primary-red font-bold">
                      Política.
                    </span>{' '}
                    Análisis sobre turbulencias
                  </h3>
                  <p className="text-sm text-dark-gray">
                    Por Autor/a Placeholder
                  </p>
                </div>
              </a>
            </div>

            {/* Fifth article (20% of total width) */}
            <div className="md:w-1/3 mt-4 md:mt-0">
              <a 
                href="#" 
                className="block bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group h-full"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Fifth article clicked');
                }}
              >
                {/* Image container with fixed aspect ratio */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=140&width=200"
                    alt="Nota 5"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Hover effect with gray overlay */}
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                </div>
                
                {/* Content area */}
                <div className="p-4">
                  <h3 className="text-lg font-bold leading-tight text-[#292929] line-clamp-3">
                    <span className="text-primary-red font-bold">
                      Judiciales.
                    </span>{' '}
                    Fallo reciente
                  </h3>
                  <p className="text-sm text-dark-gray">
                    Por Autor/a Placeholder
                  </p>
                </div>
              </a>
            </div>

            {/* Sixth article (20% of total width) */}
            <div className="md:w-1/3 mt-4 md:mt-0">
              <a 
                href="#" 
                className="block bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group h-full"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Sixth article clicked');
                }}
              >
                {/* Image container with fixed aspect ratio */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=140&width=200"
                    alt="Nota 6"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Hover effect with gray overlay */}
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                </div>
                
                {/* Content area */}
                <div className="p-4">
                  <h3 className="text-lg font-bold leading-tight text-[#292929] line-clamp-3">
                    <span className="text-primary-red font-bold">
                      Deportes.
                    </span>{' '}
                    Resumen del empate
                  </h3>
                  <p className="text-sm text-dark-gray">
                    Por Autor/a Placeholder
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom divider - simple gray without red accent */}
      <div className="h-px bg-gray-200 mt-6"></div>
    </main>
  )
}
