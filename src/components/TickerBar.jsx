import React, { useMemo } from "react";
import useStore from "../store/useStore";
import { getSummary, formatCurrency } from "../utils/helpers";

export default function TickerBar() {
  const { transactions } = useStore();
  const s = useMemo(() => getSummary(transactions), [transactions]);

  const items = [
    { lbl: "NET BALANCE",   val: formatCurrency(s.balance),  up: s.balance >= 0 },
    { lbl: "TOTAL INCOME",  val: formatCurrency(s.income),   up: true },
    { lbl: "EXPENSES",      val: formatCurrency(s.expenses), up: false },
    { lbl: "SAVINGS RATE",  val: `${s.savings.toFixed(1)}%`, up: s.savings >= 20 },
    { lbl: "TRANSACTIONS",  val: String(transactions.length), up: true },
    { lbl: "BTC/USD",       val: "$67,420",  up: true },
    { lbl: "ETH/USD",       val: "$3,280",   up: false },
    { lbl: "S&P 500",       val: "5,280.15", up: true },
    { lbl: "GOLD",          val: "$2,045",   up: true },
    { lbl: "USD/EUR",       val: "0.9240",   up: false },
  ];

  const doubled = [...items, ...items];

  return (
    <div className="ticker-strip">
      <div className="ticker-inner">
        {doubled.map((it, i) => (
          <span key={i} className="ticker-item">
            {it.lbl}&nbsp;&nbsp;
            <strong className={it.up ? "t-up" : "t-dn"}>{it.val}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}
