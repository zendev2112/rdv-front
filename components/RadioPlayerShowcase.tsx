'use client'

import { Play } from 'lucide-react'

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
    <main className="py-0 md:py-6">
      {/* Horizontal divider to separate from section above */}
      <div className="w-full h-[1px] bg-gray-300 md:bg-gray-400 mb-6 md:mb-6 md:opacity-50"></div>

      {/* Header with Title */}
      <div className="flex justify-start mb-6">
        <div className="text-left">
          <div className="w-16 h-1 bg-primary-red mb-2"></div>
          <h2 className="text-2xl font-bold uppercase">RADIO EN VIVO</h2>
        </div>
      </div>

      {/* Radio Player Card */}
      <div className="w-full border border-gray-200 bg-white">
        {/* Radio player header */}
        <div className="bg-primary-red text-white p-4 flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white text-primary-red flex items-center justify-center font-bold text-sm">
              FM
            </div>
            <div>
              <h3 className="font-bold text-lg">{stationName}</h3>
              <p className="text-sm">FM {frequency}</p>
            </div>
          </div>
          <span className="bg-white text-primary-red px-3 py-1 font-bold text-sm">
            EN VIVO
          </span>
        </div>

        {/* Player controls */}
        <div className="p-6 flex items-center justify-between">
          <a
            href={radioLink}
            target="_blank"
            rel="noopener noreferrer"
            className="h-16 w-16 bg-primary-red hover:bg-[#cc0000] flex items-center justify-center transition-colors"
            aria-label="Reproducir radio"
          >
            <Play className="h-8 w-8 text-white ml-1" />
          </a>

          <div className="flex items-center">
            <div className="bg-gray-100 px-4 py-2 flex items-center space-x-1">
              <div className="h-3 w-1 bg-primary-red animate-pulse"></div>
              <div className="h-4 w-1 bg-primary-red animate-pulse delay-75"></div>
              <div className="h-3 w-1 bg-primary-red animate-pulse delay-100"></div>
              <div className="h-5 w-1 bg-primary-red animate-pulse delay-150"></div>
              <div className="h-3 w-1 bg-primary-red animate-pulse delay-200"></div>
            </div>
          </div>
        </div>

        {/* Now playing */}
        <div className="px-6 pb-6">
          <div className="bg-gray-50 p-4 border border-gray-200">
            <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
              ESCUCHÁ EN VIVO:
            </p>
            <p className="text-base font-bold text-gray-900">
              FM {frequency} - {stationName}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
