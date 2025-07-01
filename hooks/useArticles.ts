import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useArticles(section: string, limit: number = 10) {
  const { data, error, isLoading } = useSWR(
    `/api/articles?front=${section}&status=published`,
    fetcher,
    {
      refreshInterval: 5 * 60 * 1000, // 5 minutes - same as your current polling
      revalidateOnFocus: false, // Don't refetch when window gets focus
      dedupingInterval: 60 * 1000, // 1 minute - dedupe requests within this time
      revalidateOnReconnect: true, // Refetch when connection is restored
      errorRetryCount: 3, // Retry failed requests 3 times
      errorRetryInterval: 5000, // Wait 5 seconds between retries
    }
  )

  return {
    articles: data ? (Array.isArray(data) ? data.slice(0, limit) : []) : [],
    loading: isLoading,
    error: error,
    isValidating: isLoading, // For backward compatibility
  }
}