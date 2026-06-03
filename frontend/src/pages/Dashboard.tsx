import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Award, Flame, Target, Trophy, ArrowRight, Zap, BrainCircuit, FileSearch } from "lucide-react";
import { api } from "../api/client";

type Stats = { solved: number; attempted: number; streak_days: number; badges: string[]; leaderboard_rank: number };

type ServiceCard = { title: string; description: string; path: string; icon: typeof ArrowRight };

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({ solved: 0, attempted: 0, streak_days: 0, badges: [], leaderboard_rank: 0 });
  const navigate = useNavigate();

  const serviceCards: ServiceCard[] = [
    { title: "Practice tests", description: "Solve curated problems and instantly review your score.", path: "/practice", icon: Zap },
    { title: "Mock interviews", description: "Polish answers with AI scoring and coaching feedback.", path: "/interviews", icon: BrainCircuit },
    { title: "Resume analyzer", description: "Get ATS-ready resume suggestions and role alignment.", path: "/resume", icon: FileSearch },
    { title: "Performance review", description: "Track progress, streaks, and your personal readiness score.", path: "/scorecard", icon: Trophy },
  ];

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
      <div className="service-grid">
        {serviceCards.map(({ title, description, path, icon: Icon }) => (
          <button key={title} type="button" className="service-card" onClick={() => navigate(path)}>
            <div className="service-icon"><Icon size={20} /></div>
            <div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
            <ArrowRight size={18} />
          </button>
        ))}
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
