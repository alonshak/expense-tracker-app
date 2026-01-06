export default function ExpenseTable({ expenses }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Expenses</h2>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 10 }}>Date</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 10 }}>Category</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 10 }}>Description</th>
              <th style={{ textAlign: "right", borderBottom: "1px solid #eee", padding: 10 }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: 10, color: "#666" }}>No expenses found.</td>
              </tr>
            ) : (
              expenses.map((e) => (
                <tr key={e.id}>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f3f3" }}>{e.date}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f3f3" }}>{e.category}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f3f3" }}>{e.description || "-"}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f3f3", textAlign: "right" }}>
                    {e.amount.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
