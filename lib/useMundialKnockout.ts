'use client'

import useSWR from 'swr'
import type { RondaKO } from './mundial2026Api'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

// Knockout teams resolve as groups finish; live scores during KO matches —
// 60s keeps it fresh enough.
export function useMundialKnockout() {
  const { data, error, isLoading } = useSWR<{
    rondas: RondaKO[]
    updatedAt: string
  }>('/api/mundial/knockout', fetcher, {
    refreshInterval: 60_000,
    revalidateOnFocus: true,
    dedupingInterval: 30_000,
  })

  return { rondas: data?.rondas, updatedAt: data?.updatedAt, error, isLoading }
}
