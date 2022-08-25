import { Forecast } from './Utils'

export const weatherObj : any = {
  "day" : {
    "normal" : ["lake_matsubara_on_a_morning_by_kawase_hasui", "lake_shoji_by_tsuchiya_koitsu", "fushimi_inari_shrine_by_hasegawa_sadanobu_i"],
    "foggy": ["morning_mist_by_hiroshige_utagawa", "three_stations_by_utagawa_kuniyoshi", "near_omuro_by_shotei_takahashi"],
    "overcast": ["the_pond_at_benten_shrine_in_hiba_by_kawase_hasui", "cloudy_day_at_mizuki_-_ibaraki_prefecture_by_kawase_hasui"],
    "rain": ["sudden_shower_at_shōno_by_utagawa_hiroshige", "spring_rain_at_tsuchiyama_by_utagawa_hiroshige", "a_river_in_the_rain_by_koho"],
    "snow": ["snow_at_itsukushima_kawase_hasui", "in_the_snow_storm_by_beisaku_taguchi"],
    "thunder": ["hashidate_uchû_kaminari_by_utagawa_kuniyoshi"]
  },
  "night" : {
    "normal" : ["full_moon_over_a_mountain_landscape_by_utagawa_hiroshige", "no_7_fujisawa_-_tokaido_by_utagawa_hiroshige", "kawasaki_-_the_tokugô_ferry_by_utagawa_hiroshige"],
    "foggy" : ["moon_over_a_waterfront_house_by_koho", "priest_nichiren_praying_for_the_restless_spirit_by_tsukioka_yoshitoshi"],
    "overcast" : ["summer_moon_at_miyajima_by_tsuchiya_koitsu"],
    "rain" : ["evening_rain_at_karasaki,_pine_tree_by_utagawa_hiroshige", "suitengû_shrine_at_akabane_by_utagawa_hiroshige", "bridge_in_the_rain_by_koho"],
    "snow": ["the_gion_shrine_in_snow_utagawa_hiroshige", "46th_station_-_kameyama_by_utagawa_hiroshige"],
    "thunder": ["a_vision_of_prayer_on_the_waves_by_utagawa_kuniyoshi"]
}}

export function formatWeatherQuery(weatherQuery: any, date: Date) {
  let newForecast: Forecast
  const randPrint = getPrint(getPhenom(weatherQuery.current_weather.weathercode), getTimeOfDay(weatherQuery.current_weather.time, weatherQuery.daily.sunset[0], weatherQuery.daily.sunrise[0]))

  return (
    newForecast = {
      weather: getWeather(weatherQuery.current_weather.weathercode),
      current: Math.trunc(weatherQuery.current_weather.temperature),
      high: Math.trunc(weatherQuery.daily.temperature_2m_max[0]),
      low: Math.trunc(weatherQuery.daily.temperature_2m_min[0]),
      phenom: getPhenom(weatherQuery.current_weather.weathercode),
      time: getTimeOfDay(weatherQuery.current_weather.time, weatherQuery.daily.sunset[0], weatherQuery.daily.sunrise[0]),
      date: getDate(date, weatherQuery.timezone),
      print: {
        url: randPrint,
        metadata: getPrintName(randPrint)
      }
    }
  )
}

//Get the weather phenomena category
 export function getPhenom(code : number){
    switch(code){
      case 0: 
        return "normal"
      case 1: case 2: case 3:
        return "overcast"
      case 45: case 48: 
        return "foggy"
      case 51: case 53: case 55: case 56: case 57: case 61: case 63: 
      case 65: case 66: case 67: case 69: case 80: case 81: case 82:
        return "rain"
      case 71: case 73: case 75: case 77: case 85: case 86:
        return "snow"
      case 95: case 96: case 99:
        return "thunder"
      default: 
        return "normal"
    }
  }

  //Get current weather as string
  export function getWeather(code : number){
    switch(code){
      case 0: return "clear skies"
      case 1: return "partly cloudy"
      case 2: return "partly cloudy"
      case 3: return "cloudy"
      case 45: return "foggy"
      case 48: return "rime"
      case 51: return "light drizzle"
      case 53: return "drizzle"
      case 55: return "heavy drizzle"
      case 56: return "freezing drizzle"
      case 57: return "freezing drizzle"
      case 61: return "light rain"
      case 63: return "rain"
      case 65: return "heavy rain"
      case 66: return "freezing rain"
      case 67: return "freezing rain"
      case 69: return "god drops"
      case 71: return "light snow"
      case 73: return "snow"
      case 75: return "heavy snow"
      case 77: return "powder snow"
      case 80: return "light showers"
      case 81: return "showers"
      case 82: return "heavy showers"
      case 85: return "light flurry"
      case 86: return "heavy flurry"
      case 95: return "thunderstorms"
      case 96: return "thunderstorms"
      case 99: return "heavy thunderstorms"
      default: return "unknown"
    }
  }

  export function getPrint(weather : string, time : string){
    const printList : any = weatherObj[time][weather]
    return printList[Math.floor(Math.random() * printList.length)]
  }

  export function getPrintName(print : any){
    const byline = print.replaceAll('_', ' ').split("by") 
    return byline
  }

//Render the weather icon by string concat
export function getWeatherIcon(time: number, sunset : number, sunrise : number, weather: number){
    const timeOfDay = getTimeOfDay(time, sunset, sunrise);
    const currentWeather = getWeather(weather);
    return(`/assets/icons/weather/${(timeOfDay)}/${(currentWeather)}.svg`);
  }

//Compare current UTC to sunset/sunrise
export function getTimeOfDay(time : number, sunset : number, sunrise : number){
        if(time >= sunset || time <= sunrise) return("night");
        return("day");
    }

  //Get current date as string
export function getDate(date: any, timezone: any) {
  const formattedDate = date.toLocaleDateString(Intl.DateTimeFormat().resolvedOptions().locale, {weekday: "short", day: "numeric", month: "short", timeZone: timezone})
  return(formattedDate)
  }