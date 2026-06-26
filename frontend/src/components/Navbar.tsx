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
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 glass-panel border border-white/8 bg-slate-950/45 backdrop-blur-xl rounded-2xl px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl transition-all duration-300">
      
      {/* Brand logo */}
      <Link to="/" className="flex items-center gap-2 group shrink-0">
        <div className="bg-white/4 p-2 rounded-xl border border-white/10 group-hover:bg-white/8 transition-colors duration-300">
          <CloudRain className="w-4.5 h-4.5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black text-white tracking-wider font-display uppercase">Skycast</span>
          <span className="text-[9px] text-slate-400 tracking-widest font-mono uppercase font-semibold">Intelligence</span>
        </div>
      </Link>

      {/* Global Search form with input focus expansion */}
      <form onSubmit={handleFormSubmit} className="relative w-full max-w-md" ref={dropdownRef}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search city, coordinates..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full pl-10 pr-20 py-2 bg-white/2 border border-white/5 text-white placeholder-slate-400 rounded-xl outline-none focus:bg-white/5 focus:border-white/20 text-xs tracking-wide transition-all duration-300"
          />
          <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          
          <button
            type="button"
            onClick={triggerGeolocation}
            className="absolute right-2 top-1.5 p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors duration-200"
            title="Use current location"
          >
            <Navigation className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dropdown lists */}
        {showDropdown && (query.trim().length >= 2 || suggestions.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950/95 border border-white/8 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl z-50 animate-fade-in">
            {loadingSuggestions && (
              <div className="p-3 text-[10px] text-slate-400 text-center animate-pulse font-mono uppercase tracking-widest">Querying Geocoding Registry...</div>
            )}
            {!loadingSuggestions && suggestions.length === 0 && (
              <div className="p-3 text-[10px] text-slate-400 text-center font-mono">No locations registered.</div>
            )}
            {!loadingSuggestions && suggestions.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSuggestClick(item)}
                className="w-full px-4 py-2.5 text-left text-xs text-slate-200 hover:bg-white/3 flex items-center justify-between border-b border-white/5 last:border-0 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-bold text-white">{item.name}</span>
                  {item.admin1 && <span className="text-slate-400 text-[10px]">{item.admin1}</span>}
                </div>
                <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                  {item.country_code}
                </span>
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Router Links */}
      <nav className="flex items-center gap-1.5 shrink-0">
        <Link
          to="/"
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
            location.pathname === "/"
              ? "bg-white/5 border border-white/10 text-white shadow-inner"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>
        
        <Link
          to="/favorites"
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
            location.pathname === "/favorites"
              ? "bg-white/5 border border-white/10 text-white shadow-inner"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Favorites</span>
        </Link>

        <Link
          to="/compare"
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
            location.pathname === "/compare"
              ? "bg-white/5 border border-white/10 text-white shadow-inner"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Compare</span>
        </Link>
      </nav>
    </header>
  );
};
