'use client'

import React from 'react'
import Link from 'next/link'
import { MapPin, Phone, ChevronRight } from 'lucide-react'

function getGoogleMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`
}

function formatDate(date: Date): string {
  return date.toLocaleString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export const pharmacies = [
  {
    day: 1,
    name: 'JAIME',
    address: 'Brandsen y Brown',
    phone: '422254',
  },
  {
    day: 2,
    name: 'MENNA',
    address: 'Av. Sixto Rodríguez y Alem',
    phone: '431467',
  },
  {
    day: 3,
    name: 'PASTEUR',
    address: 'Belgrano y Junín',
    phone: '422156',
  },
  {
    day: 4,
    name: 'PERRIG',
    address: 'Av. Balcarce 459',
    phone: '15408697',
  },
  {
    day: 5,
    name: 'SANTOMAURO',
    address: 'Las Heras 1242',
    phone: '421261',
  },
  {
    day: 6,
    name: 'SCHUVAB',
    address: 'Belgrano y Sarmiento',
    phone: '422045',
  },
  {
    day: 7,
    name: 'SOTELO',
    address: 'Hipólito Irigoyen 855',
    phone: '421739',
  },
  {
    day: 8,
    name: 'MATTA',
    address: 'Lamadrid y Conturbi',
    phone: '15492303',
  },
  {
    day: 9,
    name: 'CORONEL SUÁREZ',
    address: 'Avellaneda y Lavalle',
    phone: '430019',
  },
  {
    day: 10,
    name: 'FETTER',
    address: 'Mitre y San Martín',
    phone: '422778',
  },
  {
    day: 11,
    name: 'DE LA CIUDAD',
    address: 'Las Heras y Garibaldi',
    phone: '431666',
  },
  {
    day: 12,
    name: 'DEL PUEBLO',
    address: 'Mitre y Brandsen',
    phone: '424338',
  },
  {
    day: 13,
    name: 'FONZO',
    address: 'Belgrano 1269',
    phone: '422230',
  },
  {
    day: 14,
    name: 'GÓMEZ',
    address: 'Av. San Martín 218',
    phone: '431713',
  },
  {
    day: 15,
    name: 'JAIME',
    address: 'Brandsen y Brown',
    phone: '422254',
  },
  {
    day: 16,
    name: 'MENNA',
    address: 'Av. Sixto Rodríguez y Alem',
    phone: '431467',
  },
  {
    day: 17,
    name: 'PASTEUR',
    address: 'Belgrano y Junín',
    phone: '422156',
  },
  {
    day: 18,
    name: 'PERRIG',
    address: 'Av. Balcarce 459',
    phone: '15408697',
  },
  {
    day: 19,
    name: 'SANTOMAURO',
    address: 'Las Heras 1242',
    phone: '421261',
  },
  {
    day: 20,
    name: 'SCHUVAB',
    address: 'Belgrano y Sarmiento',
    phone: '422045',
  },
  {
    day: 21,
    name: 'SOTELO',
    address: 'Hipólito Irigoyen 855',
    phone: '421739',
  },
  {
    day: 22,
    name: 'MATTA',
    address: 'Lamadrid y Conturbi',
    phone: '15492303',
  },
  {
    day: 23,
    name: 'CORONEL SUÁREZ',
    address: 'Avellaneda y Lavalle',
    phone: '430019',
  },
  {
    day: 24,
    name: 'FETTER',
    address: 'Mitre y San Martín',
    phone: '422778',
  },
  {
    day: 25,
    name: 'DE LA CIUDAD',
    address: 'Las Heras y Garibaldi',
    phone: '431666',
  },
  {
    day: 26,
    name: 'DEL PUEBLO',
    address: 'Mitre y Brandsen',
    phone: '424338',
  },
  {
    day: 27,
    name: 'FONZO',
    address: 'Belgrano 1269',
    phone: '422230',
  },
  {
    day: 28,
    name: 'GÓMEZ',
    address: 'Av. San Martín 218',
    phone: '431713',
  },
  {
    day: 29,
    name: 'JAIME',
    address: 'Brandsen y Brown',
    phone: '422254',
  },
  {
    day: 30,
    name: 'MENNA',
    address: 'Av. Sixto Rodríguez y Alem',
    phone: '431467',
  },
  {
    day: 31,
    name: 'PASTEUR',
    address: 'Belgrano y Junín',
    phone: '422156',
  },
]

export default function FarmaciasDeTurno() {
  const today = new Date()
  const todayDay = today.getDate()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowDay = tomorrow.getDate()

  const currentPharmacy = pharmacies.find((p) => p.day === todayDay)
  const nextPharmacy = pharmacies.find((p) => p.day === tomorrowDay)

  const todayFormatted = formatDate(today)
  const tomorrowFormatted = formatDate(tomorrow)

  if (!currentPharmacy) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        No hay farmacia de turno para hoy.
      </div>
    )
  }

  return (
    <main className="py-0 md:py-6">
      {/* Horizontal divider to separate from section above */}
      <div className="w-full h-[1px] bg-gray-300 md:bg-gray-400 mb-6 md:mb-6 md:opacity-50"></div>

      {/* Header with Title */}
      <div className="flex justify-start mb-6">
        <div className="text-left">
          <div className="w-16 h-1 bg-primary-red mb-2"></div>
          <h2 className="font-serif text-2xl font-bold uppercase">FARMACIAS DE TURNO</h2>
        </div>
      </div>

      {/* 12-column grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* TODAY'S PHARMACY - 6 columns */}
        <div className="md:col-span-6 relative">
          <div className="bg-white border-l-4 border-l-primary-red p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
              {todayFormatted}
            </h3>
            <h1 className="text-2xl md:text-3xl font-bold text-primary-red mb-4">
              {currentPharmacy.name}
            </h1>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-red mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Dirección</p>
                  <a
                    href={getGoogleMapsUrl(currentPharmacy.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-semibold text-gray-800 hover:text-primary-red transition-colors"
                  >
                    {currentPharmacy.address}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary-red mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <a
                    href={`tel:${currentPharmacy.phone}`}
                    className="text-base font-semibold text-gray-800 hover:text-primary-red transition-colors"
                  >
                    {currentPharmacy.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Vertical divider */}
          <div className="absolute top-0 -right-4 w-[1px] h-full bg-gray-400 opacity-50 hidden md:block"></div>
          {/* Mobile divisory line */}
          <div className="md:hidden w-full h-[1px] bg-gray-300 mt-6"></div>
        </div>

        {/* TOMORROW'S PHARMACY - 6 columns */}
        {nextPharmacy && (
          <div className="md:col-span-6">
            <div className="bg-white border-l-4 border-l-gray-400 p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                {tomorrowFormatted}
              </h3>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                {nextPharmacy.name}
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Dirección</p>
                    <a
                      href={getGoogleMapsUrl(nextPharmacy.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-semibold text-gray-800 hover:text-primary-red transition-colors"
                    >
                      {nextPharmacy.address}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <a
                      href={`tel:${nextPharmacy.phone}`}
                      className="text-base font-semibold text-gray-800 hover:text-primary-red transition-colors"
                    >
                      {nextPharmacy.phone}
                    </a>
                  </div>
                </div>
              </div>

              <Link
                href="/farmacias-de-turno"
                className="inline-flex items-center gap-2 text-primary-red font-semibold hover:underline"
              >
                Ver calendario completo
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
