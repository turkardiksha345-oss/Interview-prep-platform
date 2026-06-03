import { FormEvent, useState } from "react";
import { BrainCircuit, Mic, Sparkles } from "lucide-react";
import { api } from "../api/client";

export function MockInterview() {
  const [interviewType, setInterviewType] = useState("technical");
  const [prompt, setPrompt] = useState("I would solve this by clarifying constraints, explaining complexity, and testing edge cases.");
  const [result, setResult] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    const { data } = await api.post("/mock-interviews", { interview_type: interviewType, prompt });
    setResult(`${data.score}/100 - ${data.feedback}`);
  }

  return (
    <section className="page-enter">
      <header className="page-header">
        <span className="eyebrow">Interview studio</span>
        <h1>AI Mock Interviews</h1>
        <p>Practice HR, technical, and system design answers with immediate scoring.</p>
      </header>
      <div className="split-grid">
        <form className="panel studio-panel" onSubmit={submit}>
          <div className="panel-title"><BrainCircuit size={20} /><h2>Session setup</h2></div>
          <select value={interviewType} onChange={(e) => setInterviewType(e.target.value)}>
            <option value="hr">HR</option>
            <option value="technical">Technical</option>
            <option value="system_design">System Design</option>
          </select>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />
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
