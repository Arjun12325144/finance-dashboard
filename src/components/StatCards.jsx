import React, { useEffect, useRef, useState } from "react";
import { formatCurrency } from "../utils/helpers";

function Counter({ target, prefix = "$", suffix = "" }) {
  const [val, setVal] = useState(0);
  const raf = useRef();

  useEffect(() => {
    let start = null;
    const duration = 900;
    const animate = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(target * ease);
      if (p < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [target]);

  if (prefix === "$") return <>{formatCurrency(val)}</>;
  return <>{val.toFixed(1)}{suffix}</>;
}

export default function StatCards({ summary }) {
  const cells = [
    { key: "c-balance", index: "01", label: "Net Balance",   val: summary.balance,  prefix: "$", change: "+12.4%", up: true,  fill: 70 },
    { key: "c-income",  index: "02", label: "Total Income",  val: summary.income,   prefix: "$", change: "+8.2%",  up: true,  fill: 100 },
    { key: "c-expense", index: "03", label: "Expenses",      val: summary.expenses, prefix: "$", change: "+3.1%",  up: false, fill: Math.min(summary.expenses / summary.income * 100, 100) },
    { key: "c-savings", index: "04", label: "Savings Rate",  val: summary.savings,  prefix: "",  suffix: "%", change: summary.savings >= 20 ? "Healthy" : "Below target", up: summary.savings >= 20, fill: summary.savings },
  ];

  return (
    <div className="stats-band">
      {cells.map((c, i) => (
        <div key={c.key} className={`stat-cell ${c.key} d${i + 1}`} data-index={c.index}>
          <div className="stat-type-label">{c.label}</div>
          <div className="stat-number">
            <Counter target={c.val} prefix={c.prefix} suffix={c.suffix || ""} />
          </div>
          <div className={`stat-change ${c.up ? "up" : "dn"}`}>
            <span>{c.up ? "▲" : "▼"}</span>
            <span>{c.change}</span>
          </div>
          <div className="stat-bar">
            <div className="stat-bar-fill" style={{ width: `${Math.max(5, Math.min(c.fill, 100))}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
