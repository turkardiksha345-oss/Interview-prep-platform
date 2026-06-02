import { BarChart3, BrainCircuit, Code2, FileSearch, ShieldCheck } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/practice", label: "Practice", icon: Code2 },
  { to: "/interviews", label: "Mock Interviews", icon: BrainCircuit },
  { to: "/resume", label: "Resume", icon: FileSearch },
  { to: "/admin", label: "Admin", icon: ShieldCheck }
];

export function AppShell() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">PrepForge</div>
        <nav>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => (isActive ? "active" : "")}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
