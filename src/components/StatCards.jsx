import React, { useEffect, useRef, useState } from "react";
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { formatCurrency } from "../utils/helpers";

function Counter({ value, isCurrency = true }) {
  const [disp, setDisp] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let start = 0, frames = 60;
    const step = value / frames;
    clearInterval(ref.current);
    ref.current = setInterval(() => {
      start += step;
      if (start >= value) { setDisp(value); clearInterval(ref.current); }
      else setDisp(start);
    }, 16);
    return () => clearInterval(ref.current);
  }, [value]);

  if (isCurrency) return <>{formatCurrency(disp)}</>;
  return <>{disp.toFixed(1)}%</>;
}

export default function StatCards({ summary }) {
  const cards = [
    { cls: "s-balance", label: "Net Balance",    icon: <Wallet size={17} color="var(--c-blue)" />,   val: summary.balance,  isCur: true,  badge: "+12.4%", bCls: "up" },
    { cls: "s-income",  label: "Total Income",   icon: <TrendingUp size={17} color="var(--c-green)" />, val: summary.income, isCur: true,  badge: "+8.2%",  bCls: "up" },
    { cls: "s-expense", label: "Total Expenses", icon: <TrendingDown size={17} color="var(--c-red)" />, val: summary.expenses,isCur: true, badge: "+3.1%",  bCls: "dn" },
    { cls: "s-savings", label: "Savings Rate",   icon: <PiggyBank size={17} color="var(--c-amber)" />,val: summary.savings, isCur: false, badge: summary.savings >= 20 ? "Healthy" : "Low", bCls: summary.savings >= 20 ? "up" : "dn" },
  ];

  return (
    <div className="stats-row">
      {cards.map((c, i) => (
        <div key={c.cls} className={`stat-card ${c.cls} s${i+1}`}>
          <div className="stat-top">
            <div className="stat-icon-wrap">{c.icon}</div>
            <span className={`stat-badge ${c.bCls}`}>{c.badge}</span>
          </div>
          <div className="stat-val"><Counter value={c.val} isCurrency={c.isCur} /></div>
          <div className="stat-lbl">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
