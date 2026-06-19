'use client'

import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFavorites } from './FavoritesProvider'

// Heart toggle for a single benefit. State + writes come from FavoritesProvider
// (one shared query, not one per card). Logged-out taps route to /cuenta and
// return. Favorites are per-BENEFIT, so each benefit's heart is independent.
//   variant="header"  — pill on a dark header
//   variant="overlay" — small floating button over a card image
export default function FavoritoButton({
  benefitId,
  variant = 'header',
}: {
  benefitId: string
  variant?: 'header' | 'overlay' | 'inline'
}) {
  const { ready, isFavorite, toggle } = useFavorites()
  const fav = isFavorite(benefitId)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        toggle(benefitId)
      }}
      disabled={!ready}
      aria-label={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      aria-pressed={fav}
      title={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-50',
        variant === 'header' &&
          'size-10 bg-white/10 ring-1 ring-white/15 hover:bg-white/20',
        variant === 'overlay' &&
          'size-8 bg-white/90 shadow-sm ring-1 ring-black/5 backdrop-blur-sm hover:bg-white',
        variant === 'inline' &&
          'size-9 bg-cream ring-1 ring-black/5 hover:bg-gray-100',
      )}
    >
      <Heart
        size={variant === 'overlay' ? 16 : 18}
        className={cn(
          fav && 'fill-brand text-brand',
          !fav && variant === 'header' && 'text-white',
          !fav && variant !== 'header' && 'text-neutral-gray',
        )}
      />
    </button>
  )
}
