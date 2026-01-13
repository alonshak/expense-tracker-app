export default function MonthSelector({ month, setMonth }) {
  return (
    <select
      value={month}
      onChange={e => setMonth(+e.target.value)}
      style={{
        padding: 8,
        borderRadius: 8,
        border: "1px solid #ddd",
      }}
    >
      {[...Array(12)].map((_, i) => (
        <option key={i + 1} value={i + 1}>
          Month {i + 1}
        </option>
      ))}
    </select>
  );
}
