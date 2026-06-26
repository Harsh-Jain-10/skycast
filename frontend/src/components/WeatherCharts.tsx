import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  BarChart,
  Bar,
  Legend
} from "recharts";
import type { WeatherHourlyItem, HistoricalWeatherItem } from "../types";

interface WeatherChartsProps {
  hourlyData: WeatherHourlyItem[];
  historicalData?: HistoricalWeatherItem[];
  currentTemp: number;
}

export const WeatherCharts: React.FC<WeatherChartsProps> = ({
  hourlyData,
  historicalData = [],
  currentTemp
}) => {
  // Format hourly time for XAxis (e.g. "09:00", "13:00")
  const formattedHourly = hourlyData.slice(0, 24).map((item) => {
    const timeParts = item.time.split("T")[1]; // "2026-06-26T21:00" -> "21:00"
    return {
      ...item,
      timeLabel: timeParts ? timeParts.substring(0, 5) : item.time,
    };
  });

  // Format historical data
  const formattedHist = historicalData.map((item) => {
    const dateObj = new Date(item.date);
    const dayLabel = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return {
      ...item,
      dayLabel,
      temp_avg: Math.round((item.temp_max + item.temp_min) / 2),
    };
  });

  // Custom Tooltip component matching Apple Weather / Vercel
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/85 border border-white/8 backdrop-blur-xl p-4 rounded-2xl shadow-2xl text-[11px] leading-relaxed">
          <p className="font-extrabold text-white mb-2 tracking-wide font-mono uppercase text-[9px] text-slate-400">Time: {label}</p>
          <div className="space-y-1.5">
            {payload.map((pld: any, i: number) => (
              <div key={i} className="flex items-center gap-3 justify-between">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pld.color }} />
                  {pld.name}
                </span>
                <span className="font-extrabold text-white">
                  {pld.value}
                  {pld.unit || ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full animate-slide-up">
      {/* 24-Hour Temperature & Rain Probability Chart */}
      <div className="premium-card p-6 flex flex-col justify-between h-96">
        <div className="mb-4">
          <span className="text-[10px] font-bold text-slate-400 tracking-widest font-mono uppercase">Timeline Projection</span>
          <h3 className="text-base font-extrabold text-white mt-0.5">Temperature & Precipitation</h3>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedHourly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
              <XAxis dataKey="timeLabel" stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} axisLine={false} unit="°" />
              <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} axisLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.05)", strokeWidth: 1 }} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="temperature"
                name="Temperature"
                unit="°C"
                stroke="#60a5fa"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTemp)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: "#fff" }}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="precipitation_probability"
                name="Rain Likelihood"
                unit="%"
                stroke="#22d3ee"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRain)"
                dot={false}
                activeDot={{ r: 3, strokeWidth: 0, fill: "#fff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hourly Wind & UV index graph */}
      <div className="premium-card p-6 flex flex-col justify-between h-96">
        <div className="mb-4">
          <span className="text-[10px] font-bold text-slate-400 tracking-widest font-mono uppercase">Aerodynamics</span>
          <h3 className="text-base font-extrabold text-white mt-0.5">Wind Velocity & solar UV</h3>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedHourly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
              <XAxis dataKey="timeLabel" stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} axisLine={false} unit="m" />
              <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.05)", strokeWidth: 1 }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="wind_speed"
                name="Wind Speed"
                unit=" m/s"
                stroke="#34d399"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: "#fff" }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="uv_index"
                name="UV Index"
                stroke="#fbbf24"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, strokeWidth: 0, fill: "#fff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Weather Comparison Chart */}
      {formattedHist.length > 0 && (
        <div className="premium-card p-6 col-span-1 lg:col-span-2 flex flex-col justify-between h-96">
          <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-widest font-mono uppercase">Climate Context</span>
              <h3 className="text-base font-extrabold text-white mt-0.5">Year-Over-Year Trends</h3>
            </div>
            <div className="text-[10px] bg-white/3 border border-white/5 px-3 py-1 rounded-xl text-slate-300 font-mono">
              Current Temp: <strong className="text-white">{currentTemp}°C</strong>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedHist} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis dataKey="dayLabel" stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} axisLine={false} unit="°" />
                <Tooltip
                  content={({ active, payload, label }: any) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-950/85 border border-white/8 backdrop-blur-xl p-4 rounded-2xl shadow-2xl text-[11px] leading-relaxed text-slate-300">
                          <p className="font-extrabold text-white mb-2 tracking-wide font-mono uppercase text-[9px] text-slate-400">Date: {label}</p>
                          <div className="space-y-1">
                            <p className="flex justify-between items-center gap-4">
                              <span>Max Temp</span>
                              <strong className="text-rose-400">{payload[0].value}°C</strong>
                            </p>
                            <p className="flex justify-between items-center gap-4">
                              <span>Min Temp</span>
                              <strong className="text-sky-400">{payload[1].value}°C</strong>
                            </p>
                            <p className="flex justify-between items-center gap-4">
                              <span>Rainfall</span>
                              <strong className="text-teal-400">{payload[2].value} mm</strong>
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: "10px", color: "rgba(255,255,255,0.6)", paddingTop: "10px" }} />
                <Bar dataKey="temp_max" name="Last Year Max" fill="#f43f5e" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
                <Bar dataKey="temp_min" name="Last Year Min" fill="#38bdf8" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
                <Bar dataKey="precipitation" name="Last Year Rain" fill="#14b8a6" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
