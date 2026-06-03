import { BarChart3, Bell, BrainCircuit, Code2, FileSearch, LogOut, Medal, Search, ShieldCheck, Sparkles } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/practice", label: "Practice", icon: Code2 },
  { to: "/scorecard", label: "Scorecard", icon: Medal },
  { to: "/interviews", label: "Mock Interviews", icon: BrainCircuit },
  { to: "/resume", label: "Resume", icon: FileSearch },
  { to: "/admin", label: "Admin", icon: ShieldCheck }
];

export function AppShell() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark"><Sparkles size={20} /></span>
          <div>
            <strong>PrepForge</strong>
            <small>Interview OS</small>
          </div>
        </div>
        <nav>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => (isActive ? "active" : "")}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-card">
          <span>Weekly focus</span>
          <strong>System design sprint</strong>
          <div className="mini-progress"><i /></div>
        </div>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <div className="searchbox">
            <Search size={17} />
            <span>Search questions, companies, resumes</span>
          </div>
          <button className="icon-button" aria-label="Notifications"><Bell size={18} /></button>
          <button className="icon-button" aria-label="Logout" onClick={logout}><LogOut size={18} /></button>
          <div className="avatar">DU</div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
