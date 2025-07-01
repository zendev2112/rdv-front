import { useEffect, useState } from 'react'

const API_KEY = '917367df13ed4a24b20144110250107' // <-- Replace with your key
const LOCATION = 'Coronel Suarez'

export function useWeatherAPI() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
        LOCATION
      )}&days=5&lang=es`
    )
      .then(res => res.json())
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}