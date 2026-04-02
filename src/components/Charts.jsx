import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from "recharts";
import { CATEGORY_COLORS } from "../data/transactions";
import { formatCurrency } from "../utils/helpers";

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="ct">
      <div style={{ fontSize: 11, fontFamily: "DM Mono", color: "var(--c-text-3)", marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block", flexShrink: 0 }} />
          <span style={{ color: "var(--c-text-2)", textTransform: "capitalize" }}>{p.dataKey}:</span>
          <span style={{ fontFamily: "DM Mono", fontWeight: 600, color: p.color }}>{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export function BalanceTrendChart({ data }) {
  return (
    <div className="card s3" style={{ animation: "slide-up .4s var(--ease) both" }}>
      <div className="card-head">
        <div>
          <div className="card-title">Balance Trend</div>
          <div className="card-sub">Income vs Expenses · 6 months</div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 12 }}>
          {[["var(--c-green)", "Income"], ["var(--c-red)", "Expenses"]].map(([col, lbl]) => (
            <span key={lbl} style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--c-text-2)" }}>
              <span style={{ width: 20, height: 2, background: col, display: "inline-block", borderRadius: 2 }} />{lbl}
            </span>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3ecf8e" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#3ecf8e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f16060" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#f16060" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "DM Mono" }} />
          <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fontFamily: "DM Mono" }} />
          <Tooltip content={<Tip />} />
          <Area type="monotone" dataKey="income" stroke="#3ecf8e" strokeWidth={2} fill="url(#gInc)" dot={{ fill: "#3ecf8e", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
          <Area type="monotone" dataKey="expenses" stroke="#f16060" strokeWidth={2} fill="url(#gExp)" dot={{ fill: "#f16060", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const PIE_LABEL = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.07) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600} fontFamily="DM Mono">{`${(percent*100).toFixed(0)}%`}</text>;
};

export function SpendingPieChart({ data }) {
  return (
    <div className="card s4" style={{ animation: "slide-up .4s var(--ease) both" }}>
      <div className="card-head">
        <div>
          <div className="card-title">Spending Mix</div>
          <div className="card-sub">Top 5 categories</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data.slice(0,5)} cx="50%" cy="50%" innerRadius={60} outerRadius={95}
            dataKey="amount" nameKey="category" labelLine={false} label={PIE_LABEL} strokeWidth={2} stroke="var(--c-card)">
            {data.slice(0,5).map(e => <Cell key={e.category} fill={CATEGORY_COLORS[e.category] || "#6B7280"} />)}
          </Pie>
          <Tooltip formatter={v => formatCurrency(v)} contentStyle={{ background: "var(--c-surface)", border: "1px solid var(--c-border-s)", borderRadius: 10, fontFamily: "DM Sans" }} />
          <Legend formatter={v => <span style={{ fontSize: 11, color: "var(--c-text-2)" }}>{v}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MonthlyBarChart({ data }) {
  return (
    <div className="card s3" style={{ animation: "slide-up .4s var(--ease) both" }}>
      <div className="card-head">
        <div>
          <div className="card-title">Monthly Comparison</div>
          <div className="card-sub">Income vs Expenses per month</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "DM Mono" }} />
          <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fontFamily: "DM Mono" }} />
          <Tooltip content={<Tip />} />
          <Bar dataKey="income" fill="#3ecf8e" radius={[4,4,0,0]} maxBarSize={28} />
          <Bar dataKey="expenses" fill="#f16060" radius={[4,4,0,0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
