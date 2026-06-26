import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { WeatherBackground } from "./components/WeatherBackground";
import { Home } from "./pages/Home";
import { Favorites } from "./pages/Favorites";
import { Compare } from "./pages/Compare";
import type { WeatherResponse, FavoriteCityResponse } from "./types";

const App: React.FC = () => {
  const [activeCity, setActiveCity] = useState("London");
  const [activeCoords, setActiveCoords] = useState<{ lat: number; lon: number } | null>(null);
  
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [favorites, setFavorites] = useState<FavoriteCityResponse[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  // 1. Fetch live weather data
  const fetchWeather = async (cityName: string, coords: { lat: number; lon: number } | null = null) => {
    setLoading(true);
    setError(null);
    try {
      let url = "http://localhost:8000/api/weather";
      if (coords) {
        url += `?lat=${coords.lat}&lon=${coords.lon}`;
        if (cityName) url += `&q=${encodeURIComponent(cityName)}`;
      } else {
        url += `?q=${encodeURIComponent(cityName)}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to retrieve weather metrics");
      }

      const data: WeatherResponse = await res.json();
      setWeather(data);
      setActiveCity(data.city_name);
      
      // Update coords
      setActiveCoords({ lat: data.latitude, lon: data.longitude });
    } catch (e: any) {
      setError(e.message || "Connection timeout");
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch favorites list
  const fetchFavorites = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/favorites");
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
      }
    } catch (err) {
      console.error("Error loading favorites:", err);
    }
  };

  // 3. Check if active city is in favorites
  useEffect(() => {
    if (!weather) {
      setIsFavorite(false);
      return;
    }
    // Check match by coordinates (allowing tiny floating point deviation)
    const matched = favorites.some(
      (fav) =>
        Math.abs(fav.latitude - weather.latitude) < 0.01 &&
        Math.abs(fav.longitude - weather.longitude) < 0.01
    );
    setIsFavorite(matched);
  }, [weather, favorites]);

  // Load weather and favorites on startup
  useEffect(() => {
    fetchWeather(activeCity, activeCoords);
    fetchFavorites();
  }, []);

  const handleSearch = (cityName: string) => {
    setActiveCoords(null);
    fetchWeather(cityName, null);
  };

  const handleLocationSearch = (lat: number, lon: number) => {
    const coords = { lat, lon };
    setActiveCoords(coords);
    fetchWeather("My Location", coords);
  };

  const handleFavoriteToggle = async () => {
    if (!weather) return;

    if (isFavorite) {
      // Find the favorite entry to get the ID
      const favEntry = favorites.find(
        (fav) =>
          Math.abs(fav.latitude - weather.latitude) < 0.01 &&
          Math.abs(fav.longitude - weather.longitude) < 0.01
      );
      if (favEntry) {
        try {
          const res = await fetch(`http://localhost:8000/api/favorites/${favEntry.id}`, {
            method: "DELETE",
          });
          if (res.ok) {
            setFavorites(favorites.filter((f) => f.id !== favEntry.id));
            setIsFavorite(false);
          }
        } catch (err) {
          console.error("Failed to delete favorite:", err);
        }
      }
    } else {
      // Add to favorites
      try {
        const res = await fetch("http://localhost:8000/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: weather.city_name,
            latitude: weather.latitude,
            longitude: weather.longitude,
            country: weather.country,
            state: weather.state,
          }),
        });
        if (res.ok) {
          const newFav = await res.json();
          setFavorites([newFav, ...favorites]);
          setIsFavorite(true);
        }
      } catch (err) {
        console.error("Failed to save favorite:", err);
      }
    }
  };

  const handleSelectCityFromFavorites = (cityName: string) => {
    setActiveCoords(null);
    fetchWeather(cityName, null);
    // Navigate home will be handled by Router link or inline navigation (we handle route loading)
  };

  const weatherCode = weather?.current?.weather_code ?? 0;
  const isDay = weather?.current?.is_day === 1;

  return (
    <Router>
      <div className="relative min-h-screen text-slate-100 flex flex-col font-sans antialiased overflow-x-hidden pb-12">
        {/* Dynamic Canvas / Color Background */}
        <WeatherBackground weatherCode={weatherCode} isDay={isDay} />
        
        {/* Header Navbar */}
        <Navbar onSearch={handleSearch} onLocationSearch={handleLocationSearch} />

        {/* Routed views */}
        <div className="flex-1 flex flex-col pt-4">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  weather={weather}
                  loading={loading}
                  error={error}
                  onFavoriteToggle={handleFavoriteToggle}
                  isFavorite={isFavorite}
                />
              }
            />
            <Route
              path="/favorites"
              element={<Favorites onSelectCity={handleSelectCityFromFavorites} />}
            />
            <Route path="/compare" element={<Compare />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
