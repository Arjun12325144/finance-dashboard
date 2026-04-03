import React, { useMemo } from "react";
import useStore from "../store/useStore";
import StatCards from "./StatCards";
import { BalanceTrendChart, SpendingPieChart } from "./Charts";
import { getSummary, getMonthlyData, getCategoryBreakdown, formatCurrency, formatDate } from "../utils/helpers";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "../data/transactions";

export default function Dashboard() {
  const { transactions } = useStore();
  const summary   = useMemo(() => getSummary(transactions), [transactions]);
  const monthly   = useMemo(() => getMonthlyData(transactions), [transactions]);
  const categories= useMemo(() => getCategoryBreakdown(transactions), [transactions]);
  const recent    = transactions.slice(0, 6);

  const now = new Date();

  return (
    <div>
      {/* Masthead */}
      <div className="masthead">
        <div className="masthead-left">
          <h1>Financial <i>Report</i></h1>
          <div className="masthead-meta">
            <span>{now.toLocaleDateString("en-US",{month:"long",year:"numeric"})}</span>
            <span>{transactions.length} transactions on record</span>
          </div>
        </div>
        <div className="masthead-actions">
          <span style={{ fontSize:11, fontFamily:"IBM Plex Mono,monospace", color:"var(--ink-3)", letterSpacing:1 }}>
            LAST UPDATED {now.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}
          </span>
        </div>
      </div>

      {/* Stats */}
      <StatCards summary={summary} />

      {/* Main content grid */}
      <div className="dashboard-grid">
        {/* Chart - left panel */}
        <div className="grid-panel">
          <div className="panel-header">
            <div>
              <div className="panel-label">Cash Flow</div>
              <div className="panel-title">Income vs. Expenses</div>
            </div>
            <div style={{ display:"flex", gap:16, fontSize:11, fontFamily:"IBM Plex Mono,monospace", color:"var(--ink-3)" }}>
              <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ width:16, height:1, background:"var(--green)", display:"inline-block" }}/>Income
              </span>
              <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ width:16, height:1, background:"var(--red)", display:"inline-block" }}/>Expenses
              </span>
            </div>
          </div>
          <BalanceTrendChart data={monthly} />
        </div>

        {/* Pie - right panel */}
        <div className="grid-panel" style={{ borderLeft:"1px solid var(--rule-heavy)" }}>
          <div className="panel-header">
            <div>
              <div className="panel-label">Allocation</div>
              <div className="panel-title">Spending Mix</div>
            </div>
          </div>
          <SpendingPieChart data={categories} />
        </div>

        {/* Recent transactions */}
        <div className="grid-panel" style={{ borderTop:"1px solid var(--rule-heavy)" }}>
          <div className="panel-header">
            <div>
              <div className="panel-label">Activity</div>
              <div className="panel-title">Recent Transactions</div>
            </div>
          </div>
          {recent.map((t, i) => (
            <div key={t.id} className="recent-row" style={{ animationDelay:`${i*.04}s` }}>
              <div className="recent-icon">{CATEGORY_ICONS[t.category] || "📦"}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div className="recent-desc">{t.description}</div>
                <div className="recent-cat">{t.category} · {formatDate(t.date)}</div>
              </div>
              <div className={`recent-amount ${t.type}`}>
                {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
              </div>
            </div>
          ))}
        </div>

        {/* Category breakdown */}
        <div className="grid-panel" style={{ borderTop:"1px solid var(--rule-heavy)", borderLeft:"1px solid var(--rule-heavy)" }}>
          <div className="panel-header">
            <div>
              <div className="panel-label">Breakdown</div>
              <div className="panel-title">Top Categories</div>
            </div>
          </div>
          {categories.slice(0,7).map(cat => (
            <div key={cat.category} className="cat-entry">
              <div className="cat-entry-top">
                <span className="cat-entry-name">
                  <span>{CATEGORY_ICONS[cat.category]}</span>
                  {cat.category}
                </span>
                <span className="cat-entry-amount">{formatCurrency(cat.amount)}</span>
              </div>
              <div className="cat-track">
                <div className="cat-fill" style={{ width:`${cat.percentage}%`, background:CATEGORY_COLORS[cat.category]||"var(--gold)" }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
