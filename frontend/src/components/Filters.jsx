export default function Filters({ filters, setFilters, categories }) {
  return (
    <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr 1fr" }}>
      <label>
        From
        <input
          type="date"
          value={filters.from || ""}
          onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
          style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
        />
      </label>

      <label>
        To
        <input
          type="date"
          value={filters.to || ""}
          onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
          style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
        />
      </label>

      <label>
        Category
        <select
          value={filters.category || ""}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
          style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
