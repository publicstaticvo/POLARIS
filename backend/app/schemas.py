from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


DomainKey = Literal["math", "code", "reasoning", "chinese", "knowledge", "multilingual"]
SubmissionStatus = Literal["queued", "prechecking", "running", "publishing", "completed", "cancelled"]
TimelineStatus = Literal["todo", "active", "done"]
DomainStatus = Literal["waiting", "running", "completed"]
PrecisionProfile = Literal["fast", "standard", "precise"]
Visibility = Literal["public", "private"]
SourceType = Literal["api", "local"]
Openness = Literal["Open", "Closed"]


class DomainScore(BaseModel):
    key: DomainKey
    label: str
    theta: float
    se: float
    items: int


class BehavioralProfile(BaseModel):
    robustness: int
    plasticity: int
    note: str


class HistoryPoint(BaseModel):
    label: str
    theta: float


class LeaderboardEntry(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    rank: int
    model_id: str
    model_name: str
    org: str
    theta: float
    se: float
    confidence_interval: tuple[float, float]
    items: int
    updated_at: datetime
    scale: str
    openness: Openness
    summary: str
    tags: list[str]
    domains: list[DomainScore]


class ModelProfile(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    model_id: str
    model_name: str
    version: str
    institution: str
    scale: str
    openness: Openness
    updated_at: datetime
    theta: float
    se: float
    items: int
    summary: str
    tags: list[str]
    domain_scores: list[DomainScore]
    history: list[HistoryPoint]
    behavioral: BehavioralProfile
    metadata: dict[str, str]


class TimelineStep(BaseModel):
    step: str
    detail: str
    status: TimelineStatus


class DomainProgress(BaseModel):
    key: DomainKey
    label: str
    status: DomainStatus
    percent: int = Field(ge=0, le=100)
    detail: str
    items_used: int = 0
    current_theta: float | None = None
    theta: float | None = None
    se: float | None = None


class SubmissionCreate(BaseModel):
    model_name: str
    version: str
    institution: str | None = None
    description: str | None = None
    size_category: str
    openness: Literal["open", "closed"]
    hf_link: HttpUrl | None = None
    source_type: SourceType
    endpoint: HttpUrl | None = None
    api_key: str | None = None
    request_format: str = "openai"
    temperature: float = 0.0
    max_tokens: int = 2048
    system_prompt: str | None = None
    domains: list[DomainKey]
    precision_profile: PrecisionProfile = "standard"
    visibility: Visibility = "public"
    email: str | None = None


class SubmissionConnectionTest(BaseModel):
    source_type: SourceType
    endpoint: HttpUrl | None = None
    api_key: str | None = None
    request_format: str = "openai"
    model_name: str | None = None


class SubmissionSummary(BaseModel):
    submission_id: str
    model_id: str
    model_name: str
    version: str
    institution: str
    status: SubmissionStatus
    source_type: SourceType
    visibility: Visibility
    created_at: datetime
    updated_at: datetime
    progress_percent: int = Field(ge=0, le=100)
    estimated_minutes_remaining: int
    current_stage: str
    overall_theta: float | None = None


class SubmissionDetail(SubmissionSummary):
    size_category: str
    openness: Openness
    description: str | None = None
    request_format: str
    temperature: float
    max_tokens: int
    system_prompt: str | None = None
    domains: list[DomainKey]
    domain_progress: list[DomainProgress]
    timeline: list[TimelineStep]
    summary_note: str


class LeaderboardResponse(BaseModel):
    updated_at: datetime
    domain: str
    filters: dict[str, str]
    note: str
    entries: list[LeaderboardEntry]


class DashboardOverview(BaseModel):
    active_submission: SubmissionDetail | None
    history: list[SubmissionSummary]


class CompareModelRow(BaseModel):
    model_id: str
    model_name: str
    theta: float
    se: float
    confidence_interval: tuple[float, float]
    domains: list[DomainScore]


class CompareResponse(BaseModel):
    note: str
    models: list[CompareModelRow]


class QuestionHubSummary(BaseModel):
    total_questions: int
    new_this_month: int
    contributors: int
    requirements: list[str]
    benefits: list[str]
    workflow: list[str]


class DeveloperOverview(BaseModel):
    base_url: str
    docs_url: str
    websocket_channels: list[str]
    workflow: list[str]
    sample_submission_payload: dict[str, object]


class ConnectionTestResponse(BaseModel):
    success: bool
    detail: str
    detected_format: str
    suggested_concurrency: int


class CancellationResponse(BaseModel):
    success: bool
    detail: str
    submission: SubmissionDetail
