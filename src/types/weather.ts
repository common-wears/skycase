export interface WeatherBasic {
  temp: string;
  feelsLike: string;
  icon: string;
  text: string;
  windSpeed: string;
  humidity: string;
  pressure: string;
  vis: string;
  uvIndex?: string;
  precip?: string;
}

export interface HourlyWeather {
  fxTime: string;
  temp: string;
  icon: string;
  text: string;
  pop?: string; // Probability of precipitation
}

export interface DailyWeather {
  fxDate: string;
  tempMax: string;
  tempMin: string;
  iconDay: string;
  textDay: string;
  pop?: string;
}

export interface CityInfo {
  name: string;
  id: string;
  lat: string;
  lon: string;
  adm2: string;
  adm1: string;
  country: string;
}

export interface WeatherData {
  current: WeatherBasic;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
  city: CityInfo;
}
