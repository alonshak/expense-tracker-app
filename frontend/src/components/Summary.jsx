export default function Summary({ monthlyTotal, breakdown }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Monthly Total</h2>
        <div style={{ fontSize: 28, fontWeight: 800 }}>{monthlyTotal.toFixed(2)}</div>
      </div>

      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>By Category</h2>
        {breakdown.length === 0 ? (
          <div style={{ color: "#666" }}>No data.</div>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {breakdown.map((b) => (
              <li key={b.category}>
                <strong>{b.category}</strong>: {b.total.toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
