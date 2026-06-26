from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import SearchHistory
from app.schemas import SearchHistoryResponse

router = APIRouter(prefix="/history", tags=["Search History"])

@router.get("", response_model=list[SearchHistoryResponse])
def get_search_history(db: Session = Depends(get_db)):
    """Retrieve the 15 most recent search log events."""
    return db.query(SearchHistory).order_by(SearchHistory.searched_at.desc()).limit(15).all()

@router.delete("")
def clear_search_history(db: Session = Depends(get_db)):
    """Deletes all search logs."""
    db.query(SearchHistory).delete()
    db.commit()
    return {"message": "Search history cleared"}
