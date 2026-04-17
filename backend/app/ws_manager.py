from __future__ import annotations

from collections import defaultdict
from typing import Any

from fastapi import WebSocket


class WebSocketManager:
    def __init__(self) -> None:
        self._rooms: dict[str, set[WebSocket]] = defaultdict(set)

    async def connect(self, room: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self._rooms[room].add(websocket)

    def disconnect(self, room: str, websocket: WebSocket) -> None:
        room_clients = self._rooms.get(room)
        if not room_clients:
            return
        room_clients.discard(websocket)
        if not room_clients:
            self._rooms.pop(room, None)

    async def broadcast(self, room: str, payload: dict[str, Any]) -> None:
        stale: list[WebSocket] = []
        for websocket in self._rooms.get(room, set()):
            try:
                await websocket.send_json(payload)
            except Exception:
                stale.append(websocket)
        for websocket in stale:
            self.disconnect(room, websocket)

    async def broadcast_many(self, messages: list[tuple[str, dict[str, Any]]]) -> None:
        for room, payload in messages:
            await self.broadcast(room, payload)
