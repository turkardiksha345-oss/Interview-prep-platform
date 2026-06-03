import httpx

from app.core.config import get_settings


def evaluate_submission(question_id: int, language: str, code: str) -> dict[str, object]:
    payload = {"question_id": question_id, "language": language, "code": code}
    try:
        response = httpx.post(f"{get_settings().evaluator_url}/evaluate", json=payload, timeout=6)
        response.raise_for_status()
        return response.json()
    except httpx.HTTPError:
        fallback_score = 70 if "return" in code.lower() or "print" in code.lower() else 42
        return {
            "status": "accepted" if fallback_score >= 75 else "needs_review",
            "score": fallback_score,
            "feedback": ["Evaluator service unavailable. Stored a fallback review score."],
            "runtime_ms": 0,
            "memory_kb": 0,
        }
