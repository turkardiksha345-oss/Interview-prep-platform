import { useEffect, useState } from "react";
import { api } from "../api/client";

export function Admin() {
  const [analytics, setAnalytics] = useState<Record<string, number>>({});

  useEffect(() => {
    api.get("/admin/analytics").then((res) => setAnalytics(res.data)).catch(() => undefined);
  }, []);

  return (
    <section>
      <header className="page-header"><h1>Admin Panel</h1><p>Manage users, question inventory, and platform analytics.</p></header>
      <div className="metric-grid">
        {["users", "questions", "submissions"].map((key) => <article key={key}><span>{key}</span><strong>{analytics[key] ?? "-"}</strong></article>)}
      </div>
    </section>
  );
}
