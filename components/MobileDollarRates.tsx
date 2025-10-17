'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Rate = {
  nombre: string
  compra: number
  venta: number
}

const RATE_LABELS: Record<string, string> = {
  oficial: 'Oficial',
  blue: 'Blue',
  mep: 'MEP',
  tarjeta: 'Tarjeta',
  ccl: 'CCL',
}

const SHOW_RATES = ['oficial', 'blue', 'mep', 'tarjeta', 'ccl']

export default function MobileDollarRates() {
  const [rates, setRates] = useState<Rate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://dolarapi.com/v1/dolares')
      .then((res) => res.json())
      .then((data) => {
        setRates(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="container mx-auto p-4">Cargando cotizaciones...</div>
  }

  return (
    <main className="py-0 md:py-6 mb-6 md:mb-0">
      {/* Horizontal divider to separate from section above */}
      <div className="w-full h-[1px] bg-gray-300 md:bg-gray-400 mb-4 md:mb-6 md:opacity-50"></div>

      {/* Header with Title */}
      <div className="flex justify-start mb-4">
        <div className="text-left">
          <div className="w-16 h-1 bg-primary-red mb-2"></div>
          <h2 className="text-2xl font-bold uppercase">Cotizaciones</h2>
        </div>
      </div>

      {/* Exchange Rates Grid - 12 columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {SHOW_RATES.map((rateKey) => {
          const rate = rates.find((r) => r.nombre.toLowerCase() === rateKey)
          return rate ? (
            <div key={rateKey} className="md:col-span-4">
              <Link
                href="/exchange-rates"
                className="block h-full flex flex-col group"
              >
                {/* Rate Card */}
                <div className="bg-white border border-gray-200 p-3">
                  <h3 className="text-sm md:text-base font-bold leading-tight mb-2">
                    Dólar {RATE_LABELS[rateKey]}
                  </h3>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Compra:</span>
                      <span className="font-semibold">
                        $
                        {rate.compra.toLocaleString('es-AR', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Venta:</span>
                      <span className="font-semibold">
                        $
                        {rate.venta.toLocaleString('es-AR', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ) : null
        })}
      </div>
    </main>
  )
}