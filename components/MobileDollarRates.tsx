'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ExchangeRate {
  currency: string
  buy: number
  sell: number
  variation: number
}

export default function MobileDollarRates() {
  const [rates, setRates] = useState<ExchangeRate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://dolarapi.com/v1/dolares')
        const data = await response.json()
        setRates(data)
      } catch (error) {
        console.error('Error fetching exchange rates:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRates()
  }, [])

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  return (
    <main className="py-0 md:py-6">
      {/* Horizontal divider to separate from section above */}
      <div className="w-full md:w-full h-[1px] bg-gray-300 md:bg-gray-400 mb-6 md:mb-6 md:opacity-50"></div>

      {/* Header with Title and Link */}
      <div className="flex justify-between items-start mb-6">
        {/* Section Title - Top Left */}
        <div className="text-left">
          <div className="w-16 h-1 bg-primary-red mb-2"></div>
          <h2 className="text-2xl font-bold uppercase">Cotizaciones</h2>
        </div>
      </div>

      {/* Exchange Rates Grid - 12 columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {rates.map((rate) => (
          <div key={rate.currency} className="md:col-span-4 relative">
            <Link
              href="/exchange-rates"
              className="block h-full flex flex-col group"
            >
              {/* Rate Card */}
              <div className="bg-white border border-gray-200 p-4 rounded">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-base md:text-base font-bold leading-6 sm:leading-tight">
                    {rate.currency}
                  </h3>
                  <span
                    className={`text-sm font-semibold ${
                      rate.variation >= 0
                        ? 'text-green-600'
                        : 'text-primary-red'
                    }`}
                  >
                    {rate.variation >= 0 ? '+' : ''}
                    {rate.variation.toFixed(2)}%
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Compra:</span>
                    <span className="font-semibold">${rate.buy.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Venta:</span>
                    <span className="font-semibold">${rate.sell.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Mobile divisory line */}
            <div className="md:hidden w-full h-[1px] bg-gray-300 mt-6"></div>
          </div>
        ))}
      </div>
    </main>
  )
}