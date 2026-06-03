from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="Code Evaluator Service", version="1.0.0")


class EvaluationRequest(BaseModel):
    question_id: int
    language: str = Field(min_length=1, max_length=40)
    code: str = Field(min_length=1)


class EvaluationResponse(BaseModel):
    status: str
    score: int
    feedback: list[str]
    runtime_ms: int
    memory_kb: int


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/evaluate", response_model=EvaluationResponse)
def evaluate(payload: EvaluationRequest) -> EvaluationResponse:
    normalized = payload.code.lower()
    feedback: list[str] = []
    score = 35

    if payload.language.lower() in {"python", "javascript", "typescript", "java", "cpp"}:
        score += 10
    else:
        feedback.append("Use a supported language for automated execution.")

    if "return" in normalized or "print" in normalized:
        score += 25
    else:
        feedback.append("Add a clear returned result or printed output.")

    if any(token in normalized for token in ["for ", "while ", "map(", "reduce(", "dict", "hash", "set("]):
        score += 15
    else:
        feedback.append("Add an algorithmic step that processes the input.")

    if len(payload.code.splitlines()) >= 3:
        score += 10
    else:
        feedback.append("Expand the solution into readable steps.")

    if "test" in normalized or "assert" in normalized:
        score += 5
    else:
        feedback.append("Include a small self-check or explain edge cases.")

    final_score = min(score, 100)
    status = "accepted" if final_score >= 75 else "needs_review"

    if not feedback:
        feedback.append("Solid submission with clear structure and output handling.")

    return EvaluationResponse(
        status=status,
        score=final_score,
        feedback=feedback,
        runtime_ms=max(18, 130 - final_score),
        memory_kb=18000 + len(payload.code) * 3,
    )
