import { redirect } from 'next/navigation'

// The validation hub now lives on the panel (home). Keep this path working for any
// old links by redirecting there. QR scans go straight to /validar/[id].
export default function ValidarHubPage() {
  redirect('/beneficios/comercio/panel')
}
