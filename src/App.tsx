/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SearchCity } from './components/SearchCity';
import { CurrentWeather } from './components/CurrentWeather';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { CityManager } from './components/CityManager';
import { CityInfo, WeatherData } from './types/weather';
import { getWeatherData, getCityByCoords } from './services/weather';
import { getWeatherGradient } from './components/WeatherIcon';
import { AlertCircle, Loader2, CloudRainWind } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState<CityInfo | null>(null);

  const fetchWeather = async (city: CityInfo) => {
    setLoading(true);
    setError(null);
    try {
      const weather = await getWeatherData(city);
      if (weather) {
        setData(weather);
        setCurrentCity(city);
      } else {
        setError('无法获取天气数据，请检查 API 配置。');
      }
    } catch (err) {
      setError('获取天气数据时出错。');
    } finally {
      setLoading(false);
    }
  };

  const handleLocate = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const city = await getCityByCoords(latitude, longitude);
          if (city) {
            fetchWeather(city);
          } else {
            setError('无法通过坐标找到城市。');
            setLoading(false);
          }
        },
        (err) => {
          setError('无法获取您的位置，请手动搜索。');
          setLoading(false);
        }
      );
    } else {
      setError('您的浏览器不支持地理定位。');
    }
  };

  useEffect(() => {
    handleLocate();
  }, []);

  const gradientClass = data ? getWeatherGradient(data.current.icon) : "from-slate-900 to-slate-950";

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-immersive-gradient transition-colors duration-1000">
      {/* Sidebar */}
      <aside className="w-[300px] sidebar-bg flex flex-col gap-6 p-8 overflow-y-auto no-scrollbar relative z-50">
        <div className="space-y-4">
          <SearchCity onSelect={fetchWeather} onLocate={handleLocate} />
        </div>
        
        <div className="flex-1 space-y-6">
           <CityManager 
              currentCity={currentCity} 
              onSelect={fetchWeather} 
              onRemove={() => {}} 
            />
        </div>

        <div className="mt-auto">
          <div className="glass-card p-4 text-center">
            <p className="text-muted text-[11px] mb-2 font-bold">空气质量指数 (AQI)</p>
            <p className="text-2xl font-bold mb-2 text-green-400">42 优</p>
            <div className="h-1 bg-[#1e293b] rounded-full">
              <div className="w-[42%] h-full bg-green-400 rounded-full"></div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-white/20 text-[10px] tracking-[0.2em] uppercase font-bold">
              SkyCast Atmospheric v1.0
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto no-scrollbar relative z-10">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center gap-4"
            >
              <Loader2 className="w-12 h-12 text-white animate-spin opacity-50" />
              <p className="text-white/40 text-sm animate-pulse font-medium">正在拉取实时气象图层...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center"
            >
              <div className="p-8 text-center glass-card max-w-md">
                <AlertCircle className="w-12 h-12 text-red-500/70 mx-auto mb-4" />
                <h2 className="text-white font-bold mb-2 text-xl tracking-tight">连接中断</h2>
                <p className="text-white/50 text-sm mb-6 leading-relaxed">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="px-8 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full transition-all text-sm font-medium"
                >
                  继续重试
                </button>
              </div>
            </motion.div>
          ) : data ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Header Info */}
              <CurrentWeather data={data} />

              {/* Sub Grids */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 glass-card p-6">
                  <HourlyForecast data={data.hourly} />
                </div>
                <div className="glass-card p-6">
                  <DailyForecast data={data.daily} />
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-6 opacity-20">
              <CloudRainWind className="w-20 h-20" />
              <div className="text-center">
                <p className="text-xl font-medium mb-1">等待指令</p>
                <p className="text-sm">搜索城市或激活定位系统</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

