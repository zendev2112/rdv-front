'use client'

import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Clock, Phone, ChevronRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function FarmaciasDeTurno() {
  // Sample data for a single pharmacy
  const pharmacy = {
    name: 'Farmacia 24hs Las Heras',
    address: 'Av. Las Heras 2901, CABA',
    distance: '1.8 km',
    openUntil: '',
    phone: '011 4801-6677',
    isOpen24h: true,
  }

  return (
    <section className="container mx-auto px-4 py-6 border-t border-light-gray">
      {/* Section header with red accent */}
      <div className="flex items-center mb-6">
        <div className="h-5 w-1 bg-primary-red mr-3"></div>
        <h2 className="text-xl font-bold uppercase">FARMACIA DE TURNO</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Pharmacy details - takes 5 columns */}
        <div className="md:col-span-5">
          <Card className="border-0 shadow-sm bg-cream h-full">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{pharmacy.name}</h3>
                {pharmacy.isOpen24h && (
                  <span className="bg-green-100 text-green-800 text-sm px-2 py-0.5 rounded-full">
                    ABIERTO 24hs
                  </span>
                )}
              </div>

              <div className="flex items-start mb-4">
                <MapPin className="w-5 h-5 text-primary-red mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">{pharmacy.address}</p>
                  <p className="text-sm text-dark-gray mt-1">
                    {pharmacy.distance} de tu ubicación
                  </p>
                </div>
              </div>

              <div className="flex items-center mb-4">
                <Phone className="w-5 h-5 text-primary-red mr-2 flex-shrink-0" />
                <span className="font-medium">{pharmacy.phone}</span>
              </div>

              <div className="flex items-center">
                <Clock className="w-5 h-5 text-primary-red mr-2 flex-shrink-0" />
                <span className="font-medium">Atención las 24 horas</span>
              </div>

              <div className="mt-6 pt-6 border-t border-light-gray flex justify-between">
                <Link
                  href="#"
                  className="text-primary-red font-medium flex items-center hover:underline"
                >
                  Ver otras farmacias cercanas
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  href="#"
                  className="text-dark-gray text-sm hover:text-primary-red flex items-center"
                >
                  Cómo llegar
                  <ExternalLink className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map - takes 7 columns */}
        <div className="md:col-span-7">
          <Card className="border-0 shadow-sm h-full">
            <CardContent className="p-0 h-full">
              {/* Google Maps placeholder */}
              <div className="relative h-full min-h-[300px] bg-[#e8ecef]">
                {/* Fake Google Maps UI */}
                <div className="absolute inset-0 overflow-hidden">
                  {/* Map content */}
                  <div
                    className="h-full w-full"
                    style={{
                      backgroundImage: `url("https://placehold.co/800x500/e8ecef/95a5a6?text=Google+Maps")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {/* Map marker for the pharmacy */}
                    <div
                      className="absolute w-8 h-8 bg-primary-red rounded-full flex items-center justify-center text-white text-sm font-bold transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        top: '50%',
                        left: '50%',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      }}
                      title={pharmacy.name}
                    >
                      <MapPin className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Zoom controls */}
                  <div className="absolute top-4 right-4 bg-white rounded shadow">
                    <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100">
                      +
                    </button>
                    <div className="border-t border-gray-200"></div>
                    <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100">
                      −
                    </button>
                  </div>

                  {/* Attribution */}
                  <div className="absolute bottom-2 left-2 bg-white bg-opacity-70 text-xs text-gray-600 px-1 rounded">
                    Mapa © Google
                  </div>
                </div>

                {/* "Open in Google Maps" link */}
                <div className="absolute top-4 left-4">
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white py-1 px-2 rounded shadow-sm text-xs flex items-center hover:bg-gray-50"
                  >
                    Abrir en Google Maps
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Disclaimer text */}
      <p className="text-xs text-gray-500 mt-3 text-center">
        Información actualizada el 09/04/2025. Consulte la disponibilidad
        telefónicamente antes de acudir a la farmacia.
      </p>
    </section>
  )
}
