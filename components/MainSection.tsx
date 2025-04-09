'use client'

import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'

export default function MainSection() {
  return (
    <main className="container mx-auto px-4 py-6">
      {/* Vibrant red accent bar above the main content */}
      <div className="h-1 bg-primary-red w-full mb-4"></div>

      {/* Custom grid layout with reduced height */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Main article (40% width) */}
        <div className="md:w-2/5">
          {/* Red badge for important/breaking news */}
          <div className="mb-4 flex items-center">
            <span className="bg-primary-red text-white text-xs font-bold px-2 py-1 rounded">
              DESTACADO
            </span>
            <span className="ml-2 text-dark-gray text-xs">
              Actualizado hace 10 min
            </span>
          </div>

          {/* Title with red highlight */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-2 leading-tight">
              <span className="text-primary-red font-bold">
                "Título principal".
              </span>{' '}
              Las bolsas asiáticas y europeas se desploman y caen los futuros de
              EE.UU
            </h1>
            <p className="text-dark-gray mb-2 text-sm">
              Bajada de nota con más detalle. Se utiliza para ampliar el
              contexto de forma concisa y legible.
            </p>
          </div>

          {/* Main article card with red border accent */}
          <Card className="p-0 overflow-hidden border-0 shadow-sm">
            <div className="relative" style={{ height: '400px' }}>
              <div className="absolute left-0 top-0 h-full w-1 bg-primary-red"></div>
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="Nota Principal"
                fill
                className="object-cover"
              />
              {/* Red overlay for hover effect */}
              <div className="absolute inset-0 bg-primary-red bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
            </div>
          </Card>


        </div>

        {/* Right column (60% width) with cream background */}
        <div className="md:w-3/5 bg-cream p-4 rounded-md">
          {/* Section header with red underline */}
          <h2 className="text-lg font-bold mb-4 pb-2 border-b-2 border-primary-red">
            NOTICIAS RELACIONADAS
          </h2>

          {/* Top row (50% height) with two equal cards - reduced height */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Second article (30% of total width) */}
            <div className="md:w-1/2">
              <Card className="p-0 overflow-hidden h-full bg-white border-0 shadow-sm">
                <div className="relative" style={{ height: '190px' }}>
                  <Image
                    src="/placeholder.svg?height=190&width=350"
                    alt="Nota 2"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-3">
                  <h3 className="text-base font-semibold">
                    <span className="text-primary-red">Sociedad.</span> Segunda
                    nota destacada
                  </h3>
                  <p className="text-xs text-dark-gray mt-1">
                    Por Autor/a Placeholder
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Third article (30% of total width) */}
            <div className="md:w-1/2 mt-4 md:mt-0">
              <Card className="p-0 overflow-hidden h-full bg-white border-0 shadow-sm">
                <div className="relative" style={{ height: '190px' }}>
                  <Image
                    src="/placeholder.svg?height=190&width=350"
                    alt="Nota 3"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-3">
                  <h3 className="text-base font-semibold">
                    <span className="text-primary-red">Internacional.</span>{' '}
                    Tercera nota destacada
                  </h3>
                  <p className="text-xs text-dark-gray mt-1">
                    Por Autor/a Placeholder
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Divider with red accent */}
          <div className="flex items-center my-4">
            <div className="h-px bg-light-gray flex-grow"></div>
            <div className="h-1 bg-primary-red w-16 mx-2"></div>
            <div className="h-px bg-light-gray flex-grow"></div>
          </div>

          {/* Bottom row (50% height) with three equal cards - reduced height */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Fourth article (20% of total width) */}
            <div className="md:w-1/3">
              <Card className="p-0 overflow-hidden h-full bg-white border-0 shadow-sm">
                <div className="relative" style={{ height: '140px' }}>
                  <Image
                    src="/placeholder.svg?height=140&width=200"
                    alt="Nota 4"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-3">
                  <h3 className="text-sm font-semibold">
                    <span className="text-primary-red">Política.</span> Análisis
                    sobre turbulencias
                  </h3>
                  <p className="text-xs text-dark-gray mt-1">
                    Por Autor/a Placeholder
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Fifth article (20% of total width) */}
            <div className="md:w-1/3 mt-4 md:mt-0">
              <Card className="p-0 overflow-hidden h-full bg-white border-0 shadow-sm">
                <div className="relative" style={{ height: '140px' }}>
                  <Image
                    src="/placeholder.svg?height=140&width=200"
                    alt="Nota 5"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-3">
                  <h3 className="text-sm font-semibold">
                    <span className="text-primary-red">Judiciales.</span> Fallo
                    reciente
                  </h3>
                  <p className="text-xs text-dark-gray mt-1">
                    Por Autor/a Placeholder
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sixth article (20% of total width) */}
            <div className="md:w-1/3 mt-4 md:mt-0">
              <Card className="p-0 overflow-hidden h-full bg-white border-0 shadow-sm">
                <div className="relative" style={{ height: '140px' }}>
                  <Image
                    src="/placeholder.svg?height=140&width=200"
                    alt="Nota 6"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-3">
                  <h3 className="text-sm font-semibold">
                    <span className="text-primary-red">Deportes.</span> Resumen
                    del empate
                  </h3>
                  <p className="text-xs text-dark-gray mt-1">
                    Por Autor/a Placeholder
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom red accent bar */}
      <div className="h-1 bg-primary-red w-full mt-6"></div>
    </main>
  )
}
