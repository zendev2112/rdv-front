import { Bricolage_Grotesque, Plus_Jakarta_Sans } from 'next/font/google'
import { cn } from '@/lib/utils'
import FavoritesProvider from './components/FavoritesProvider'

// Deliberate pairing scoped to /beneficios only (the portal keeps Inter):
// Bricolage Grotesque carries the personality on headings; Plus Jakarta Sans
// is the calm, legible body/UI face.
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})
const body = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export default function BeneficiosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FavoritesProvider>
      <div className={cn('vb-root pb-14 xl:pb-0', display.variable, body.variable)}>
        {children}
      </div>
    </FavoritesProvider>
  )
}
