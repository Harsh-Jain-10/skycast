import React, { useState } from "react";
import {
  Wind,
  Droplets,
  Gauge,
  Sun,
  Sunrise,
  Moon,
  Sparkles,
  Heart,
  Calendar,
  AlertTriangle,
  Shirt,
  Compass,
  Sprout,
  Activity
} from "lucide-react";
import { MetricCard } from "../components/MetricCard";
import { WeatherCharts } from "../components/WeatherCharts";
import type { WeatherResponse } from "../types";

interface HomeProps {
  weather: WeatherResponse | null;
  loading: boolean;
  error: string | null;
  onFavoriteToggle: () => void;
  isFavorite: boolean;
}

export const Home: React.FC<HomeProps> = ({
  weather,
  loading,
  error,
  onFavoriteToggle,
  isFavorite
}) => {
  const [activeAITab, setActiveAITab] = useState<"summary" | "wardrobe" | "activities" | "travel" | "agri">("summary");

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-medium animate-pulse">Gathering meteorological readings...</p>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[70vh] text-center max-w-md mx-auto">
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-3xl mb-4 text-red-400">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Weather Fetch Failed</h3>
        <p className="text-slate-400 text-sm mb-6">{error || "Could not retrieve weather payload. Check your internet connection."}</p>
      </div>
    );
  }

  const { current, hourly, daily, historical, ai_insights } = weather;

  // Calculate rotation for wind direction
  const windRotation = current.wind_direction;

  return (
    <main className="flex-1 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full space-y-6 animate-fade-in">
      {/* 1. HERO PROFILE & SUMMARY CARD */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Current Weather Glass Panel */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          {/* Top Row: Title, Fav toggle */}
          <div className="flex justify-between items-start z-10">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold text-white tracking-wide">{weather.city_name}</h1>
                <button
                  onClick={onFavoriteToggle}
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    isFavorite 
                      ? "bg-red-500/20 text-red-500 border border-red-500/30" 
                      : "bg-white/5 text-slate-400 border border-white/5 hover:text-white"
                  }`}
                  title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500" : ""}`} />
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {weather.state ? `${weather.state}, ` : ""}{weather.country || ""}
              </p>
            </div>
            <span className="text-xs bg-white/5 border border-white/8 px-3 py-1.5 rounded-xl text-slate-300 font-mono">
              Live Weather
            </span>
          </div>

          {/* Core Info */}
          <div className="my-6 flex flex-col md:flex-row items-baseline md:items-center justify-between gap-6 z-10">
            <div className="flex items-center gap-4">
              <span className="text-7xl font-extrabold text-white tracking-tighter">
                {Math.round(current.temperature)}°
              </span>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white capitalize">{current.description}</span>
                <span className="text-xs text-slate-300">
                  Feels like <span className="font-semibold text-white">{Math.round(current.feels_like)}°</span>
                </span>
              </div>
            </div>

            {/* Quick overview ranges */}
            <div className="flex items-center gap-4 border-l border-white/10 pl-6 text-sm text-slate-300 font-medium">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 tracking-wider uppercase font-mono">Day High</span>
                <span className="text-base font-bold text-rose-400">{Math.round(daily[0].temperature_max)}°C</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 tracking-wider uppercase font-mono">Day Low</span>
                <span className="text-base font-bold text-sky-400">{Math.round(daily[0].temperature_min)}°C</span>
              </div>
            </div>
          </div>

          {/* Footer stats bar */}
          <div className="border-t border-white/5 pt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400 z-10">
            <span>Wind: <strong className="text-slate-200">{current.wind_speed} m/s</strong></span>
            <span className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
            <span>Humidity: <strong className="text-slate-200">{current.humidity}%</strong></span>
            <span className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
            <span>Barometer: <strong className="text-slate-200">{current.pressure} hPa</strong></span>
            <span className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
            <span>UV Index: <strong className="text-slate-200">{current.uv_index}</strong></span>
          </div>
        </div>

        {/* AI INTEL CENTER */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between border-blue-500/10 relative overflow-hidden">
          {/* Top header */}
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">AI Weather Intel</h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">gemini-3-flash</span>
          </div>

          {/* Tabs header */}
          <div className="flex gap-1 overflow-x-auto pb-2 mb-4 scrollbar-none">
            {[
              { id: "summary", label: "Summary", icon: <Sparkles className="w-3.5 h-3.5" /> },
              { id: "wardrobe", label: "Wardrobe", icon: <Shirt className="w-3.5 h-3.5" /> },
              { id: "activities", label: "Sports", icon: <Activity className="w-3.5 h-3.5" /> },
              { id: "travel", label: "Travel", icon: <Compass className="w-3.5 h-3.5" /> },
              { id: "agri", label: "Farm", icon: <Sprout className="w-3.5 h-3.5" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveAITab(tab.id as any)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                  activeAITab === tab.id
                    ? "bg-blue-600/20 border-blue-500/30 text-blue-400"
                    : "bg-white/2 border-transparent text-slate-400 hover:text-white"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Active Tab Panel */}
          <div className="flex-1 text-slate-300 text-xs leading-relaxed overflow-y-auto max-h-48 pr-1">
            {activeAITab === "summary" && (
              <div className="space-y-3">
                <p className="font-medium text-white text-sm">{ai_insights?.summary}</p>
                <div className="space-y-1.5 mt-2">
                  {ai_insights?.insights.map((insight, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-white/2 p-2 rounded-xl border border-white/5">
                      <span className="text-blue-400 font-bold shrink-0">•</span>
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeAITab === "wardrobe" && (
              <div className="space-y-2">
                <p className="font-semibold text-slate-300 mb-2">Recommended Outfit Generator:</p>
                <div className="grid grid-cols-1 gap-1.5">
                  {ai_insights?.clothing_suggestion.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white/2 p-2.5 rounded-xl border border-white/5 text-slate-200">
                      <Shirt className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeAITab === "activities" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {ai_insights?.outdoor_activities &&
                    Object.entries(ai_insights.outdoor_activities).map(([act, score]) => (
                      <div key={act} className="bg-white/2 border border-white/5 rounded-xl p-2 flex flex-col justify-between">
                        <span className="text-slate-400 text-[10px] font-mono">{act}</span>
                        <span className="text-xs font-bold text-white mt-1">{score as string}</span>
                      </div>
                    ))}
                </div>
                <p className="text-[11px] text-slate-400 bg-white/2 p-2 rounded-xl border border-white/5">
                  {ai_insights?.cycling_running_conditions}
                </p>
              </div>
            )}

            {activeAITab === "travel" && (
              <div className="space-y-2">
                <p className="font-semibold text-slate-300">Safety & Travel Recommendations:</p>
                <p className="bg-white/2 border border-white/5 p-3 rounded-xl text-slate-200">
                  {ai_insights?.travel_advice}
                </p>
              </div>
            )}

            {activeAITab === "agri" && (
              <div className="space-y-2">
                <p className="font-semibold text-slate-300">Agricultural & Gardening Tips:</p>
                <p className="bg-white/2 border border-white/5 p-3 rounded-xl text-slate-200">
                  {ai_insights?.agricultural_tips}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. HOURLY TIMELINE FORECAST */}
      <section className="glass-panel p-6 rounded-3xl">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">24-Hour Forecast Timeline</h2>
        </div>
        
        {/* Horizontal scrollable listing */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {hourly.slice(0, 24).map((hour, i) => {
            const timeString = hour.time.split("T")[1].substring(0, 5);
            return (
              <div
                key={i}
                className="flex flex-col items-center justify-between bg-white/2 border border-white/5 rounded-2xl p-4 min-w-[90px] text-center hover:bg-white/5 hover:border-white/10 hover:scale-102 transition-all duration-200"
              >
                <span className="text-slate-400 text-xs font-mono">{timeString}</span>
                <span className="text-2xl my-2 shrink-0 select-none">
                  {hour.description.split(" ")[0]} {/* Extract emoji */}
                </span>
                <span className="text-sm font-bold text-white">{Math.round(hour.temperature)}°</span>
                <span className="text-[10px] text-cyan-400 font-semibold mt-1">
                  {hour.precipitation_probability > 0 ? `${hour.precipitation_probability}%` : "-"}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. CHARTS DATA VISUALIZATION */}
      <section>
        <WeatherCharts hourlyData={hourly} historicalData={historical} currentTemp={current.temperature} />
      </section>

      {/* 4. EXTENDED 7-DAY FORECAST & DETAILED METRICS GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-Day Table (LG span 2) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl">
          <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
            <Calendar className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">7-Day Forecast</h2>
          </div>
          
          <div className="space-y-3.5">
            {daily.map((day, idx) => {
              // Parse date to day name
              const dayName = new Date(day.date).toLocaleDateString("en-US", { weekday: "long" });
              const isToday = idx === 0;

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b border-white/5 last:border-0 pb-3 last:pb-0 text-sm"
                >
                  {/* Day label */}
                  <span className="w-28 font-semibold text-slate-200">
                    {isToday ? <span className="text-blue-400 font-bold">Today</span> : dayName}
                  </span>
                  
                  {/* Weather Emoji & description */}
                  <div className="flex items-center gap-2 w-44">
                    <span className="text-xl shrink-0 select-none">{day.description.split(" ")[0]}</span>
                    <span className="text-xs text-slate-300 line-clamp-1">{day.description.substring(day.description.indexOf(" ") + 1)}</span>
                  </div>

                  {/* Precipitation */}
                  <span className="w-12 text-center text-xs font-semibold text-cyan-400">
                    {day.precipitation_sum > 0 ? `${day.precipitation_sum.toFixed(1)}mm` : ""}
                  </span>

                  {/* Temp scale visual */}
                  <div className="flex items-center gap-3 font-semibold font-mono">
                    <span className="text-xs text-slate-400 w-8 text-right">{Math.round(day.apparent_temperature_min)}°</span>
                    <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                      <div
                        className="absolute top-0 bottom-0 bg-gradient-to-r from-blue-500 to-rose-500 rounded-full"
                        style={{ left: "20%", right: "20%" }} // Simple visual representation
                      />
                    </div>
                    <span className="text-xs text-white w-8">{Math.round(day.apparent_temperature_max)}°</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* METRICS DETAIL GRID (LG span 1) */}
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            title="UV Index"
            icon={<Sun className="w-4 h-4" />}
            value={current.uv_index.toFixed(1)}
            description={current.uv_index > 5 ? "High risk of harm" : "Low exposure risk"}
            accentColor="text-yellow-400"
          />
          <MetricCard
            title="Wind Speed"
            icon={<Wind className="w-4 h-4" />}
            value={current.wind_speed}
            unit="m/s"
            description={`Dir: ${windRotation}°`}
            accentColor="text-emerald-400"
          />
          <MetricCard
            title="Humidity"
            icon={<Droplets className="w-4 h-4" />}
            value={current.humidity}
            unit="%"
            description={`Dew Point: ${current.dew_point.toFixed(1)}°`}
            accentColor="text-cyan-400"
          />
          <MetricCard
            title="Pressure"
            icon={<Gauge className="w-4 h-4" />}
            value={current.pressure}
            unit="hPa"
            description="Sea Level pressure"
            accentColor="text-indigo-400"
          />
          <MetricCard
            title="Sunrise"
            icon={<Sunrise className="w-4 h-4" />}
            value={current.sunrise}
            description={`Sunset: ${current.sunset}`}
            accentColor="text-orange-400"
          />
          <MetricCard
            title="Moon Phase"
            icon={<Moon className="w-4 h-4" />}
            value={`${Math.round(current.moon_phase * 100)}%`}
            description="Luminosity percentage"
            accentColor="text-violet-400"
          />
        </div>
      </section>
    </main>
  );
};
