import Link from 'next/link'

export const metadata = {
  title: 'Política de privacidad · Volga Beneficios',
}

// Privacy policy for Volga Beneficios (Ley 25.326 de Protección de Datos Personales).
export default function PrivacidadPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-extrabold text-gray-900">Política de privacidad</h1>
      <p className="mt-2 text-sm text-gray-500">Volga Beneficios · Radio del Volga · Coronel Suárez</p>

      <div className="mt-6 space-y-5 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="font-bold text-gray-900">Qué datos guardamos</h2>
          <p className="mt-1">
            Cuando creás tu cuenta guardamos tu nombre y tu email. Si lo activás, registramos también
            si querés recibir novedades. Cuando usás un beneficio guardamos qué beneficio usaste y
            cuándo, para que puedas verlo en “Mis canjes”.
          </p>
        </section>
        <section>
          <h2 className="font-bold text-gray-900">Para qué los usamos</h2>
          <p className="mt-1">
            Para que puedas usar tus beneficios, ver tu historial y —solo si lo aceptaste— enviarte
            novedades del club por email y notificaciones. No vendemos tus datos a terceros.
          </p>
        </section>
        <section>
          <h2 className="font-bold text-gray-900">Tus derechos</h2>
          <p className="mt-1">
            Podés dejar de recibir novedades en cualquier momento con el enlace “Cancelar
            suscripción” de cada email, o pedirnos que borremos tu cuenta y tus datos escribiéndonos.
            En cumplimiento de la Ley 25.326 de Protección de Datos Personales, tenés derecho a
            acceder, rectificar y suprimir tus datos.
          </p>
        </section>
        <section>
          <h2 className="font-bold text-gray-900">Contacto</h2>
          <p className="mt-1">
            Escribinos a{' '}
            <a href="mailto:radiodelvolga@gmail.com" className="text-red-600 underline">
              radiodelvolga@gmail.com
            </a>{' '}
            por cualquier consulta sobre tus datos.
          </p>
        </section>
      </div>

      <Link href="/beneficios" className="mt-8 inline-block text-sm font-bold text-red-600">
        ← Volver a Beneficios
      </Link>
    </main>
  )
}
