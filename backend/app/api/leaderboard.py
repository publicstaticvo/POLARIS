from fastapi import APIRouter
from app.database import get_leaderboard, get_model_profile

router = APIRouter()

@router.get("/", summary="Leaderboard entries")
def list_leaderboard():
    return get_leaderboard()

@router.get("/models/{model_id}", summary="Model profile data")
def model_profile(model_id: str):
    return get_model_profile(model_id)
