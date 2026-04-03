import React, { useMemo } from "react";
import useStore from "../store/useStore";
import { MonthlyBarChart } from "./Charts";
import { getSummary, getMonthlyData, getCategoryBreakdown, formatCurrency } from "../utils/helpers";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "../data/transactions";

export default function Insights() {
  const { transactions } = useStore();
  const summary    = useMemo(() => getSummary(transactions), [transactions]);
  const monthly    = useMemo(() => getMonthlyData(transactions), [transactions]);
  const categories = useMemo(() => getCategoryBreakdown(transactions), [transactions]);

  const top  = categories[0];
  const avgE = monthly.reduce((s,m)=>s+m.expenses,0) / (monthly.length||1);
  const avgI = monthly.reduce((s,m)=>s+m.income,0)   / (monthly.length||1);
  const last = monthly[monthly.length-1];
  const prev = monthly[monthly.length-2];
  const trend = prev ? ((last?.expenses - prev.expenses)/prev.expenses)*100 : 0;

  const cells = [
    { cls:"a", label:"Top Spending",      val: top?.category||"—",            detail: top?`${formatCurrency(top.amount)} · ${top.percentage.toFixed(1)}% of spend`:"" },
    { cls:"b", label:"Avg Monthly Income",val: formatCurrency(avgI),           detail: "6-month rolling average" },
    { cls:"c", label:"Avg Monthly Spend", val: formatCurrency(avgE),           detail: "6-month rolling average" },
    { cls:"d", label:"Savings Rate",      val: `${summary.savings.toFixed(1)}%`, detail: summary.savings>=20?"Above 20% target — healthy":"Below 20% — consider reducing spend" },
    { cls:"e", label:"Expense Trend",     val: `${trend>=0?"+":""}${trend.toFixed(1)}%`, detail:`vs previous month (${prev?.month||"—"})` },
    { cls:"f", label:"Total Entries",     val: transactions.length,            detail:`${transactions.filter(t=>t.type==="income").length} income · ${transactions.filter(t=>t.type==="expense").length} expenses` },
  ];

  return (
    <div>
      <div className="masthead">
        <div className="masthead-left">
          <h1>Financial <i>Insights</i></h1>
          <div className="masthead-meta">
            <span>Patterns from your data</span>
            <span>{monthly.length} months analysed</span>
          </div>
        </div>
      </div>

      <div className="insight-grid">
        {cells.map((c,i)=>(
          <div key={c.cls} className={`insight-cell ${c.cls} d${i+1}`}>
            <div className="ins-label">{c.label}</div>
            <div className="ins-value">{c.val}</div>
            <div className="ins-detail">{c.detail}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:1, background:"var(--rule-heavy)", border:"1px solid var(--rule-heavy)", marginBottom:24 }}>
        <div style={{ background:"var(--paper)", padding:24 }}>
          <div className="panel-header">
            <div>
              <div className="panel-label">Comparison</div>
              <div className="panel-title">Monthly Performance</div>
            </div>
          </div>
          <MonthlyBarChart data={monthly}/>
        </div>

        <div style={{ background:"var(--paper)", padding:24, borderLeft:"1px solid var(--rule-heavy)" }}>
          <div className="panel-header">
            <div>
              <div className="panel-label">Distribution</div>
              <div className="panel-title">All Spend Categories</div>
            </div>
          </div>
          <div>
            {categories.map(cat=>(
              <div key={cat.category} className="cat-entry">
                <div className="cat-entry-top">
                  <span className="cat-entry-name"><span>{CATEGORY_ICONS[cat.category]}</span>{cat.category}</span>
                  <span style={{ display:"flex", gap:10, alignItems:"baseline" }}>
                    <span style={{ fontSize:10, fontFamily:"IBM Plex Mono,monospace", color:"var(--ink-4)" }}>{cat.percentage.toFixed(1)}%</span>
                    <span className="cat-entry-amount">{formatCurrency(cat.amount)}</span>
                  </span>
                </div>
                <div className="cat-track">
                  <div className="cat-fill" style={{ width:`${cat.percentage}%`, background:CATEGORY_COLORS[cat.category]||"var(--gold)" }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly table */}
      <div className="month-wrap">
        <div style={{ padding:"14px 16px", background:"var(--paper-2)", borderBottom:"2px solid var(--rule-heavy)" }}>
          <div style={{ fontFamily:"Playfair Display,serif", fontSize:16, fontWeight:700 }}>Month-by-Month Summary</div>
          <div style={{ fontSize:11, color:"var(--ink-3)", marginTop:2, fontFamily:"IBM Plex Mono,monospace", letterSpacing:.5 }}>DETAILED FINANCIAL PERFORMANCE</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Period</th>
              <th style={{ textAlign:"right" }}>Income</th>
              <th style={{ textAlign:"right" }}>Expenses</th>
              <th style={{ textAlign:"right" }}>Net</th>
              <th style={{ textAlign:"right" }}>Savings</th>
            </tr>
          </thead>
          <tbody>
            {monthly.slice().reverse().map((m,i)=>{
              const net = m.income - m.expenses;
              const sv  = m.income > 0 ? ((m.income-m.expenses)/m.income)*100 : 0;
              return (
                <tr key={m.month} style={{ animationDelay:`${i*.04}s` }}>
                  <td style={{ fontFamily:"IBM Plex Mono,monospace", fontWeight:500, fontSize:12 }}>{m.month}</td>
                  <td className="mono-amt income">{formatCurrency(m.income)}</td>
                  <td className="mono-amt expense">{formatCurrency(m.expenses)}</td>
                  <td className={`mono-amt ${net>=0?"income":"expense"}`}>{net>=0?"+":"−"}{formatCurrency(Math.abs(net))}</td>
                  <td style={{ textAlign:"right" }}>
                    <span style={{ fontFamily:"IBM Plex Mono,monospace", fontSize:11, color:sv>=20?"var(--green)":"var(--red)", fontWeight:500 }}>{sv.toFixed(1)}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
