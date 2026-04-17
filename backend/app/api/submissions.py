from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
from app.database import create_submission, list_submissions, test_connection

router = APIRouter()

class SubmissionCreate(BaseModel):
    model_name: str
    version: str
    institution: str | None = None
    size_category: str
    source_type: str
    endpoint: HttpUrl | None = None
    api_key: str | None = None
    request_format: str = "openai"
    temperature: float = 0.0
    max_tokens: int = 2048
    system_prompt: str | None = None
    domains: list[str]
    precision_profile: str
    visibility: str
    email: str | None = None

@router.post("/", summary="Submit a new model for evaluation")
def submit_model(payload: SubmissionCreate):
    submission = create_submission(payload.dict())
    return submission

@router.get("/", summary="List user submissions")
def submission_list():
    return list_submissions()

@router.post("/test-connection", summary="Test model API connection")
def connection_test(payload: SubmissionCreate):
    success, detail = test_connection(payload.dict())
    if not success:
        raise HTTPException(status_code=400, detail=detail)
    return {"success": True, "detail": detail}
