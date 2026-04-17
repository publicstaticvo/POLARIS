from fastapi import APIRouter, WebSocket
from app.database import register_websocket

router = APIRouter()

@router.websocket("/leaderboard")
async def leaderboard_socket(websocket: WebSocket):
    await websocket.accept()
    await register_websocket(websocket)
