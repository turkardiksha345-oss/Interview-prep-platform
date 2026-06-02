# API Documentation

Base URL: `/api/v1`

Interactive OpenAPI documentation is available at `/docs` when the FastAPI service is running.

## Authentication

### POST `/auth/signup`
Creates a student account.

Request:
```json
{ "email": "demo@example.com", "full_name": "Demo User", "password": "Password123" }
```

### POST `/auth/login`
Returns a JWT bearer token.

Request:
```json
{ "email": "demo@example.com", "password": "Password123" }
```

### POST `/auth/forgot-password`
Starts a reset flow. The current implementation is a secure placeholder that does not reveal whether an account exists.

## User

### GET `/me`
Returns the authenticated user profile.

## Coding Practice

### GET `/questions?difficulty=easy`
Lists coding questions. Difficulty is optional and accepts `easy`, `medium`, or `hard`.

### POST `/submissions`
Submits code for tracking and scoring.

Request:
```json
{ "question_id": 1, "language": "python", "code": "def solve(): return 1" }
```

### GET `/submissions`
Returns authenticated user's submissions.

## Mock Interviews

### POST `/mock-interviews`
Runs a mock interview scoring pass.

Request:
```json
{ "interview_type": "technical", "prompt": "I clarify constraints and explain complexity." }
```

## Resume Analyzer

### POST `/resume/analyze`
Scores a resume for ATS alignment.

Request:
```json
{ "resume_text": "Python React AWS Docker Kubernetes SQL...", "target_role": "Software Engineer" }
```

## Roadmaps

### GET `/roadmaps?company=Google`
Lists company-wise preparation roadmaps.

## Progress

### GET `/dashboard`
Returns solved count, attempt count, streaks, badges, and leaderboard rank.

### GET `/leaderboard`
Returns top users by solved submissions.

## Admin

Admin endpoints require a user with `role = admin`.

### POST `/admin/questions`
Creates coding questions.

### GET `/admin/analytics`
Returns platform-level counts for users, questions, and submissions.
