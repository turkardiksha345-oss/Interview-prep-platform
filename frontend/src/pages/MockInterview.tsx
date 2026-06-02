import { FormEvent, useState } from "react";
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
    <section>
      <header className="page-header"><h1>AI Mock Interviews</h1><p>Practice HR, technical, and system design answers with immediate scoring.</p></header>
      <form className="panel" onSubmit={submit}>
        <select value={interviewType} onChange={(e) => setInterviewType(e.target.value)}>
          <option value="hr">HR</option>
          <option value="technical">Technical</option>
          <option value="system_design">System Design</option>
        </select>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <button className="primary">Evaluate</button>
        {result && <p className="result">{result}</p>}
      </form>
    </section>
  );
}
