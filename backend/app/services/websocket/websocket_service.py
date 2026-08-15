import json
from typing import Any

from fastapi import WebSocket


class WebSocketService:

    def __init__(self):
        self.connections: set[WebSocket] = set()

    async def connect(
        self,
        websocket: WebSocket,
    ) -> None:

        await websocket.accept()

        self.connections.add(websocket)

    def disconnect(
        self,
        websocket: WebSocket,
    ) -> None:

        self.connections.discard(websocket)

    async def broadcast(
        self,
        event: str,
        payload: dict[str, Any],
    ) -> None:

        message = {
            "event": event,
            **payload,
        }

        disconnected = []

        for websocket in self.connections:

            try:
                await websocket.send_text(
                    json.dumps(message)
                )

            except Exception:
                disconnected.append(
                    websocket
                )

        for websocket in disconnected:
            self.disconnect(websocket)