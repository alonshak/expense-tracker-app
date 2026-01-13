import PieWithLegend from "./PieWithLegend";
import Logo from "./Logo";

export default function Overview({ overview, onAdd }) {
  // 🔒 הגנה מלאה – תמיד לעבוד עם מערך
  const safeOverview = Array.isArray(overview) ? overview : [];

  const total = safeOverview.reduce((a, o) => a + o.spent, 0);

  const data = safeOverview.map((o) => ({
    ...o,
    percent: total ? o.spent / total : 0,
  }));

  return (
    <section style={{ marginBottom: 40 }}>
      {/* Title + Add button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
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

        <button
          onClick={onAdd}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            background: "#ffffff",
            color: "#374151",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
          title="Add expense"
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
          Add expense
        </button>
      </div>

      {/* Card */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 24,
          border: "1px solid #e5e7eb",
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
              border: "2px dashed #d1d5db",
              borderRadius: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              color: "#6b7280",
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
