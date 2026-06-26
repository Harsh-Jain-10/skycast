import React, { useEffect, useState } from "react";
import type { FavoriteCityResponse } from "../types";
import { Heart, Trash2, MapPin, AlertCircle, ArrowRight } from "lucide-react";

interface FavoritesProps {
  onSelectCity: (city: string) => void;
}

export const Favorites: React.FC<FavoritesProps> = ({ onSelectCity }) => {
  const [favorites, setFavorites] = useState<FavoriteCityResponse[]>([]);
  const [favoritesWeatherData, setFavoritesWeatherData] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/favorites");
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
        
        // Fetch weather for each favorite city in parallel
        const weatherPromises = data.map(async (city: FavoriteCityResponse) => {
          try {
            const wRes = await fetch(
              `http://localhost:8000/api/weather?lat=${city.latitude}&lon=${city.longitude}&q=${encodeURIComponent(city.name)}`
            );
            if (wRes.ok) {
              const wData = await wRes.json();
              return { id: city.id, weather: wData };
            }
          } catch (e) {
            console.error(`Error loading weather for ${city.name}:`, e);
          }
          return { id: city.id, weather: null };
        });

        const weatherResults = await Promise.all(weatherPromises);
        const weatherMap: Record<number, any> = {};
        weatherResults.forEach((res) => {
          if (res && res.weather) {
            weatherMap[res.id] = res.weather;
          }
        });
        setFavoritesWeatherData(weatherMap);
      } else {
        setError("Could not retrieve favorites registry");
      }
    } catch (e) {
      setError("Network error connecting to API server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Avoid selecting the city
    try {
      const res = await fetch(`http://localhost:8000/api/favorites/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setFavorites(favorites.filter((f) => f.id !== id));
      }
    } catch (err) {
      console.error("Error deleting favorite:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-12 h-12 border-t-2 border-r-2 border-white rounded-full animate-spin mb-4" />
        <span className="text-[10px] font-bold text-slate-400 tracking-widest font-mono uppercase animate-pulse">Syncing Bookmarked Coordinates...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full pt-28 px-4 md:px-8 space-y-8 max-w-7xl mx-auto w-full animate-fade-in pb-16">
      <div className="flex flex-col gap-1 mb-8">
        <span className="text-[10px] font-bold text-slate-400 tracking-widest font-mono uppercase">Control Center</span>
        <h1 className="text-3xl font-extrabold text-white tracking-wide font-display mt-0.5">Saved Favorite Locations</h1>
        <p className="text-xs text-slate-400 font-medium">Monitor and compare live metrics of your bookmarked cities</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-3 text-sm max-w-md mx-auto">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!error && favorites.length === 0 && (
        <div className="text-center p-12 premium-card max-w-md mx-auto flex flex-col items-center justify-center min-h-[250px]">
          <Heart className="w-10 h-10 text-slate-500/40 mb-4 stroke-1 animate-pulse" />
          <h3 className="text-base font-bold text-white mb-1.5">No Favorite Cities</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            Search for locations and click the Heart icon on the dashboard to bookmark cities for immediate tracking.
          </p>
        </div>
      )}

      {!error && favorites.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((city) => {
            const weather = favoritesWeatherData[city.id];
            const temp = weather ? Math.round(weather.current.temperature) : null;
            const desc = weather ? weather.current.description : "Loading...";
            
            return (
              <div
                key={city.id}
                onClick={() => onSelectCity(city.name)}
                className="premium-card p-6 cursor-pointer flex flex-col justify-between h-44 relative group overflow-hidden"
              >
                {/* Trash delete icon */}
                <button
                  onClick={(e) => handleDelete(e, city.id)}
                  className="absolute right-4 top-4 p-2 rounded-xl bg-white/0 hover:bg-red-500/25 text-slate-400 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all duration-200"
                  title="Delete favorite"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="pr-10">
                  <div className="flex items-center gap-1.5 text-white font-bold text-lg">
                    <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="line-clamp-1 font-display">{city.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 tracking-wide font-medium mt-0.5 font-mono">
                    {city.state ? `${city.state}, ` : ""}{city.country || ""}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  {temp !== null ? (
                    <div className="flex items-center gap-3">
                      <span className="text-4xl font-extrabold text-white font-display">{temp}°</span>
                      <span className="text-xs text-slate-300 font-semibold">{desc}</span>
                    </div>
                  ) : (
                    <div className="w-16 h-8 bg-white/3 rounded-xl animate-pulse" />
                  )}
                  
                  <div className="p-2 rounded-xl bg-white/3 group-hover:bg-blue-600/25 group-hover:text-blue-400 text-slate-400 border border-transparent group-hover:border-blue-500/20 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
