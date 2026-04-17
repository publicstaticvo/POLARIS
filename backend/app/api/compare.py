from fastapi import APIRouter, Query, Request

from app.database import PolarisRepository

router = APIRouter()


def get_repository(request: Request) -> PolarisRepository:
    return request.app.state.repository


@router.get("/", summary="Compare models by overall and domain theta")
def compare_models(
    request: Request,
    model_ids: list[str] = Query(default=[]),
):
    repo = get_repository(request)
    return repo.get_compare(model_ids)
