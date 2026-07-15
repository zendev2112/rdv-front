import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SidelinesLayout from '@/components/SidelinesLayout'
import CalendarioDelMes from './CalendarioDelMes'

// This page is a server component purely so the metadata below is actually emitted:
// the previous version set <Head> from next/head inside a 'use client' page, which the
// App Router ignores — the title/canonical/OG tags never reached the HTML. The
// date-dependent UI lives in CalendarioDelMes (client) so "hoy" uses the reader's clock.
export const metadata: Metadata = {
  title: 'Farmacias de Turno en Coronel Suárez Hoy | Radio del Volga',
  description:
    'Qué farmacia está de turno hoy en Coronel Suárez, con dirección y teléfono. Calendario completo del mes, actualizado.',
  keywords: [
    'farmacias de turno coronel suarez',
    'farmacia de turno hoy coronel suarez',
    'farmacias abiertas coronel suarez',
    'farmacia de guardia coronel suarez',
    'farmacia 24 horas coronel suarez',
  ],
  alternates: { canonical: 'https://www.radiodelvolga.com.ar/farmacias-de-turno' },
  openGraph: {
    title: 'Farmacias de Turno en Coronel Suárez',
    description:
      'Qué farmacia está de turno hoy en Coronel Suárez, con dirección y teléfono.',
    url: 'https://www.radiodelvolga.com.ar/farmacias-de-turno',
    type: 'website',
    locale: 'es_AR',
  },
}

const pageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Farmacias de Turno - Coronel Suárez',
  description: 'Farmacias de turno 24 horas en Coronel Suárez',
  areaServed: {
    '@type': 'City',
    name: 'Coronel Suárez',
    addressRegion: 'Buenos Aires',
    addressCountry: 'AR',
  },
  url: 'https://www.radiodelvolga.com.ar/farmacias-de-turno',
}

export default function FarmaciasDeTurnoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      {/* MOBILE */}
      <div className="pb-24 pt-[184px] md:hidden">
        <div className="container mx-auto max-w-[1600px] px-4">
          <CalendarioDelMes />
          <Footer />
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden pt-[80px] md:block">
        <SidelinesLayout sidelineWidth={15}>
          <Header />
          <div className="px-8 py-8">
            <CalendarioDelMes />
          </div>
          <div className="mt-12 px-8">
            <Footer />
          </div>
        </SidelinesLayout>
      </div>
    </>
  )
}
