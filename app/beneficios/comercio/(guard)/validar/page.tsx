import Link from 'next/link'
import CodigoForm from './CodigoForm'

export const dynamic = 'force-dynamic'

// Validation hub. The normal path is the merchant scanning the customer's QR with
// their plain phone camera (it opens /validar/[id] directly). This screen is the
// fallback: type the VB-XXXX code the customer reads aloud, plus the how-to.
export default function ValidarHubPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-extrabold text-gray-900">Validar canje</h1>
        <p className="mt-1 text-sm text-gray-500">
          Escaneá el QR del cliente con la cámara de tu teléfono. Si no podés,
          ingresá el código a mano.
        </p>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900">Ingresar código</h2>
          <CodigoForm />
        </div>

        <ol className="mt-6 space-y-2 text-sm text-gray-500">
          <li>
            <strong className="text-gray-700">1.</strong> Pedile al cliente que abra
            su cupón.
          </li>
          <li>
            <strong className="text-gray-700">2.</strong> Apuntá la cámara al QR — se
            abre la pantalla de validación.
          </li>
          <li>
            <strong className="text-gray-700">3.</strong> Aplicá el descuento y tocá{' '}
            <span className="font-semibold text-green-700">CONFIRMAR CANJE</span>.
          </li>
        </ol>

        <div className="mt-8 text-center">
          <Link
            href="/beneficios/comercio/panel"
            className="text-sm font-semibold text-gray-500 hover:text-gray-900"
          >
            ← Volver al panel
          </Link>
        </div>
      </div>
    </main>
  )
}
