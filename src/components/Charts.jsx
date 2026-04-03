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
    <div style={{ background:"var(--paper)", border:"2px solid var(--ink)", padding:"10px 14px", fontFamily:"IBM Plex Sans, sans-serif", boxShadow:"4px 4px 0 var(--ink-4)" }}>
      <div style={{ fontSize:10, fontFamily:"IBM Plex Mono,monospace", color:"var(--ink-3)", marginBottom:8, letterSpacing:1 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ display:"flex", gap:10, alignItems:"center", fontSize:13, marginBottom:3 }}>
          <span style={{ width:10, height:2, background:p.color, display:"inline-block" }} />
          <span style={{ color:"var(--ink-2)", fontSize:11, textTransform:"capitalize" }}>{p.dataKey}</span>
          <span style={{ fontFamily:"IBM Plex Mono,monospace", fontWeight:600, color:"var(--ink)" }}>{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export function BalanceTrendChart({ data }) {
  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--green)" stopOpacity={0.15}/>
              <stop offset="100%" stopColor="var(--green)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--red)" stopOpacity={0.15}/>
              <stop offset="100%" stopColor="var(--red)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" vertical={false}/>
          <XAxis dataKey="month" tick={{ fontSize:10, fontFamily:"IBM Plex Mono" }}/>
          <YAxis tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} tick={{ fontSize:10, fontFamily:"IBM Plex Mono" }}/>
          <Tooltip content={<Tip/>}/>
          <Area type="monotone" dataKey="income"   stroke="var(--green)" strokeWidth={1.5} fill="url(#gI)" dot={false} activeDot={{ r:4, strokeWidth:0 }}/>
          <Area type="monotone" dataKey="expenses" stroke="var(--red)"   strokeWidth={1.5} fill="url(#gE)" dot={false} activeDot={{ r:4, strokeWidth:0 }}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const PIE_LABEL = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.08) return null;
  const R = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * R);
  const y = cy + r * Math.sin(-midAngle * R);
  return <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600} fontFamily="IBM Plex Mono">{`${(percent*100).toFixed(0)}%`}</text>;
};

export function SpendingPieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data.slice(0,5)} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
          dataKey="amount" nameKey="category" labelLine={false} label={PIE_LABEL}
          strokeWidth={2} stroke="var(--paper)">
          {data.slice(0,5).map(e => <Cell key={e.category} fill={CATEGORY_COLORS[e.category] || "#888"}/>)}
        </Pie>
        <Tooltip formatter={v=>formatCurrency(v)} contentStyle={{ background:"var(--paper)", border:"2px solid var(--ink)", fontFamily:"IBM Plex Sans" }}/>
        <Legend formatter={v=><span style={{ fontSize:10, color:"var(--ink-2)", fontFamily:"IBM Plex Sans" }}>{v}</span>}/>
      </PieChart>
    </ResponsiveContainer>
  );
}

export function MonthlyBarChart({ data }) {
  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top:4, right:0, left:-20, bottom:0 }}>
          <CartesianGrid strokeDasharray="2 4" vertical={false}/>
          <XAxis dataKey="month" tick={{ fontSize:10, fontFamily:"IBM Plex Mono" }}/>
          <YAxis tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} tick={{ fontSize:10, fontFamily:"IBM Plex Mono" }}/>
          <Tooltip content={<Tip/>}/>
          <Bar dataKey="income"   fill="var(--green)" maxBarSize={22} radius={[2,2,0,0]}/>
          <Bar dataKey="expenses" fill="var(--red)"   maxBarSize={22} radius={[2,2,0,0]}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
