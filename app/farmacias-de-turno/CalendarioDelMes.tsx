'use client'

import Link from 'next/link'
import {
  pharmacies,
  pharmacyForDate,
  getGoogleMapsUrl,
  isScheduleCurrent,
  TurnoDeHoy,
  CalendarioDesactualizado,
  SCHEDULE_LABEL,
  SCHEDULE_YEAR,
  SCHEDULE_MONTH,
  type Pharmacy,
} from '@/components/FarmaciasDeTurno'

// Date math runs in the browser so "hoy" follows the reader's clock. Computing it
// on the server would resolve to UTC and flip the on-call pharmacy three hours early
// every evening in Argentina.

function weekdayFor(day: number) {
  return new Date(SCHEDULE_YEAR, SCHEDULE_MONTH, day).toLocaleString('es-AR', {
    weekday: 'short',
  })
}

function FilaTurno({ pharmacy, todayDay }: { pharmacy: Pharmacy; todayDay: number | null }) {
  const esHoy = pharmacy.day === todayDay
  const esPasado = todayDay !== null && pharmacy.day < todayDay

  return (
    <li
      className={`flex gap-4 border-l-4 p-4 transition-colors sm:gap-6 ${
        esHoy
          ? 'border-l-primary-red bg-red-50'
          : `border-l-transparent hover:bg-gray-50 ${esPasado ? 'opacity-45' : ''}`
      }`}
    >
      {/* Day spine — the rotation is keyed by date, so the number is the real index. */}
      <div className="w-12 shrink-0 text-center sm:w-14">
        <div
          className={`font-serif text-3xl font-bold tabular-nums leading-none ${
            esHoy ? 'text-primary-red' : 'text-gray-900'
          }`}
        >
          {pharmacy.day}
        </div>
        <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          {weekdayFor(pharmacy.day)}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {esHoy && (
            <span className="bg-primary-red px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-widest text-white">
              Hoy
            </span>
          )}
          <h3
            className={`font-serif text-xl font-bold ${
              esHoy ? 'text-primary-red' : 'text-gray-900'
            }`}
          >
            {pharmacy.name}
          </h3>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <a
            href={getGoogleMapsUrl(pharmacy.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-700 underline-offset-2 hover:text-primary-red hover:underline"
          >
            {pharmacy.address}
          </a>
          <a
            href={`tel:${pharmacy.phone}`}
            className="font-semibold text-gray-700 tabular-nums underline-offset-2 hover:text-primary-red hover:underline"
          >
            {pharmacy.phone}
          </a>
        </div>

        {pharmacy.nota && (
          <p className="mt-1 text-sm font-semibold text-primary-red">{pharmacy.nota}</p>
        )}
      </div>
    </li>
  )
}

function Contenido() {
  const today = new Date()
  const vigente = isScheduleCurrent(today)
  const todayDay = vigente ? today.getDate() : null
  const currentPharmacy = pharmacyForDate(today)

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/" className="font-medium hover:text-primary-red">
          RADIO DEL VOLGA
        </Link>
        <span className="mx-2 text-gray-400">›</span>
        <span className="font-medium">Farmacias de Turno</span>
      </nav>

      <h1 className="font-serif text-4xl font-bold leading-tight md:text-5xl">
        Farmacias de Turno
      </h1>
      <p className="mt-2 text-gray-500">
        Coronel Suárez · calendario de {SCHEDULE_LABEL}
      </p>

      {/* The answer first: whoever is open right now. */}
      <div className="mt-6">
        {currentPharmacy ? (
          <TurnoDeHoy pharmacy={currentPharmacy} date={today} size="xl" />
        ) : (
          <CalendarioDesactualizado />
        )}
      </div>

      {/* Then the month, as reference. */}
      <h2 className="mt-12 font-serif text-2xl font-bold uppercase">
        Calendario de {SCHEDULE_LABEL}
      </h2>
      <div className="mt-4 border-t border-gray-300">
        <ul className="divide-y divide-gray-100">
          {pharmacies.map((pharmacy) => (
            <FilaTurno key={pharmacy.day} pharmacy={pharmacy} todayDay={todayDay} />
          ))}
        </ul>
      </div>

      <div className="mt-12 border border-gray-200 bg-gray-50 p-6">
        <h3 className="text-lg font-bold text-gray-900">Información importante</h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          Las farmacias de turno atienden las 24 horas para emergencias y medicamentos
          fuera del horario comercial. Cuando el turno cambia a media mañana, figura la
          aclaración en el día correspondiente. Ante una urgencia médica, llamá al 107.
        </p>
      </div>
    </>
  )
}

export default function CalendarioDelMes() {
  return <Contenido />
}
