import React from "react";
import { Sun, Compass, Droplets, Sunrise, Moon, Gauge, Eye } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  description?: string;
  accentColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit = "",
  description = "",
}) => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  // Custom renders for each gauge type to provide unique personalities
  const renderVisualContent = () => {
    switch (title) {
      case "Wind Speed": {
        // Rotating wind fan based on wind speed
        const speed = Math.max(1, numValue);
        const spinDuration = Math.max(0.5, 10 / speed); // Faster speed = faster spin
        
        // Extract direction from description (e.g. "Dir: 236°")
        const dirMatch = description.match(/\d+/);
        const direction = dirMatch ? parseInt(dirMatch[0]) : 0;

        return (
          <div className="flex items-center justify-between w-full h-full">
            <div className="flex flex-col justify-between h-full">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest font-mono">Wind Speed</span>
              <div className="mt-2">
                <span className="text-3xl font-extrabold text-white">{value}</span>
                <span className="text-xs text-slate-400 ml-1">{unit}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <Compass className="w-3 h-3 text-emerald-400" style={{ transform: `rotate(${direction}deg)` }} />
                <span>Direction: {direction}°</span>
              </p>
            </div>
            {/* Propeller animation */}
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <div className="absolute w-0.5 h-12 bg-slate-700/50 rounded-full" />
              <svg
                viewBox="0 0 100 100"
                className="w-12 h-12 text-slate-400/80 fill-current"
                style={{
                  animation: `spin ${spinDuration}s linear infinite`,
                }}
              >
                <circle cx="50" cy="50" r="8" className="text-white fill-current" />
                <path d="M50 50 C45 30, 45 10, 50 10 C55 10, 55 30, 50 50 Z" />
                <path d="M50 50 C30 45, 10 45, 10 50 C10 55, 30 55, 50 50 Z" style={{ transform: "rotate(120deg)", transformOrigin: "50px 50px" }} />
                <path d="M50 50 C30 55, 10 55, 10 50 C10 45, 30 45, 50 50 Z" style={{ transform: "rotate(240deg)", transformOrigin: "50px 50px" }} />
              </svg>
            </div>
          </div>
        );
      }

      case "Humidity": {
        // Wave-like water drop fill container
        const percent = Math.min(100, Math.max(0, numValue));
        return (
          <div className="flex items-center justify-between w-full h-full">
            <div className="flex flex-col justify-between h-full">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest font-mono">Humidity</span>
              <div className="mt-2">
                <span className="text-3xl font-extrabold text-white">{value}</span>
                <span className="text-xs text-slate-400 ml-1">{unit}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{description}</p>
            </div>
            {/* Water drop visual fill gauge */}
            <div className="w-12 h-16 border border-white/8 rounded-b-2xl rounded-t-sm flex items-end overflow-hidden bg-white/2 relative shrink-0">
              <div
                className="w-full bg-cyan-500/25 border-t border-cyan-400/50 transition-all duration-1000 animate-pulse"
                style={{ height: `${percent}%` }}
              />
              <Droplets className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/50" />
            </div>
          </div>
        );
      }

      case "UV Index": {
        const uv = numValue;
        // Radial progress arc calculation
        const percent = Math.min(100, (uv / 11) * 100);
        return (
          <div className="flex items-center justify-between w-full h-full">
            <div className="flex flex-col justify-between h-full">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest font-mono">UV Index</span>
              <div className="mt-2">
                <span className="text-3xl font-extrabold text-white">{value}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{description}</p>
            </div>
            {/* UV Gauge circular progress ring */}
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 36 36" className="w-14 h-14">
                <path
                  className="text-slate-800"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-yellow-500 transition-all duration-1000"
                  strokeWidth="2.5"
                  strokeDasharray={`${percent}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <Sun className="absolute w-4 h-4 text-yellow-400 animate-spin-slow" />
            </div>
          </div>
        );
      }

      case "Pressure": {
        const pressure = numValue;
        // Map pressure 950 - 1050 to angle -90 to 90 degrees
        const angle = Math.min(90, Math.max(-90, ((pressure - 950) / 100) * 180 - 90));
        return (
          <div className="flex items-center justify-between w-full h-full">
            <div className="flex flex-col justify-between h-full">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest font-mono">Pressure</span>
              <div className="mt-2">
                <span className="text-3xl font-extrabold text-white">{value}</span>
                <span className="text-xs text-slate-400 ml-1">{unit}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{description}</p>
            </div>
            {/* Analog speedometer scale */}
            <div className="relative w-16 h-12 overflow-hidden flex items-end justify-center shrink-0">
              <div className="absolute w-14 h-14 border-t-2 border-x-2 border-slate-700/80 rounded-full top-2" />
              <div
                className="absolute w-1 h-8 bg-indigo-400 rounded-full bottom-0 origin-bottom transition-transform duration-1000"
                style={{ transform: `rotate(${angle}deg)` }}
              />
              <Gauge className="absolute bottom-1 w-3.5 h-3.5 text-indigo-400" />
            </div>
          </div>
        );
      }

      case "Sunrise": {
        // Sunset/sunrise curve
        return (
          <div className="flex items-center justify-between w-full h-full">
            <div className="flex flex-col justify-between h-full">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest font-mono">Sun Schedule</span>
              <div className="mt-2 flex flex-col">
                <span className="text-sm text-slate-300 flex items-center gap-1">
                  <Sunrise className="w-3.5 h-3.5 text-orange-400" /> Rise: <strong>{value}</strong>
                </span>
                <span className="text-sm text-slate-300 flex items-center gap-1 mt-1">
                  <Sun className="w-3.5 h-3.5 text-amber-500" /> Set: <strong>{description.split(" ")[1]}</strong>
                </span>
              </div>
            </div>
            {/* Elegant sunrise/sunset path curve */}
            <div className="relative w-16 h-10 overflow-hidden flex items-end shrink-0">
              <svg viewBox="0 0 100 50" className="w-16 h-10 text-slate-700">
                <path d="M0,50 Q50,0 100,50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="50" cy="15" r="4" fill="#f59e0b" className="animate-pulse" />
              </svg>
            </div>
          </div>
        );
      }

      case "Moon Phase": {
        return (
          <div className="flex items-center justify-between w-full h-full">
            <div className="flex flex-col justify-between h-full">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest font-mono">Moon Phase</span>
              <div className="mt-2">
                <span className="text-3xl font-extrabold text-white">{value}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{description}</p>
            </div>
            {/* Crescent moon visual */}
            <div className="relative w-14 h-14 bg-slate-900 border border-white/5 rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
              <div className="absolute right-0 top-0 bottom-0 left-[40%] bg-slate-200/80 rounded-r-full shadow-inner" />
              <Moon className="absolute w-5 h-5 text-indigo-400/40" />
            </div>
          </div>
        );
      }

      default: {
        // Fallback default metric visual
        return (
          <div className="flex flex-col justify-between h-full w-full">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest font-mono">{title}</span>
              <div className="p-1.5 rounded-xl bg-white/3 border border-white/5 text-slate-400">
                <Eye className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-0.5">
                <span className="text-3xl font-extrabold text-white">{value}</span>
                {unit && <span className="text-xs text-slate-400 ml-1">{unit}</span>}
              </div>
              {description && <p className="text-[10px] text-slate-400 mt-1 truncate">{description}</p>}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="premium-card p-5 h-36 flex flex-col justify-between relative">
      {renderVisualContent()}
    </div>
  );
};
