import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, MapPin, Sparkles, Navigation, Heart, BarChart3, CloudRain } from "lucide-react";

interface NavbarProps {
  onSearch: (city: string) => void;
  onLocationSearch: (lat: number, lon: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, onLocationSearch }) => {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLFormElement>(null);

  // Debounced search logic for suggestions
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const res = await fetch(`http://localhost:8000/api/weather/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
        }
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSuggestClick = (item: any) => {
    const name = item.name;
    setQuery(name);
    setShowDropdown(false);
    onSearch(name);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowDropdown(false);
    }
  };

  const triggerGeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocationSearch(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          alert("Error obtaining location: " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 bg-slate-950/20 backdrop-blur-md px-4 md:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-blue-600/30 p-2.5 rounded-2xl border border-blue-500/20 group-hover:scale-105 transition-transform duration-300">
          <CloudRain className="w-5 h-5 text-blue-400 group-hover:animate-bounce" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-white tracking-wide font-sans">Skycast</span>
          <span className="text-[10px] text-slate-400 tracking-widest font-mono uppercase">AI Weather Intel</span>
        </div>
      </Link>

      {/* Global Search Bar with Autocomplete Dropdown */}
      <form onSubmit={handleFormSubmit} className="relative w-full max-w-md" ref={dropdownRef}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for cities..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full pl-11 pr-24 py-2.5 bg-white/5 border border-white/8 text-white placeholder-slate-400 rounded-2xl outline-none focus:bg-white/8 focus:border-blue-500/40 text-sm tracking-wide transition-all"
          />
          <Search className="absolute left-4 top-3 h-4.5 w-4.5 text-slate-400" />
          
          {/* Location Request Button inside Input */}
          <button
            type="button"
            onClick={triggerGeolocation}
            className="absolute right-2.5 top-1.5 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors duration-200"
            title="Use current location"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showDropdown && (query.trim().length >= 2 || suggestions.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-slate-800 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl z-50">
            {loadingSuggestions && (
              <div className="p-4 text-xs text-slate-400 text-center animate-pulse">Querying geocoding registry...</div>
            )}
            {!loadingSuggestions && suggestions.length === 0 && (
              <div className="p-4 text-xs text-slate-400 text-center">No cities found. Try another query.</div>
            )}
            {!loadingSuggestions && suggestions.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSuggestClick(item)}
                className="w-full px-4 py-3 text-left text-sm text-slate-200 hover:bg-white/5 flex items-center justify-between border-b border-slate-800 last:border-0 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="font-semibold text-white">{item.name}</span>
                  {item.admin1 && <span className="text-slate-400 text-xs">{item.admin1}</span>}
                </div>
                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-md text-slate-400 font-medium">
                  {item.country_code}
                </span>
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Pages Navigation Controls */}
      <nav className="flex items-center gap-2">
        <Link
          to="/"
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            location.pathname === "/"
              ? "bg-blue-600/20 border border-blue-500/20 text-blue-400"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
        
        <Link
          to="/favorites"
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            location.pathname === "/favorites"
              ? "bg-blue-600/20 border border-blue-500/20 text-blue-400"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Favorites</span>
        </Link>

        <Link
          to="/compare"
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            location.pathname === "/compare"
              ? "bg-blue-600/20 border border-blue-500/20 text-blue-400"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Compare</span>
        </Link>
      </nav>
    </header>
  );
};
