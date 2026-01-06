import { useEffect, useMemo, useState } from "react";
import { getCategoriesBreakdown, getExpenses, getMonthlySummary } from "./api";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseTable from "./components/ExpenseTable";
import Filters from "./components/Filters";
import Summary from "./components/Summary";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState({ from: "", to: "", category: "" });
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [breakdown, setBreakdown] = useState([]);
  const [error, setError] = useState("");

  const categories = useMemo(() => {
    const set = new Set(expenses.map((e) => e.category));
    return Array.from(set).sort();
  }, [expenses]);

  async function refresh() {
    setError("");
    try {
      const list = await getExpenses(filters);
      setExpenses(list);

      const now = new Date();
      const y = now.getFullYear();
      const m = now.getMonth() + 1;
      const monthly = await getMonthlySummary(y, m);
      setMonthlyTotal(monthly.total);

      const cats = await getCategoriesBreakdown({ from: filters.from, to: filters.to });
      setBreakdown(cats);
    } catch (e) {
      setError(e.message || "Failed to load data");
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.from, filters.to, filters.category]);

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 1100, margin: "0 auto", padding: 20 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <h1 style={{ marginBottom: 6 }}>Expense Tracker</h1>
          <div style={{ color: "#666" }}>Track expenses, view monthly totals, and category breakdown.</div>
        </div>
        <button
          onClick={refresh}
          style={{ padding: 10, borderRadius: 12, border: "1px solid #ddd", cursor: "pointer" }}
        >
          Refresh
        </button>
      </header>

      <div style={{ marginTop: 18 }}>
        <Filters filters={filters} setFilters={setFilters} categories={categories} />
      </div>

      {error && <div style={{ marginTop: 12, color: "crimson" }}>{error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <ExpenseForm onCreated={refresh} />
        <Summary monthlyTotal={monthlyTotal} breakdown={breakdown} />
      </div>

      <div style={{ marginTop: 16 }}>
        <ExpenseTable expenses={expenses} />
      </div>
    </div>
  );
}
