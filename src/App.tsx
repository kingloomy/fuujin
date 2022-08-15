import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDate, getWeather, getPhenom, getPrint, getPrintName, getTimeOfDay } from './components/Weather'
import './App.css'
import './weather.css'

interface Forecast {
  weather: string,
  phenom: string,
  time: string,
  date: string,
  print: Print
}

interface Print {
  url: string,
  metadata: string[]
}

interface GeoCode {
  lat: number,
  long: number,
}

const defaultCity = "Machiya"
const defaultGeo: GeoCode = { lat: 0, long: 0 }
const defaultDate = new Date()

var forecast : Forecast = {
  weather: "",
  phenom: "",
  time: "",
  date: "",
  print: {url: "", metadata: ["", ""]},
}

function buildLocationQuery(city: string) {
  return ("https://geocoding-api.open-meteo.com/v1/search?name=" + city)
}
function buildWeatherQuery(locale: GeoCode) {
  return ("https://api.open-meteo.com/v1/forecast?latitude=" + locale.lat + "&longitude=" + locale.long + "&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=ms&precipitation_unit=inch&hourly=relativehumidity_2m&timezone=auto&timeformat=unixtime")
}

function App() {
  const [errorBool, setErrorBool] = useState<boolean>(false)

  const [currentCity, setCurrentCity] = useState(checkCityCache())
  const [searchQuery, setSearchQuery] = useState("")

  //Get locale by city name
  const { data: locale } = useQuery(['locale', currentCity], async () => {
    const result: any = await fetch(buildLocationQuery(currentCity)).then(res => res.json())
    if (result.results === undefined) setErrorBool(true)
    if (result.results !== undefined) {
      setErrorBool(false)
      localStorage.setItem('city', result.results[0].name)
    }
    return result
  })

  //Get locale lat/long for weather query
  const localeGeo: GeoCode = (errorBool) ? defaultGeo : { lat: locale?.results[0].latitude, long: locale?.results[0].longitude }

  //Weather status dependent upon getting locale
  const { status, data: weather } = useQuery(['weather', localeGeo, errorBool], async () => {
    const result: any = await fetch(buildWeatherQuery(localeGeo)).then(res => res.json())
    if (result.latitude !== undefined) {

      const randPrint = getPrint(getPhenom(result.current_weather.weathercode), getTimeOfDay(result.current_weather.time, result.daily.sunset[0], result.daily.sunrise[0]))
      
      forecast = {
        weather: getWeather(result.current_weather.weathercode),
        phenom: getPhenom(result.current_weather.weathercode),
        time: getTimeOfDay(result.current_weather.time, result.daily.sunset[0], result.daily.sunrise[0]),
        date: getDate(defaultDate, result.timezone),
        print: {
          url: randPrint,
          metadata: getPrintName(randPrint)
        }
      }
    }
    return result
  }, {
    enabled: !!localeGeo.lat
  })

  function checkCityCache() {
    const cachedCity = localStorage.getItem('city')
    if (cachedCity === null) return defaultCity
    return cachedCity
  }

  const searchBar = (
    <input type="text" className='search-box' placeholder={"✑ " + currentCity} onChange={e => setSearchQuery(e.target.value)} onKeyPress={e => (e.key === ('Enter' || 'Return') ? searchHandler() : null)} data-error={errorBool}></input>
  )

  function searchHandler() {
    if (searchQuery != "") setCurrentCity(searchQuery)
  }

  return (
    (errorBool) ?
      (<div className='loader'>
        <h2>undel.la</h2>
        <h3>location not found</h3>
        {searchBar}
      </div>)
      :
      ((status === "loading") ?
        <div className='loader'>
          <h2>loading</h2>
        </div>
        :
        <div className='stem' style={{backgroundImage: `url(/assets/prints/${forecast.print.url}.webp)`}}>
          <header>
            {searchBar}
            <time>{forecast.date}</time>
          </header>
          <main>
            <section>
                <h1>{weather.current_weather.temperature}°</h1>
                <h2><figure className='weather-icon' data-phenom={forecast.phenom}></figure>{forecast.weather}</h2>
            </section>
          </main>
          <footer>
            <ul>
              <li>{weather.daily.temperature_2m_max[0]} high</li>
              <li>{weather.daily.temperature_2m_min[0]} low</li>
            </ul>
            <a className="artist" href={"https://duckduckgo.com/?q=" + forecast.print.metadata[0] + "by" + forecast.print.metadata[1] + "&ia=images"}>
              <p>
                <cite> {forecast.print.metadata[0]}</cite>
                by {forecast.print.metadata[1]}
              </p>
            </a>
          </footer>
        </div>)
  )
}

export default App
