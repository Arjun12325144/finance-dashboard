import React, { useState } from "react";
import { X } from "lucide-react";
import useStore from "../store/useStore";
import { CATEGORIES } from "../data/transactions";

const empty = { description:"", amount:"", type:"expense", category:"Food & Dining", date: new Date().toISOString().slice(0,10) };

export default function TransactionModal() {
  const { modal, closeModal, addTransaction, updateTransaction } = useStore();
  const isEdit = modal?.type === "edit";
  const [form, setForm] = useState(isEdit ? { ...modal.data, date: modal.data.date.slice(0,10) } : empty);
  const [errs, setErrs] = useState({});

  if (!modal) return null;
  const set = (k,v) => { setForm(f=>({...f,[k]:v})); setErrs(e=>({...e,[k]:""})); };

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = "Required";
    if (!form.amount || isNaN(+form.amount) || +form.amount <= 0) e.amount = "Enter a valid amount";
    if (!form.date) e.date = "Required";
    return e;
  };

  const submit = () => {
    const e = validate(); if (Object.keys(e).length) { setErrs(e); return; }
    const t = { ...form, amount: parseFloat(form.amount), date: new Date(form.date).toISOString() };
    if (isEdit) updateTransaction(modal.data.id, t); else addTransaction(t);
    closeModal();
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
      <div className="modal">
        <div className="modal-head">
          <div className="modal-title">{isEdit ? "Edit Transaction" : "New Transaction"}</div>
          <button className="btn btn-ghost btn-icon" onClick={closeModal}><X size={15} /></button>
        </div>
        <div className="modal-body">
          <div className="type-toggle">
            {["income","expense"].map(t => (
              <button key={t} className={`type-btn active-${form.type === t ? t : ""}`}
                style={form.type !== t ? {} : {}} onClick={() => set("type", t)}>
                {t === "income" ? "💚 Income" : "🔴 Expense"}
              </button>
            ))}
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <input className="inp" placeholder="e.g. Grocery Store" value={form.description} onChange={e=>set("description",e.target.value)} />
            {errs.description && <span className="err-msg">{errs.description}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount (USD)</label>
              <input className="inp" type="number" placeholder="0.00" value={form.amount} onChange={e=>set("amount",e.target.value)} />
              {errs.amount && <span className="err-msg">{errs.amount}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="inp" type="date" value={form.date} onChange={e=>set("date",e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="sel" style={{ width:"100%" }} value={form.category} onChange={e=>set("category",e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
          <button className="btn btn-amber" onClick={submit}>{isEdit ? "Save Changes" : "Add Transaction"}</button>
        </div>
      </div>
    </div>
  );
}
