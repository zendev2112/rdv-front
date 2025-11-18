'use client'

import { pharmacies } from '@/components/FarmaciasDeTurno'
import Link from 'next/link'
import Header from '@/components/Header'
import SidelinesLayout from '@/components/SidelinesLayout'
import { MapPin, Phone } from 'lucide-react'
import Footer from '@/components/Footer'

function getGoogleMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`
}

function formatDateBadge(day: number): string {
  const date = new Date()
  const currentYear = date.getFullYear()
  const currentMonth = date.getMonth()

  const pharmacyDate = new Date(currentYear, currentMonth, day)

  return pharmacyDate.toLocaleString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export default function FarmaciasDeTurnoPage() {
  const currentMonth = new Date().toLocaleString('es-ES', {
    month: 'long',
    year: 'numeric',
  })
  const sidelineWidth = 15

  return (
    <>
      {/* ✅ MOBILE */}
      <div className="md:hidden pt-[184px] pb-24">
        <div className="container mx-auto max-w-[1600px] px-4">
          <div className="mb-0 pb-4 py-0 -mt-8">
            {/* Breadcrumbs */}
            <nav className="text-sm md:text-xs text-gray-500 mb-4 mt-0">
              <Link href="/" className="hover:text-primary-red font-medium">
                RADIO DEL VOLGA
              </Link>
              <span className="mx-2 text-gray-400">›</span>
              <span className="font-medium">Farmacias de Turno</span>
            </nav>

            {/* Title */}
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2 leading-tight mt-6 md:mt-8">
              Farmacias de Turno
            </h1>

            {/* Subtitle */}
            <p className="text-gray-500 text-sm mt-3">
              Calendario completo de {currentMonth}
            </p>
          </div>

          {/* Divisory Line */}
          <div className="border-t border-gray-300 my-4"></div>

          {/* Pharmacies Grid */}
          <div className="grid grid-cols-1 gap-6">
            {pharmacies.map((pharmacy) => (
              <article
                key={pharmacy.day}
                className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300 p-6"
              >
                {/* Day Badge with Date */}
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-primary-red">
                    {pharmacy.name}
                  </h2>
                  <span className="bg-primary-red text-white px-3 py-1 text-sm font-semibold uppercase">
                    {formatDateBadge(pharmacy.day)}
                  </span>
                </div>

                {/* Pharmacy Information */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary-red mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Dirección</p>
                      <a
                        href={getGoogleMapsUrl(pharmacy.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-semibold text-gray-800 hover:text-primary-red transition-colors"
                      >
                        {pharmacy.address}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary-red mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Teléfono</p>
                      <a
                        href={`tel:${pharmacy.phone}`}
                        className="text-base font-semibold text-gray-800 hover:text-primary-red transition-colors"
                      >
                        {pharmacy.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Info Box */}
          <div className="mt-12 bg-gray-50 p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Información importante
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Las farmacias de turno están disponibles las 24 horas del día para
              atender emergencias y necesidades de medicamentos fuera del
              horario comercial habitual. Siempre verifique la disponibilidad
              antes de acudir.
            </p>
          </div>

          {/* ✅ FOOTER - MOBILE */}
          <Footer />
        </div>
      </div>

      {/* ✅ DESKTOP */}
      <div className="hidden md:block pt-[80px]">
        <SidelinesLayout sidelineWidth={sidelineWidth}>
          <Header />

          <div className="mb-0 pb-4 px-8 py-8">
            {/* Breadcrumbs */}
            <nav className="text-base md:text-sm text-gray-500 mb-4 mt-4">
              <Link href="/" className="hover:text-primary-red font-medium">
                RADIO DEL VOLGA
              </Link>
              <span className="mx-2 text-gray-400">›</span>
              <span className="font-medium">Farmacias de Turno</span>
            </nav>

            {/* Title */}
            <h1 className="font-serif text-2xl md:text-3xl font-semibold mb-4 leading-tight mt-4 md:mt-6">
              Farmacias de Turno
            </h1>

            {/* Subtitle */}
            <p className="text-gray-500 text-sm mt-3">
              Calendario completo de {currentMonth}
            </p>

            {/* Divisory Line */}
            <div className="border-t border-gray-300 my-4 px-4 md:px-0"></div>
          </div>

          {/* Pharmacies Grid */}
          <div className="px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pharmacies.map((pharmacy) => (
              <article
                key={pharmacy.day}
                className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300 p-6"
              >
                {/* Day Badge with Date */}
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-primary-red">
                    {pharmacy.name}
                  </h2>
                  <span className="bg-primary-red text-white px-3 py-1 text-sm font-semibold uppercase">
                    {formatDateBadge(pharmacy.day)}
                  </span>
                </div>

                {/* Pharmacy Information */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary-red mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Dirección</p>
                      <a
                        href={getGoogleMapsUrl(pharmacy.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-semibold text-gray-800 hover:text-primary-red transition-colors"
                      >
                        {pharmacy.address}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary-red mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Teléfono</p>
                      <a
                        href={`tel:${pharmacy.phone}`}
                        className="text-base font-semibold text-gray-800 hover:text-primary-red transition-colors"
                      >
                        {pharmacy.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Info Box */}
          <div className="mt-12 px-8 bg-gray-50 p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Información importante
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Las farmacias de turno están disponibles las 24 horas del día para
              atender emergencias y necesidades de medicamentos fuera del
              horario comercial habitual. Siempre verifique la disponibilidad
              antes de acudir.
            </p>
          </div>

          {/* ✅ FOOTER - DESKTOP */}
          <div className="px-8 mt-12">
            <Footer />
          </div>
        </SidelinesLayout>
      </div>
    </>
  )
}
