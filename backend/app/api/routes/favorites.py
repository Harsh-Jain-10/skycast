from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import FavoriteCity
from app.schemas import FavoriteCityCreate, FavoriteCityResponse

router = APIRouter(prefix="/favorites", tags=["Favorites"])

@router.get("", response_model=list[FavoriteCityResponse])
def get_favorites(db: Session = Depends(get_db)):
    return db.query(FavoriteCity).order_by(FavoriteCity.created_at.desc()).all()

@router.post("", response_model=FavoriteCityResponse)
def add_favorite(city: FavoriteCityCreate, db: Session = Depends(get_db)):
    # Check if already exists to avoid duplicates
    existing = db.query(FavoriteCity).filter(
        FavoriteCity.latitude == city.latitude,
        FavoriteCity.longitude == city.longitude
    ).first()
    if existing:
        return existing
        
    db_fav = FavoriteCity(
        name=city.name,
        latitude=city.latitude,
        longitude=city.longitude,
        country=city.country,
        state=city.state
    )
    db.add(db_fav)
    db.commit()
    db.refresh(db_fav)
    return db_fav

@router.delete("/{favorite_id}")
def delete_favorite(favorite_id: int, db: Session = Depends(get_db)):
    db_fav = db.query(FavoriteCity).filter(FavoriteCity.id == favorite_id).first()
    if not db_fav:
        raise HTTPException(status_code=404, detail="Favorite city not found")
    db.delete(db_fav)
    db.commit()
    return {"message": "Favorite deleted successfully"}
