import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Contacto | Radio del Volga',
  description:
    'Contactá a Radio del Volga. Envianos tu noticia, consulta o sugerencia.',
}

export default function ContactoPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Contacto</h1>

        <p className="text-gray-700 mb-6 text-lg">
          ¿Tenés una noticia, consulta o sugerencia? Escribinos.
        </p>

        <div className="flex items-center gap-2 text-gray-700 mb-4 text-lg">
          <span>📧</span>
          <a
            href="mailto:redaccion@radiodelvolga.com.ar"
            className="text-primary-red hover:underline font-medium"
          >
            redaccion@radiodelvolga.com.ar
          </a>
        </div>

        <p className="text-sm text-gray-500 mt-10">
          Coronel Suárez, Buenos Aires, Argentina
        </p>
      </main>
      <Footer />
    </>
  )
}
