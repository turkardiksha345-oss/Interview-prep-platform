import { FormEvent, useState } from "react";
import { FileSearch, UploadCloud } from "lucide-react";
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
    <section className="page-enter">
      <header className="page-header">
        <span className="eyebrow">Resume intelligence</span>
        <h1>Resume Analyzer</h1>
        <p>ATS scoring and role-aligned feedback for interview shortlisting.</p>
      </header>
      <div className="split-grid">
        <form className="panel" onSubmit={submit}>
          <div className="panel-title"><UploadCloud size={20} /><h2>Resume input</h2></div>
          <textarea placeholder="Paste resume text" value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
          <button className="primary"><FileSearch size={16} />Analyze resume</button>
        </form>
        <div className="panel ats-panel">
          <div className="ats-score">{score ?? "--"}<span>/100</span></div>
          <h2>ATS Score</h2>
          {(findings.length ? findings : ["Paste your resume to generate keyword, impact, and formatting recommendations."]).map((f) => <p key={f}>{f}</p>)}
        </div>
      </div>
    </section>
  );
}
