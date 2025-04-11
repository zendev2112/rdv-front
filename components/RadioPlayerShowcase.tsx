'use client'

import { Play } from 'lucide-react'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface RadioPlayerShowcaseProps {
  frequency?: string
  stationName?: string
  radioLink?: string
}

export default function RadioPlayerShowcase({
  frequency = '99.5',
  stationName = 'Radio del Volga',
  radioLink = 'https://app.radiodelvolga.com.ar/',
}: RadioPlayerShowcaseProps) {
  return (
    <Card className="w-full overflow-hidden border-gray-200 shadow-sm">
      {/* Radio player header */}
      <CardHeader className="bg-[#ff0808] text-white p-3 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-white text-[#ff0808] flex items-center justify-center font-bold text-xs">
            FM
          </div>
          <div>
            <h3 className="font-bold">{stationName}</h3>
            <p className="text-sm">FM {frequency}</p>
          </div>
        </div>
        <Badge className="bg-white text-[#ff0808] hover:bg-white hover:text-[#ff0808] px-2 py-1 font-bold">
          EN VIVO
        </Badge>
      </CardHeader>

      {/* Player controls */}
      <CardContent className="p-4 flex items-center justify-between">
        <Button
          asChild
          size="icon"
          className="h-12 w-12 rounded-full bg-[#ff0808] hover:bg-[#e00000]"
          aria-label="Reproducir radio"
        >
          <a href={radioLink} target="_blank" rel="noopener noreferrer">
            <Play className="h-5 w-5 ml-1" />
          </a>
        </Button>

        <div className="flex items-center">
          <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center space-x-1">
            <div className="h-2 w-1 bg-[#ff0808] animate-pulse"></div>
            <div className="h-3 w-1 bg-[#ff0808] animate-pulse delay-75"></div>
            <div className="h-2 w-1 bg-[#ff0808] animate-pulse delay-100"></div>
            <div className="h-4 w-1 bg-[#ff0808] animate-pulse delay-150"></div>
            <div className="h-2 w-1 bg-[#ff0808] animate-pulse delay-200"></div>
          </div>
        </div>
      </CardContent>

      {/* Now playing */}
      <CardFooter className="px-4 pb-4 pt-0 block">
        <div className="bg-gray-50 p-2 rounded text-sm">
          <p className="text-xs text-gray-500 uppercase font-medium">
            ESCUCHA EN VIVO:
          </p>
          <div className="flex items-center justify-between">
            <p className="text-gray-800 font-medium truncate">
              FM {frequency} - {stationName}
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
