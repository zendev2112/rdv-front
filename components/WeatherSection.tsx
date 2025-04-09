'use client'

import { Card, CardContent } from '@/components/ui/card'
import { 
  Cloud, CloudRain, CloudSun, Sun, ThermometerSun, Wind, Droplets 
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface WeatherData {
  location: string
  currentTemp: number
  condition: string
  highTemp: number
  lowTemp: number
  humidity: number
  windSpeed: number
  forecast: {
    day: string
    highTemp: number
    lowTemp: number
    condition: string
  }[]
}

export default function WeatherSection() {
  // Sample data - in a real app, this would come from an API
  const weatherData: WeatherData = {
    location: "Coronel Suarez",
    currentTemp: 24,
    condition: "Parcialmente nublado",
    highTemp: 26,
    lowTemp: 18,
    humidity: 65,
    windSpeed: 12,
    forecast: [
      { day: "Hoy", highTemp: 26, lowTemp: 18, condition: "cloudy" },
      { day: "Mañana", highTemp: 28, lowTemp: 19, condition: "sunny" },
      { day: "Miércoles", highTemp: 25, lowTemp: 17, condition: "rainy" },
      { day: "Jueves", highTemp: 22, lowTemp: 16, condition: "cloudy-sun" },
      { day: "Viernes", highTemp: 24, lowTemp: 15, condition: "sunny" }
    ]
  }

  // Map weather conditions to icons
  const conditionIcons = {
    sunny: <Sun className="w-6 h-6 text-yellow-500" />,
    cloudy: <Cloud className="w-6 h-6 text-gray-500" />,
    rainy: <CloudRain className="w-6 h-6 text-blue-500" />,
    "cloudy-sun": <CloudSun className="w-6 h-6 text-gray-400" />
  }

  return (
    <section className="py-6 border-t border-gray-200">
      <div className="container mx-auto px-4">
        {/* Section header with vibrant red accent */}
        <div className="mb-6 border-b border-light-gray pb-2 flex items-center">
          <div className="h-5 w-1 bg-primary-red mr-3"></div>
          <h2 className="text-xl font-bold uppercase">EL CLIMA</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Current weather - takes up 5/12 of the grid */}
          <div className="md:col-span-5">
            <Card className="overflow-hidden h-full border-0 shadow-sm bg-cream">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold">{weatherData.location}</h3>
                    <p className="text-dark-gray">{weatherData.condition}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold">{weatherData.currentTemp}°</div>
                    <div className="text-dark-gray">
                      {weatherData.highTemp}° / {weatherData.lowTemp}°
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center my-6">
                  <div className="relative h-32 w-32">
                    <Image 
                      src="/placeholder.svg?height=200&width=200" 
                      alt="Weather condition"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center">
                    <Droplets className="w-5 h-5 text-primary-red mr-2" />
                    <div>
                      <p className="text-sm text-dark-gray">Humedad</p>
                      <p className="font-bold">{weatherData.humidity}%</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Wind className="w-5 h-5 text-primary-red mr-2" />
                    <div>
                      <p className="text-sm text-dark-gray">Viento</p>
                      <p className="font-bold">{weatherData.windSpeed} km/h</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* 5-day forecast - takes up 7/12 of the grid */}
          <div className="md:col-span-7">
            <Card className="h-full border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold border-b border-light-gray pb-2 mb-4">Pronóstico a 5 días</h3>
                
                <div className="grid grid-cols-1 divide-y divide-light-gray">
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} className="py-3 flex justify-between items-center">
                      <div className="w-1/4">
                        <p className="font-bold">{day.day}</p>
                      </div>
                      <div className="w-1/4 flex justify-center">
                        {conditionIcons[day.condition as keyof typeof conditionIcons]}
                      </div>
                      <div className="w-1/4 text-center">
                        <p className="font-bold">{day.highTemp}°</p>
                      </div>
                      <div className="w-1/4 text-right">
                        <p className="text-dark-gray">{day.lowTemp}°</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-light-gray">
                  <Link 
                    href="#" 
                    className="flex items-center justify-center text-primary-red font-medium hover:text-opacity-80 transition-colors"
                  >
                    <ThermometerSun className="w-4 h-4 mr-2" />
                    Ver pronóstico extendido
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Red accent line at bottom */}
        <div className="h-1 bg-primary-red w-1/4 mt-6 mx-auto"></div>
      </div>
    </section>
  )
}