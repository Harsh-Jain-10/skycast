import json
import logging
from google import genai
from google.genai import types
from app.core.config import settings

class AIService:
    @staticmethod
    def generate_weather_intelligence(weather_data: dict) -> dict:
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            import os
            api_key = os.getenv("GEMINI_API_KEY", "")
            
        if not api_key:
            return AIService.get_fallback_intelligence(weather_data)
            
        try:
            # Initialize the modern google-genai client
            client = genai.Client(api_key=api_key)
            
            # Extract main components for cleaner LLM context
            current = weather_data.get("current", {})
            daily = weather_data.get("daily", [])
            air = weather_data.get("air_quality", {})
            
            prompt = f"""
            Analyze the weather metrics and forecast to produce a comprehensive weather report.
            
            City: {weather_data.get('city_name', 'Unknown')}
            Current Metrics:
            - Temperature: {current.get('temperature')}°C (Feels like: {current.get('feels_like')}°C)
            - Humidity: {current.get('humidity')}%
            - Wind: {current.get('wind_speed')} m/s
            - Description: {current.get('description')}
            - UV Index: {current.get('uv_index')}
            - Air Quality Index (US AQI): {air.get('us_aqi')} ({air.get('quality_label')})
            
            7-Day Forecast:
            {json.dumps([{ 'date': d.get('date'), 'temp_range': f"{d.get('temperature_min')} to {d.get('temperature_max')}°C", 'desc': d.get('description') } for d in daily[:4]], indent=2)}

            Output a valid JSON object matching the schema below.
            Do not wrap in markdown quotes, return ONLY the raw JSON string:
            {{
                "summary": "Natural language summary of today's conditions and forecast trends.",
                "clothing_suggestion": ["Specific clothing item 1", "Specific clothing item 2", "Accessories based on UV/rain/wind"],
                "outdoor_activities": {{
                    "Running": "Excellent/Good/Fair/Poor based on weather",
                    "Cycling": "Excellent/Good/Fair/Poor based on wind and wetness",
                    "Hiking": "Excellent/Good/Fair/Poor based on conditions",
                    "Golf": "Excellent/Good/Fair/Poor"
                }},
                "travel_advice": "Commuting or long-distance travel safety recommendations.",
                "agricultural_tips": "Watering, planting, or harvesting insights based on rain and humidity.",
                "cycling_running_conditions": "More details about traction, wind drag, or temperature considerations for cardio activities.",
                "insights": [
                    "Technical insight 1 (e.g. pressure change, wind chill, humidity impact)",
                    "Technical insight 2"
                ]
            }}
            """
            
            response = client.models.generate_content(
                model="gemini-3-flash-preview",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=types.Schema(
                        type=types.Type.OBJECT,
                        properties={
                            "summary": types.Schema(type=types.Type.STRING),
                            "clothing_suggestion": types.Schema(
                                type=types.Type.ARRAY,
                                items=types.Schema(type=types.Type.STRING)
                            ),
                            "outdoor_activities": types.Schema(
                                type=types.Type.OBJECT,
                                additional_properties=types.Schema(type=types.Type.STRING)
                            ),
                            "travel_advice": types.Schema(type=types.Type.STRING),
                            "agricultural_tips": types.Schema(type=types.Type.STRING),
                            "cycling_running_conditions": types.Schema(type=types.Type.STRING),
                            "insights": types.Schema(
                                type=types.Type.ARRAY,
                                items=types.Schema(type=types.Type.STRING)
                            )
                        },
                        required=[
                            "summary", "clothing_suggestion", "outdoor_activities", 
                            "travel_advice", "agricultural_tips", "cycling_running_conditions", "insights"
                        ]
                    )
                )
            )
            
            return json.loads(response.text)
            
        except Exception as e:
            logging.error(f"Gemini API failure: {e}")
            return AIService.get_fallback_intelligence(weather_data)

    @staticmethod
    def get_fallback_intelligence(weather_data: dict) -> dict:
        """Fallback rule-based intelligence when Gemini API key is missing or errors."""
        current = weather_data.get("current", {})
        temp = current.get("temperature", 15.0)
        desc = current.get("description", "").lower()
        uv = current.get("uv_index", 0.0)
        humidity = current.get("humidity", 50)
        wind = current.get("wind_speed", 0.0)
        
        # 1. Clothing suggestions
        clothing = []
        if temp < 5:
            clothing.extend(["Heavy winter coat", "Thermal layers", "Beanie & gloves"])
        elif temp < 15:
            clothing.extend(["Sweater or light jacket", "Long pants", "Layered clothing"])
        elif temp < 25:
            clothing.extend(["T-shirt and jeans", "Light cardigan for evening"])
        else:
            clothing.extend(["Shorts and breathable t-shirt", "Sunglasses"])
            
        if "rain" in desc or "drizzle" in desc or "showers" in desc or "thunderstorm" in desc:
            clothing.extend(["Waterproof jacket", "Umbrella", "Water-resistant shoes"])
        elif uv > 5:
            clothing.extend(["Sunscreen (SPF 30+)", "Wide-brimmed hat"])

        # 2. Outdoor Activities
        running = "Excellent"
        cycling = "Excellent"
        hiking = "Good"
        golf = "Good"
        
        if "rain" in desc or "thunderstorm" in desc:
            running = "Poor (Wet roads)"
            cycling = "Poor (Low traction & splash)"
            hiking = "Poor (Muddy trails, lightning risk)"
            golf = "Poor (Waterlogging)"
        elif wind > 8:
            running = "Fair (Wind drag)"
            cycling = "Poor (High crosswinds)"
            hiking = "Fair (Dusty conditions)"
            golf = "Fair (Flight trajectory drift)"
        elif temp > 30:
            running = "Fair (High heat, hydrate)"
            cycling = "Good"
            hiking = "Fair (Sun exposure risk)"
            golf = "Fair (High dehydration risk)"
        elif temp < 5:
            running = "Fair (Freezing air, wrap up)"
            cycling = "Fair (Cold headwind)"
            hiking = "Fair (Ice hazard)"
            golf = "Poor (Frozen greens)"

        # 3. Travel advice
        travel = "Normal commuting conditions."
        if "rain" in desc:
            travel = "Wet road surfaces. Watch out for hydroplaning and increase braking distance."
        elif "thunderstorm" in desc:
            travel = "Severe thunderstorms. Expect localized flooding, high gusts, and potential road blockages."
        elif "fog" in desc or "mist" in desc:
            travel = "Low visibility. Keep fog lights on, slow down, and do not use high-beams."
        elif temp < 0:
            travel = "Freezing temperatures. Beware of black ice on bridges and overpasses."

        # 4. Agricultural tips
        agri = "Good conditions for general farming and gardening."
        if "rain" in desc or "thunderstorm" in desc:
            agri = "Avoid spraying fertilizers or pesticides. Excellent day for soil moisture retention; postpone irrigation."
        elif temp > 30 and humidity < 40:
            agri = "High evaporation rate. Increase irrigation schedules, preferably early morning or late evening."
        elif temp < 2:
            agri = "Frost warning risk. Protect sensitive crops or container plants under covers."

        # 5. Cycling/Running conditions details
        cardio = f"Temperature is {temp}°C with {wind} m/s winds."
        if "rain" in desc:
            cardio += " High moisture makes breathing feel heavy. Slick roads reduce traction significantly."
        elif wind > 8:
            cardio += " Wind gusts will generate significant aerodynamic drag on headwind stretches."
        else:
            cardio += " Stable conditions make this a fantastic day for cardiovascular outdoor exercise."

        # 6. Insights
        insights = [
            f"Relative humidity is {humidity}%. Higher moisture content can make cold days feel cooler and hot days more oppressive.",
            f"Wind speed is {wind} m/s, adding a slight cooling effect to the skin."
        ]
        if uv > 6:
            insights.append("UV levels are high. Skin damage can occur in under 20 minutes without protection.")

        summary = f"Currently experiencing {desc} with a temperature of {temp}°C. "
        if "rain" in desc:
            summary += "Expect precipitation to continue throughout the local area. Outdoor activities should be moved indoors."
        else:
            summary += "Weather is stable. Good day to enjoy outdoor excursions."

        return {
            "summary": summary,
            "clothing_suggestion": clothing,
            "outdoor_activities": {
                "Running": running,
                "Cycling": cycling,
                "Hiking": hiking,
                "Golf": golf
            },
            "travel_advice": travel,
            "agricultural_tips": agri,
            "cycling_running_conditions": cardio,
            "insights": insights
        }
