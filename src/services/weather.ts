import axios from 'axios';
import { CityInfo, WeatherData } from '../types/weather';

const GEO_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

const apiClient = axios.create({
  timeout: 10000,
});

export const searchCities = async (query: string): Promise<CityInfo[]> => {
  if (!query) return [];
  try {
    const res = await apiClient.get(GEO_API, {
      params: {
        name: query,
        count: 10,
        language: 'zh',
        format: 'json',
      },
    });
    
    if (!res.data.results) return [];
    
    return res.data.results.map((item: any) => ({
      name: item.name,
      id: item.id.toString(),
      lat: item.latitude.toString(),
      lon: item.longitude.toString(),
      adm2: item.admin2 || '',
      adm1: item.admin1 || '',
      country: item.country,
    }));
  } catch (error) {
    console.error('Search cities error:', error);
    return [];
  }
};

export const getCityByCoords = async (lat: number, lon: number): Promise<CityInfo | null> => {
  try {
    // Open-Meteo doesn't have a direct reverse geocoding API in their free tier
    // We'll use a public reverse geocoding API or a fallback
    // Actually, BigDataCloud or similar. For now let's try to get city name from a simple fetch
    const res = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=zh`);
    const data = res.data;
    
    return {
      name: data.city || data.locality || '当前位置',
      id: `${lat},${lon}`,
      lat: lat.toString(),
      lon: lon.toString(),
      adm2: data.principalSubdivision || '',
      adm1: data.countryName || '',
      country: data.countryName || '',
    };
  } catch (error) {
    console.error('Get city error:', error);
    return {
      name: '当前位置',
      id: `${lat},${lon}`,
      lat: lat.toString(),
      lon: lon.toString(),
      adm2: '',
      adm1: '',
      country: '',
    };
  }
};

export const getWeatherData = async (city: CityInfo): Promise<WeatherData | null> => {
  try {
    const res = await apiClient.get(WEATHER_API, {
      params: {
        latitude: city.lat,
        longitude: city.lon,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,visibility',
        hourly: 'temperature_2m,weather_code,precipitation_probability',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max',
        timezone: 'auto',
      },
    });

    const data = res.data;
    const current = data.current;
    
    return {
      current: {
        temp: Math.round(current.temperature_2m).toString(),
        feelsLike: Math.round(current.apparent_temperature).toString(),
        icon: current.weather_code.toString(),
        text: getWeatherText(current.weather_code),
        windSpeed: current.wind_speed_10m.toString(),
        humidity: current.relative_humidity_2m.toString(),
        pressure: current.surface_pressure.toString(),
        vis: (current.visibility / 1000).toString(), // convert to km
        uvIndex: data.daily.uv_index_max[0].toString(),
      },
      hourly: data.hourly.time.map((time: string, i: number) => ({
        fxTime: time,
        temp: Math.round(data.hourly.temperature_2m[i]).toString(),
        icon: data.hourly.weather_code[i].toString(),
        text: getWeatherText(data.hourly.weather_code[i]),
        pop: data.hourly.precipitation_probability[i].toString(),
      })),
      daily: data.daily.time.map((time: string, i: number) => ({
        fxDate: time,
        tempMax: Math.round(data.daily.temperature_2m_max[i]).toString(),
        tempMin: Math.round(data.daily.temperature_2m_min[i]).toString(),
        iconDay: data.daily.weather_code[i].toString(),
        textDay: getWeatherText(data.daily.weather_code[i]),
        pop: data.daily.precipitation_probability_max[i].toString(),
      })),
      city,
    };
  } catch (error) {
    console.error('Get weather data error:', error);
    return null;
  }
};

function getWeatherText(code: number): string {
  const mapping: Record<number, string> = {
    0: '晴朗',
    1: '大部分晴朗',
    2: '多云',
    3: '阴天',
    45: '雾',
    48: '雾',
    51: '毛毛雨',
    53: '毛毛雨',
    55: '毛毛雨',
    61: '小雨',
    63: '中雨',
    65: '大雨',
    71: '小雪',
    73: '中雪',
    75: '大雪',
    77: '雪粒',
    80: '阵雨',
    81: '阵雨',
    82: '阵雨',
    85: '阵雪',
    86: '阵雪',
    95: '雷阵雨',
    96: '雷阵雨伴有冰雹',
    99: '雷阵雨伴有强冰雹',
  };
  return mapping[code] || '未知';
}
