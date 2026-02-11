import {
  BarChart,
  Bar,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#C08A5B",
  "#8B6F5A",
  "#6E7D5B",
  "#4B5D73",
  "#2F2A26",
];


function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;

  const d = payload[0].payload;

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 13,
        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        color: "#3f3f3f",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 2 }}>{d.category}</div>
      <div>₪{d.spent}</div>
    </div>
  );
}

export default function BarWithLegend({ data }) {
  const safeData = Array.isArray(data) ? data : [];
  if (safeData.length === 0) return null;

  return (
    <div style={{ display: "flex", gap: 28, alignItems: "center", width: "100%" }}>
      {/* Bars */}
      <div style={{ flex: 1, height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={safeData}>
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="spent" radius={[10, 10, 10, 10]} barSize={26}>
              {safeData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div style={{ width: 260 }}>
        <h3 style={{ marginBottom: 12, color: "#3f3f3f" }}>By Category</h3>

        {safeData.map((d, i) => (
          <div
            key={d.category}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              fontSize: 14,
              color: "#3f3f3f",
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: COLORS[i % COLORS.length],
                  marginTop: 6,
                }}
              />
              {d.category}
            </div>

            <div>₪{d.spent}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
