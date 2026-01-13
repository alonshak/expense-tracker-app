export default function ExpenseRow({ expense }) {
  const date = new Date(expense.date).toLocaleDateString("en-GB");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "120px 1fr auto",
        gap: 12,
        padding: "10px 0",
        borderBottom: "1px solid #f3f4f6",
        fontSize: 14,
      }}
    >
      <div style={{ color: "#6b7280" }}>{date}</div>
      <div>
        <strong>{expense.category}</strong>
        <div style={{ color: "#6b7280", fontSize: 12 }}>
          {expense.description || "—"}
        </div>
      </div>
      <div style={{ fontWeight: 600 }}>₪{expense.amount}</div>
    </div>
  );
}
