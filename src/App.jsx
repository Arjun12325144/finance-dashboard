import React, { useState, useEffect } from "react";
import useStore from "./store/useStore";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import Insights from "./components/Insights";
import TransactionModal from "./components/TransactionModal";
import TickerBar from "./components/TickerBar";
import { Menu, Bell, Shield, Eye } from "lucide-react";

export default function App() {
  const { darkMode, activePage, role, modal } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const now = new Date();
  const h = now.getHours();
  const greet = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";

  return (
    <>
      <TickerBar />
      <div className="app">
        <div className={`sb-backdrop ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="main">
          <div className="topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button className="mobile-toggle btn" onClick={() => setSidebarOpen(true)} style={{ display: "none" }}>
                <Menu size={16} />
              </button>
              <div>
                <div className="topbar-greeting">{greet}, <strong>Alex</strong> 👋</div>
                <div className="topbar-date">{now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
              </div>
            </div>
            <div className="topbar-right">
              <div className="role-status" style={{ marginRight: 6 }}>
                <span className={`role-dot ${role}`} />
                <span style={{ fontSize: 12, color: "var(--c-text-2)", fontWeight: 600 }}>
                  {role === "admin" ? "Admin" : "Viewer"}
                </span>
              </div>
              <button className="btn btn-ghost btn-icon" title="Notifications"><Bell size={15} /></button>
            </div>
          </div>

          {activePage === "dashboard"    && <Dashboard />}
          {activePage === "transactions" && <Transactions />}
          {activePage === "insights"     && <Insights />}
        </main>
      </div>
      {modal && <TransactionModal />}
    </>
  );
}
