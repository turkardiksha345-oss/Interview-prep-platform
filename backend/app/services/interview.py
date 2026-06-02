from app.models.domain import InterviewType


def score_mock_interview(interview_type: InterviewType, prompt: str) -> tuple[int, str]:
    keywords = ["tradeoff", "complexity", "example", "metric", "failure", "ownership"]
    hits = sum(1 for word in keywords if word in prompt.lower())
    base = {"hr": 70, "technical": 65, "system_design": 60}[interview_type.value]
    score = min(98, base + hits * 5)
    feedback = (
        "Strong structured answer. Improve by adding measurable impact, edge cases, "
        "and a crisp closing summary."
    )
    return score, feedback
