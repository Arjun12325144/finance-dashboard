import React, { useMemo } from "react";
import useStore from "../store/useStore";
import { getSummary, formatCurrency } from "../utils/helpers";

export default function TickerBar() {
  const { transactions } = useStore();
  const s = useMemo(() => getSummary(transactions), [transactions]);
  const items = [
    { lbl:"Balance",   val: formatCurrency(s.balance),       up: s.balance >= 0 },
    { lbl:"Income",    val: formatCurrency(s.income),        up: true },
    { lbl:"Expenses",  val: formatCurrency(s.expenses),      up: false },
    { lbl:"Savings",   val: `${s.savings.toFixed(1)}%`,      up: s.savings >= 20 },
    { lbl:"BTC",       val: "$67,420",                       up: true },
    { lbl:"ETH",       val: "$3,280",                        up: false },
    { lbl:"S&P 500",   val: "5,280",                         up: true },
    { lbl:"Gold",      val: "$2,045/oz",                     up: true },
    { lbl:"USD/EUR",   val: "0.924",                         up: false },
    { lbl:"Txns",      val: transactions.length,             up: true },
  ];
  const doubled = [...items, ...items];
  return (
    <div className="ticker">
      <div className="ticker-inner">
        {doubled.map((it, i) => (
          <span key={i} className="ticker-item">
            <span>{it.lbl}</span>
            <span className={it.up ? "t-up" : "t-dn"}>{it.val}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
