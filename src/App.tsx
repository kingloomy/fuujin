import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Forecast, GeoCode, LocObj, City } from './scripts/Utils'
import { formatWeatherQuery } from './scripts/Weather'
import './stylesheet.css'

//Defaults for new sessions/no cache
const defaultCity = "Machiya"
const defaultGeo: GeoCode = { lat: 0, long: 0 }
const defaultDate: Date = new Date()

//Cache ref
const cachedCity = localStorage.getItem('city');

function buildLocationQuery(city: string) {
  return (`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)
}

function buildWeatherQuery(locale: GeoCode) {
  return (`https://api.open-meteo.com/v1/forecast?latitude=${locale.lat}&longitude=${locale.long}&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=ms&precipitation_unit=inch&hourly=relativehumidity_2m&timezone=auto&timeformat=unixtime`)
}

function App() {
  const [error, setError] = useState(false)
  const [meteoToggle, setMeteoToggle] = useState(false)
  const [navToggle, setNavToggle] = useState(false)
  const [currentCity, setCurrentCity] = useState(cacheHandler())
  const [searchQuery, setSearchQuery] = useState("")
  const [activeZone, setActiveZone] = useState<City>()
  const [forecast, setForecast] = useState<Forecast | undefined>(undefined)


  //Get locale by city name
  const { data: locale } = useQuery(['locale', currentCity], async () => {
    const result: LocObj = await fetch(buildLocationQuery(currentCity)).then(res => res.json())
    if (result.results === undefined) setError(true)
    if (result.results !== undefined) {
      //Enables new query after no result
      setError(false)
      setActiveZone(result.results[0])
      //Store locally if valid
      localStorage.setItem('city', result.results[0].name)
    }
    return result
  })

  //Get locale lat/long for weather query
  const localeGeo: GeoCode = (error) ? defaultGeo : { lat: activeZone?.latitude, long: activeZone?.longitude }

  //Get weather by lat/long
  const { data: weather, status: weatherStatus } = useQuery(['weather', localeGeo], async () => {
    const result: any = await fetch(buildWeatherQuery(localeGeo)).then(res => res.json())
    setForecast(formatWeatherQuery(result, defaultDate))
    return result
  }, {
    //Weather status dependent upon getting locale
    enabled: !!localeGeo.lat
  })

  function createLocaleList(locale: City[] | undefined) {
    if (locale === undefined) return null
    return (
      locale.slice(0, 6).map((x) =>
        <button key={x.id} className="button --location"
          data-active={(x.id === activeZone?.id) ? "true" : "false"}
          onClick={() => { setActiveZone(x); setNavToggle(!navToggle) }}>
          <span className='button --country'>{(x.country_code === undefined) ? "∴" : (x.country_code)}</span>
          <strong>{x.name}</strong>  <em>{x.admin1}</em>
        </button>
      ))
  }

  function createForecast() {
    return (
      <li>
        <h2 className="weather-condition">
          test
        </h2>
      </li>
    )
  }

  function cacheHandler() {
    if (cachedCity === null) return defaultCity
    return cachedCity
  }

  function searchHandler() {
    if (searchQuery !== "") setCurrentCity(searchQuery)
  }

  const searchBar = (
    <input type="search"
      className={"search-bar"}
      data-error={error}
      placeholder={(error) ? currentCity : activeZone?.name}
      onChange={e => setSearchQuery(e.target.value)}
      onKeyPress={e => (e.key === ('Enter' || 'Return') ? searchHandler() : null)} />
  )

  const header = (
    <header>
      <button data-active={navToggle} className="button --country" onClick={() => { setNavToggle(!navToggle); setMeteoToggle(false) }}>
        {(activeZone?.country_code === undefined) ? "∴" : (activeZone?.country_code)}
      </button>
      {searchBar}
      <button data-active={meteoToggle} className='button --forecast' onClick={() => { setMeteoToggle(!meteoToggle); setNavToggle(false) }}>
        <time>{forecast?.date}</time>
      </button>
    </header>
  )

  const nav = (
    <>
      {createLocaleList(locale?.results)}
    </>
  )

  const meteo = (
    <ul>
      {createForecast()}
    </ul >
  )

  const main = (
    <main>
      <section className='section --today'>
        <h1>{forecast?.current}°</h1>
        <ul className='range'>
          <li>{forecast?.high} hi</li>
          <li><hr /></li>
          <li>{forecast?.low} lo</li>
        </ul>
      </section>
    </main>
  )

  const footer = (
    <footer>
      <h2 className="weather-condition">
        <figure className='weather-icon' data-phenom={forecast?.phenom}></figure>
        {forecast?.weather}
      </h2>
      <a className="button --artist" target="_blank" href={"https://duckduckgo.com/?q=" + forecast?.print.metadata[0] + "by" + forecast?.print.metadata[1] + "&ia=images"}>
        <p>
          <cite> {forecast?.print.metadata[0]}</cite>
          by {forecast?.print.metadata[1]}
        </p>
      </a>
    </footer>
  )

  const content = (
    <>
      {main}
      {footer}
    </>
  )

  const dropdown = (
    <nav className='dropdown'>
      {(navToggle) ? <>{nav}</> : <>{meteo}</>}
    </nav>
  )

  const loader = (
    <div className='loader'>
      {(error) ?
        <>
          <h3>location not found</h3>
          {searchBar}
        </>
        :
        <h2>loading</h2>
      }
    </div>
  )

  return (
    (error || weatherStatus === "loading") ?
      <>{loader}</>
      :
      <div className='stem' style={{ backgroundImage: `url(/assets/prints/${forecast?.print.url}.webp)` }}>
        <>
          {header}
          {(navToggle || meteoToggle) ? <>{dropdown}</> : <>{content}</>}
        </>
      </div>
  )
}

export default App
