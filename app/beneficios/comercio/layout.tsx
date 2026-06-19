import type { Metadata, Viewport } from 'next'
import RegisterComerciosSW from './RegisterComerciosSW'
import InstallBanner from './components/InstallBanner'

// Volga Comercios — the merchant app. A separate product from the consumer
// Beneficios app, sharing one login system but its own identity, manifest, and
// installable PWA. This layout sets that identity for the whole /beneficios/comercio
// section (login + panel); the (guard) sublayout adds the header + role gate.
export const metadata: Metadata = {
  title: 'Volga Comercios',
  manifest: '/comercios.webmanifest',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Volga Comercios' },
}

export const viewport: Viewport = {
  themeColor: '#8B0000',
}

export default function ComercioSectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <RegisterComerciosSW />
      <InstallBanner />
      {children}
    </>
  )
}
