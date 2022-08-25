export interface Forecast {
    weather: string,
    current: number,
    high: number,
    low: number,
    phenom: string,
    time: string,
    date: string,
    print: Print
}

export interface Print {
    url: string,
    metadata: string[]
}

export interface GeoCode {
    lat: number | undefined | string,
    long: number | undefined | string,
}

export interface LocObj{
    results: City[],
    generationtime_ms: number
}

export interface City {
    id: number,
    name: string,
    latitude: number | undefined | string,
    longitude: number | undefined | string,
    ranking?: number,
    elevation?: number,
    feature_code?: string,
    country_code?: string,
    admin1_id?: number,
    admin2_id?: number,
    admin3_id?: number,
    admin4_id?: number,
    timezone?: string,
    population?: number,
    postcodes?: string[],
    country_id?: number,
    country?: string,
    admin1?: string,
    admin2?: string,
    admin3?: string,
    admin4?: string,
}