from fastapi import APIRouter, Body
from app.schemas import WeatherIntelligence
from app.services.ai_service import AIService

router = APIRouter(prefix="/ai", tags=["AI Intelligence"])

@router.post("/insights", response_model=WeatherIntelligence)
def get_custom_ai_insights(weather_payload: dict = Body(..., description="Full weather payload data")):
    """Generates AI weather insights, clothing tips, and activity scores on-demand."""
    return AIService.generate_weather_intelligence(weather_payload)
