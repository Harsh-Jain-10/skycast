export interface FavoriteCityResponse {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  state?: string;
  created_at: string;
}

export interface SearchHistoryResponse {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  state?: string;
  searched_at: string;
}

export interface WeatherCurrent {
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  visibility: number;
  dew_point: number;
  uv_index: number;
  wind_speed: number;
  wind_direction: number;
  cloud_cover: number;
  sunrise: string;
  sunset: string;
  moon_phase: number;
  weather_code: number;
  is_day: number;
  description: string;
}

export interface WeatherHourlyItem {
  time: string;
  temperature: number;
  apparent_temperature: number;
  precipitation_probability: number;
  precipitation: number;
  weather_code: number;
  description: string;
  humidity: number;
  wind_speed: number;
  uv_index: number;
  is_day: number;
}

export interface WeatherDailyItem {
  date: string;
  temperature_max: number;
  temperature_min: number;
  apparent_temperature_max: number;
  apparent_temperature_min: number;
  sunrise: string;
  sunset: string;
  uv_index_max: number;
  precipitation_sum: number;
  precipitation_probability_max: number;
  wind_speed_max: number;
  wind_direction_dominant: number;
  weather_code: number;
  description: string;
}

export interface AirQualityCurrent {
  european_aqi: number;
  us_aqi: number;
  pm10: number;
  pm2_5: number;
  carbon_monoxide: number;
  nitrogen_dioxide: number;
  sulphur_dioxide: number;
  ozone: number;
  quality_label: string;
}

export interface HistoricalWeatherItem {
  date: string;
  temp_max: number;
  temp_min: number;
  precipitation: number;
}

export interface WeatherIntelligence {
  summary: string;
  clothing_suggestion: string[];
  outdoor_activities: Record<string, string>;
  travel_advice: string;
  agricultural_tips: string;
  cycling_running_conditions: string;
  insights: string[];
}

export interface WeatherResponse {
  city_name: string;
  latitude: number;
  longitude: number;
  country?: string;
  state?: string;
  current: WeatherCurrent;
  hourly: WeatherHourlyItem[];
  daily: WeatherDailyItem[];
  air_quality: AirQualityCurrent;
  historical?: HistoricalWeatherItem[];
  ai_insights?: WeatherIntelligence;
}
