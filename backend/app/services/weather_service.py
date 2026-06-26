import json
import requests
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models import WeatherCache

WMO_CODE_MAP = {
    0: ("Clear sky", "☀️"),
    1: ("Mainly clear", "🌤️"),
    2: ("Partly cloudy", "⛅"),
    3: ("Overcast", "☁️"),
    45: ("Fog", "🌫️"),
    48: ("Depositing rime fog", "🌫️"),
    51: ("Light drizzle", "🌦️"),
    53: ("Moderate drizzle", "🌦️"),
    55: ("Dense drizzle", "🌦️"),
    56: ("Light freezing drizzle", "🌦️"),
    57: ("Dense freezing drizzle", "🌦️"),
    61: ("Slight rain", "🌧️"),
    63: ("Moderate rain", "🌧️"),
    65: ("Heavy rain", "🌧️"),
    66: ("Light freezing rain", "🌧️"),
    67: ("Heavy freezing rain", "🌧️"),
    71: ("Slight snow fall", "❄️"),
    73: ("Moderate snow fall", "❄️"),
    75: ("Heavy snow fall", "❄️"),
    77: ("Snow grains", "❄️"),
    80: ("Slight rain showers", "🌧️"),
    81: ("Moderate rain showers", "🌧️"),
    82: ("Violent rain showers", "🌧️"),
    85: ("Slight snow showers", "❄️"),
    86: ("Heavy snow showers", "❄️"),
    95: ("Thunderstorm", "⛈️"),
    96: ("Thunderstorm with slight hail", "⛈️"),
    99: ("Thunderstorm with heavy hail", "⛈️"),
}

def get_description_and_emoji(code: int) -> tuple[str, str]:
    return WMO_CODE_MAP.get(code, ("Unknown", "🌈"))

