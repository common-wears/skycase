import React, { useState, useEffect } from 'react';
import { CityInfo } from '../types/weather';
import { X, Plus, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CityManagerProps {
  currentCity: CityInfo | null;
  onSelect: (city: CityInfo) => void;
  onRemove: (city: CityInfo) => void;
}

export const CityManager: React.FC<CityManagerProps> = ({ currentCity, onSelect, onRemove }) => {
  const [savedCities, setSavedCities] = useState<CityInfo[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('weather_saved_cities');
    if (saved) setSavedCities(JSON.parse(saved));
  }, []);

  const saveCurrentCity = () => {
    if (!currentCity) return;
    if (savedCities.find(c => c.id === currentCity.id)) return;
    const newList = [...savedCities, currentCity];
    setSavedCities(newList);
    localStorage.setItem('weather_saved_cities', JSON.stringify(newList));
  };

  const removeCity = (city: CityInfo, e: React.MouseEvent) => {
    e.stopPropagation();
    const newList = savedCities.filter(c => c.id !== city.id);
    setSavedCities(newList);
    localStorage.setItem('weather_saved_cities', JSON.stringify(newList));
    onRemove(city);
  };

  const isSaved = currentCity && savedCities.find(c => c.id === currentCity.id);

  return (
    <div className="w-full">
       <div className="flex items-center justify-between mb-4">
        <p className="text-muted font-bold">收藏节点</p>
        <button 
          onClick={saveCurrentCity}
          disabled={!currentCity || isSaved}
          className="p-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-20 rounded-lg transition-all border border-white/10"
          title="收藏当前区域"
        >
          <Plus className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {savedCities.map((city) => (
            <motion.button
              key={city.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={() => onSelect(city)}
              className={`relative group flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                currentCity?.id === city.id 
                ? 'bg-white/[0.08] border-white/20' 
                : 'bg-white/[0.02] border-transparent hover:bg-white/[0.05]'
              }`}
            >
              <div className="flex flex-col items-start overflow-hidden">
                <span className="text-white font-medium text-sm truncate w-full text-left">{city.name}</span>
                <span className="text-white/30 text-[10px] uppercase tracking-wider truncate w-full text-left">{city.country}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Star className={`w-3 h-3 ${currentCity?.id === city.id ? 'text-yellow-500' : 'text-white/10'}`} />
                <span 
                  onClick={(e) => removeCity(city, e)}
                  className="p-1 hover:bg-red-500/20 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3 h-3 text-white/30" />
                </span>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
        
        {savedCities.length === 0 && (
          <div className="py-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
            <p className="text-white/20 text-xs font-medium tracking-widest uppercase">无收藏档案</p>
          </div>
        )}
      </div>
    </div>
  );
};
