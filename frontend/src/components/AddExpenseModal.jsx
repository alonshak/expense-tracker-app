import { useState } from "react";
import { createExpense } from "../api";

const CATEGORIES = ["Food", "Transport", "Bills", "Shopping", "Other"];

export default function AddExpenseModal({ onClose, onCreated }) {
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    category: "Food",
    amount: "",
    description: "",
    date: today,
  });

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    await createExpense(form);
    onCreated();
  }

  return (
    <div style={overlay}>
      <form onSubmit={submit} style={modal}>
        <h2 style={{ marginBottom: 20, color: "#43442b" }}>
          Add Expense
        </h2>

        <div style={grid}>
          <Field label="Category">
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              style={selectInput}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>

          <Field label="Amount">
            <input
              type="number"
              value={form.amount}
              onChange={(e) => update("amount", e.target.value)}
              style={input}
              required
            />
          </Field>

          <Field label="Description">
            <input
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              style={input}
            />
          </Field>

          <Field label="Date">
            <input
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              style={input}
              required
            />
          </Field>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button type="submit" style={primaryBtn}>
            Save
          </button>
          <button type="button" onClick={onClose} style={secondaryBtn}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* reusable field wrapper */
function Field({ label, children }) {
  return (
    <div>
      <div style={labelStyle}>{label}</div>
      {children}
    </div>
  );
}

/* styles */
const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 50,
};

const modal = {
  background: "#D0C7B3",
  borderRadius: 18,
  padding: 28,
  width: 420,
  border: "1px solid #bdb4a2",
  boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 14,
};

const labelStyle = {
  marginBottom: 6,
  fontSize: 13,
  fontWeight: 500,
  color: "#43442b",
};

const input = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #43442b",
  background: "#bdb4a2",
  fontSize: 14,
  color: "#43442b",
};

const selectInput = {
  ...input,
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  paddingRight: 44,
  backgroundImage:
    "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNiA4bDQgNCA0LTQiIHN0cm9rZT0iIzQzNDQyYiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 14px center",
  backgroundSize: "14px",
};

const primaryBtn = {
  flex: 1,
  padding: 12,
  borderRadius: 12,
  border: "1px solid #43442b",
  background: "transparent",
  color: "#43442b",
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryBtn = {
  flex: 1,
  padding: 12,
  borderRadius: 12,
  border: "1px solid #43442b",
  background: "#bdb4a2",
  color: "#43442b",
  cursor: "pointer",
};
