import { useEffect, useState } from "react";
import { getExpenses, getOverview, getYearlyMonthsOverview } from "../api";

import Overview from "../components/Overview";
import ExpenseList from "../components/ExpenseList";
import AddExpenseModal from "../components/AddExpenseModal";
import EditExpenseModal from "../components/EditExpenseModal";
import Footer from "../components/Footer";

const PAGE_SIZE = 20;

export default function Dashboard() {
  const now = new Date();

  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const [expenses, setExpenses] = useState([]);
  const [hasMoreExpenses, setHasMoreExpenses] = useState(true);
  const [expensesOffset, setExpensesOffset] = useState(0);

  const [overview, setOverview] = useState([]);
  const [yearlyMonths, setYearlyMonths] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);

  // ✅ edit modal
  const [editingExpense, setEditingExpense] = useState(null);

  const [view, setView] = useState("monthly"); // monthly | yearly

  const canGoNext =
    year < now.getFullYear() ||
    (year === now.getFullYear() && month < now.getMonth());

  const canGoNextYear = year < now.getFullYear();

  async function loadMonthlyOverview() {
    const o = await getOverview({ year, month: month + 1 });
    setOverview(o);
  }

  async function loadYearly() {
    const y = await getYearlyMonthsOverview({ year });
    setYearlyMonths(y);
  }

  async function loadExpensesFirstPage() {
    const first = await getExpenses({ limit: PAGE_SIZE, offset: 0 });
    setExpenses(first);
    setExpensesOffset(first.length);
    setHasMoreExpenses(first.length === PAGE_SIZE);
  }

  async function loadMoreExpenses() {
    if (!hasMoreExpenses) return;

    const next = await getExpenses({ limit: PAGE_SIZE, offset: expensesOffset });
    setExpenses((prev) => [...prev, ...next]);
    setExpensesOffset((prev) => prev + next.length);
    setHasMoreExpenses(next.length === PAGE_SIZE);
  }

  useEffect(() => {
    loadMonthlyOverview();
    loadExpensesFirstPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  useEffect(() => {
    if (view === "yearly") loadYearly();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, year]);

  function goPrev() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function goNext() {
    if (!canGoNext) return;
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  function goPrevYear() {
    setYear((y) => y - 1);
  }

  function goNextYear() {
    if (!canGoNextYear) return;
    setYear((y) => y + 1);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#939474" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 32 }}>
        <Overview
          overview={overview}
          yearlyMonths={yearlyMonths}
          onAdd={() => setShowAddModal(true)}
          month={month}
          year={year}
          onPrevMonth={goPrev}
          onNextMonth={goNext}
          canGoNext={canGoNext}
          onPrevYear={goPrevYear}
          onNextYear={goNextYear}
          canGoNextYear={canGoNextYear}
          onViewChange={(next) => {
            setView(next);
            if (next === "yearly") loadYearly();
          }}
        />

        <ExpenseList
          expenses={expenses}
          hasMore={hasMoreExpenses}
          onLoadMore={loadMoreExpenses}
          onEdit={(exp) => setEditingExpense(exp)}
        />

        {showAddModal && (
          <AddExpenseModal
            onClose={() => setShowAddModal(false)}
            onCreated={() => {
              setShowAddModal(false);
              loadMonthlyOverview();
              loadExpensesFirstPage();
              if (view === "yearly") loadYearly();
            }}
          />
        )}

        {editingExpense && (
          <EditExpenseModal
            expense={editingExpense}
            onClose={() => setEditingExpense(null)}
            onSaved={() => {
              setEditingExpense(null);
              loadMonthlyOverview();
              loadExpensesFirstPage();
              if (view === "yearly") loadYearly();
            }}
            onDeleted={() => {
              setEditingExpense(null);
              loadMonthlyOverview();
              loadExpensesFirstPage();
              if (view === "yearly") loadYearly();
            }}
          />
        )}

        <Footer />
      </div>
    </div>
  );
}
