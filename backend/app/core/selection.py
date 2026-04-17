from typing import Any
from app.core.irt import fisher_information


def select_next_item(theta: float, item_pool: list[dict], exposure_counts: dict[str, int], max_exposure: int = 20) -> dict[str, Any]:
    candidates = []
    for item in item_pool:
        exposure = exposure_counts.get(item["item_id"], 0)
        if exposure >= max_exposure:
            continue
        info = fisher_information(theta, item["a"], item["b"])
        score = info * (1.0 - exposure / max_exposure)
        candidates.append((score, item))
    if not candidates:
        return item_pool[0]
    return max(candidates, key=lambda pair: pair[0])[1]
