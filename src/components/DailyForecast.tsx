import React from 'react';
import { DailyWeather } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

interface DailyForecastProps {
  data: DailyWeather[];
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ data }) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-muted">未来 7 天预报</p>
      </div>

      <div className="divide-y divide-white/5">
        {data.map((day, idx) => {
           const isToday = idx === 0;
           return (
             <div 
               key={idx} 
               className="flex items-center justify-between py-4 group cursor-default"
             >
               <div className="flex flex-col">
                 <span className="text-white font-medium text-sm group-hover:text-blue-400 transition-colors">
                   {isToday ? '今天' : dayjs(day.fxDate).format('ddd')}
                 </span>
                 <p className="text-white/30 text-[10px] uppercase tracking-wider">{dayjs(day.fxDate).format('MM/DD')}</p>
               </div>

               <div className="flex items-center gap-2">
                 <WeatherIcon code={day.iconDay} className="w-6 h-6 text-white/90" />
                 <span className="text-white/50 text-xs font-medium hidden md:inline">{day.textDay}</span>
               </div>

               <div className="flex items-center gap-3">
                 <span className="text-white font-bold text-sm">{day.tempMax}°</span>
                 <span className="text-white/30 text-sm">{day.tempMin}°</span>
               </div>
             </div>
           );
        })}
      </div>
    </div>
  );
};
