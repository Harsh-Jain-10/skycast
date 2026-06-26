import React from "react";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit?: string;
  description?: string;
  accentColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  value,
  unit = "",
  description,
  accentColor = "text-blue-400"
}) => {
  return (
    <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between h-36 relative overflow-hidden group">
      {/* Accent glow on hover */}
      <div className="absolute -right-4 -top-4 w-12 h-12 bg-white/2 rounded-full blur-xl group-hover:bg-white/5 transition-all duration-500" />
      
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300 tracking-wide">{title}</span>
        <div className={`p-2 rounded-xl bg-white/5 ${accentColor} transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight text-white">{value}</span>
          {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
        </div>
        {description && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-1 group-hover:text-slate-300 transition-colors duration-300">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
