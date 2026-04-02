import React from "react";
import useStore from "../store/useStore";
import { LayoutDashboard, ArrowLeftRight, Lightbulb, Moon, Sun, X } from "lucide-react";

const NAV = [
  { id: "dashboard",    label: "Overview",      icon: LayoutDashboard },
  { id: "transactions", label: "Transactions",   icon: ArrowLeftRight },
  { id: "insights",     label: "Insights",       icon: Lightbulb },
];

export default function Sidebar({ isOpen, onClose }) {
  const { activePage, setActivePage, darkMode, toggleDarkMode, role, setRole } = useStore();

  const go = (id) => { setActivePage(id); if (onClose) onClose(); };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sb-logo">
        <div className="sb-logo-icon">💎</div>
        <div>
          <div className="sb-logo-name">FinFlow</div>
          <div className="sb-logo-tag">Finance OS</div>
        </div>
        {isOpen && (
          <button className="btn btn-ghost btn-icon" style={{ marginLeft: "auto" }} onClick={onClose}>
            <X size={15} />
          </button>
        )}
      </div>

      <nav className="sb-nav">
        <div className="sb-section">Navigation</div>
        {NAV.map(({ id, label, icon: Icon }) => (
          <div key={id} className={`nav-item ${activePage === id ? "active" : ""}`} onClick={() => go(id)}>
            <Icon size={15} />
            {label}
            {activePage === id && <span className="nav-pip" />}
          </div>
        ))}

        <div className="sb-section" style={{ marginTop: 8 }}>Settings</div>
        <div className="nav-item" onClick={toggleDarkMode}>
          {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </div>
      </nav>

      <div className="sb-footer">
        <div className="role-box">
          <label>Active Role</label>
          <select className="role-select" value={role} onChange={e => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
          <div className="role-status">
            <span className={`role-dot ${role}`} />
            {role === "admin" ? "Full access · can edit" : "Read only · no edits"}
          </div>
        </div>
      </div>
    </aside>
  );
}
