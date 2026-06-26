import React, { useEffect, useState } from "react";

interface WeatherBackgroundProps {
  weatherCode: number;
  isDay: boolean;
}

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ weatherCode, isDay }) => {
  const [drops, setDrops] = useState<{ id: number; left: string; delay: string; duration: string }[]>([]);
  const [flakes, setFlakes] = useState<{ id: number; left: string; delay: string; duration: string; size: string }[]>([]);

  // Determine weather type
  let skyClass = "sky-clear";
  let isRain = false;
  let isSnow = false;
  let isCloudy = false;
  let isThunder = false;

  if (!isDay) {
    skyClass = "sky-clear-night";
  }

  // WMO Codes categorization
  if (weatherCode === 0 || weatherCode === 1) {
    skyClass = isDay ? "sky-clear" : "sky-clear-night";
  } else if (weatherCode === 2 || weatherCode === 3) {
    skyClass = isDay ? "sky-cloudy" : "sky-cloudy-night";
    isCloudy = true;
  } else if ([45, 48].includes(weatherCode)) {
    skyClass = "sky-cloudy";
    isCloudy = true;
  } else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    skyClass = "sky-rainy";
    isRain = true;
  } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    skyClass = "sky-snowy";
    isSnow = true;
  } else if ([95, 96, 99].includes(weatherCode)) {
    skyClass = "sky-thunderstorm";
    isThunder = true;
    isRain = true;
  }

  // Generate rain drops
  useEffect(() => {
    if (isRain) {
      const generatedDrops = Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 2}s`,
        duration: `${0.8 + Math.random() * 0.5}s`,
      }));
      setDrops(generatedDrops);
    } else {
      setDrops([]);
    }
  }, [isRain]);

  // Generate snow particles
  useEffect(() => {
    if (isSnow) {
      const generatedFlakes = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${3 + Math.random() * 4}s`,
        size: `${2 + Math.random() * 4}px`,
      }));
      setFlakes(generatedFlakes);
    } else {
      setFlakes([]);
    }
  }, [isSnow]);

  return (
    <div className={`fixed inset-0 -z-10 w-full h-full transition-all duration-1000 ${skyClass}`}>
      {/* Night stars simulation */}
      {!isDay && (
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(white_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      )}

      {/* Cloud drifts */}
      {(isCloudy || isRain || isSnow) && <div className="cloud-layer" />}

      {/* Rain simulation */}
      {isRain && (
        <div className="rain-container">
          {drops.map((drop) => (
            <div
              key={drop.id}
              className="rain-drop"
              style={{
                left: drop.left,
                animationDelay: drop.delay,
                animationDuration: drop.duration,
              }}
            />
          ))}
        </div>
      )}

      {/* Snow simulation */}
      {isSnow && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
          {flakes.map((flake) => (
            <div
              key={flake.id}
              className="absolute bg-white rounded-full animate-[fall_linear_infinite]"
              style={{
                left: flake.left,
                animationDelay: flake.delay,
                animationDuration: flake.duration,
                width: flake.size,
                height: flake.size,
                top: "-10px",
              }}
            />
          ))}
        </div>
      )}

      {/* Thunderstorm lightning simulation */}
      {isThunder && <div className="lightning-flash" />}

      {/* Ambient gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/10" />
    </div>
  );
};
