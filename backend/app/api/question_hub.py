from fastapi import APIRouter, Request

from app.database import PolarisRepository

router = APIRouter()


def get_repository(request: Request) -> PolarisRepository:
    return request.app.state.repository


@router.get("/summary", summary="Question hub summary and contribution rules")
def question_hub_summary(request: Request):
    repo = get_repository(request)
    return repo.get_question_hub_summary()
