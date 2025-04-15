'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

interface LotteryGame {
  name: string
  date: string
  link: string
  draws: {
    name: string
    numbers: string
  }[]
}

interface QuinielaSectionProps {
  logoSrc?: string
  nationalGames?: LotteryGame[]
}

export default function QuinielaSection({
  logoSrc = '/placeholder.svg?height=80&width=150&text=QUINIELA',
  nationalGames = [
    {
      name: 'Quiniela Nacional',
      date: '14.04.2025',
      link: '#',
      draws: [
        { name: 'Previa del 14-04', numbers: '8035' },
        { name: 'Primera del 14-04', numbers: '9861' },
        { name: 'Matutina del 14-04', numbers: '7045' },
        { name: 'Vespertina del 12-04', numbers: '4961' },
        { name: 'Nocturna del 12-04', numbers: '0658' },
      ],
    },
    {
      name: 'Quiniela Provincia',
      date: '14.04.2025',
      link: '#',
      draws: [
        { name: 'Previa del 14-04', numbers: '8661' },
        { name: 'Primera del 14-04', numbers: '8432' },
        { name: 'Matutina del 14-04', numbers: '0821' },
        { name: 'Vespertina del 12-04', numbers: '0684' },
        { name: 'Nocturna del 12-04', numbers: '3891' },
      ],
    },
    {
      name: 'Quiniela de Córdoba',
      date: '14.04.2025',
      link: '#',
      draws: [
        { name: 'Previa del 14-04', numbers: '5775' },
        { name: 'Matutina del 14-04', numbers: '0546' },
        { name: 'Vespertina del 12-04', numbers: '6020' },
        { name: 'Nocturna del 12-04', numbers: '4783' },
      ],
    },
    {
      name: 'Quiniela Santa Fe',
      date: '14.04.2025',
      link: '#',
      draws: [
        { name: 'Previa del 14-04', numbers: '2481' },
        { name: 'Primera del 14-04', numbers: '5028' },
        { name: 'Matutina del 14-04', numbers: '0206' },
        { name: 'Vespertina del 12-04', numbers: '3656' },
        { name: 'Nocturna del 12-04', numbers: '9777' },
      ],
    },
    {
      name: 'Quiniela Santiago del Estero',
      date: '14.04.2025',
      link: '#',
      draws: [
        { name: 'Matutina del 14-04', numbers: '0650' },
        { name: 'Vespertina del 14-04', numbers: '8891' },
        { name: 'Nocturna del 12-04', numbers: '0070' },
      ],
    },
    {
      name: 'Quiniela Montevideo',
      date: '14.04.2025',
      link: '#',
      draws: [
        { name: 'Vespertina del 14-04', numbers: '586' },
        { name: 'Nocturna del 12-04', numbers: '347' },
      ],
    },
  ],
}: QuinielaSectionProps) {
  return (
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="relative h-16 w-40">
          <Image
            src={logoSrc}
            alt="Quiniela"
            fill
            className="object-contain object-left"
            priority
            unoptimized
          />
        </div>
        <div className="flex space-x-2">
          <Link
            href="#"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'text-sm'
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Sorteos
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nationalGames.map((game, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="py-3 px-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-bold">
                  {game.name}
                </CardTitle>
                <div className="text-sm text-gray-500">Sorteo {game.date}</div>
              </div>
            </CardHeader>
            <CardContent className="py-3 px-4">
              <div className="space-y-3">
                {game.draws.map((draw, drawIndex) => (
                  <div key={drawIndex} className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 text-sm text-gray-600">
                      {draw.name}
                    </div>
                    <div className="col-span-1 text-right">
                      <span className="font-bold text-lg text-red-600">
                        {draw.numbers}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-end">
                <Link
                  href={game.link}
                  className="text-red-600 text-sm font-medium flex items-center"
                >
                  Ver resultados
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 text-center">

        <p className="text-sm text-gray-500 mt-2">
          Resultados actualizados al 14 de Abril de 2025
        </p>
      </div>
    </section>
  )
}
