from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

from app.models.domain import Difficulty, InterviewType


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=120)
    password: str = Field(min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserRead(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    streak_days: int

    model_config = {"from_attributes": True}


class QuestionRead(BaseModel):
    id: int
    title: str
    slug: str
    difficulty: Difficulty
    category: str
    prompt: str
    starter_code: str

    model_config = {"from_attributes": True}


class QuestionCreate(BaseModel):
    title: str
    slug: str
    difficulty: Difficulty
    category: str
    prompt: str
    starter_code: str = ""
    test_cases: str = "[]"


class SubmissionCreate(BaseModel):
    question_id: int
    language: str
    code: str


class SubmissionRead(BaseModel):
    id: int
    question_id: int
    language: str
    status: str
    score: int
    feedback: str
    created_at: datetime

    model_config = {"from_attributes": True}


class MockInterviewCreate(BaseModel):
    interview_type: InterviewType
    prompt: str


class MockInterviewRead(BaseModel):
    id: int
    interview_type: InterviewType
    feedback: str
    score: int

    model_config = {"from_attributes": True}


class ResumeAnalyzeRequest(BaseModel):
    resume_text: str
    target_role: str = "Software Engineer"


class ResumeAnalyzeResponse(BaseModel):
    ats_score: int
    findings: list[str]


class DashboardStats(BaseModel):
    solved: int
    attempted: int
    streak_days: int
    badges: list[str]
    leaderboard_rank: int


class Scorecard(BaseModel):
    total_submissions: int
    solved: int
    average_score: float
    best_score: int
    accuracy: float
    latest_submissions: list[SubmissionRead]
    recommendations: list[str]
