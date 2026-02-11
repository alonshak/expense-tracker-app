import { useState } from "react";
import { updateExpense, deleteExpense } from "../api";

const CATEGORIES = ["Food", "Transport", "Bills", "Shopping", "Health", "Other"];

export default function EditExpenseModal({ expense, onClose, onSaved, onDeleted }) {
  const [form, setForm] = useState({
    category: expense.category || "Food",
    amount: String(expense.amount ?? ""),
    description: expense.description || "",
    date: expense.date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await updateExpense(expense.id, form);
      onSaved?.();
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
    const ok = window.confirm("Delete this expense?");
    if (!ok) return;

    setError("");
    setLoading(true);
    try {
      await deleteExpense(expense.id);
      onDeleted?.();
    } catch (err) {
      setError(err.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={overlay}>
      <form onSubmit={save} style={modal}>
        <h2 style={{ marginBottom: 20, color: "#43442b" }}>Edit Expense</h2>

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

        {error && <div style={{ marginTop: 12, color: "#7f1d1d" }}>{error}</div>}

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button type="submit" disabled={loading} style={primaryBtn}>
            {loading ? "Saving..." : "Save"}
          </button>

          <button type="button" onClick={onClose} disabled={loading} style={secondaryBtn}>
            Cancel
          </button>
        </div>

        <button
          type="button"
          onClick={remove}
          disabled={loading}
          style={dangerBtn}
        >
          Delete expense
        </button>
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
  fontWeight: 800,
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
  fontWeight: 800,
};

const dangerBtn = {
  marginTop: 14,
  width: "100%",
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(127,29,29,0.65)",
  background: "rgba(127,29,29,0.08)",
  color: "#7f1d1d",
  cursor: "pointer",
  fontWeight: 900,
};
