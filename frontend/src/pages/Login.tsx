import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("Password123");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      if (mode === "signup") {
        await api.post("/auth/signup", { email, password, full_name: "Demo User" });
      }
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.access_token);
      navigate("/");
    } catch {
      setError("Authentication failed. Check credentials or create an account.");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-showcase">
        <div className="brand large"><span className="brand-mark"><Sparkles size={22} /></span><div><strong>PrepForge</strong><small>Interview OS</small></div></div>
        <h1>Practice, analyze, and ship your interview prep in one place.</h1>
        <div className="auth-checks">
          {["Coding tracker", "AI mock interviews", "ATS resume insights"].map((item) => <span key={item}><CheckCircle2 size={16} />{item}</span>)}
        </div>
      </section>
      <form className="auth-panel" onSubmit={submit}>
        <h2>{mode === "login" ? "Welcome back" : "Create your workspace"}</h2>
        <div className="segmented">
          <button type="button" className={mode === "login" ? "selected" : ""} onClick={() => setMode("login")}>Login</button>
          <button type="button" className={mode === "signup" ? "selected" : ""} onClick={() => setMode("signup")}>Signup</button>
        </div>
        <label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {error && <p className="error">{error}</p>}
        <button className="primary" type="submit">{mode === "login" ? "Login" : "Create account"}<ArrowRight size={16} /></button>
      </form>
    </main>
  );
}
