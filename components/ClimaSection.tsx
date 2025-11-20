'use client'

import { useTomorrowWeather } from './hooks/useTomorrowWeather'
import {
  Cloud,
  CloudRain,
  CloudSun,
  Sun,
  Wind,
  Droplets,
  Eye,
  Umbrella,
} from 'lucide-react'

interface WeatherData {
  location: string
  currentTemp: number
  condition: string
  highTemp: number
  lowTemp: number
  humidity: number
  windSpeed: number
  uvIndex: number
  visibility: number
  precipitationProbability: number
  dailyForecast: {
    day: string
    highTemp: number
    lowTemp: number
    weatherCode: number
    precipitationProbability: number
  }[]
}

export default function ClimaSection() {
  const { data, loading, error } = useTomorrowWeather()

  if (loading)
    return (
      <main className="py-0 md:py-6">
        <div className="w-full h-[1px] bg-gray-300 md:bg-gray-400 mb-6 md:mb-6 md:opacity-50"></div>
        <div className="flex justify-start mb-6">
          <div className="text-left">
            <div className="w-16 h-1 bg-primary-red mb-2"></div>
            <h2 className="text-2xl font-bold uppercase">
              EL CLIMA
            </h2>
          </div>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-red"></div>
          <span className="ml-3 text-gray-600">Cargando clima...</span>
        </div>
      </main>
    )

  const timelines = data?.data?.timelines
  if (error || !data || !timelines) {
    return (
      <main className="py-0 md:py-6">
        <div className="w-full h-[1px] bg-gray-300 md:bg-gray-400 mb-6 md:mb-6 md:opacity-50"></div>
        <div className="flex justify-start mb-6">
          <div className="text-left">
            <div className="w-16 h-1 bg-primary-red mb-2"></div>
            <h2 className="text-2xl font-bold uppercase">
              EL CLIMA
            </h2>
          </div>
        </div>
        <div className="text-center text-gray-600">
          No se pudo cargar el pronóstico del tiempo
        </div>
      </main>
    )
  }

  const currentWeather = timelines.find((t: any) => t.timestep === '1h')
    ?.intervals?.[0]
  const dailyWeather = timelines
    .find((t: any) => t.timestep === '1d')
    ?.intervals?.slice(0, 6)

  const weatherData: WeatherData = {
    location: 'Coronel Suárez',
    currentTemp: Math.round(currentWeather?.values.temperature || 0),
    condition: getWeatherCondition(currentWeather?.values.weatherCode || 0),
    highTemp: Math.round(dailyWeather?.[0]?.values.temperatureMax || 0),
    lowTemp: Math.round(dailyWeather?.[0]?.values.temperatureMin || 0),
    humidity: currentWeather?.values.humidity || 0,
    windSpeed: Math.round(currentWeather?.values.windSpeed || 0),
    uvIndex: currentWeather?.values.uvIndex || 0,
    visibility: Math.round(currentWeather?.values.visibility || 0),
    precipitationProbability:
      currentWeather?.values.precipitationProbability || 0,
    dailyForecast:
      dailyWeather?.map((d: any) => ({
        day: new Date(d.startTime).toLocaleDateString('es-AR', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }),
        highTemp: Math.round(d.values.temperatureMax),
        lowTemp: Math.round(d.values.temperatureMin),
        weatherCode: d.values.weatherCodeMax || d.values.weatherCode,
        precipitationProbability: d.values.precipitationProbabilityAvg || 0,
      })) || [],
  }

  function getWeatherCondition(code: number): string {
    const conditions: { [key: number]: string } = {
      0: 'Desconocido',
      1000: 'Despejado',
      1100: 'Mayormente despejado',
      1101: 'Parcialmente nublado',
      1102: 'Mayormente nublado',
      1001: 'Nublado',
      2000: 'Niebla',
      2100: 'Niebla ligera',
      4000: 'Llovizna',
      4001: 'Lluvia',
      4200: 'Lluvia ligera',
      4201: 'Lluvia intensa',
      5000: 'Nieve',
      5001: 'Ventisca',
      5100: 'Nieve ligera',
      5101: 'Nieve intensa',
      6000: 'Granizo helado',
      6001: 'Granizo helado mixto',
      6200: 'Granizo helado ligero',
      6201: 'Granizo helado intenso',
      7000: 'Granizo',
      7101: 'Granizo intenso',
      7102: 'Granizo ligero',
      8000: 'Tormenta',
    }
    return conditions[code] || 'Desconocido'
  }

  function getWeatherIcon(code: number, size = 'w-6 h-6') {
    if (code === 1000) return <Sun className={`${size} text-yellow-500`} />
    if ([1100, 1101].includes(code))
      return <CloudSun className={`${size} text-yellow-400`} />
    if ([1102, 1001, 2000, 2100].includes(code))
      return <Cloud className={`${size} text-gray-500`} />
    if ([4000, 4001, 4200, 4201].includes(code))
      return <CloudRain className={`${size} text-blue-500`} />
    return <Cloud className={`${size} text-gray-400`} />
  }

  return (
    <main className="py-0 md:py-6">
      {/* Horizontal divider */}
      <div className="w-full h-[1px] bg-gray-300 md:bg-gray-400 mb-6 md:mb-6 md:opacity-50"></div>

      {/* Header with Title */}
      <div className="flex justify-start mb-6">
        <div className="text-left">
          <div className="w-16 h-1 bg-primary-red mb-2"></div>
          <h2 className="text-2xl font-bold uppercase">EL CLIMA</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Current weather - 6 columns (half) */}
        <div className="w-full">
          <div className="border border-gray-200 bg-white p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {weatherData.location}
                </h3>
                <p className="text-gray-600">
                  {weatherData.condition}
                </p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold text-gray-900">
                  {weatherData.currentTemp}°
                </div>
                <div className="text-gray-600 text-sm">
                  Máx {weatherData.highTemp}° / Mín {weatherData.lowTemp}°
                </div>
              </div>
            </div>

            <div className="flex justify-center my-6">
              {getWeatherIcon(
                currentWeather?.values.weatherCode || 0,
                'w-20 h-20'
              )}
            </div>

            {/* Weather details grid */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center border border-gray-200 p-3">
                <Droplets className="w-5 h-5 text-blue-500 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Humedad
                  </p>
                  <p className="font-bold text-gray-900">
                    {weatherData.humidity}%
                  </p>
                </div>
              </div>
              <div className="flex items-center border border-gray-200 p-3">
                <Wind className="w-5 h-5 text-green-500 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Viento
                  </p>
                  <p className="font-bold text-gray-900">
                    {weatherData.windSpeed} km/h
                  </p>
                </div>
              </div>
              <div className="flex items-center border border-gray-200 p-3">
                <Eye className="w-5 h-5 text-purple-500 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Visibilidad
                  </p>
                  <p className="font-bold text-gray-900">
                    {weatherData.visibility} km
                  </p>
                </div>
              </div>
              <div className="flex items-center border border-gray-200 p-3">
                <Umbrella className="w-5 h-5 text-indigo-500 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Lluvia
                  </p>
                  <p className="font-bold text-gray-900">
                    {weatherData.precipitationProbability}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily forecast - 6 columns (half) */}
        <div className="w-full">
          <div className="border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-bold mb-4">
              Pronóstico para los próximos días
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {weatherData.dailyForecast.map((day, index) => (
                <div
                  key={index}
                  className="text-center bg-gray-50 border border-gray-200 p-4"
                >
                  <p className="text-sm font-semibold text-gray-700 mb-2 uppercase">
                    {day.day}
                  </p>
                  <div className="flex justify-center mb-3">
                    {getWeatherIcon(day.weatherCode, 'w-8 h-8')}
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-gray-900">
                      {day.highTemp}° / {day.lowTemp}°
                    </p>
                    <p className="text-xs text-blue-500">
                      {day.precipitationProbability}% lluvia
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Attribution */}
      <div className="mt-6 text-center">
        <div className="text-xs text-gray-500">
          Powered by{' '}
          <a
            href="https://www.tomorrow.io/"
            target="_blank"
            rel="noopener"
            className="underline"
          >
            Tomorrow.io
          </a>
        </div>
      </div>
    </main>
  )
}
