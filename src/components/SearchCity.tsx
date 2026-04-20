import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, History, X } from 'lucide-react';
import { CityInfo } from '../types/weather';
import { searchCities } from '../services/weather';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SearchCityProps {
  onSelect: (city: CityInfo) => void;
  onLocate: () => void;
}

export const SearchCity: React.FC<SearchCityProps> = ({ onSelect, onLocate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityInfo[]>([]);
  const [history, setHistory] = useState<CityInfo[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('weather_search_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim()) {
        const data = await searchCities(query);
        setResults(data);
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: CityInfo) => {
    const newHistory = [city, ...history.filter(h => h.id !== city.id)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('weather_search_history', JSON.stringify(newHistory));
    onSelect(city);
    setQuery('');
    setIsFocused(false);
  };

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory([]);
    localStorage.removeItem('weather_search_history');
  };

const POPULAR_CITIES = [
    { name: '北京', id: '101010100', adm1: '北京', adm2: '北京', lat: '39.9042', lon: '116.4074', country: '中国' },
    { name: '上海', id: '101020100', adm1: '上海', adm2: '上海', lat: '31.2304', lon: '121.4737', country: '中国' },
    { name: '广州', id: '101280101', adm1: '广东', adm2: '广州', lat: '23.1291', lon: '113.2644', country: '中国' },
    { name: '深圳', id: '101280601', adm1: '广东', adm2: '深圳', lat: '22.5431', lon: '114.0579', country: '中国' },
    { name: '东京', id: '201010100', adm1: '东京都', adm2: '东京', lat: '35.6895', lon: '139.6917', country: '日本' },
    { name: '伦敦', id: '203010100', adm1: '伦敦', adm2: '伦敦', lat: '51.5074', lon: '-0.1278', country: '英国' },
  ];

  return (
    <div className="relative w-full z-50 text-left" ref={containerRef}>
      <div className={cn(
        "flex items-center gap-3 px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl transition-all duration-300",
        isFocused && "bg-white/[0.08] ring-2 ring-white/10 border-white/20"
      )}>
        <Search className="w-5 h-5 text-white/50" />
        <input
          type="text"
          placeholder="搜索全球城市..."
          className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/40 text-sm py-0.5"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        <button 
          onClick={onLocate}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          title="定位当前位置"
        >
          <MapPin className="w-5 h-5 text-white/60 hover:text-white transition-colors" />
        </button>
      </div>

      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute top-full left-0 right-0 mt-3 p-2 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            {results.length > 0 ? (
              <div className="max-h-64 overflow-y-auto space-y-1">
                {results.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleSelect(city)}
                    className="w-full px-4 py-3 text-left hover:bg-white/5 rounded-xl flex flex-col transition-all group"
                  >
                    <span className="text-white group-hover:text-blue-400 transition-colors font-medium">{city.name}</span>
                    <span className="text-white/40 text-[10px] uppercase tracking-wider">{city.adm1}, {city.country}</span>
                  </button>
                ))}
              </div>
            ) : query.trim() ? (
              <div className="p-8 text-center text-white/30 text-xs font-medium tracking-widest uppercase">
                未探测到目标地理单元
              </div>
            ) : (
               <div className="space-y-4">
                  <div className="px-3 pt-2">
                    <p className="text-muted text-[10px] font-bold">推荐节点 / 历史记录</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {(history.length > 0 ? history : POPULAR_CITIES).map((city) => (
                      <button
                        key={city.id}
                        onClick={() => handleSelect(city)}
                        className="px-4 py-3 text-left hover:bg-white/5 rounded-xl transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-white/20 group-hover:text-blue-500 transition-colors" />
                          <span className="text-white/80 group-hover:text-white transition-colors text-sm font-medium">{city.name}</span>
                        </div>
                        <span className="text-white/20 text-[10px] group-hover:text-white/40">{city.country}</span>
                      </button>
                    ))}
                  </div>
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
