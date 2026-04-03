import React from "react";
import { Sun, Moon, Bell, Plus } from "lucide-react";
import useStore from "../store/useStore";

const LINKS = [
  { id: "dashboard",    label: "Overview" },
  { id: "transactions", label: "Transactions" },
  { id: "insights",     label: "Insights" },
];

export default function Topnav() {
  const { activePage, setActivePage, darkMode, toggleDarkMode, role, setRole, openModal } = useStore();

  return (
    <nav className="topnav">
      <div className="nav-brand">
        <span className="nav-brand-name">Ledger</span>
        <span className="nav-brand-tag">Personal Finance</span>
      </div>

      <div className="nav-links">
        {LINKS.map(l => (
          <div
            key={l.id}
            className={`nav-link ${activePage === l.id ? "active" : ""}`}
            onClick={() => setActivePage(l.id)}
          >
            {l.label}
          </div>
        ))}
      </div>

      <div className="nav-right">
        <div className="role-pill">
          <span style={{ color: "var(--ink-3)", fontSize: 10 }}>ROLE</span>
          <select
            className="role-select-inline"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        <button className="nav-btn" onClick={toggleDarkMode} title="Toggle theme">
          {darkMode ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {role === "admin" && (
          <button className="nav-btn filled" onClick={() => openModal({ type: "add" })}>
            <Plus size={13} /> New
          </button>
        )}
      </div>
    </nav>
  );
}
