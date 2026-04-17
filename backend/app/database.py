from datetime import datetime
from fastapi import WebSocket

subscriptions = []
leaderboard_data = [
    {
        "rank": 1,
        "model_id": "polaris-alpha",
        "model_name": "POLARIS Alpha",
        "theta": 2.13,
        "se": 0.14,
        "confidence_interval": [1.86, 2.40],
        "domains": {
            "math": 2.18,
            "code": 2.05,
            "reasoning": 2.23,
            "chinese": 2.10,
            "knowledge": 2.07,
            "multilingual": 2.00,
        },
        "source_type": "api",
        "size_category": ">70B",
        "updated_at": "2026-04-17T08:00:00Z",
    },
]
model_profiles = {
    "polaris-alpha": {
        "model_id": "polaris-alpha",
        "model_name": "POLARIS Alpha",
        "version": "2026-04-17",
        "institution": "Polaris Labs",
        "size_category": ">70B",
        "source_type": "api",
        "hf_link": "https://huggingface.co/polaris-alpha",
        "domain_scores": {
            "math": {"theta": 2.18, "se": 0.12},
            "code": {"theta": 2.05, "se": 0.15},
            "reasoning": {"theta": 2.23, "se": 0.13},
            "chinese": {"theta": 2.10, "se": 0.14},
            "knowledge": {"theta": 2.07, "se": 0.16},
            "multilingual": {"theta": 2.00, "se": 0.18},
        },
        "history": [
            {"version": "2026-01-01", "theta": 1.88},
            {"version": "2026-03-01", "theta": 2.05},
            {"version": "2026-04-17", "theta": 2.13},
        ],
    }
}
active_websockets: list[WebSocket] = []


def get_leaderboard():
    return leaderboard_data


def get_model_profile(model_id: str):
    return model_profiles.get(model_id, {"error": "Model not found"})


def list_submissions():
    return subscriptions


def create_submission(payload: dict):
    submission = {
        "submission_id": f"sub_{len(subscriptions)+1}",
        "created_at": datetime.utcnow().isoformat() + "Z",
        "status": "queued",
        **payload,
    }
    subscriptions.append(submission)
    return submission


def test_connection(payload: dict) -> tuple[bool, str]:
    if payload.get("source_type") == "api" and not payload.get("endpoint"):
        return False, "API endpoint is required for remote submissions."
    return True, "Connection verified (simulated)."

async def register_websocket(websocket: WebSocket):
    active_websockets.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except Exception:
        active_websockets.remove(websocket)
