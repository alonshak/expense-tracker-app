import { useEffect, useState } from "react";
import { getExpenses, getOverview } from "../api";

import Header from "../components/Header";
import MonthNavigator from "../components/MonthNavigator";
import Overview from "../components/Overview";
import ExpenseList from "../components/ExpenseList";
import AddExpenseModal from "../components/AddExpenseModal";
import Footer from "../components/Footer";


export default function App() {
  const now = new Date();

  // month 0-11
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const [expenses, setExpenses] = useState([]);
  const [overview, setOverview] = useState([]);
  const [visibleCount, setVisibleCount] = useState(7);
  const [showModal, setShowModal] = useState(false);

  const canGoNext =
    year < now.getFullYear() ||
    (year === now.getFullYear() && month < now.getMonth());

  async function load() {
    const [e, o] = await Promise.all([
      getExpenses({ year, month: month + 1 }),
      getOverview({ year, month: month + 1 }),
    ]);
    setExpenses(e);
    setOverview(o);
    setVisibleCount(7);
  }

  useEffect(() => {
    load();
  }, [month, year]);

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

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", padding: 32 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Header />

        <MonthNavigator
          month={month}
          year={year}
          onPrev={goPrev}
          onNext={goNext}
          canGoNext={canGoNext}
        />

        <Overview overview={overview} onAdd={() => setShowModal(true)} />

        <ExpenseList
          expenses={expenses.slice(0, visibleCount)}
          hasMore={visibleCount < expenses.length}
          onLoadMore={() => setVisibleCount((v) => v + 7)}
        />

        {showModal && (
          <AddExpenseModal
            onClose={() => setShowModal(false)}
            onCreated={() => {
              setShowModal(false);
              load();
            }}
          />
        )}
        <Footer />
      </div>
    </div>
  );
}
