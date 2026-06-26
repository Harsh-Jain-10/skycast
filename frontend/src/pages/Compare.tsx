import React, { useState } from "react";
import { MapPin, Plus, X, BarChart3, AlertCircle } from "lucide-react";

export const Compare: React.FC = () => {
  const [inputs, setInputs] = useState<string[]>(["", ""]);
  const [citiesData, setCitiesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompareData = async () => {
    const activeQueries = inputs.filter((q) => q.trim().length > 0);
    if (activeQueries.length < 2) {
      setError("Please specify at least two cities to compare.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const promises = activeQueries.map(async (query) => {
        const res = await fetch(`http://localhost:8000/api/weather?q=${encodeURIComponent(query)}`);
        if (!res.ok) {
          throw new Error(`Failed to load data for '${query}'`);
        }
        return res.json();
      });

      const results = await Promise.all(promises);
      setCitiesData(results);
    } catch (e: any) {
      setError(e.message || "Error running comparison fetches");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (idx: number, val: string) => {
    const newInputs = [...inputs];
    newInputs[idx] = val;
    setInputs(newInputs);
  };

  const removeInput = (idx: number) => {
    if (inputs.length <= 2) return;
    const newInputs = inputs.filter((_, i) => i !== idx);
    setInputs(newInputs);
    
    if (citiesData[idx]) {
      setCitiesData(citiesData.filter((_, i) => i !== idx));
    }
  };

  const addInput = () => {
    if (inputs.length >= 3) return;
    setInputs([...inputs, ""]);
  };

  return (
    <div className="flex-1 w-full pt-28 px-4 md:px-8 space-y-8 max-w-7xl mx-auto animate-fade-in pb-16">
      <div className="flex flex-col gap-1 mb-8">
        <span className="text-[10px] font-bold text-slate-400 tracking-widest font-mono uppercase">Metrics System</span>
        <h1 className="text-3xl font-extrabold text-white tracking-wide font-display mt-0.5">City Comparison Matrix</h1>
        <p className="text-xs text-slate-400 font-medium">Compare live meteorological metrics and forecasts side-by-side</p>
      </div>

      {/* Inputs selectors */}
      <div className="premium-card p-6 mb-8 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {inputs.map((input, idx) => (
            <div key={idx} className="relative flex items-center">
              <MapPin className="absolute left-4 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={`Enter City ${idx + 1}`}
                value={input}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-white/2 border border-white/5 text-white placeholder-slate-400 rounded-2xl outline-none focus:bg-white/5 focus:border-white/20 text-xs transition-all"
              />
              {inputs.length > 2 && (
                <button
                  onClick={() => removeInput(idx)}
                  className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition-all"
                  title="Remove location"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 justify-end border-t border-white/5 pt-4 mt-2">
          {inputs.length < 3 && (
            <button
              onClick={addInput}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-white/3 hover:bg-white/5 rounded-xl transition-all border border-white/5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add City</span>
            </button>
          )}

          <button
            onClick={fetchCompareData}
            disabled={loading}
            className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl shadow-lg transition-all"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{loading ? "Comparing..." : "Compare Cities"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-3 text-sm max-w-md mx-auto mb-8">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Comparison results table */}
      {!loading && citiesData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {citiesData.map((data, idx) => {
            const { current, air_quality, daily } = data;
            return (
              <div key={idx} className="premium-card p-6 flex flex-col justify-between border-white/5">
                {/* Header */}
                <div className="border-b border-white/5 pb-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                    <h2 className="text-xl font-extrabold text-white truncate font-display">{data.city_name}</h2>
                  </div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold mt-0.5 block">
                    {data.country || "Global"}
                  </span>
                </div>

                {/* Metrics list */}
                <div className="space-y-4 flex-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Current Temp</span>
                    <span className="font-extrabold text-white text-lg font-display">{Math.round(current.temperature)}°C</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Feels Like</span>
                    <span className="font-bold text-slate-200">{Math.round(current.feels_like)}°C</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Conditions</span>
                    <span className="font-bold text-slate-200">{current.description}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Humidity</span>
                    <span className="font-bold text-slate-200">{current.humidity}%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Wind Speed</span>
                    <span className="font-bold text-slate-200">{current.wind_speed} m/s</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">UV Index</span>
                    <span className="font-bold text-yellow-400">{current.uv_index.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Air Quality</span>
                    <span className="font-bold text-emerald-400">{air_quality.us_aqi} AQI ({air_quality.quality_label})</span>
                  </div>

                  {/* 3-Day short forecast forecast */}
                  <div className="border-t border-white/5 pt-4 mt-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-3">3-Day Forecast</h4>
                    <div className="space-y-2 text-xs">
                      {daily.slice(1, 4).map((day: any, i: number) => (
                        <div key={i} className="flex justify-between items-center text-slate-300">
                          <span className="font-semibold text-slate-200">
                            {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                          </span>
                          <span className="text-slate-400 text-[11px] truncate max-w-[100px]">{day.description}</span>
                          <span className="font-bold text-white font-mono">
                            {Math.round(day.temperature_min)}° / {Math.round(day.temperature_max)}°C
                          </span>
                        </div>
                      ))}
                    </div>
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
