import { useState } from "react";
import PieWithLegend from "./PieWithLegend";
import YearlyStackedBars from "./YearlyStackedBars";
import Logo from "./Logo";
import MonthNavigator from "./MonthNavigator";

export default function Overview({
  overview,
  yearlyMonths,
  onAdd,
  month,
  year,
  onPrevMonth,
  onNextMonth,
  canGoNext,
  onPrevYear,
  onNextYear,
  canGoNextYear,
  onViewChange,
}) {
  const safeOverview = Array.isArray(overview) ? overview : [];

  const totalMonthly = safeOverview.reduce(
    (a, o) => a + (Number(o.spent) || 0),
    0
  );

  const dataMonthly = safeOverview.map((o) => ({
    ...o,
    spent: Number(o.spent) || 0,
    percent: totalMonthly ? (Number(o.spent) || 0) / totalMonthly : 0,
  }));

  const [view, setView] = useState("monthly"); // monthly | yearly
  const [switching, setSwitching] = useState(false);

  const monthsArr = yearlyMonths?.months || [];
  const totalYearly = Array.isArray(monthsArr)
    ? monthsArr.reduce((a, m) => a + (Number(m.total) || 0), 0)
    : 0;

  function money0(n) {
    const v = Number(n) || 0;
    return `₪${Math.round(v).toLocaleString("en-US")}`;
  }

  function setViewMode(next) {
    if (next === view) return;

    setView(next);
    onViewChange?.(next);

    setSwitching(true);
    setTimeout(() => setSwitching(false), 450);
  }

  const isYearly = view === "yearly";
  const hasData = isYearly
    ? Array.isArray(monthsArr) && monthsArr.length > 0
    : dataMonthly.length > 0;

  return (
    <section style={{ marginBottom: 40 }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
        @keyframes pulse { 0% { opacity: .45; } 50% { opacity: 1; } 100% { opacity: .45; } }
      `}</style>

      {/* Header row */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0, color: "#111827", fontSize: 20, fontWeight: 700 }}>
          {isYearly ? "Yearly Overview" : "Monthly Overview"}
        </h2>

        {/* Center – navigator */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {isYearly ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                onClick={onPrevYear}
                style={{
                  border: "1px solid #43442b",
                  borderRadius: 8,
                  padding: "6px 10px",
                  background: "transparent",
                  color: "#43442b",
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                ◀
              </button>

              <div
                style={{
                  minWidth: 90,
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#111827",
                }}
              >
                {year}
              </div>

              <button
                onClick={onNextYear}
                disabled={!canGoNextYear}
                style={{
                  border: "1px solid #43442b",
                  borderRadius: 8,
                  padding: "6px 10px",
                  background: "transparent",
                  color: "#43442b",
                  fontSize: 14,
                  opacity: canGoNextYear ? 1 : 0.3,
                  cursor: canGoNextYear ? "pointer" : "default",
                }}
              >
                ▶
              </button>
            </div>
          ) : (
            <MonthNavigator
              month={month}
              year={year}
              onPrev={onPrevMonth}
              onNext={onNextMonth}
              canGoNext={canGoNext}
            />
          )}
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Toggle */}
          <div
            style={{
              display: "flex",
              border: "1px solid #43442b",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode("monthly")}
              style={{
                padding: "8px 12px",
                border: "none",
                background: !isYearly ? "#bdb4a2" : "transparent",
                color: "#43442b",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setViewMode("yearly")}
              style={{
                padding: "8px 12px",
                border: "none",
                background: isYearly ? "#bdb4a2" : "transparent",
                color: "#43442b",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Yearly
            </button>
          </div>

          <button
            onClick={onAdd}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 10,
              border: "1px solid #43442b",
              background: "transparent",
              color: "#43442a",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
            title="Add expense"
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
            Add Expense
          </button>
        </div>
      </div>

      {/* Card */}
      <div
        style={{
          background: "#D0C7B2",
          borderRadius: 16,
          padding: 24,
          border: "1px solid var(--border-soft)",
          minHeight: 300,
          position: "relative",
        }}
      >
        {/* Total */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 14,
          }}
        >
          <div style={{ fontWeight: 800, color: "#3f3f3f" }}>
            {isYearly ? "Yearly Total" : "Monthly Total"}
          </div>
          <div style={{ fontWeight: 900, fontSize: 18, color: "#3f3f3f" }}>
            {money0(isYearly ? totalYearly : totalMonthly)}
          </div>
        </div>

        {!hasData ? (
          <div
            style={{
              height: 260,
              width: "100%",
              border: "2px dashed var(--border-soft)",
              borderRadius: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              color: "var(--text-muted)",
            }}
          >
            <Logo size={48} />
            <div style={{ fontSize: 15, fontWeight: 500 }}>No expenses yet</div>
          </div>
        ) : switching ? (
          <div
            style={{
              height: 260,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              color: "#3f3f3f",
              animation: "pulse 1s infinite",
              fontWeight: 700,
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: "3px solid rgba(67,68,43,0.25)",
                borderTopColor: "#43442b",
                animation: "spin .9s linear infinite",
              }}
            />
            Loading…
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            {isYearly ? (
              <YearlyStackedBars yearlyMonths={yearlyMonths} />
            ) : (
              <PieWithLegend data={dataMonthly} />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
