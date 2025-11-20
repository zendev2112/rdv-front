import { useEffect, useState } from 'react'

const LOCATION = [-37.4552, -61.9329]

export function useWeather() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchOpenMeteo() {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${LOCATION[0]}&longitude=${LOCATION[1]}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America/Argentina/Buenos_Aires&forecast_days=7`
        
        const res = await fetch(url)
        if (!res.ok) throw new Error('Open-Meteo API failed')
        
        const rawData = await res.json()
        
        const transformed = {
          data: {
            timelines: [
              {
                timestep: '1h',
                intervals: [{
                  startTime: rawData.current.time,
                  values: {
                    temperature: rawData.current.temperature_2m,
                    humidity: rawData.current.relative_humidity_2m,
                    windSpeed: rawData.current.wind_speed_10m,
                    weatherCode: mapOpenMeteoCode(rawData.current.weather_code),
                    precipitationProbability: rawData.hourly.precipitation_probability[0] || 0,
                    visibility: 10,
                    uvIndex: 0,
                  }
                }]
              },
              {
                timestep: '1d',
                intervals: rawData.daily.time.map((time: string, i: number) => ({
                  startTime: time,
                  values: {
                    temperatureMax: rawData.daily.temperature_2m_max[i],
                    temperatureMin: rawData.daily.temperature_2m_min[i],
                    weatherCode: mapOpenMeteoCode(rawData.daily.weather_code[i]),
                    precipitationProbabilityAvg: rawData.daily.precipitation_probability_max[i],
                  }
                }))
              }
            ]
          }
        }
        
        setData(transformed)
        setLoading(false)
      } catch (err) {
        console.error('Open-Meteo failed:', err)
        setError(true)
        setLoading(false)
      }
    }

    fetchOpenMeteo()
  }, [])

  function mapOpenMeteoCode(code: number): number {
    const mapping: { [key: number]: number } = {
      0: 1000,
      1: 1100,
      2: 1101,
      3: 1102,
      45: 2000,
      48: 2100,
      51: 4200,
      53: 4000,
      55: 4001,
      61: 4200,
      63: 4000,
      65: 4201,
      71: 5100,
      73: 5000,
      75: 5101,
      77: 5000,
      80: 4200,
      81: 4000,
      82: 4201,
      85: 5100,
      86: 5101,
      95: 8000,
      96: 8000,
      99: 8000,
    }
    return mapping[code] || 1000
  }

  return { data, loading, error }
}