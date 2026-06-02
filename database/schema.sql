CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(120) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(40) NOT NULL DEFAULT 'student',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  streak_days INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TYPE difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE interview_type AS ENUM ('hr', 'technical', 'system_design');

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  difficulty difficulty NOT NULL,
  category VARCHAR(80) NOT NULL,
  prompt TEXT NOT NULL,
  starter_code TEXT NOT NULL DEFAULT '',
  test_cases TEXT NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  question_id INTEGER NOT NULL REFERENCES questions(id),
  language VARCHAR(40) NOT NULL,
  code TEXT NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'queued',
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mock_interviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  interview_type interview_type NOT NULL,
  transcript TEXT NOT NULL DEFAULT '',
  feedback TEXT NOT NULL DEFAULT '',
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS resume_analyses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  ats_score INTEGER NOT NULL,
  findings TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mcq_tests (
  id SERIAL PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  topic VARCHAR(80) NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30
);

CREATE TABLE IF NOT EXISTS roadmaps (
  id SERIAL PRIMARY KEY,
  company VARCHAR(100) NOT NULL,
  level VARCHAR(60) NOT NULL DEFAULT 'SDE',
  steps TEXT NOT NULL,
  CONSTRAINT uq_roadmap_company_level UNIQUE (company, level)
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  channel VARCHAR(40) NOT NULL DEFAULT 'in_app',
  title VARCHAR(160) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_submissions_user_created ON submissions(user_id, created_at DESC);

INSERT INTO questions (title, slug, difficulty, category, prompt, starter_code)
VALUES
('Two Sum', 'two-sum', 'easy', 'arrays', 'Return indices of two numbers that add up to the target.', 'def two_sum(nums, target):\n    return []'),
('LRU Cache', 'lru-cache', 'medium', 'design', 'Design a least recently used cache with get and put.', 'class LRUCache:\n    pass'),
('Median of Two Sorted Arrays', 'median-two-arrays', 'hard', 'binary-search', 'Find the median of two sorted arrays in logarithmic time.', 'def find_median_sorted_arrays(a, b):\n    return 0')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO roadmaps (company, level, steps)
VALUES
('Google', 'SDE', 'Data structures foundations\nGraph and dynamic programming drills\nSystem design fundamentals\nBehavioral stories with impact metrics'),
('Amazon', 'SDE', 'Leadership principles mapping\nArrays, heaps, and trees\nHigh-scale distributed systems\nBar raiser mock interviews'),
('Microsoft', 'SDE', 'Problem solving patterns\nObject-oriented design\nCloud architecture on Azure or AWS\nCollaboration and product thinking')
ON CONFLICT ON CONSTRAINT uq_roadmap_company_level DO NOTHING;
