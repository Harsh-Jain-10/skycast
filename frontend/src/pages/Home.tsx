import React, { useState, useEffect } from "react";
import {
  Calendar,
  AlertTriangle,
  Shirt,
  Compass,
  Sprout,
  Activity,
  Sparkles,
  Heart,
  Clock
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
  const [activeAITab, setActiveAITab] = useState<"summary" | "wardrobe" | "sports" | "safety" | "agri">("summary");
  
  // Streaming typewriter state for AI
  const [streamedText, setStreamedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  // Trigger streaming effect when weather changes
  useEffect(() => {
    if (!weather?.ai_insights?.summary) {
      setStreamedText("");
      return;
    }

    const text = weather.ai_insights.summary;
    setStreamedText("");
    setIsStreaming(true);
    
    let currentIdx = 0;
    const words = text.split(" ");
    
    const interval = setInterval(() => {
      if (currentIdx < words.length) {
        setStreamedText((prev) => (prev ? prev + " " + words[currentIdx] : words[currentIdx]));
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
      }
    }, 45); // Speed of streaming

    return () => clearInterval(interval);
  }, [weather]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-4">
        {/* Sleek skeleton loaders */}
        <div className="w-16 h-16 border-t-2 border-r-2 border-white rounded-full animate-spin mb-4" />
        <span className="text-[10px] font-bold text-slate-400 tracking-widest font-mono uppercase animate-pulse">
          Syncing Atmospheric Models...
        </span>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] text-center px-6 max-w-lg mx-auto">
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-3xl mb-5 text-red-400">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Weather Fetch Failed</h3>
        <p className="text-slate-400 text-xs leading-relaxed mb-6">{error || "Could not retrieve weather payload. Check your connection."}</p>
      </div>
    );
  }

  const { current, hourly, daily, historical, ai_insights } = weather;

  // Format current local time
  const localTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex-1 w-full pt-20 px-4 md:px-8 space-y-8 max-w-7xl mx-auto animate-fade-in pb-16">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* Left 2 Cols: Immersive Current Weather Hero */}
        <div className="lg:col-span-2 premium-card p-10 flex flex-col justify-between min-h-[380px] bg-gradient-to-br from-white/2 to-white/0">
          {/* Top header line */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-bold text-slate-300 tracking-widest font-mono uppercase">Live Radar</span>
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight font-display mt-1">{weather.city_name}</h1>
              <p className="text-xs text-slate-400 font-mono">
                {weather.state ? `${weather.state}, ` : ""}{weather.country || "Global"}
              </p>
            </div>

            {/* Favorite toggle and current time */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-300 bg-white/4 border border-white/5 px-3 py-1.5 rounded-xl font-mono">
                {localTime}
              </span>
              <button
                onClick={onFavoriteToggle}
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  isFavorite
                    ? "bg-red-500/25 text-red-400 border border-red-500/30"
                    : "bg-white/4 text-slate-400 border border-white/5 hover:text-white"
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500" : ""}`} />
              </button>
            </div>
          </div>

          {/* Large temperature display */}
          <div className="my-8 flex flex-col md:flex-row items-baseline md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <span className="text-8xl md:text-9xl font-black text-white tracking-tighter font-display select-none">
                {Math.round(current.temperature)}°
              </span>
              <div className="space-y-1">
                <span className="text-xl font-extrabold text-white block capitalize tracking-wide">{current.description}</span>
                <span className="text-xs text-slate-400 block font-mono">
                  Apparent: <strong className="text-slate-200">{Math.round(current.feels_like)}°C</strong>
                </span>
              </div>
            </div>

            {/* Range meters */}
            <div className="flex gap-6 border-l border-white/8 pl-8">
              <div>
                <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase block">High</span>
                <span className="text-xl font-bold text-rose-400 font-display">{Math.round(daily[0].temperature_max)}°C</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase block">Low</span>
                <span className="text-xl font-bold text-sky-400 font-display">{Math.round(daily[0].temperature_min)}°C</span>
              </div>
            </div>
          </div>

          {/* Details horizontal bar */}
          <div className="border-t border-white/5 pt-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="space-y-0.5">
              <span className="text-slate-400 block">Atmosphere</span>
              <strong className="text-slate-200 font-mono">{current.pressure} hPa</strong>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 block">Wind Velocity</span>
              <strong className="text-slate-200 font-mono">{current.wind_speed} m/s</strong>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 block">Humidity Ratio</span>
              <strong className="text-slate-200 font-mono">{current.humidity}%</strong>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 block">UV Index</span>
              <strong className="text-slate-200 font-mono">{current.uv_index.toFixed(1)}</strong>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Chatbot-Style Conversational AI Assistant */}
        <div className="premium-card p-6 flex flex-col justify-between min-h-[380px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600/10 p-1.5 rounded-lg border border-blue-500/20">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <span className="text-xs font-extrabold text-white tracking-widest font-mono uppercase">Skycast Assistant</span>
            </div>
            <span className="text-[9px] text-slate-500 font-mono font-bold bg-white/4 px-2 py-0.5 rounded-md">LLM ENGINE</span>
          </div>

          {/* Conversational Screen */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin max-h-56 text-[11px] leading-relaxed text-slate-300">
            {/* Assistant prompt bubble */}
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-600/25 border border-blue-500/35 flex items-center justify-center shrink-0">
                <Sparkles className="w-3 h-3 text-blue-400" />
              </div>
              <div className="bg-white/2 border border-white/5 rounded-2xl p-3.5 text-slate-200 max-w-[85%] rounded-tl-sm relative">
                <p className="font-semibold text-white mb-1.5">Skycast AI:</p>
                {/* Streaming text */}
                <p className="min-h-[30px] font-sans">
                  {streamedText}
                  {isStreaming && (
                    <span className="inline-block w-1.5 h-3 bg-blue-400 ml-1 animate-pulse" />
                  )}
                </p>
              </div>
            </div>

            {/* Detailed advice categories as message responses */}
            {ai_insights && (
              <div className="space-y-3 pt-2">
                {activeAITab === "summary" && (
                  <div className="grid grid-cols-1 gap-2">
                    {ai_insights.insights.map((insight, idx) => (
                      <div key={idx} className="bg-white/2 border border-white/5 rounded-xl p-3 flex gap-2">
                        <span className="text-blue-400 font-bold shrink-0">•</span>
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeAITab === "wardrobe" && (
                  <div className="space-y-2">
                    <p className="font-bold text-slate-400 uppercase tracking-widest font-mono text-[9px]">Virtual Closet Suggestions:</p>
                    {ai_insights.clothing_suggestion.map((item, idx) => (
                      <div key={idx} className="bg-white/2 border border-white/5 rounded-xl p-2.5 flex items-center gap-2 text-slate-200">
                        <Shirt className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeAITab === "sports" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(ai_insights.outdoor_activities).map(([act, rating]) => (
                        <div key={act} className="bg-white/2 border border-white/5 rounded-xl p-2.5">
                          <span className="text-[10px] text-slate-500 font-mono block">{act}</span>
                          <span className="font-bold text-white mt-1 block">{rating as string}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 bg-white/2 border border-white/5 p-2 rounded-xl">
                      {ai_insights.cycling_running_conditions}
                    </p>
                  </div>
                )}

                {activeAITab === "safety" && (
                  <div className="bg-white/2 border border-white/5 rounded-xl p-3 flex gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Travel Safety Advice</span>
                      <span className="mt-1 block text-slate-300">{ai_insights.travel_advice}</span>
                    </div>
                  </div>
                )}

                {activeAITab === "agri" && (
                  <div className="bg-white/2 border border-white/5 rounded-xl p-3 flex gap-2.5">
                    <Sprout className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Agricultural Impact</span>
                      <span className="mt-1 block text-slate-300">{ai_insights.agricultural_tips}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Tab selectors */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 mt-4 scrollbar-none border-t border-white/5 pt-3">
            {[
              { id: "summary", label: "Insights", icon: <Sparkles className="w-3 h-3" /> },
              { id: "wardrobe", label: "Wardrobe", icon: <Shirt className="w-3 h-3" /> },
              { id: "sports", label: "Sports", icon: <Activity className="w-3 h-3" /> },
              { id: "safety", label: "Travel", icon: <Compass className="w-3 h-3" /> },
              { id: "agri", label: "Farm", icon: <Sprout className="w-3 h-3" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveAITab(tab.id as any)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-bold tracking-wide shrink-0 transition-all border ${
                  activeAITab === tab.id
                    ? "bg-white/5 border-white/10 text-white"
                    : "bg-transparent border-transparent text-slate-400 hover:text-white"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. HOURLY TIMELINE FORECAST */}
      <section className="premium-card p-6">
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-widest font-mono">24-Hour Forecast Timeline</h2>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Drag to scroll</span>
        </div>
        
        {/* Horizontal scrollable listing */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {hourly.slice(0, 24).map((hour, i) => {
            const timeString = hour.time.split("T")[1].substring(0, 5);
            
            // Highlight the first element or current hour match
            const isCurrent = i === 0;

            return (
              <div
                key={i}
                className={`flex flex-col items-center justify-between bg-white/2 border rounded-2xl p-4 min-w-[95px] text-center hover:bg-white/4 transition-all duration-300 ${
                  isCurrent 
                    ? "border-blue-500/40 bg-blue-600/5 shadow-lg shadow-blue-500/2" 
                    : "border-white/5"
                }`}
              >
                <span className="text-slate-400 text-[10px] font-mono font-semibold">{timeString}</span>
                <span className="text-2xl my-2 shrink-0 select-none animate-float" style={{ animationDelay: `${i * 0.1}s` }}>
                  {hour.description.split(" ")[0]}
                </span>
                <span className="text-sm font-bold text-white font-display">{Math.round(hour.temperature)}°</span>
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
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 7-Day Table (LG span 2) */}
        <div className="lg:col-span-2 premium-card p-6 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
            <Calendar className="w-4 h-4 text-slate-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-widest font-mono">7-Day Forecast</h2>
          </div>
          
          <div className="space-y-4">
            {daily.map((day, idx) => {
              const dayName = new Date(day.date).toLocaleDateString("en-US", { weekday: "long" });
              const isToday = idx === 0;

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b border-white/5 last:border-0 pb-3 last:pb-0 text-xs"
                >
                  {/* Day label */}
                  <span className="w-28 font-bold text-slate-200 font-sans">
                    {isToday ? <span className="text-blue-400 font-extrabold">Today</span> : dayName}
                  </span>
                  
                  {/* Weather Emoji & description */}
                  <div className="flex items-center gap-2.5 w-44">
                    <span className="text-xl shrink-0 select-none">{day.description.split(" ")[0]}</span>
                    <span className="text-slate-300 font-medium truncate">{day.description.substring(day.description.indexOf(" ") + 1)}</span>
                  </div>

                  {/* Precipitation */}
                  <span className="w-16 text-center text-[10px] font-semibold text-cyan-400 font-mono">
                    {day.precipitation_sum > 0 ? `${day.precipitation_sum.toFixed(1)}mm` : ""}
                  </span>

                  {/* Temp scale visual */}
                  <div className="flex items-center gap-3 font-semibold font-mono">
                    <span className="text-slate-400 w-8 text-right">{Math.round(day.apparent_temperature_min)}°</span>
                    <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden relative">
                      <div
                        className="absolute top-0 bottom-0 bg-gradient-to-r from-blue-400 to-rose-400 rounded-full"
                        style={{ left: "25%", right: "25%" }}
                      />
                    </div>
                    <span className="text-white w-8">{Math.round(day.apparent_temperature_max)}°</span>
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
            value={current.uv_index.toFixed(1)}
            description={current.uv_index > 5 ? "High risk of harm" : "Low exposure hazard"}
          />
          <MetricCard
            title="Wind Speed"
            value={current.wind_speed}
            unit="m/s"
            description={`Dir: ${current.wind_direction}°`}
          />
          <MetricCard
            title="Humidity"
            value={current.humidity}
            unit="%"
            description={`Dew Point: ${current.dew_point.toFixed(1)}°`}
          />
          <MetricCard
            title="Pressure"
            value={current.pressure}
            unit="hPa"
            description="Sea Level pressure"
          />
          <MetricCard
            title="Sunrise"
            value={current.sunrise}
            description={`Sunset: ${current.sunset}`}
          />
          <MetricCard
            title="Moon Phase"
            value={`${Math.round(current.moon_phase * 100)}%`}
            description="Luminosity percentage"
          />
        </div>
      </section>
    </div>
  );
};
