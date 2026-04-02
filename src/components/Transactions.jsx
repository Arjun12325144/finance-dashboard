import React, { useState } from "react";
import { Search, Plus, Download, Edit2, Trash2, ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
import useStore from "../store/useStore";
import { CATEGORIES, CATEGORY_ICONS } from "../data/transactions";
import { formatDate, formatCurrency, exportToCSV, exportToJSON } from "../utils/helpers";

const PAGE = 15;

export default function Transactions() {
  const { role, filters, setFilter, resetFilters, openModal, deleteTransaction, getFilteredTransactions } = useStore();
  const filtered = getFilteredTransactions();
  const [page, setPage] = useState(1);
  const [showExp, setShowExp] = useState(false);
  const total = Math.ceil(filtered.length / PAGE);
  const rows = filtered.slice((page-1)*PAGE, page*PAGE);

  const sort = col => {
    if (filters.sortBy === col) setFilter("sortDir", filters.sortDir === "asc" ? "desc" : "asc");
    else { setFilter("sortBy", col); setFilter("sortDir", "desc"); }
    setPage(1);
  };
  const Ico = ({ col }) => filters.sortBy !== col
    ? <ArrowUpDown size={11} style={{ opacity:.4 }} />
    : filters.sortDir === "asc" ? <ChevronUp size={11} /> : <ChevronDown size={11} />;

  return (
    <div>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
        <div className="page-heading" style={{ marginBottom:0 }}>
          <h1>Trans<em>actions</em></h1>
          <p>{filtered.length} records found</p>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <div style={{ position:"relative" }}>
            <button className="btn btn-ghost" onClick={() => setShowExp(!showExp)}><Download size={14} /> Export</button>
            {showExp && (
              <div style={{ position:"absolute", top:"calc(100% + 6px)", right:0, background:"var(--c-surface)", border:"1px solid var(--c-border-s)", borderRadius:11, padding:6, minWidth:140, boxShadow:"0 8px 24px rgba(0,0,0,.3)", zIndex:50 }}>
                <button className="btn btn-ghost" style={{ width:"100%", justifyContent:"flex-start", fontSize:13 }} onClick={() => { exportToCSV(filtered); setShowExp(false); }}>📄 CSV</button>
                <button className="btn btn-ghost" style={{ width:"100%", justifyContent:"flex-start", fontSize:13 }} onClick={() => { exportToJSON(filtered); setShowExp(false); }}>📋 JSON</button>
              </div>
            )}
          </div>
          {role === "admin" && (
            <button className="btn btn-amber" onClick={() => openModal({ type:"add" })}><Plus size={14} /> Add</button>
          )}
        </div>
      </div>

      <div className="tbl-wrap">
        <div className="filters">
          <div className="search-box">
            <Search size={13} />
            <input className="inp inp-search" placeholder="Search…" value={filters.search} onChange={e => { setFilter("search", e.target.value); setPage(1); }} />
          </div>
          <select className="sel" value={filters.type} onChange={e => { setFilter("type", e.target.value); setPage(1); }}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select className="sel" value={filters.category} onChange={e => { setFilter("category", e.target.value); setPage(1); }}>
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="sel" value={filters.dateRange} onChange={e => { setFilter("dateRange", e.target.value); setPage(1); }}>
            <option value="1m">Last Month</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last Year</option>
            <option value="all">All Time</option>
          </select>
          <button className="btn btn-ghost" onClick={() => { resetFilters(); setPage(1); }}>Reset</button>
        </div>

        {rows.length === 0 ? (
          <div className="empty">
            <span className="empty-ico">🔍</span>
            <h3>Nothing found</h3>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table>
              <thead>
                <tr>
                  <th onClick={() => sort("date")}><span style={{ display:"inline-flex", alignItems:"center", gap:4 }}>Date <Ico col="date" /></span></th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th onClick={() => sort("amount")} style={{ textAlign:"right" }}><span style={{ display:"inline-flex", alignItems:"center", gap:4, justifyContent:"flex-end" }}>Amount <Ico col="amount" /></span></th>
                  {role === "admin" && <th style={{ textAlign:"right" }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((t, i) => (
                  <tr key={t.id} style={{ animationDelay: `${i * 0.025}s` }}>
                    <td style={{ fontFamily:"DM Mono", fontSize:12, color:"var(--c-text-2)", whiteSpace:"nowrap" }}>{formatDate(t.date)}</td>
                    <td style={{ fontWeight:600, maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.description}</td>
                    <td><span className="badge-cat">{CATEGORY_ICONS[t.category] || "📦"} {t.category}</span></td>
                    <td><span className={`badge-type ${t.type}`}>{t.type === "income" ? "▲" : "▼"} {t.type}</span></td>
                    <td className={`amt ${t.type}`}>{t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}</td>
                    {role === "admin" && (
                      <td>
                        <div className="actions">
                          <button className="btn btn-ghost btn-icon" title="Edit" onClick={() => openModal({ type:"edit", data:t })}><Edit2 size={13} /></button>
                          <button className="btn btn-danger-soft btn-icon" title="Delete" onClick={() => { if(window.confirm("Delete this transaction?")) deleteTransaction(t.id); }}><Trash2 size={13} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {total > 1 && (
          <div className="pager">
            <div className="pager-info">{(page-1)*PAGE+1}–{Math.min(page*PAGE, filtered.length)} of {filtered.length}</div>
            <div className="pager-btns">
              <button className="btn btn-ghost" style={{ padding:"6px 12px", fontSize:12 }} disabled={page===1} onClick={() => setPage(p=>p-1)}>←</button>
              {Array.from({ length: Math.min(5, total) }, (_, i) => {
                const p = page <= 3 ? i+1 : page+i-2;
                if (p < 1 || p > total) return null;
                return <button key={p} className={`btn ${p===page?"btn-amber":"btn-ghost"}`} style={{ padding:"6px 10px", fontSize:12, minWidth:34 }} onClick={() => setPage(p)}>{p}</button>;
              })}
              <button className="btn btn-ghost" style={{ padding:"6px 12px", fontSize:12 }} disabled={page===total} onClick={() => setPage(p=>p+1)}>→</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
