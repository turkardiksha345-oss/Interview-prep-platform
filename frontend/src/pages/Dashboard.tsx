import { useEffect, useState } from "react";
import { api } from "../api/client";

type Stats = { solved: number; attempted: number; streak_days: number; badges: string[]; leaderboard_rank: number };

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({ solved: 0, attempted: 0, streak_days: 0, badges: [], leaderboard_rank: 0 });

  useEffect(() => {
    api.get("/dashboard").then((res) => setStats(res.data)).catch(() => undefined);
  }, []);

  return (
    <section>
      <header className="page-header">
        <h1>Preparation Dashboard</h1>
        <p>Track coding, interviews, resume readiness, streaks, and rank from one operating view.</p>
      </header>
      <div className="metric-grid">
        <article><span>Solved</span><strong>{stats.solved}</strong></article>
        <article><span>Attempts</span><strong>{stats.attempted}</strong></article>
        <article><span>Streak</span><strong>{stats.streak_days}d</strong></article>
        <article><span>Rank</span><strong>#{stats.leaderboard_rank || "-"}</strong></article>
      </div>
      <div className="panel">
        <h2>Badges</h2>
        <div className="badges">{stats.badges.length ? stats.badges.map((b) => <span key={b}>{b}</span>) : <span>Start solving to unlock badges</span>}</div>
      </div>
    </section>
  );
}
