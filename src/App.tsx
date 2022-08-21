import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Forecast, GeoCode, LocObj, City } from './scripts/utils'
import { formatWeatherQuery } from './scripts/Weather'
import './stylesheet.css'

//Defaults for new sessions/no cache
const defaultCity: string = "Machiya"
const defaultGeo: GeoCode = { lat: 0, long: 0 }
const defaultDate: Date = new Date()

//Cache ref
const cachedCity = localStorage.getItem('city');

var searchQuery: string = ""
var forecast: Forecast

function buildLocationQuery(city: string) {
  return ("https://geocoding-api.open-meteo.com/v1/search?name=" + city)
}
function buildWeatherQuery(locale: GeoCode) {
  return ("https://api.open-meteo.com/v1/forecast?latitude=" + locale.lat + "&longitude=" + locale.long + "&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=ms&precipitation_unit=inch&hourly=relativehumidity_2m&timezone=auto&timeformat=unixtime")
}

function App() {
  const [errorBool, setErrorBool] = useState(false)
  const [meteoToggle, setMeteoToggle] = useState(false)
  const [navToggle, setNavToggle] = useState(false)
  const [currentCity, setCurrentCity] = useState(cacheHandler())
  const [activeZone, setActiveZone] = useState<City>()
  const [print, setPrint] = useState<string>("")


  //Get locale by city name
  const { data: locale } = useQuery(['locale', currentCity], async () => {
    const result: LocObj = await fetch(buildLocationQuery(currentCity)).then(res => res.json())
    if (result.results === undefined) setErrorBool(true)
    if (result.results !== undefined) {
      //Enables new query after no result
      setErrorBool(false)
      setActiveZone(result.results[0])
      //Store locally if valid
      localStorage.setItem('city', result.results[0].name)
    }
    return result
  })

  //Get locale lat/long for weather query
  const localeGeo: GeoCode = (errorBool) ? defaultGeo : { lat: activeZone?.latitude, long: activeZone?.longitude }

  //Get weather by lat/long
  const { status: weatherStatus } = useQuery(['weather', localeGeo], async () => {
    const result: any = await fetch(buildWeatherQuery(localeGeo)).then(res => res.json())
    forecast = formatWeatherQuery(result, defaultDate)
    setPrint(forecast.print.url)
    return result
  }, {
    //Weather status dependent upon getting locale
    enabled: !!localeGeo.lat
  })


  function createLocaleList(locale: City[] | undefined) {
    if (locale === undefined) return null
    return (
      locale.map((x, index) =>
        (index < 6) ?
          <button key={x.id} className="button --location"
            data-active={(x.id === activeZone?.id) ? "true" : "false"}
            onClick={() => { setActiveZone(x); setNavToggle(!navToggle) }}>
            <span className='button --country'>{(x.country_code === undefined) ? "∴" : (x.country_code)}</span>
            <strong>{x.name}</strong>  <em>{x.admin1}</em>
          </button>
          :
          null
      ))
  }

  function cacheHandler() {
    if (cachedCity === null) return defaultCity
    return cachedCity
  }

  function searchHandler() {
    if (searchQuery != "") setCurrentCity(searchQuery)
  }

  const searchBar = (
    <input type="search" className='search-bar'
      placeholder={currentCity}
      onChange={e => searchQuery = e.target.value}
      onKeyPress={e => (e.key === ('Enter' || 'Return') ? searchHandler() : null)} />
  )

  const header = (
    <header className='struct'>
      <div className='location-box'>
        <button data-active={navToggle} className="button --country" onClick={() => { setNavToggle(!navToggle); setMeteoToggle(false) }}>
          {(activeZone?.country_code === undefined) ? "∴" : (activeZone?.country_code)}
        </button>
        {searchBar}
      </div>
      <time>{forecast?.date}</time>
    </header>
  )

  const nav = (
    <nav className='dropdown'>
      {createLocaleList(locale?.results)}
    </nav>
  )

  const meteo = (
    <><div></div></>
  )

  const main = (
    <main className='struct'>
      <section className='section --today'>
        <h1>{forecast?.current}°</h1>
        <h2 className="weather-condition">
          <figure className='weather-icon' data-phenom={forecast?.phenom}></figure>
          {forecast?.weather}
          {/*           <button data-active={meteoToggle} className='button --forecast' onClick={() => { setMeteoToggle(!meteoToggle); setNavToggle(false) }}>
        <img src="/assets/calendar.svg" alt="forecast icon" />
      </button> */}
        </h2>
      </section>
    </main>
  )

  const footer = (
    <footer className='struct'>
      <ul>
        <li>{forecast?.high} high</li>
        <li>{forecast?.low} low</li>
      </ul>
      <a className="button --artist" target="_blank" href={"https://duckduckgo.com/?q=" + forecast?.print.metadata[0] + "by" + forecast?.print.metadata[1] + "&ia=images"}>
        <p>
          <cite> {forecast?.print.metadata[0]}</cite>
          by {forecast?.print.metadata[1]}
        </p>
      </a>
    </footer>
  )

  return (
    (errorBool) ?
      (<div className='loader --error'>
        <h3>location not found</h3>
        {searchBar}
      </div>)
      :
      ((weatherStatus === "loading") ?
        <div className='loader'>
          <h2>loading</h2>
        </div>
        :
        <div className='stem' style={{ backgroundImage: `url(/assets/prints/${print}.webp)` }}>
          <>
            {header}
            {(navToggle) ?
              <>
                {nav}
              </>
              :
              <>
                {(meteoToggle) ?
                  <>
                    {meteo}
                  </>
                  :
                  <>
                    {main}
                    {footer}
                  </>
                }</>}
          </>
        </div>
      )
  )
}

export default App
