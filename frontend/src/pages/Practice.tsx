import { FormEvent, useEffect, useState } from "react";
import { Play, RotateCcw, Send } from "lucide-react";
import { api } from "../api/client";

type Question = { id: number; title: string; difficulty: string; category: string; prompt: string; starter_code: string };

export function Practice() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [active, setActive] = useState<Question | null>(null);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get("/questions").then((res) => {
      setQuestions(res.data);
      setActive(res.data[0] ?? null);
      setCode(res.data[0]?.starter_code ?? "");
    });
  }, []);

  function choose(question: Question) {
    setActive(question);
    setCode(question.starter_code);
    setStatus("");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!active) return;
    const { data } = await api.post("/submissions", { question_id: active.id, language: "python", code });
    setStatus(`${data.status} - score ${data.score}`);
  }

  return (
    <section className="page-enter">
      <header className="page-header"><span className="eyebrow">Code lab</span><h1>Coding Practice</h1><p>Question bank, editor, and submission history hooks.</p></header>
      <div className="practice-layout">
        <div className="question-list">
          <div className="list-title">Problem set</div>
          {questions.map((q) => <button key={q.id} onClick={() => choose(q)} className={active?.id === q.id ? "selected" : ""}><span>{q.title}</span><small>{q.difficulty} / {q.category}</small></button>)}
        </div>
        <form className="editor-panel" onSubmit={submit}>
          <div className="editor-header">
            <div>
              <h2>{active?.title ?? "No questions loaded"}</h2>
              <p>{active?.prompt}</p>
            </div>
            <span className={`difficulty ${active?.difficulty ?? "easy"}`}>{active?.difficulty ?? "easy"}</span>
          </div>
          <div className="editor-tabs"><span className="active">solution.py</span><span>submissions</span><span>notes</span></div>
          <textarea value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false} />
          <div className="toolbar">
            <button className="secondary" type="button"><Play size={16} />Run</button>
            <button className="secondary" type="button" onClick={() => active && setCode(active.starter_code)}><RotateCcw size={16} />Reset</button>
            <button className="primary" type="submit"><Send size={16} />Submit</button>
            <span className="status-pill">{status}</span>
          </div>
        </form>
      </div>
    </section>
  );
}
