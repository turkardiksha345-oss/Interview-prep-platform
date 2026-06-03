import { useEffect, useState } from "react";
import { Activity, Database, ShieldCheck, Users } from "lucide-react";
import { api } from "../api/client";

export function Admin() {
  const [analytics, setAnalytics] = useState<Record<string, number>>({});

  useEffect(() => {
    api.get("/admin/analytics").then((res) => setAnalytics(res.data)).catch(() => undefined);
  }, []);

  return (
    <section className="page-enter">
      <header className="page-header">
        <span className="eyebrow">Operations</span>
        <h1>Admin Panel</h1>
        <p>Manage users, question inventory, and platform analytics.</p>
      </header>
      <div className="metric-grid">
        {[
          { key: "users", icon: Users },
          { key: "questions", icon: Database },
          { key: "submissions", icon: Activity }
        ].map(({ key, icon: Icon }) => (
          <article className="metric-card" key={key}>
            <Icon size={20} />
            <span>{key}</span>
            <strong>{analytics[key] ?? "-"}</strong>
            <em>live count</em>
          </article>
        ))}
        <article className="metric-card"><ShieldCheck size={20} /><span>security</span><strong>OK</strong><em>admin gated</em></article>
      </div>
      <div className="panel">
        <h2>Admin queue</h2>
        <div className="activity-list">
          <span>Review new question submissions</span>
          <span>Validate resume analyzer feedback quality</span>
          <span>Audit failed login spikes</span>
        </div>
      </div>
    </section>
  );
}
