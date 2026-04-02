import React, { useMemo } from "react";
import useStore from "../store/useStore";
import { MonthlyBarChart } from "./Charts";
import { getSummary, getMonthlyData, getCategoryBreakdown, formatCurrency } from "../utils/helpers";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "../data/transactions";

export default function Insights() {
  const { transactions } = useStore();
  const summary = useMemo(() => getSummary(transactions), [transactions]);
  const monthly = useMemo(() => getMonthlyData(transactions), [transactions]);
  const categories = useMemo(() => getCategoryBreakdown(transactions), [transactions]);

  const top = categories[0];
  const avgExp = monthly.reduce((s,m) => s+m.expenses, 0) / (monthly.length||1);
  const avgInc = monthly.reduce((s,m) => s+m.income,   0) / (monthly.length||1);
  const last = monthly[monthly.length-1], prev = monthly[monthly.length-2];
  const expChg = prev ? ((last?.expenses - prev.expenses) / prev.expenses) * 100 : 0;

  const cards = [
    { lbl:"Top Spending Category", val: top?.category || "—", detail: top ? `${formatCurrency(top.amount)} · ${top.percentage.toFixed(1)}% of spend` : "No data" },
    { lbl:"Avg Monthly Expenses",  val: formatCurrency(avgExp), detail: `vs ${formatCurrency(avgInc)} avg income` },
    { lbl:"Savings Rate",          val: `${summary.savings.toFixed(1)}%`, detail: summary.savings >= 20 ? "✅ Healthy — above 20%" : "⚠️ Low — under 20%" },
    { lbl:"Expense Trend",         val: `${expChg >= 0 ? "+" : ""}${expChg.toFixed(1)}%`, detail: `vs previous month` },
    { lbl:"Net Worth Change",      val: formatCurrency(summary.balance), detail: "Total income minus expenses" },
    { lbl:"Total Transactions",    val: transactions.length, detail: `${transactions.filter(t=>t.type==="income").length} income · ${transactions.filter(t=>t.type==="expense").length} expense` },
  ];

  return (
    <div>
      <div className="page-heading">
        <h1>Financial <em>Insights</em></h1>
        <p>Patterns and observations from your data</p>
      </div>

      <div className="insights-grid">
        {cards.map((c, i) => (
          <div key={c.lbl} className={`insight-card s${i+1}`}>
            <div className="insight-lbl">{c.lbl}</div>
            <div className="insight-val">{c.val}</div>
            <div className="insight-detail">{c.detail}</div>
          </div>
        ))}
      </div>

      <div className="charts-row">
        <MonthlyBarChart data={monthly} />
        <div className="card s4" style={{ animation:"slide-up .4s var(--ease) both" }}>
          <div className="card-head">
            <div className="card-title">Category Breakdown</div>
            <div className="card-sub">All spending categories</div>
          </div>
          <div className="cat-list">
            {categories.map(cat => (
              <div key={cat.category}>
                <div className="cat-row">
                  <span className="cat-name"><span>{CATEGORY_ICONS[cat.category]}</span>{cat.category}</span>
                  <span style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <span style={{ fontSize:11, color:"var(--c-text-3)", fontFamily:"DM Mono" }}>{cat.percentage.toFixed(1)}%</span>
                    <span className="cat-amt">{formatCurrency(cat.amount)}</span>
                  </span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width:`${cat.percentage}%`, background: CATEGORY_COLORS[cat.category] || "var(--c-amber)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tbl-wrap" style={{ marginTop:16 }}>
        <div style={{ padding:"18px 18px 0" }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:2 }}>Month-by-Month Summary</div>
          <div style={{ fontSize:12, color:"var(--c-text-2)", marginBottom:14 }}>Detailed financial performance</div>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table>
            <thead>
              <tr>
                <th>Month</th><th style={{ textAlign:"right" }}>Income</th>
                <th style={{ textAlign:"right" }}>Expenses</th><th style={{ textAlign:"right" }}>Net</th>
                <th style={{ textAlign:"right" }}>Savings %</th>
              </tr>
            </thead>
            <tbody>
              {monthly.slice().reverse().map((m, i) => {
                const net = m.income - m.expenses;
                const sv = m.income > 0 ? ((m.income-m.expenses)/m.income)*100 : 0;
                return (
                  <tr key={m.month} style={{ animationDelay:`${i*.04}s` }}>
                    <td style={{ fontWeight:600 }}>{m.month}</td>
                    <td className="amt income">{formatCurrency(m.income)}</td>
                    <td className="amt expense">{formatCurrency(m.expenses)}</td>
                    <td className={`amt ${net>=0?"income":"expense"}`}>{net>=0?"+":"−"}{formatCurrency(Math.abs(net))}</td>
                    <td style={{ textAlign:"right" }}>
                      <span className={`stat-badge ${sv>=20?"up":"dn"}`}>{sv.toFixed(1)}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
