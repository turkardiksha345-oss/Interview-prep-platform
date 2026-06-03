import { FormEvent, useState } from "react";
import { BrainCircuit, Mic, Sparkles, ShieldCheck, Clock3 } from "lucide-react";
import { api } from "../api/client";

const features = [
  { title: "Instant scoring", description: "Receive a score and improvement guidance right away.", icon: ShieldCheck },
  { title: "Answer clarity", description: "Practice structure, examples, and storytelling for interviews.", icon: BrainCircuit },
  { title: "Time management", description: "Train with a prompt and simulate actual interview pacing.", icon: Clock3 },
];

export function MockInterview() {
  const [interviewType, setInterviewType] = useState("technical");
  const [prompt, setPrompt] = useState("I would solve this by clarifying constraints, explaining complexity, and testing edge cases.");
  const [result, setResult] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    const { data } = await api.post("/mock-interviews", { interview_type: interviewType, prompt });
    setResult(`${data.score}/100 — ${data.feedback}`);
  }

  return (
    <section className="page-enter">
      <header className="page-header">
        <span className="eyebrow">Interview studio</span>
        <h1>AI Mock Interviews</h1>
        <p>Practice HR, technical, and system design answers with immediate scoring and coaching.</p>
      </header>
      <div className="feature-grid">
        {features.map(({ title, description, icon: Icon }) => (
          <article key={title} className="feature-card">
            <div className="feature-mark"><Icon size={18} /></div>
            <div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="split-grid interview-grid">
        <form className="panel studio-panel" onSubmit={submit}>
          <div className="panel-title"><BrainCircuit size={20} /><h2>Session setup</h2></div>
          <label>
            Interview type
            <select value={interviewType} onChange={(e) => setInterviewType(e.target.value)}>
              <option value="hr">HR</option>
              <option value="technical">Technical</option>
              <option value="system_design">System Design</option>
            </select>
          </label>
          <label>
            Your answer
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </label>
          <button className="primary"><Mic size={16} />Evaluate answer</button>
        </form>
        <aside className="panel insight-panel">
          <div className="score-orb"><Sparkles size={22} /></div>
          <h2>Feedback</h2>
          <p className="result">{result || "Submit an answer to receive a score, coaching notes, and improvement signals."}</p>
        </aside>
      </div>
    </section>
  );
}
