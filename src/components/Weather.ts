export const weatherObj : any = {
  "day" : {
    "normal" : ["lake_matsubara_on_a_morning_by_kawase_hasui"],
    "foggy": ["morning_mist_by_hiroshige_utagawa"],
    "overcast": ["shimabara_kujukushima_by_kawase_hasui", "the_pond_at_benten_shrine_in_hiba_by_kawase_hasui"],
    "rain": ["sudden_shower_at_shōno_by_utagawa_hiroshige", "spring_rain_at_tsuchiyama_by_utagawa_hiroshige"],
    "snow": ["snow_at_itsukushima_kawase_hasui"],
    "thunder": [""]
  },
  "night" : {
    "normal" : ["full_moon_over_a_mountain_landscape_by_utagawa_hiroshige"],
    "foggy" : ["misty_mountains_by_suzuki_shōnen", "priest_nichiren_praying_for_the_restless_spirit_by_tsukioka_yoshitoshi"],
    "overcast" : ["above_the_clouds_by_yoshida_hiroshi"],
    "rain" : ["evening_rain_at_karasaki,_pine_tree_by_utagawa_hiroshige"],
    "snow": ["the_gion_shrine_in_snow_utagawa_hiroshige"],
    "thunder": [""]
}}

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
    const list : any = weatherObj[time][weather]
    return list[Math.floor(Math.random() * list.length)]
  }

  export function getPrintName(print : any){
    print = print.replaceAll('_', ' ')
    const byline = print.split("by") 
    return(byline)
  }

//Render the weather icon by string concat
export function getWeatherIcon(time: number, sunset : number, sunrise : number, weather: number){
    const timeOfDay : string = getTimeOfDay(time, sunset, sunrise);
    const currentWeather : string = getWeather(weather);
    return(
      "/assets/icons/weather/" + (timeOfDay) + "/" + (currentWeather) + ".svg"
    );
  }

//Compare current UTC to sunset/sunrise
export function getTimeOfDay(time : number, sunset : number, sunrise : number){
        if(time >= sunset || time <= sunrise) return("night");
        return("day");
    }

  //Get current date as string
export function getDate(date: any, timezone: any) {
    return date.toLocaleDateString(Intl.DateTimeFormat().resolvedOptions().locale, { weekday: "short", day: "numeric", month: "short", timeZone: timezone })
  }