import React, { useState } from "react";
import { X } from "lucide-react";
import useStore from "../store/useStore";
import { CATEGORIES } from "../data/transactions";

const blank = { description:"", amount:"", type:"expense", category:"Food & Dining", date:new Date().toISOString().slice(0,10) };

export default function TransactionModal() {
  const { modal, closeModal, addTransaction, updateTransaction } = useStore();
  const isEdit = modal?.type === "edit";
  const [form, setForm] = useState(isEdit ? { ...modal.data, date:modal.data.date.slice(0,10) } : blank);
  const [errs, setErrs] = useState({});

  if (!modal) return null;
  const f = (k,v) => { setForm(x=>({...x,[k]:v})); setErrs(e=>({...e,[k]:""})); };

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = "Required";
    if (!form.amount || isNaN(+form.amount) || +form.amount <= 0) e.amount = "Enter valid amount";
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrs(e); return; }
    const t = { ...form, amount:parseFloat(form.amount), date:new Date(form.date).toISOString() };
    if (isEdit) updateTransaction(modal.data.id, t); else addTransaction(t);
    closeModal();
  };

  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&closeModal()}>
      <div className="modal">
        <div className="modal-head">
          <div className="modal-title">{isEdit ? "Edit Entry" : "New Entry"}</div>
          <button style={{ background:"transparent", border:"none", color:"var(--paper)", cursor:"pointer", display:"flex" }} onClick={closeModal}><X size={18}/></button>
        </div>
        <div className="modal-body">
          <div>
            <div className="form-label">Type</div>
            <div className="type-toggle">
              <button className={`type-btn ${form.type==="income"?"sel-income":""}`} onClick={()=>f("type","income")}>▲ Income</button>
              <button className={`type-btn ${form.type==="expense"?"sel-expense":""}`} onClick={()=>f("type","expense")}>▼ Expense</button>
            </div>
          </div>

          <div>
            <label className="form-label">Description</label>
            <input className="form-inp" placeholder="e.g. Grocery Store" value={form.description} onChange={e=>f("description",e.target.value)}/>
            {errs.description && <div className="err">{errs.description}</div>}
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Amount (USD)</label>
              <input className="form-inp" type="number" placeholder="0.00" value={form.amount} onChange={e=>f("amount",e.target.value)}/>
              {errs.amount && <div className="err">{errs.amount}</div>}
            </div>
            <div>
              <label className="form-label">Date</label>
              <input className="form-inp" type="date" value={form.date} onChange={e=>f("date",e.target.value)}/>
            </div>
          </div>

          <div>
            <label className="form-label">Category</label>
            <select className="form-sel" value={form.category} onChange={e=>f("category",e.target.value)}>
              {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="modal-foot">
          <button className="nav-btn" onClick={closeModal}>Cancel</button>
          <button className="nav-btn filled" onClick={submit}>{isEdit?"Save changes":"Add entry"}</button>
        </div>
      </div>
    </div>
  );
}
