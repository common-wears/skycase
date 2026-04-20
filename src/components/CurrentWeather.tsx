import React from 'react';
import { WeatherData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { Wind, Droplets, Thermometer, Eye, Gauge, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import dayjs from 'dayjs';

interface CurrentWeatherProps {
  data: WeatherData;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data }) => {
  const { current, city } = data;

  const highlights = [
    { label: '体感温度', value: `${current.feelsLike}°`, icon: Thermometer },
    { label: '湿度', value: `${current.humidity}%`, icon: Droplets },
    { label: '风速', value: `${current.windSpeed} km/h`, icon: Wind },
    { label: '能见度', value: `${current.vis} km`, icon: Eye },
    { label: '气压', value: `${current.pressure} mb`, icon: Gauge },
    { label: '紫外线', value: current.uvIndex || '低', icon: Sun },
  ];

  return (
    <div className="w-full text-white">
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 mb-12">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="text-center md:text-left space-y-2"
        >
          <h1 className="text-5xl font-bold tracking-tight">{city.name}</h1>
          <p className="text-white/60 text-lg">
            {dayjs().format('YYYY年MM月DD日 dddd')} | {current.text}
          </p>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.2 }}
           className="text-center md:text-right"
        >
          <div className="text-[120px] font-thin leading-[0.8] tracking-[-4px] relative inline-block select-none">
             {current.temp}
             <span className="text-4xl align-top absolute -right-8 top-4 font-normal opacity-50">°</span>
          </div>
          <p className="text-white/80 text-xl font-light mt-4 tracking-tight">体感温度 {current.feelsLike}°</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {highlights.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.05 }}
            className="glass-card p-6 flex flex-col items-center justify-center text-center group hover:bg-white/[0.06] transition-colors"
          >
            <item.icon className="w-6 h-6 text-[#94a3b8] mb-3 group-hover:text-white/90 transition-colors" />
            <span className="text-muted text-[10px] mb-1">{item.label}</span>
            <span className="text-xl font-medium tracking-tight whitespace-nowrap">{item.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
