export default function ExpenseRow({ expense, onEdit }) {
  const date = new Date(expense.date).toLocaleDateString("en-GB");

  return (
    <button
      type="button"
      onClick={() => onEdit?.(expense)}
      style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "120px 1fr auto",
        gap: 12,
        padding: "10px 10px",
        border: "none",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        background: "transparent",
        textAlign: "left",
        fontSize: 14,
        alignItems: "center",
        cursor: "pointer",
        color: "inherit",
        borderRadius: 12,
        transition: "background 160ms ease, transform 120ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.22)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.995)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      onFocus={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.22)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
      title="Edit expense"
    >
      <div style={{ color: "#6b7280" }}>{date}</div>

      <div>
        <strong>{expense.category}</strong>
        <div style={{ color: "#6b7280", fontSize: 12 }}>
          {expense.description || "—"}
        </div>
      </div>

      <div style={{ fontWeight: 800, color: "#3f3f3f" }}>
  ₪{Math.round(Number(expense.amount) || 0).toLocaleString("en-US")}
</div>

    </button>
  );
}
