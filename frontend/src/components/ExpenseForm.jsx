import { useState } from "react";
import { createExpense } from "../api";

const DEFAULT_CATEGORIES = ["Food", "Transport", "Bills", "Shopping", "Health", "Other"];

export default function ExpenseForm({ onCreated }) {
  const today = new Date().toISOString().slice(0, 10);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(today);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createExpense({ amount, category, description, date });
      setAmount("");
      setDescription("");
      onCreated?.();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Add Expense</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <label>
          Amount
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 25.90"
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
            required
          />
        </label>

        <label>
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          >
            {DEFAULT_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label>
          Description (Optional)
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. groceries"
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
        </label>

        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
            required
          />
        </label>

        {error && <div style={{ color: "crimson" }}>{error}</div>}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 12,
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            fontWeight: 700
          }}
        >
          {loading ? "Saving..." : "Add"}
        </button>
      </form>
    </div>
  );
}
