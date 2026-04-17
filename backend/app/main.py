from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import leaderboard, submissions, websocket

app = FastAPI(
    title="POLARIS IRT Core API",
    description="Backend API for adaptive model evaluation, leaderboard, and submission workflows.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(leaderboard.router, prefix="/api/leaderboard", tags=["leaderboard"])
app.include_router(submissions.router, prefix="/api/submissions", tags=["submissions"])
app.include_router(websocket.router, prefix="/api/ws", tags=["websocket"])

@app.get("/api/health", summary="Health check")
def health_check():
    return {"status": "ok", "service": "POLARIS IRT Core API"}
