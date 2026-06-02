import { FormEvent, useState } from "react";
import { api } from "../api/client";

export function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [findings, setFindings] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const { data } = await api.post("/resume/analyze", { resume_text: resumeText, target_role: "Software Engineer" });
    setScore(data.ats_score);
    setFindings(data.findings);
  }

  return (
    <section>
      <header className="page-header"><h1>Resume Analyzer</h1><p>ATS scoring and role-aligned feedback for interview shortlisting.</p></header>
      <form className="panel" onSubmit={submit}>
        <textarea placeholder="Paste resume text" value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
        <button className="primary">Analyze</button>
      </form>
      {score !== null && <div className="panel"><h2>ATS Score: {score}</h2>{findings.map((f) => <p key={f}>{f}</p>)}</div>}
    </section>
  );
}
