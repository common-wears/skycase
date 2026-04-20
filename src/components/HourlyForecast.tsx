import React from 'react';
import { HourlyWeather } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import dayjs from 'dayjs';

interface HourlyForecastProps {
  data: HourlyWeather[];
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ data }) => {
  const chartData = data.slice(0, 24).map(h => ({
    time: dayjs(h.fxTime).format('HH:00'),
    temp: parseInt(h.temp),
    icon: h.icon,
    text: h.text
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl text-xs space-y-1">
          <p className="text-muted text-[10px]">{payload[0].payload.time}</p>
          <div className="flex items-center gap-2">
            <WeatherIcon code={payload[0].payload.icon} className="w-4 h-4" />
            <p className="font-bold text-white text-lg">{payload[0].value}°</p>
          </div>
          <p className="text-white/60 font-medium">{payload[0].payload.text}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between px-2">
        <p className="text-muted">24 小时预报 (温度趋势)</p>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(148, 163, 184, 0.5)', fontSize: 11 }}
              interval={3}
            />
            <YAxis hide domain={['dataMin - 3', 'dataMax + 3']} />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="temp" 
              stroke="#3b82f6" 
              strokeWidth={4}
              fillOpacity={0.2} 
              fill="url(#colorTemp)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex overflow-x-auto gap-8 px-2 pb-2 no-scrollbar">
        {data.slice(0, 24).map((hour, idx) => (
          <div key={idx} className="flex flex-col items-center gap-3 min-w-[44px] shrink-0">
            <span className="text-muted text-[10px] font-bold">
              {idx === 0 ? '现在' : dayjs(hour.fxTime).format('HH:00')}
            </span>
            <WeatherIcon code={hour.icon} className="w-6 h-6 text-white/90" />
            <span className="text-white font-bold text-sm tracking-tight">{hour.temp}°</span>
          </div>
        ))}
      </div>
    </div>
  );
};
