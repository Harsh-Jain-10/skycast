from pydantic import SettingsConfigDict
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Skycast AI Weather Platform"
    
    # API Keys
    GEMINI_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    OPENWEATHERMAP_API_KEY: str = ""
    
    # Database
    # Default to sqlite relative to the workspace folder
    DATABASE_URL: str = "sqlite:///./skycast.db"
    
    # Caching (default 15 minutes)
    CACHE_TTL_SECONDS: int = 900
    
    # CORS
    ALLOWED_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
