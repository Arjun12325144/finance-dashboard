import React, { useMemo } from "react";
import useStore from "../store/useStore";
import StatCards from "./StatCards";
import { BalanceTrendChart, SpendingPieChart } from "./Charts";
import { getSummary, getMonthlyData, getCategoryBreakdown, formatCurrency } from "../utils/helpers";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "../data/transactions";

export default function Dashboard() {
  const { transactions } = useStore();
  const summary = useMemo(() => getSummary(transactions), [transactions]);
  const monthly = useMemo(() => getMonthlyData(transactions), [transactions]);
  const categories = useMemo(() => getCategoryBreakdown(transactions), [transactions]);
  const recent = transactions.slice(0, 5);

  return (
    <div>
      <div className="page-heading">
        <h1>Financial <em>Overview</em></h1>
        <p>Your money at a glance · last 6 months</p>
      </div>

      <StatCards summary={summary} />

      <div className="charts-row">
        <BalanceTrendChart data={monthly} />
        <SpendingPieChart data={categories} />
      </div>

      <div className="bottom-row">
        <div className="card s5" style={{ animation: "slide-up .4s var(--ease) both" }}>
          <div className="card-head">
            <div>
              <div className="card-title">Recent Activity</div>
              <div className="card-sub">Last 5 transactions</div>
            </div>
          </div>
          {recent.map(t => (
            <div key={t.id} className="recent-item">
              <div className="recent-emoji">{CATEGORY_ICONS[t.category] || "📦"}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="recent-desc">{t.description}</div>
                <div className="recent-cat">{t.category}</div>
              </div>
              <div className={`recent-amt ${t.type}`} style={{ color: t.type === "income" ? "var(--c-green)" : "var(--c-red)" }}>
                {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
              </div>
            </div>
          ))}
        </div>

        <div className="card s6" style={{ animation: "slide-up .4s var(--ease) both" }}>
          <div className="card-head">
            <div>
              <div className="card-title">Top Spending</div>
              <div className="card-sub">By category</div>
            </div>
          </div>
          <div className="cat-list">
            {categories.slice(0, 6).map(cat => (
              <div key={cat.category}>
                <div className="cat-row">
                  <span className="cat-name">
                    <span>{CATEGORY_ICONS[cat.category]}</span>{cat.category}
                  </span>
                  <span className="cat-amt">{formatCurrency(cat.amount)}</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${cat.percentage}%`, background: CATEGORY_COLORS[cat.category] || "var(--c-amber)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
