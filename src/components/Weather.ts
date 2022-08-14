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

  //Get the sky coverage as string
  export function getSky(code : number){
    switch(code){
      case 0:
        return "clear"
      case 1: case 2: case 51: case 53: case 71: case 80: case 81: case 85: case 86:
        return "partly"
      case 3: case 45: case 48:  case 56: case 57: case 61: case 63: case 65: case 73: 
      case 75: case 77: case 82: case 95: case 96: case 99:
        return "full"
      case 55: case 66: case 67: case 69: case 75: case 99:
        return "extreme"
      default: 
        return "clear"
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