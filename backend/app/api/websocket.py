from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()


@router.websocket("/leaderboard")
async def leaderboard_socket(websocket: WebSocket):
    manager = websocket.app.state.ws_manager
    repository = websocket.app.state.repository
    room = "leaderboard"
    await manager.connect(room, websocket)
    await websocket.send_json(
        {
            "event": "snapshot",
            "leaderboard": repository.list_leaderboard().model_dump(mode="json"),
        }
    )
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(room, websocket)


@router.websocket("/submissions/{submission_id}")
async def submission_socket(websocket: WebSocket, submission_id: str):
    manager = websocket.app.state.ws_manager
    repository = websocket.app.state.repository
    room = f"submission:{submission_id}"
    await manager.connect(room, websocket)
    detail = repository.get_submission_detail(submission_id)
    await websocket.send_json(
        {
            "event": "snapshot",
            "submission": detail.model_dump(mode="json") if detail else None,
        }
    )
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(room, websocket)
