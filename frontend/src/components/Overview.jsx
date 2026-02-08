import PieWithLegend from "./PieWithLegend";
import Logo from "./Logo";
import MonthNavigator from "./MonthNavigator";

export default function Overview({
  overview,
  onAdd,
  month,
  year,
  onPrevMonth,
  onNextMonth,
  canGoNext,
}) {
  const safeOverview = Array.isArray(overview) ? overview : [];

  const total = safeOverview.reduce((a, o) => a + o.spent, 0);

  const data = safeOverview.map((o) => ({
    ...o,
    percent: total ? o.spent / total : 0,
  }));

  return (
    <section style={{ marginBottom: 40 }}>
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
        <h2
          style={{
            margin: 0,
            color: "#111827",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          Monthly Overview
        </h2>

        {/* Center – Month navigator */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <MonthNavigator
            month={month}
            year={year}
            onPrev={onPrevMonth}
            onNext={onNextMonth}
            canGoNext={canGoNext}
          />
        </div>

        {/* Right */}
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
    color: "#43442b",
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

      {/* Card */}
      <div
        style={{
          background: "#D0C7B2",   // 👈 כאן השינוי
          borderRadius: 16,
          padding: 24,
          border: "1px solid var(--border-soft)",
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {data.length === 0 ? (
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
            <div style={{ fontSize: 15, fontWeight: 500 }}>
              No expenses yet
            </div>
          </div>
        ) : (
          <PieWithLegend data={data} />
        )}
      </div>
    </section>
  );
}
