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
    // Format date string to readable day/month
    const dateObj = new Date(item.date);
    const dayLabel = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return {
      ...item,
      dayLabel,
      temp_avg: Math.round((item.temp_max + item.temp_min) / 2),
    };
  });

  // Custom Tooltip component for Dark theme
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-md p-3 rounded-xl shadow-xl text-xs">
          <p className="font-semibold text-slate-200 mb-1">{`Time: ${label}`}</p>
          {payload.map((pld: any, i: number) => (
            <p key={i} style={{ color: pld.color }} className="font-medium">
              {`${pld.name}: ${pld.value}${pld.unit || ""}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* 24-Hour Temperature & Rain Probability Chart */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between">
        <div className="mb-4">
          <h3 className="text-base font-bold text-white tracking-wide">24-Hour Temperature & Rain</h3>
          <p className="text-xs text-slate-400">Hourly projections for temperature and precipitation likelihood</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedHourly}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} unit="°C" />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="temperature"
                name="Temperature"
                unit="°C"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorTemp)"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="precipitation_probability"
                name="Precipitation Prob."
                unit="%"
                stroke="#06b6d4"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorRain)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hourly Wind & UV index graph */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between">
        <div className="mb-4">
          <h3 className="text-base font-bold text-white tracking-wide">Wind & UV Intensity</h3>
          <p className="text-xs text-slate-400">Projected hourly wind velocities and solar UV hazard index</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedHourly}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} unit=" m/s" />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="wind_speed"
                name="Wind Speed"
                unit=" m/s"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="uv_index"
                name="UV Index"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Weather Comparison Chart */}
      {formattedHist.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl col-span-1 lg:col-span-2 flex flex-col justify-between">
          <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">Historical Context Comparison</h3>
              <p className="text-xs text-slate-400">Current weather trends vs historical data for the same week last year</p>
            </div>
            <div className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-slate-300">
              Current City Temp: <span className="font-bold text-blue-400">{currentTemp}°C</span>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedHist}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="dayLabel" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} unit="°C" />
                <Tooltip
                  content={({ active, payload, label }: any) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-md p-3 rounded-xl shadow-xl text-xs text-slate-200">
                          <p className="font-semibold text-slate-100 mb-1">{`Date (Last Year): ${label}`}</p>
                          <p className="text-blue-400">{`Max Temp: ${payload[0].value}°C`}</p>
                          <p className="text-sky-300">{`Min Temp: ${payload[1].value}°C`}</p>
                          <p className="text-teal-400">{`Rain Sum: ${payload[2].value} mm`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="temp_max" name="Max Temperature (Last Year)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="temp_min" name="Min Temperature (Last Year)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="precipitation" name="Precipitation Sum (Last Year)" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
