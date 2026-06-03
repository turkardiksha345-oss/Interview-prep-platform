import { useEffect, useState } from "react";
import { Award, Flame, Target, Trophy } from "lucide-react";
import { api } from "../api/client";

type Stats = { solved: number; attempted: number; streak_days: number; badges: string[]; leaderboard_rank: number };

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({ solved: 0, attempted: 0, streak_days: 0, badges: [], leaderboard_rank: 0 });

  useEffect(() => {
    api.get("/dashboard").then((res) => setStats(res.data)).catch(() => undefined);
  }, []);

  return (
    <section className="page-enter">
      <header className="page-header hero-strip">
        <div>
          <span className="eyebrow">Placement command center</span>
          <h1>Preparation Dashboard</h1>
          <p>Track coding, interviews, resume readiness, streaks, and rank from one operating view.</p>
        </div>
        <button className="primary">Start today's plan</button>
      </header>
      <div className="metric-grid">
        <article className="metric-card"><Target size={20} /><span>Solved</span><strong>{stats.solved}</strong><em>+3 this week</em></article>
        <article className="metric-card"><BarIcon /><span>Attempts</span><strong>{stats.attempted}</strong><em>accuracy improving</em></article>
        <article className="metric-card"><Flame size={20} /><span>Streak</span><strong>{stats.streak_days}d</strong><em>keep momentum</em></article>
        <article className="metric-card"><Trophy size={20} /><span>Rank</span><strong>#{stats.leaderboard_rank || "-"}</strong><em>leaderboard</em></article>
      </div>
      <div className="dashboard-grid">
        <div className="panel progress-panel">
          <h2>Roadmap Progress</h2>
          {["Arrays and Hashing", "Dynamic Programming", "System Design", "Behavioral Stories"].map((item, index) => (
            <div className="progress-row" key={item}>
              <span>{item}</span>
              <div className="progress-track"><i style={{ width: `${72 - index * 13}%` }} /></div>
            </div>
          ))}
        </div>
        <div className="panel">
          <h2>Badges</h2>
          <div className="badges">
            {(stats.badges.length ? stats.badges : ["First Solve", "Resume Ready", "Mock Interview"]).map((b) => (
              <span key={b}><Award size={15} />{b}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BarIcon() {
  return <span className="bar-icon"><i /><i /><i /></span>;
}
