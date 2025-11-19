'use client'

import { Cloud, CloudRain, Sun, CloudSnow, Wind } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function WeatherWidget() {
  const [weather, setWeather] = useState<{
    temp: number
    condition: string
    icon: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Using Open-Meteo free API (no key required)
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-34.7461&longitude=-63.2516&current=temperature_2m,weather_code'
        )
        const data = await response.json()
        const current = data.current

        setWeather({
          temp: Math.round(current.temperature_2m),
          condition: getWeatherCondition(current.weather_code),
          icon: getWeatherIcon(current.weather_code),
        })
      } catch (error) {
        console.error('Weather fetch failed:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [])

  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return 'sunny'
    if (code === 2 || code === 3) return 'cloudy'
    if (code === 45 || code === 48) return 'foggy'
    if (code >= 51 && code <= 67) return 'rainy'
    if (code >= 80 && code <= 82) return 'rainy'
    if (code >= 85 && code <= 86) return 'snowy'
    return 'cloudy'
  }

  const getWeatherCondition = (code: number) => {
    if (code === 0) return 'Despejado'
    if (code === 1 || code === 2) return 'Mayormente despejado'
    if (code === 3) return 'Nublado'
    if (code === 45 || code === 48) return 'Niebla'
    if (code >= 51 && code <= 67) return 'Lluvia'
    if (code >= 80 && code <= 82) return 'Lluvia'
    if (code >= 85 && code <= 86) return 'Nieve'
    return 'Variable'
  }

  const IconComponent = {
    sunny: Sun,
    cloudy: Cloud,
    rainy: CloudRain,
    snowy: CloudSnow,
    foggy: Wind,
  }[weather?.icon || 'cloudy'] || Cloud

  return (
    <div
      className="flex items-center justify-start py-2 px-4 gap-4 ml-4 border-l border-gray-200"
      style={{ margin: '4px 0' }}
    >
      <div className="text-sm font-bold text-gray-900">Coronel Suárez</div>
      <div className="flex items-center gap-2">
        <IconComponent className="w-5 h-5 text-gray-600" />
        <div className="text-sm font-bold text-gray-900">
          {loading ? '-' : `${weather?.temp}°`}
        </div>
        <div className="text-xs text-gray-500">
          {loading ? 'Cargando...' : weather?.condition}
        </div>
      </div>
    </div>
  )
}