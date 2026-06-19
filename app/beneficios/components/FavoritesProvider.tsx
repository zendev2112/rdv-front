'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'
import { createBeneficiosBrowserClient } from '@/lib/supabase-beneficios-browser'

// Shared favorites state for the whole /beneficios subtree. Fetches the member's
// favorite benefit_ids ONCE (not per card), so a listing with N hearts costs one
// query instead of N. Favorites are per-BENEFIT (not per-comercio). Hearts
// read/write through here; writes are optimistic.
type FavoritesContextValue = {
  ready: boolean
  loggedIn: boolean
  isFavorite: (benefitId: string) => boolean
  toggle: (benefitId: string) => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}

export default function FavoritesProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [favs, setFavs] = useState<Set<string>>(new Set())
  const [userId, setUserId] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const supabase = createBeneficiosBrowserClient()
    let active = true

    const load = async (uid: string | null) => {
      if (!uid) {
        if (active) {
          setFavs(new Set())
          setUserId(null)
          setReady(true)
        }
        return
      }
      const { data } = await supabase
        .from('user_favorites')
        .select('benefit_id')
      if (!active) return
      setUserId(uid)
      setFavs(new Set((data ?? []).map((r) => r.benefit_id)))
      setReady(true)
    }

    // getSession reads local storage (no network round-trip).
    supabase.auth.getSession().then(({ data }) => {
      load(data.session?.user?.id ?? null)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      load(session?.user?.id ?? null)
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const isFavorite = useCallback((id: string) => favs.has(id), [favs])

  const toggle = useCallback(
    (benefitId: string) => {
      if (!userId) {
        const next = window.location.pathname + window.location.search
        router.push('/beneficios/cuenta?next=' + encodeURIComponent(next))
        return
      }

      const wasFav = favs.has(benefitId)
      // optimistic
      setFavs((prev) => {
        const copy = new Set(prev)
        if (wasFav) copy.delete(benefitId)
        else copy.add(benefitId)
        return copy
      })

      const supabase = createBeneficiosBrowserClient()
      const op = wasFav
        ? supabase.from('user_favorites').delete().eq('benefit_id', benefitId)
        : supabase
            .from('user_favorites')
            .insert({ user_id: userId, benefit_id: benefitId })

      op.then(({ error }) => {
        if (!error) return
        // revert on failure
        setFavs((prev) => {
          const copy = new Set(prev)
          if (wasFav) copy.add(benefitId)
          else copy.delete(benefitId)
          return copy
        })
      })
    },
    [userId, favs, router],
  )

  return (
    <FavoritesContext.Provider value={{ ready, loggedIn: !!userId, isFavorite, toggle }}>
      {children}
    </FavoritesContext.Provider>
  )
}
