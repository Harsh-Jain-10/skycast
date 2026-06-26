from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime
from app.database import Base

class FavoriteCity(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    country = Column(String, nullable=True)
    state = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    country = Column(String, nullable=True)
    state = Column(String, nullable=True)
    searched_at = Column(DateTime, default=datetime.utcnow)

class WeatherCache(Base):
    __tablename__ = "weather_cache"

    id = Column(Integer, primary_key=True, index=True)
    cache_key = Column(String, unique=True, index=True, nullable=False) # e.g. "lat:51.5085;lon:-0.1257"
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    data = Column(Text, nullable=False)  # JSON-serialized payload
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
