'use client'

import React from 'react'
import Link from 'next/link'
import { MapPin, Phone, ChevronRight, Navigation } from 'lucide-react'

// The turno rotation is published per month by the Colegio de Farmacéuticos, so
// it is month-bound — day 15 means "15 de julio de 2026", not "the 15th of any
// month". SCHEDULE_MONTH/YEAR pin which month `pharmacies` describes so the UI can
// say so plainly instead of showing a stale month's pharmacy as if it were today's.
export const SCHEDULE_YEAR = 2026
export const SCHEDULE_MONTH = 7 // 0-indexed: 7 = agosto

export type Pharmacy = {
  day: number
  name: string
  address: string
  phone: string
  /** Handover window when the turno does not run midnight-to-midnight. */
  nota?: string
}

export const pharmacies: Pharmacy[] = [
  { day: 1, name: 'SANTOMAURO', address: 'Las Heras 1242', phone: '15407913' },
  { day: 2, name: 'SCHUVAB', address: 'Belgrano y Sarmiento', phone: '15500643' },
  { day: 3, name: 'SOTELO', address: 'Hipólito Irigoyen 855', phone: '421739' },
  { day: 4, name: 'MENNA', address: 'Av. Sixto Rodriguez y Alem', phone: '431467' },
  { day: 5, name: 'CORONEL SUÁREZ', address: 'Avellaneda y Rivadavia', phone: '430019' },
  { day: 6, name: 'FETTER', address: 'Mitre y San Martín', phone: '422778' },
  { day: 7, name: 'DE LA CIUDAD', address: 'Las Heras y Garibaldi', phone: '15500641' },
  { day: 8, name: 'DEL PUEBLO', address: 'Mitre y Brandsen', phone: '424338' },
  { day: 9, name: 'FONZO', address: 'Belgrano 1269', phone: '422230' },
  { day: 10, name: 'GOMEZ', address: 'Av. San Martín 218', phone: '15407906' },
  { day: 11, name: 'MENNA', address: 'Av. Sixto Rodriguez y Alem', phone: '431467' },
  { day: 12, name: 'PASTEUR', address: 'Belgrano y Junín', phone: '422156' },
  { day: 13, name: 'PERRIG', address: 'Av. Balcarce 459', phone: '15408697' },
  { day: 14, name: 'SANTOMAURO', address: 'Las Heras 1242', phone: '15407913' },
  { day: 15, name: 'SCHUVAB', address: 'Belgrano y Sarmiento', phone: '15500643' },
  { day: 16, name: 'SOTELO', address: 'Hipólito Irigoyen 855', phone: '421739' },
  { day: 17, name: 'MATTA', address: 'Lamadrid y Conturbi', phone: '15492303' },
  { day: 18, name: 'CORONEL SUÁREZ', address: 'Avellaneda y Rivadavia', phone: '430019' },
  { day: 19, name: 'FETTER', address: 'Mitre y San Martín', phone: '422778' },
  { day: 20, name: 'DE LA CIUDAD', address: 'Las Heras y Garibaldi', phone: '15500641' },
  { day: 21, name: 'DEL PUEBLO', address: 'Mitre y Brandsen', phone: '424338' },
  { day: 22, name: 'FONZO', address: 'Belgrano 1269', phone: '422230' },
  { day: 23, name: 'GOMEZ', address: 'Av. San Martín 218', phone: '15407906' },
  { day: 24, name: 'JAIME', address: 'Brandsen y Brown', phone: '422254' },
  { day: 25, name: 'PASTEUR', address: 'Belgrano y Junín', phone: '422156' },
  { day: 26, name: 'PERRIG', address: 'Av. Balcarce 459', phone: '15408697' },
  { day: 27, name: 'SANTOMAURO', address: 'Las Heras 1242', phone: '15407913' },
  { day: 28, name: 'SCHUVAB', address: 'Belgrano y Sarmiento', phone: '15500643' },
  { day: 29, name: 'SOTELO', address: 'Hipólito Irigoyen 855', phone: '421739' },
  { day: 30, name: 'MATTA', address: 'Lamadrid y Conturbi', phone: '15492303' },
  { day: 31, name: 'CORONEL SUÁREZ', address: 'Avellaneda y Rivadavia', phone: '430019' },
]

// Street-corner addresses ("Mitre y Brandsen") are ambiguous nationwide — pin the
// search to the city so "Cómo llegar" lands on the right corner.
export function getGoogleMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${address}, Coronel Suárez, Buenos Aires, Argentina`,
  )}`
}

/** True when `date` falls inside the month this schedule describes. */
export function isScheduleCurrent(date: Date) {
  return date.getFullYear() === SCHEDULE_YEAR && date.getMonth() === SCHEDULE_MONTH
}

export function pharmacyForDate(date: Date): Pharmacy | undefined {
  if (!isScheduleCurrent(date)) return undefined
  return pharmacies.find((p) => p.day === date.getDate())
}

