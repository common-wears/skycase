import React from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  CloudSnow, 
  CloudDrizzle, 
  CloudFog, 
  Wind,
  Moon,
  CloudMoon,
  CloudSun
} from 'lucide-react';

interface WeatherIconProps {
  code: string;
  className?: string;
  isNight?: boolean;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ code, className, isNight }) => {
  // WMO Weather interpretation codes (WW)
  // https://open-meteo.com/en/docs
  const codeNum = parseInt(code);

  // Clear
  if (codeNum === 0) return isNight ? <Moon className={className} /> : <Sun className={className} />;
  
  // Partly Cloudy
  if (codeNum === 1 || codeNum === 2) return isNight ? <CloudMoon className={className} /> : <CloudSun className={className} />;
  
  // Overcast
  if (codeNum === 3) return <Cloud className={className} />;
  
  // Fog
  if (codeNum === 45 || codeNum === 48) return <CloudFog className={className} />;
  
  // Drizzle
  if (codeNum >= 51 && codeNum <= 57) return <CloudDrizzle className={className} />;
  
  // Rain
  if (codeNum >= 61 && codeNum <= 67 || (codeNum >= 80 && codeNum <= 82)) return <CloudRain className={className} />;
  
  // Snow
  if (codeNum >= 71 && codeNum <= 77 || (codeNum >= 85 && codeNum <= 86)) return <CloudSnow className={className} />;
  
  // Thunderstorm
  if (codeNum >= 95 && codeNum <= 99) return <CloudLightning className={className} />;
  
  return isNight ? <Moon className={className} /> : <Sun className={className} />;
};

export const getWeatherGradient = (code: string, isNight?: boolean) => {
  const codeNum = parseInt(code);
  if (isNight) return "from-slate-900 via-blue-950 to-slate-900";
  
  if (codeNum === 0) return "from-sky-400 via-blue-500 to-blue-600"; // Clear
  if (codeNum >= 1 && codeNum <= 3) return "from-blue-400 via-slate-400 to-slate-500"; // Cloudy
  if ((codeNum >= 51 && codeNum <= 67) || (codeNum >= 80 && codeNum <= 82)) return "from-slate-600 via-slate-700 to-slate-800"; // Rain
  if ((codeNum >= 71 && codeNum <= 77) || (codeNum >= 85 && codeNum <= 86)) return "from-blue-100 via-blue-200 to-slate-300"; // Snow
  if (codeNum >= 95 && codeNum <= 99) return "from-slate-800 via-purple-900 to-slate-900"; // Thunder
  
  return "from-sky-400 via-blue-500 to-blue-600";
};
