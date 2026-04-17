from fastapi import APIRouter, HTTPException, Request

from app.database import PolarisRepository

router = APIRouter()


def get_repository(request: Request) -> PolarisRepository:
    return request.app.state.repository


@router.get("/", summary="Dashboard overview")
def dashboard_overview(request: Request):
    repo = get_repository(request)
    return repo.get_dashboard_overview()


@router.get("/active", summary="Current active submission")
def active_submission(request: Request):
    repo = get_repository(request)
    submission = repo.get_active_dashboard()
    if submission is None:
        raise HTTPException(status_code=404, detail="No active submission found.")
    return submission


@router.get("/submissions/{submission_id}", summary="Dashboard details for a submission")
def dashboard_submission(submission_id: str, request: Request):
    repo = get_repository(request)
    submission = repo.get_submission_detail(submission_id)
    if submission is None:
        raise HTTPException(status_code=404, detail="Submission not found.")
    return submission


@router.get("/history", summary="Completed submissions history")
def dashboard_history(request: Request):
    repo = get_repository(request)
    return repo.get_history()
