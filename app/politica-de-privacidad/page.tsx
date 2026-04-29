import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Política de Privacidad | Radio del Volga',
  description: 'Política de privacidad de Radio del Volga.',
}

export default function PoliticaDePrivacidadPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Política de Privacidad de Radio del Volga
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Última actualización: 29 de abril de 2026
        </p>

        <p className="text-gray-700 mb-6">
          En Radio del Volga ("nosotros", "nuestro sitio"), accesible desde{' '}
          <span className="font-medium">radiodelvolga.com.ar</span>, la
          privacidad de nuestros visitantes es importante para nosotros. Esta
          Política de Privacidad describe qué información recopilamos y cómo la
          usamos.
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Información que recopilamos
          </h2>
          <p className="text-gray-700">
            No recopilamos información personal identificable de los visitantes
            de nuestro sitio. No utilizamos formularios de registro ni sistemas
            de inicio de sesión.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Cookies</h2>
          <p className="text-gray-700">
            Nuestro sitio puede utilizar cookies para mejorar la experiencia del
            usuario. Las cookies son pequeños archivos que se almacenan en su
            dispositivo. Puede configurar su navegador para rechazar todas las
            cookies.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Publicidad
          </h2>
          <p className="text-gray-700">
            Mostramos publicidad propia de Radio del Volga. Estos anuncios no
            recopilan datos personales de los usuarios.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Enlaces a terceros
          </h2>
          <p className="text-gray-700">
            Nuestro sitio puede contener enlaces a sitios externos. No somos
            responsables por las prácticas de privacidad de esos sitios.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Contacto</h2>
          <p className="text-gray-700">
            Si tiene preguntas sobre esta política, puede contactarnos en:{' '}
            <a
              href="mailto:redaccion@radiodelvolga.com.ar"
              className="text-primary-red hover:underline"
            >
              redaccion@radiodelvolga.com.ar
            </a>
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-10">
          Radio del Volga — Coronel Suárez, Buenos Aires, Argentina
        </p>
      </main>
      <Footer />
    </>
  )
}