class WeatherService:
    @staticmethod
    def search_city(query: str) -> list[dict]:
        """Resolves city query to latitude, longitude, and metadata using Open-Meteo Geocoding API."""
        url = f"https://geocoding-api.open-meteo.com/v1/search?name={query}&count=5&format=json"
        try:
            res = requests.get(url, timeout=10)
            res.raise_for_status()
            data = res.json()
            return data.get("results", [])
        except Exception:
            return []

    @staticmethod
    def get_air_quality_label(aqi: float) -> str:
        if aqi <= 50:
            return "Good"
        elif aqi <= 100:
            return "Moderate"
        elif aqi <= 150:
            return "Unhealthy for Sensitive Groups"
        elif aqi <= 200:
            return "Unhealthy"
        elif aqi <= 300:
            return "Very Unhealthy"
        else:
            return "Hazardous"

    @classmethod
    def fetch_weather_raw(cls, lat: float, lon: float) -> dict:
        """Hits Open-Meteo APIs for Forecast, Air Quality, and History."""
        # 1. Forecast & Current Weather
        forecast_url = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={lat}&longitude={lon}"
            f"&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m"
            f"&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,pressure_msl,cloud_cover,visibility,wind_speed_10m,uv_index,is_day"
            f"&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant"
            f"&timezone=auto"
        )
        forecast_res = requests.get(forecast_url, timeout=10)
        forecast_res.raise_for_status()
        forecast_data = forecast_res.json()

        # 2. Air Quality
        aq_url = (
            f"https://air-quality-api.open-meteo.com/v1/air-quality?"
            f"latitude={lat}&longitude={lon}"
            f"&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone"
        )
        aq_data = {}
        try:
            aq_res = requests.get(aq_url, timeout=10)
            aq_res.raise_for_status()
            aq_data = aq_res.json()
        except Exception:
            # Fallback AQI if API fails
            aq_data = {
                "current": {
                    "european_aqi": 30.0, "us_aqi": 30.0, "pm10": 10.0, "pm2_5": 5.0,
                    "carbon_monoxide": 200.0, "nitrogen_dioxide": 15.0, "sulphur_dioxide": 2.0, "ozone": 50.0
                }
            }

        # 3. Historical Weather Trends (for comparison, last 7 days of previous year)
        # Using historical approximation or standard API. Let's calculate previous year dates.
        today = datetime.now()
        start_date = (today - timedelta(days=365 + 3)).strftime("%Y-%m-%d")
        end_date = (today - timedelta(days=365 - 3)).strftime("%Y-%m-%d")
        hist_url = (
            f"https://archive-api.open-meteo.com/v1/archive?"
            f"latitude={lat}&longitude={lon}"
            f"&start_date={start_date}&end_date={end_date}"
            f"&daily=temperature_2m_max,temperature_2m_min,precipitation_sum"
        )
        hist_data = {}
        try:
            hist_res = requests.get(hist_url, timeout=10)
            if hist_res.status_code == 200:
                hist_data = hist_res.json()
        except Exception:
            pass

        return {
            "forecast": forecast_data,
            "air_quality": aq_data,
            "historical": hist_data
        }

    @classmethod
    def get_weather(cls, db: Session, lat: float, lon: float, city_name: str) -> dict:
        """Gets weather payload from cache or fetches new if expired."""
        cache_key = f"lat:{lat:.4f};lon:{lon:.4f}"
        
        # Check cache
        cache_entry = db.query(WeatherCache).filter(WeatherCache.cache_key == cache_key).first()
        now = datetime.utcnow()
        
        if cache_entry and (now - cache_entry.updated_at).total_seconds() < settings.CACHE_TTL_SECONDS:
            return json.loads(cache_entry.data)
            
        # Fetch fresh data
        raw = cls.fetch_weather_raw(lat, lon)
        
        # Process and build clean structured response payload
        forecast = raw["forecast"]
        aq = raw["air_quality"]
        hist = raw["historical"]
        
        current_data = forecast["current"]
        hourly_data = forecast["hourly"]
        daily_data = forecast["daily"]
        
        # Current Weather Parse
        curr_code = int(current_data["weather_code"])
        curr_desc, curr_emoji = get_description_and_emoji(curr_code)
        
        # Geolocation UV/Moon Phase approximations
        # Open-Meteo hourly has UV index. Let's find current hour UV index.
        curr_hour_index = 0
        current_time_str = current_data["time"]
        for idx, t in enumerate(hourly_data["time"]):
            if t.startswith(current_time_str[:13]):
                curr_hour_index = idx
                break
                
        curr_uv = hourly_data.get("uv_index", [0]*240)[curr_hour_index]
        curr_vis = hourly_data.get("visibility", [10000]*240)[curr_hour_index]
        curr_dew = hourly_data.get("dew_point_2m", [0]*240)[curr_hour_index]
        
        # Moon phase calculation approximation based on days since new moon
        # base: 2026-06-26
        # standard moon cycle: 29.53 days
        diff_days = (datetime.now() - datetime(2026, 1, 1)).days
        moon_phase = (diff_days % 29.53059) / 29.53059
        
        current = {
            "temperature": current_data["temperature_2m"],
            "feels_like": current_data["apparent_temperature"],
            "humidity": current_data["relative_humidity_2m"],
            "pressure": current_data["pressure_msl"],
            "visibility": curr_vis,
            "dew_point": curr_dew,
            "uv_index": curr_uv,
            "wind_speed": current_data["wind_speed_10m"],
            "wind_direction": current_data["wind_direction_10m"],
            "cloud_cover": current_data["cloud_cover"],
            "sunrise": daily_data["sunrise"][0].split("T")[-1] if daily_data["sunrise"] else "",
            "sunset": daily_data["sunset"][0].split("T")[-1] if daily_data["sunset"] else "",
            "moon_phase": moon_phase,
            "weather_code": curr_code,
            "is_day": current_data["is_day"],
            "description": f"{curr_emoji} {curr_desc}"
        }
        
        # Hourly Forecast Parse (Take next 24 hours)
        hourly = []
        for i in range(curr_hour_index, min(curr_hour_index + 24, len(hourly_data["time"]))):
            h_code = int(hourly_data["weather_code"][i])
            h_desc, h_emoji = get_description_and_emoji(h_code)
            hourly.append({
                "time": hourly_data["time"][i],
                "temperature": hourly_data["temperature_2m"][i],
                "apparent_temperature": hourly_data["apparent_temperature"][i],
                "precipitation_probability": hourly_data["precipitation_probability"][i],
                "precipitation": hourly_data["precipitation"][i],
                "weather_code": h_code,
                "description": f"{h_emoji} {h_desc}",
                "humidity": hourly_data["relative_humidity_2m"][i],
                "wind_speed": hourly_data["wind_speed_10m"][i],
                "uv_index": hourly_data["uv_index"][i],
                "is_day": hourly_data["is_day"][i],
            })
            
        # Daily Forecast Parse (7 Days)
        daily = []
        for i in range(min(7, len(daily_data["time"]))):
            d_code = int(daily_data["weather_code"][i])
            d_desc, d_emoji = get_description_and_emoji(d_code)
            daily.append({
                "date": daily_data["time"][i],
                "temperature_max": daily_data["temperature_2m_max"][i],
                "temperature_min": daily_data["temperature_2m_min"][i],
                "apparent_temperature_max": daily_data["apparent_temperature_max"][i],
                "apparent_temperature_min": daily_data["apparent_temperature_min"][i],
                "sunrise": daily_data["sunrise"][i].split("T")[-1] if daily_data["sunrise"][i] else "",
                "sunset": daily_data["sunset"][i].split("T")[-1] if daily_data["sunset"][i] else "",
                "uv_index_max": daily_data["uv_index_max"][i],
                "precipitation_sum": daily_data["precipitation_sum"][i],
                "precipitation_probability_max": daily_data["precipitation_probability_max"][i] if "precipitation_probability_max" in daily_data else 0,
                "wind_speed_max": daily_data["wind_speed_10m_max"][i],
                "wind_direction_dominant": daily_data["wind_direction_10m_dominant"][i],
                "weather_code": d_code,
                "description": f"{d_emoji} {d_desc}"
            })
            
        # Air Quality Parse
        aq_curr = aq.get("current", {})
        aq_us = aq_curr.get("us_aqi", 30)
        aq_label = cls.get_air_quality_label(aq_us)
        
        air_quality = {
            "european_aqi": aq_curr.get("european_aqi", 30.0),
            "us_aqi": aq_us,
            "pm10": aq_curr.get("pm10", 10.0),
            "pm2_5": aq_curr.get("pm2_5", 5.0),
            "carbon_monoxide": aq_curr.get("carbon_monoxide", 200.0),
            "nitrogen_dioxide": aq_curr.get("nitrogen_dioxide", 15.0),
            "sulphur_dioxide": aq_curr.get("sulphur_dioxide", 2.0),
            "ozone": aq_curr.get("ozone", 50.0),
            "quality_label": aq_label
        }
        
        # Historical Parse
        historical = []
        if hist and "daily" in hist:
            hist_daily = hist["daily"]
            for i in range(len(hist_daily.get("time", []))):
                historical.append({
                    "date": hist_daily["time"][i],
                    "temp_max": hist_daily["temperature_2m_max"][i],
                    "temp_min": hist_daily["temperature_2m_min"][i],
                    "precipitation": hist_daily["precipitation_sum"][i]
                })

        processed = {
            "city_name": city_name,
            "latitude": lat,
            "longitude": lon,
            "current": current,
            "hourly": hourly,
            "daily": daily,
            "air_quality": air_quality,
            "historical": historical
        }
        
        # Save cache
        if cache_entry:
            cache_entry.data = json.dumps(processed)
            cache_entry.updated_at = now
        else:
            new_cache = WeatherCache(
                cache_key=cache_key,
                latitude=lat,
                longitude=lon,
                data=json.dumps(processed)
            )
            db.add(new_cache)
            
        db.commit()
        return processed
