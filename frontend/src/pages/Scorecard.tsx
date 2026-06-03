import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { CheckCircle2, Medal, Sparkles, TrendingUp } from "lucide-react";
import { api } from "../api/client";

type Submission = {
  id: number;
  question_id: number;
  language: string;
  status: string;
  score: number;
  feedback: string;
  created_at: string;
};

type ScorecardData = {
  total_submissions: number;
  solved: number;
  average_score: number;
  best_score: number;
  accuracy: number;
  latest_submissions: Submission[];
  recommendations: string[];
};

type ScoreRingStyle = CSSProperties & {
  "--score": string;
};

export function Scorecard() {
  const [data, setData] = useState<ScorecardData>({
    total_submissions: 0,
    solved: 0,
    average_score: 0,
    best_score: 0,
    accuracy: 0,
    latest_submissions: [],
    recommendations: []
  });

  useEffect(() => {
    api.get("/scorecard").then((res) => setData(res.data)).catch(() => undefined);
  }, []);

  return (
    <section className="page-enter">
      <header className="page-header hero-strip">
        <div>
          <span className="eyebrow">Performance report</span>
          <h1>Scorecard</h1>
          <p>Your solved count, submission quality, recent feedback, and next best actions after practice.</p>
        </div>
        <div className="score-ring" style={{ "--score": `${data.average_score}%` } as ScoreRingStyle}>
          <strong>{data.average_score}</strong>
          <span>avg</span>
        </div>
      </header>

      <div className="metric-grid">
        <article className="metric-card"><Medal size={20} /><span>Solved</span><strong>{data.solved}</strong><em>accepted submissions</em></article>
        <article className="metric-card"><TrendingUp size={20} /><span>Accuracy</span><strong>{data.accuracy}%</strong><em>accepted ratio</em></article>
        <article className="metric-card"><Sparkles size={20} /><span>Best score</span><strong>{data.best_score}</strong><em>personal best</em></article>
        <article className="metric-card"><CheckCircle2 size={20} /><span>Total</span><strong>{data.total_submissions}</strong><em>submissions</em></article>
      </div>

      <div className="split-grid">
        <div className="panel">
          <h2>Recent submissions</h2>
          <div className="submission-table">
            {data.latest_submissions.length ? data.latest_submissions.map((item) => (
              <div className="submission-row" key={item.id}>
                <span>Question #{item.question_id}</span>
                <strong>{item.score}</strong>
                <em className={item.status}>{item.status}</em>
                <p>{item.feedback || "No feedback recorded."}</p>
              </div>
            )) : <p>No submissions yet. Solve a practice problem to generate your scorecard.</p>}
          </div>
        </div>
        <div className="panel recommendations">
          <h2>Next actions</h2>
          {(data.recommendations.length ? data.recommendations : ["Submit your first solution to unlock recommendations."]).map((item) => (
            <p key={item}><Sparkles size={16} />{item}</p>
          ))}
          <div className="score-tips">
            <h3>Try this next</h3>
            <ul>
              <li>Complete a new coding test in <strong>Practice</strong>.</li>
              <li>Record one answer in <strong>Mock interviews</strong>.</li>
              <li>Optimize your resume in <strong>Resume analyzer</strong>.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
