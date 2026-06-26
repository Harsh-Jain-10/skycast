from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import WeatherResponse
from app.services.weather_service import WeatherService
from app.services.ai_service import AIService
from app.models import SearchHistory

router = APIRouter(prefix="/weather", tags=["Weather"])

@router.get("", response_model=WeatherResponse)
def get_weather_data(
    q: str = Query(None, description="City name to search"),
    lat: float = Query(None, description="Latitude coordinate"),
    lon: float = Query(None, description="Longitude coordinate"),
    exclude_ai: bool = Query(False, description="Exclude AI insights generation"),
    db: Session = Depends(get_db)
):
    if not q and (lat is None or lon is None):
        raise HTTPException(
            status_code=400, 
            detail="You must specify either a city name (q) or both latitude (lat) and longitude (lon)."
        )

    city_name = q
    country = None
    state = None

    # If city name was passed, use Geocoding to locate
    if q and (lat is None or lon is None):
        results = WeatherService.search_city(q)
        if not results:
            raise HTTPException(status_code=404, detail=f"City '{q}' not found.")
        
        # Take the top match
        match = results[0]
        lat = match["latitude"]
        lon = match["longitude"]
        city_name = match["name"]
        country = match.get("country")
        state = match.get("admin1")

    elif lat is not None and lon is not None:
        # If coordinates were passed, we default to the city name or "My Location"
        if not city_name:
            city_name = f"Coordinates ({lat:.2f}, {lon:.2f})"

    # Save to search history
    history_entry = SearchHistory(
        name=city_name,
        latitude=lat,
        longitude=lon,
        country=country,
        state=state
    )
    db.add(history_entry)
    db.commit()

    # Fetch weather and cache it
    weather_data = WeatherService.get_weather(db, lat, lon, city_name)
    weather_data["country"] = country
    weather_data["state"] = state

    # Add AI weather summary as well on loading
    if not exclude_ai:
        ai_insights = AIService.generate_weather_intelligence(weather_data)
        weather_data["ai_insights"] = ai_insights
    else:
        weather_data["ai_insights"] = None

    return weather_data

@router.get("/search", tags=["Geocoding"])
def search_cities(q: str = Query(..., min_length=2)):
    """Exposes geocoding search suggestions for autocomplete input."""
    return WeatherService.search_city(q)
