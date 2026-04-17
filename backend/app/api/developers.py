from fastapi import APIRouter, Request

from app.database import PolarisRepository

router = APIRouter()


def get_repository(request: Request) -> PolarisRepository:
    return request.app.state.repository


@router.get("/overview", summary="Developer API overview")
def developer_overview(request: Request):
    repo = get_repository(request)
    return repo.get_developer_overview()
