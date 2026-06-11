'use client'

import useSWR from 'swr'
import type { GrupoPosiciones } from './mundial2026Api'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

// Standings change only when matches finish — poll every 2 min.
export function useMundialStandings() {
  const { data, error, isLoading } = useSWR<{
    grupos: GrupoPosiciones[]
    updatedAt: string
  }>('/api/mundial/standings', fetcher, {
    refreshInterval: 120_000,
    revalidateOnFocus: true,
    dedupingInterval: 60_000,
  })

  return { grupos: data?.grupos, updatedAt: data?.updatedAt, error, isLoading }
}
