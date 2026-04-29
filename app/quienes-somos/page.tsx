import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Quiénes Somos | Radio del Volga',
  description:
    'Radio del Volga es un medio de comunicación digital de Coronel Suárez, Buenos Aires, Argentina.',
}

export default function QuienesSomosPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Quiénes Somos</h1>

        <p className="text-gray-700 mb-4 text-lg leading-relaxed">
          Radio del Volga es un medio de comunicación digital de Coronel Suárez,
          Buenos Aires, Argentina. Fundado en 2023, cubre noticias locales,
          regionales y nacionales con foco en la comunidad de Coronel Suárez,
          Santa Trinidad, San José, Santa María, Huanguelén y la zona:
          información local, deportes, agro, política, economía, cultura,
          entretenimiento y más.
        </p>

        <div className="mt-8 space-y-2 text-gray-700">
          <p>
            <span className="font-medium">Contacto:</span>{' '}
            <a
              href="mailto:redaccion@radiodelvolga.com.ar"
              className="text-primary-red hover:underline"
            >
              redaccion@radiodelvolga.com.ar
            </a>
          </p>
          <p>
            <span className="font-medium">Ubicación:</span> Coronel Suárez,
            Buenos Aires, Argentina
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
