from fastapi import APIRouter, HTTPException, Query, Request

from app.database import PolarisRepository

router = APIRouter()


def get_repository(request: Request) -> PolarisRepository:
    return request.app.state.repository


@router.get("/", summary="Leaderboard entries")
def list_leaderboard(
    request: Request,
    domain: str = Query(default="overall"),
    scale: str = Query(default="all"),
    openness: str = Query(default="all"),
    time_range: str = Query(default="all"),
):
    repo = get_repository(request)
    return repo.list_leaderboard(domain=domain, scale=scale, openness=openness, time_range=time_range)


@router.get("/models/{model_id}", summary="Model profile data")
def model_profile(model_id: str, request: Request):
    repo = get_repository(request)
    profile = repo.get_model_profile(model_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Model not found.")
    return profile