export function formatLongDate(date: Date): string {
  return date.toLocaleString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export const SCHEDULE_LABEL = new Date(SCHEDULE_YEAR, SCHEDULE_MONTH, 1).toLocaleString(
  'es-AR',
  { month: 'long', year: 'numeric' },
)

// Shown when the published calendar has run out (a new month started and nobody has
// loaded the new rotation yet). Saying so beats showing last month's pharmacy.
export function CalendarioDesactualizado({ className = '' }: { className?: string }) {
  return (
    <div className={`border border-gray-300 bg-gray-50 p-6 ${className}`}>
      <p className="font-bold text-gray-900">Calendario no disponible para hoy</p>
      <p className="mt-1 text-sm text-gray-600">
        El último calendario publicado corresponde a {SCHEDULE_LABEL}. Consultá el turno
        de hoy con el Colegio de Farmacéuticos o llamá al 107.
      </p>
    </div>
  )
}

// Two big, unmissable actions — the only things anyone needs at 3am.
function AccionesTurno({ pharmacy, tone }: { pharmacy: Pharmacy; tone: 'hoy' | 'quiet' }) {
  const primary =
    tone === 'hoy'
      ? 'bg-white text-primary-red hover:bg-white/90 focus-visible:outline-white'
      : 'bg-primary-red text-white hover:bg-primary-red/90 focus-visible:outline-primary-red'
  const secondary =
    tone === 'hoy'
      ? 'border-white/70 text-white hover:bg-white/10 focus-visible:outline-white'
      : 'border-gray-300 text-gray-800 hover:bg-gray-50 focus-visible:outline-primary-red'

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={`tel:${pharmacy.phone}`}
        className={`inline-flex min-h-[48px] items-center gap-2 px-5 text-base font-bold uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${primary}`}
      >
        <Phone className="h-5 w-5" />
        Llamar {pharmacy.phone}
      </a>
      <a
        href={getGoogleMapsUrl(pharmacy.address)}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex min-h-[48px] items-center gap-2 border px-5 text-base font-bold uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${secondary}`}
      >
        <Navigation className="h-5 w-5" />
        Cómo llegar
      </a>
    </div>
  )
}

/**
 * The "HOY" hero — the one loud element. Everything around it stays quiet so this
 * reads first: which pharmacy is open, and the two ways to act on it.
 */
export function TurnoDeHoy({
  pharmacy,
  date,
  size = 'lg',
}: {
  pharmacy: Pharmacy
  date: Date
  size?: 'lg' | 'xl'
}) {
  return (
    <section className="bg-primary-red p-6 text-white md:p-8" aria-label="Farmacia de turno hoy">
      <div className="flex items-center gap-3">
        <span className="bg-white px-2 py-0.5 text-xs font-extrabold uppercase tracking-widest text-primary-red">
          Hoy
        </span>
        <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
          {formatLongDate(date)}
        </p>
      </div>

      <h2
        className={`mt-3 font-serif font-bold leading-[0.95] ${
          size === 'xl' ? 'text-5xl md:text-7xl' : 'text-4xl md:text-5xl'
        }`}
      >
        {pharmacy.name}
      </h2>

      <p className="mt-3 flex items-start gap-2 text-lg text-white/95">
        <MapPin className="mt-1 h-5 w-5 flex-shrink-0" />
        {pharmacy.address}
      </p>

      {pharmacy.nota && (
        <p className="mt-3 inline-block border border-white/40 bg-white/10 px-3 py-1.5 text-sm font-semibold">
          {pharmacy.nota}
        </p>
      )}

      <div className="mt-6">
        <AccionesTurno pharmacy={pharmacy} tone="hoy" />
      </div>
    </section>
  )
}

/** Tomorrow, deliberately subdued — reference, not a call to action. */
function TurnoDeManana({ pharmacy, date }: { pharmacy: Pharmacy; date: Date }) {
  return (
    <div className="border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <span className="border border-gray-300 px-2 py-0.5 text-xs font-extrabold uppercase tracking-widest text-gray-500">
          Mañana
        </span>
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          {formatLongDate(date)}
        </p>
      </div>
      <h3 className="mt-3 font-serif text-2xl font-bold text-gray-900 md:text-3xl">
        {pharmacy.name}
      </h3>
      <p className="mt-2 flex items-start gap-2 text-gray-600">
        <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-gray-400" />
        {pharmacy.address}
      </p>
      {pharmacy.nota && (
        <p className="mt-2 text-sm font-semibold text-gray-500">{pharmacy.nota}</p>
      )}
      <a
        href={`tel:${pharmacy.phone}`}
        className="mt-3 inline-flex items-center gap-2 font-semibold text-gray-700 hover:text-primary-red"
      >
        <Phone className="h-4 w-4" />
        {pharmacy.phone}
      </a>
    </div>
  )
}

export default function FarmaciasDeTurno() {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const currentPharmacy = pharmacyForDate(today)
  const nextPharmacy = pharmacyForDate(tomorrow)

  return (
    <main className="py-0 md:py-6">
      <div className="mb-6 h-[1px] w-full bg-gray-300 md:bg-gray-400 md:opacity-50"></div>

      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="text-left">
          <div className="mb-2 h-1 w-16 bg-primary-red"></div>
          <h2 className="font-serif text-2xl font-bold uppercase">Farmacias de turno</h2>
        </div>
        <Link
          href="/farmacias-de-turno"
          className="hidden items-center gap-1 whitespace-nowrap font-semibold text-primary-red hover:underline sm:inline-flex"
        >
          Ver calendario completo
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {currentPharmacy ? (
        // Today gets two thirds of the row; tomorrow is a sidebar, not a twin.
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <TurnoDeHoy pharmacy={currentPharmacy} date={today} />
          </div>
          <div className="md:col-span-1">
            {nextPharmacy ? (
              <TurnoDeManana pharmacy={nextPharmacy} date={tomorrow} />
            ) : (
              <div className="border border-gray-200 bg-white p-6 text-sm text-gray-500">
                El turno de mañana se publica con el calendario del mes que viene.
              </div>
            )}
          </div>
        </div>
      ) : (
        <CalendarioDesactualizado />
      )}

      <Link
        href="/farmacias-de-turno"
        className="mt-6 inline-flex items-center gap-1 font-semibold text-primary-red hover:underline sm:hidden"
      >
        Ver calendario completo
        <ChevronRight className="h-4 w-4" />
      </Link>
    </main>
  )
}
