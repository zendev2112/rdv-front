'use client'

import { useTomorrowWeather } from './hooks/useTomorrowWeather'
import { Card, CardContent } from '@/components/ui/card'
import {
  Cloud,
  CloudRain,
  CloudSun,
  Sun,
  ThermometerSun,
  Wind,
  Droplets,
  Eye,
  Zap,
  Umbrella,
} from 'lucide-react'
import Link from 'next/link'

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
  hourlyForecast: {
    time: string
    temp: number
    weatherCode: number
    precipitationProbability: number
  }[]
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
      <div className="py-6 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="mb-6 border-b border-light-gray pb-2 flex items-center">
            <div className="h-5 w-1 bg-primary-red mr-3"></div>
            <h2 className="text-xl font-bold uppercase">EL CLIMA</h2>
          </div>
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-red"></div>
            <span className="ml-3 text-dark-gray">Cargando clima...</span>
          </div>
        </div>
      </div>
    )

  if (error || !data)
    return (
      <div className="py-6 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="mb-6 border-b border-light-gray pb-2 flex items-center">
            <div className="h-5 w-1 bg-primary-red mr-3"></div>
            <h2 className="text-xl font-bold uppercase">EL CLIMA</h2>
          </div>
          <div className="text-center text-dark-gray">
            No se pudo cargar el pronóstico del tiempo
          </div>
        </div>
      </div>
    )

  // Defensive check for data shape
  const timelines = data?.data?.timelines
  if (error || !data || !timelines) {
    return (
      <div className="py-6 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="mb-6 border-b border-light-gray pb-2 flex items-center">
            <div className="h-5 w-1 bg-primary-red mr-3"></div>
            <h2 className="text-xl font-bold uppercase">EL CLIMA</h2>
          </div>
          <div className="text-center text-dark-gray">
            No se pudo cargar el pronóstico del tiempo
          </div>
        </div>
      </div>
    )
  }

  // Map Tomorrow.io data to our structure
  const currentWeather = timelines.find((t: any) => t.timestep === '1h')
    ?.intervals?.[0]
  const dailyWeather = timelines
    .find((t: any) => t.timestep === '1d')
    ?.intervals?.slice(0, 5)
  const hourlyWeather = timelines
    .find((t: any) => t.timestep === '1h')
    ?.intervals?.slice(0, 12)

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
    hourlyForecast:
      hourlyWeather?.map((h: any) => ({
        time: new Date(h.startTime).toLocaleTimeString('es-AR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        temp: Math.round(h.values.temperature),
        weatherCode: h.values.weatherCode,
        precipitationProbability: h.values.precipitationProbability,
      })) || [],
    dailyForecast:
      dailyWeather?.map((d: any, i: number) => ({
        day:
          i === 0
            ? 'Hoy'
            : new Date(d.startTime).toLocaleDateString('es-AR', {
                weekday: 'short',
              }),
        highTemp: Math.round(d.values.temperatureMax),
        lowTemp: Math.round(d.values.temperatureMin),
        weatherCode: d.values.weatherCode,
        precipitationProbability: d.values.precipitationProbability,
      })) || [],
  }

  // Tomorrow.io weather code mapping
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

  // Weather icon mapping
  function getWeatherIcon(code: number, size = 'w-6 h-6') {
    if (code === 1000) return <Sun className={`${size} text-yellow-500`} />
    if ([1100, 1101].includes(code))
      return <CloudSun className={`${size} text-yellow-400`} />
    if ([1102, 1001, 2000, 2100].includes(code))
      return <Cloud className={`${size} text-gray-500`} />
    if ([4000, 4001, 4200, 4201].includes(code))
      return <CloudRain className={`${size} text-blue-500`} />
    if (code === 8000) return <Zap className={`${size} text-purple-500`} />
    return <Cloud className={`${size} text-gray-400`} />
  }

  return (
    <section className="py-6 border-t border-gray-200">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="mb-6 border-b border-light-gray pb-2 flex items-center">
          <div className="h-5 w-1 bg-primary-red mr-3"></div>
          <h2 className="text-xl font-bold uppercase">EL CLIMA</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Current weather - Enhanced */}
          <div className="lg:col-span-5">
            <Card className="overflow-hidden h-full border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {weatherData.location}
                    </h3>
                    <p className="text-gray-600">{weatherData.condition}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-bold text-gray-800">
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

                {/* Enhanced weather details grid */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center bg-white/50 rounded-lg p-3">
                    <Droplets className="w-5 h-5 text-blue-500 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Humedad</p>
                      <p className="font-bold text-gray-800">
                        {weatherData.humidity}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center bg-white/50 rounded-lg p-3">
                    <Wind className="w-5 h-5 text-green-500 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Viento</p>
                      <p className="font-bold text-gray-800">
                        {weatherData.windSpeed} km/h
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center bg-white/50 rounded-lg p-3">
                    <Eye className="w-5 h-5 text-purple-500 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">
                        Visibilidad
                      </p>
                      <p className="font-bold text-gray-800">
                        {weatherData.visibility} km
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center bg-white/50 rounded-lg p-3">
                    <Umbrella className="w-5 h-5 text-indigo-500 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Lluvia</p>
                      <p className="font-bold text-gray-800">
                        {weatherData.precipitationProbability}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Forecast section */}
          <div className="lg:col-span-7 space-y-6">
            {/* Hourly forecast */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold border-b border-light-gray pb-2 mb-4">
                  Próximas 12 horas
                </h3>
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                  {weatherData.hourlyForecast.map((hour, index) => (
                    <div
                      key={index}
                      className="text-center bg-gray-50 rounded-lg p-3"
                    >
                      <p className="text-xs text-gray-500 mb-1">{hour.time}</p>
                      <div className="flex justify-center mb-2">
                        {getWeatherIcon(hour.weatherCode, 'w-4 h-4')}
                      </div>
                      <p className="font-bold text-sm">{hour.temp}°</p>
                      <p className="text-xs text-blue-500">
                        {hour.precipitationProbability}%
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 5-day forecast */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold border-b border-light-gray pb-2 mb-4">
                  Pronóstico a 5 días
                </h3>
                <div className="space-y-3">
                  {weatherData.dailyForecast.map((day, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="w-16">
                        <p className="font-bold text-sm">{day.day}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getWeatherIcon(day.weatherCode)}
                        <span className="text-blue-500 text-sm">
                          {day.precipitationProbability}%
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">{day.highTemp}°</span>
                        <span className="text-gray-500 ml-2">
                          {day.lowTemp}°
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Attribution and link */}
        <div className="mt-6 text-center">
          <Link
            href="#"
            className="inline-flex items-center text-primary-red font-medium hover:text-opacity-80 transition-colors"
          >
            <ThermometerSun className="w-4 h-4 mr-2" />
            Ver pronóstico extendido
          </Link>
          <div className="text-xs text-gray-400 mt-2">
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

        {/* Red accent line */}
        <div className="h-1 bg-primary-red w-1/4 mt-6 mx-auto"></div>
      </div>
    </section>
  )
}
