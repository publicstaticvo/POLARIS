from __future__ import annotations

import asyncio
from contextlib import asynccontextmanager, suppress

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import compare, dashboard, developers, leaderboard, question_hub, submissions, websocket
from app.database import PolarisRepository
from app.ws_manager import WebSocketManager


async def run_simulation(repository: PolarisRepository, ws_manager: WebSocketManager) -> None:
    try:
        while True:
            await asyncio.sleep(3)
            messages = repository.advance_simulation()
            if messages:
                await ws_manager.broadcast_many(messages)
    except asyncio.CancelledError:
        return


@asynccontextmanager
async def lifespan(app: FastAPI):
    repository = PolarisRepository()
    ws_manager = WebSocketManager()
    app.state.repository = repository
    app.state.ws_manager = ws_manager
    simulation_task = asyncio.create_task(run_simulation(repository, ws_manager))
    try:
        yield
    finally:
        simulation_task.cancel()
        with suppress(asyncio.CancelledError):
            await simulation_task


app = FastAPI(
    title="POLARIS IRT Core API",
    description="Adaptive model evaluation backend for leaderboard, submissions, dashboard, and realtime updates.",
    version="0.2.0",
    lifespan=lifespan,
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
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(compare.router, prefix="/api/compare", tags=["compare"])
app.include_router(question_hub.router, prefix="/api/question-hub", tags=["question-hub"])
app.include_router(developers.router, prefix="/api/developers", tags=["developers"])
app.include_router(websocket.router, prefix="/api/ws", tags=["websocket"])


@app.get("/api/health", summary="Health check")
def health_check():
    return {
        "status": "ok",
        "service": "POLARIS IRT Core API",
        "version": app.version,
    }
