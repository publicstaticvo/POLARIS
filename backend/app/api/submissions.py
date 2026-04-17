from fastapi import APIRouter, HTTPException, Query, Request

from app.database import PolarisRepository
from app.schemas import SubmissionConnectionTest, SubmissionCreate

router = APIRouter()


def get_repository(request: Request) -> PolarisRepository:
    return request.app.state.repository


@router.post("/", summary="Submit a new model for evaluation")
def submit_model(payload: SubmissionCreate, request: Request):
    repo = get_repository(request)
    return repo.create_submission(payload)


@router.get("/", summary="List submissions")
def submission_list(request: Request, status: str | None = Query(default=None)):
    repo = get_repository(request)
    return repo.list_submissions(status=status)


@router.get("/{submission_id}", summary="Submission detail")
def submission_detail(submission_id: str, request: Request):
    repo = get_repository(request)
    submission = repo.get_submission_detail(submission_id)
    if submission is None:
        raise HTTPException(status_code=404, detail="Submission not found.")
    return submission


@router.post("/{submission_id}/cancel", summary="Cancel a submission")
def cancel_submission(submission_id: str, request: Request):
    repo = get_repository(request)
    cancelled = repo.cancel_submission(submission_id)
    if cancelled is None:
        raise HTTPException(status_code=404, detail="Submission not found.")
    return cancelled


@router.post("/test-connection", summary="Test model API connection")
def connection_test(payload: SubmissionConnectionTest, request: Request):
    repo = get_repository(request)
    result = repo.test_connection(payload)
    if not result.success:
        raise HTTPException(status_code=400, detail=result.detail)
    return result
