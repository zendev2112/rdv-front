import { useEffect, useState } from 'react'

const API_KEY = 'aJiFgDHIemtJfZrOL33sgCWbJHanl1co' // Replace with your key
const LOCATION = [-37.4552, -61.9329] // [lat, lon] for Coronel Suárez

export function useTomorrowWeather() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const url = `https://api.tomorrow.io/v4/timelines?location=${LOCATION[0]},${LOCATION[1]}&fields=temperature,temperatureMax,temperatureMin,humidity,windSpeed,weatherCode,precipitationProbability,uvIndex,visibility&timesteps=1h,1d&units=metric&apikey=${API_KEY}`
    
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}