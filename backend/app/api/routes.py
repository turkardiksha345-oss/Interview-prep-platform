from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc, func, select
from sqlalchemy.orm import Session

from app.api.deps import current_user, require_admin
from app.core.security import create_access_token, hash_password, verify_password
from app.db.session import get_db
from app.models.domain import MockInterview, Question, ResumeAnalysis, Roadmap, Submission, User
from app.schemas.domain import (
    DashboardStats,
    MockInterviewCreate,
    MockInterviewRead,
    QuestionCreate,
    QuestionRead,
    ResumeAnalyzeRequest,
    ResumeAnalyzeResponse,
    SubmissionCreate,
    SubmissionRead,
    Token,
    UserCreate,
    UserLogin,
    UserRead,
)
from app.services.interview import score_mock_interview
from app.services.resume import analyze_resume

router = APIRouter()


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/auth/signup", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def signup(payload: UserCreate, db: Session = Depends(get_db)) -> User:
    if db.scalar(select(User).where(User.email == payload.email)):
        raise HTTPException(status_code=409, detail="Email already registered")
    user = User(email=payload.email, full_name=payload.full_name, password_hash=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/auth/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)) -> Token:
    user = db.scalar(select(User).where(User.email == payload.email))
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return Token(access_token=create_access_token(user.email))


@router.post("/auth/forgot-password")
def forgot_password(payload: dict[str, str]) -> dict[str, str]:
    return {"message": "If the account exists, a reset link will be sent."}


@router.get("/me", response_model=UserRead)
def me(user: User = Depends(current_user)) -> User:
    return user


@router.get("/questions", response_model=list[QuestionRead])
def questions(difficulty: str | None = None, db: Session = Depends(get_db)) -> list[Question]:
    stmt = select(Question).order_by(Question.id)
    if difficulty:
        stmt = stmt.where(Question.difficulty == difficulty)
    return list(db.scalars(stmt).all())


@router.post("/admin/questions", response_model=QuestionRead, status_code=201)
def create_question(payload: QuestionCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)) -> Question:
    question = Question(**payload.model_dump())
    db.add(question)
    db.commit()
    db.refresh(question)
    return question


@router.post("/submissions", response_model=SubmissionRead, status_code=201)
def submit_code(payload: SubmissionCreate, db: Session = Depends(get_db), user: User = Depends(current_user)) -> Submission:
    question = db.get(Question, payload.question_id)
    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    status_value = "accepted" if "return" in payload.code or "print" in payload.code else "needs_review"
    submission = Submission(
        user_id=user.id,
        question_id=payload.question_id,
        language=payload.language,
        code=payload.code,
        status=status_value,
        score=100 if status_value == "accepted" else 40,
    )
    db.add(submission)
    user.streak_days = max(user.streak_days, 1)
    db.commit()
    db.refresh(submission)
    return submission


@router.get("/submissions", response_model=list[SubmissionRead])
def my_submissions(db: Session = Depends(get_db), user: User = Depends(current_user)) -> list[Submission]:
    return list(db.scalars(select(Submission).where(Submission.user_id == user.id).order_by(desc(Submission.created_at))).all())


@router.post("/mock-interviews", response_model=MockInterviewRead, status_code=201)
def mock_interview(payload: MockInterviewCreate, db: Session = Depends(get_db), user: User = Depends(current_user)) -> MockInterview:
    score, feedback = score_mock_interview(payload.interview_type, payload.prompt)
    interview = MockInterview(user_id=user.id, interview_type=payload.interview_type, transcript=payload.prompt, feedback=feedback, score=score)
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return interview


@router.post("/resume/analyze", response_model=ResumeAnalyzeResponse)
def resume_analyze(payload: ResumeAnalyzeRequest, db: Session = Depends(get_db), user: User = Depends(current_user)) -> ResumeAnalyzeResponse:
    score, findings = analyze_resume(payload.resume_text, payload.target_role)
    db.add(ResumeAnalysis(user_id=user.id, ats_score=score, findings="\n".join(findings)))
    db.commit()
    return ResumeAnalyzeResponse(ats_score=score, findings=findings)


@router.get("/roadmaps")
def roadmaps(company: str | None = None, db: Session = Depends(get_db)) -> list[dict[str, object]]:
    stmt = select(Roadmap)
    if company:
        stmt = stmt.where(Roadmap.company.ilike(f"%{company}%"))
    items = db.scalars(stmt).all()
    return [{"company": r.company, "level": r.level, "steps": r.steps.splitlines()} for r in items]


@router.get("/dashboard", response_model=DashboardStats)
def dashboard(db: Session = Depends(get_db), user: User = Depends(current_user)) -> DashboardStats:
    attempted = db.scalar(select(func.count(Submission.id)).where(Submission.user_id == user.id)) or 0
    solved = db.scalar(select(func.count(Submission.id)).where(Submission.user_id == user.id, Submission.status == "accepted")) or 0
    badges = ["First Solve"] if solved else []
    if user.streak_days >= 7:
        badges.append("Weekly Streak")
    return DashboardStats(solved=solved, attempted=attempted, streak_days=user.streak_days, badges=badges, leaderboard_rank=12)


@router.get("/leaderboard")
def leaderboard(db: Session = Depends(get_db)) -> list[dict[str, object]]:
    rows = db.execute(
        select(User.full_name, func.count(Submission.id).label("solved"))
        .join(Submission, Submission.user_id == User.id, isouter=True)
        .group_by(User.id)
        .order_by(desc("solved"))
        .limit(25)
    )
    return [{"name": name, "solved": solved} for name, solved in rows]


@router.get("/admin/analytics")
def admin_analytics(db: Session = Depends(get_db), _: User = Depends(require_admin)) -> dict[str, int]:
    return {
        "users": db.scalar(select(func.count(User.id))) or 0,
        "questions": db.scalar(select(func.count(Question.id))) or 0,
        "submissions": db.scalar(select(func.count(Submission.id))) or 0,
    }
