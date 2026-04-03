import React, { useState } from "react";
import { Search, ChevronUp, ChevronDown, ArrowUpDown, Edit2, Trash2, Download } from "lucide-react";
import useStore from "../store/useStore";
import { CATEGORIES, CATEGORY_ICONS } from "../data/transactions";
import { formatDate, formatCurrency, exportToCSV, exportToJSON } from "../utils/helpers";

const PAGE = 15;

export default function Transactions() {
  const { role, filters, setFilter, resetFilters, openModal, deleteTransaction, getFilteredTransactions } = useStore();
  const filtered = getFilteredTransactions();
  const [page, setPage] = useState(1);
  const [showExport, setShowExport] = useState(false);
  const totalPages = Math.ceil(filtered.length / PAGE);
  const rows = filtered.slice((page-1)*PAGE, page*PAGE);

  const sort = col => {
    if (filters.sortBy === col) setFilter("sortDir", filters.sortDir === "asc" ? "desc" : "asc");
    else { setFilter("sortBy", col); setFilter("sortDir", "desc"); }
    setPage(1);
  };

  const SortIco = ({ col }) => {
    if (filters.sortBy !== col) return <ArrowUpDown size={10} style={{opacity:.4}}/>;
    return filters.sortDir === "asc" ? <ChevronUp size={10}/> : <ChevronDown size={10}/>;
  };

  return (
    <div>
      <div className="masthead">
        <div className="masthead-left">
          <h1>Trans<i>actions</i></h1>
          <div className="masthead-meta">
            <span>{filtered.length} records</span>
            <span>{filters.type !== "all" ? filters.type : "all types"}</span>
          </div>
        </div>
        <div className="masthead-actions" style={{ gap:8 }}>
          <div style={{ position:"relative" }}>
            <button className="nav-btn" onClick={()=>setShowExport(!showExport)}>
              <Download size={13}/> Export
            </button>
            {showExport && (
              <div style={{ position:"absolute", top:"calc(100%+4px)", right:0, background:"var(--paper)", border:"2px solid var(--ink)", minWidth:130, zIndex:50, boxShadow:"4px 4px 0 var(--ink-4)" }}>
                <div style={{ padding:"8px 0" }}>
                  <button className="nav-btn" style={{ width:"100%", justifyContent:"flex-start", padding:"7px 14px", border:"none", borderRadius:0, fontSize:12 }} onClick={()=>{exportToCSV(filtered);setShowExport(false);}}>CSV file</button>
                  <button className="nav-btn" style={{ width:"100%", justifyContent:"flex-start", padding:"7px 14px", border:"none", borderRadius:0, fontSize:12 }} onClick={()=>{exportToJSON(filtered);setShowExport(false);}}>JSON file</button>
                </div>
              </div>
            )}
          </div>
          {role === "admin" && (
            <button className="nav-btn filled" onClick={()=>openModal({type:"add"})}>+ Add entry</button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="filters-row">
        <div className="search-wrap">
          <Search size={13}/>
          <input
            className="filter-inp has-icon"
            style={{ width:"100%" }}
            placeholder="Search description or category…"
            value={filters.search}
            onChange={e=>{setFilter("search",e.target.value);setPage(1);}}
          />
        </div>
        <select className="filter-sel" value={filters.type} onChange={e=>{setFilter("type",e.target.value);setPage(1);}}>
          <option value="all">All types</option>
          <option value="income">Income only</option>
          <option value="expense">Expenses only</option>
        </select>
        <select className="filter-sel" value={filters.category} onChange={e=>{setFilter("category",e.target.value);setPage(1);}}>
          <option value="all">All categories</option>
          {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <select className="filter-sel" value={filters.dateRange} onChange={e=>{setFilter("dateRange",e.target.value);setPage(1);}}>
          <option value="1m">Last month</option>
          <option value="3m">Last 3 months</option>
          <option value="6m">Last 6 months</option>
          <option value="1y">Last year</option>
          <option value="all">All time</option>
        </select>
        <button className="nav-btn" onClick={()=>{resetFilters();setPage(1);}}>Reset</button>
      </div>

      <div className="data-table-wrap">
        {rows.length === 0 ? (
          <div className="empty">
            <span className="empty-ico">○</span>
            <h3>No results</h3>
            <p>Try adjusting the filters above</p>
          </div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table>
              <thead>
                <tr>
                  <th onClick={()=>sort("date")} style={{ width:110 }}>
                    <span style={{ display:"inline-flex", alignItems:"center", gap:5 }}>Date <SortIco col="date"/></span>
                  </th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th onClick={()=>sort("amount")} style={{ textAlign:"right" }}>
                    <span style={{ display:"inline-flex", alignItems:"center", gap:5, justifyContent:"flex-end" }}>Amount <SortIco col="amount"/></span>
                  </th>
                  {role === "admin" && <th style={{ textAlign:"right" }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((t,i) => (
                  <tr key={t.id} style={{ animationDelay:`${i*.02}s` }}>
                    <td><span className="mono-date">{formatDate(t.date)}</span></td>
                    <td style={{ fontWeight:500, maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.description}</td>
                    <td><span className="cat-tag">{CATEGORY_ICONS[t.category]||"📦"} {t.category}</span></td>
                    <td><span className={`type-tag ${t.type}`}>{t.type === "income" ? "▲" : "▼"} {t.type}</span></td>
                    <td className={`mono-amt ${t.type}`}>{t.type==="income"?"+":"−"}{formatCurrency(t.amount)}</td>
                    {role === "admin" && (
                      <td>
                        <div className="tbl-actions">
                          <button className="icon-btn" title="Edit" onClick={()=>openModal({type:"edit",data:t})}><Edit2 size={12}/></button>
                          <button className="icon-btn danger" title="Delete" onClick={()=>{if(window.confirm("Delete this entry?"))deleteTransaction(t.id);}}><Trash2 size={12}/></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pager">
            <div className="pager-info">{(page-1)*PAGE+1}–{Math.min(page*PAGE,filtered.length)} of {filtered.length}</div>
            <div className="pager-btns">
              <button className="pager-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</button>
              {Array.from({length:Math.min(7,totalPages)},(_,i)=>{
                const p = page<=4 ? i+1 : page+i-3;
                if(p<1||p>totalPages) return null;
                return <button key={p} className={`pager-btn ${p===page?"active":""}`} onClick={()=>setPage(p)}>{p}</button>;
              })}
              <button className="pager-btn" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
