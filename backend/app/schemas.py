from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Dict, Any

# Favorite City Schemas
class FavoriteCityBase(BaseModel):
    name: str
    latitude: float
    longitude: float
    country: Optional[str] = None
    state: Optional[str] = None

class FavoriteCityCreate(FavoriteCityBase):
    pass

class FavoriteCityResponse(FavoriteCityBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Search History Schemas
class SearchHistoryBase(BaseModel):
    name: str
    latitude: float
    longitude: float
    country: Optional[str] = None
    state: Optional[str] = None

class SearchHistoryCreate(SearchHistoryBase):
    pass

class SearchHistoryResponse(SearchHistoryBase):
    id: int
    searched_at: datetime

    class Config:
        from_attributes = True

# Weather Schemas
class WeatherCurrent(BaseModel):
    temperature: float
    feels_like: float
    humidity: float
    pressure: float
    visibility: float
    dew_point: float
    uv_index: float
    wind_speed: float
    wind_direction: float
    cloud_cover: float
    sunrise: str
    sunset: str
    moon_phase: float
    weather_code: int
    is_day: int
    description: str

class WeatherHourlyItem(BaseModel):
    time: str
    temperature: float
    apparent_temperature: float
    precipitation_probability: float
    precipitation: float
    weather_code: int
    description: str
    humidity: float
    wind_speed: float
    uv_index: float
    is_day: int

class WeatherDailyItem(BaseModel):
    date: str
    temperature_max: float
    temperature_min: float
    apparent_temperature_max: float
    apparent_temperature_min: float
    sunrise: str
    sunset: str
    uv_index_max: float
    precipitation_sum: float
    precipitation_probability_max: float
    wind_speed_max: float
    wind_direction_dominant: float
    weather_code: int
    description: str

class AirQualityCurrent(BaseModel):
    european_aqi: float
    us_aqi: float
    pm10: float
    pm2_5: float
    carbon_monoxide: float
    nitrogen_dioxide: float
    sulphur_dioxide: float
    ozone: float
    quality_label: str

class HistoricalWeatherItem(BaseModel):
    date: str
    temp_max: float
    temp_min: float
    precipitation: float

class WeatherIntelligence(BaseModel):
    summary: str
    clothing_suggestion: List[str]
    outdoor_activities: Dict[str, Any] # e.g. {"running": "Good", "cycling": "Fair", ...}
    travel_advice: str
    agricultural_tips: str
    cycling_running_conditions: str
    insights: List[str]

class WeatherResponse(BaseModel):
    city_name: str
    latitude: float
    longitude: float
    country: Optional[str] = None
    state: Optional[str] = None
    current: WeatherCurrent
    hourly: List[WeatherHourlyItem]
    daily: List[WeatherDailyItem]
    air_quality: AirQualityCurrent
    historical: Optional[List[HistoricalWeatherItem]] = None
    ai_insights: Optional[WeatherIntelligence] = None
