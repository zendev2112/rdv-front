'use client'

import useSWR from 'swr'
import type { ScoresMap } from './mundial2026Api'

interface ScoresResponse {
  scores: ScoresMap
  updatedAt: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

// Polls /api/mundial/scores. Refreshes every 60s (matches go ~90min, so a
// minute of staleness is fine) and on window focus.
export function useMundialScores() {
  const { data, error, isLoading } = useSWR<ScoresResponse>(
    '/api/mundial/scores',
    fetcher,
    {
      refreshInterval: 30_000,
      revalidateOnFocus: true,
      dedupingInterval: 15_000,
    },
  )

  return {
    scores: data?.scores,
    updatedAt: data?.updatedAt,
    error,
    isLoading,
  }
}
