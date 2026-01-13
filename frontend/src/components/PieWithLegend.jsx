import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#6366f1", // indigo
  "#22c55e", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
  "#a855f7", // purple
  "#64748b", // slate
];

export default function PieWithLegend({ data }) {
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0) return null;

  return (
    <div style={{ display: "flex", gap: 32 }}>
      <div style={{ width: 240, height: 240 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={safeData}
              dataKey="spent"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
            >
              {safeData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ flex: 1 }}>
        <h3 style={{ marginBottom: 12 }}>By Category</h3>

        {safeData.map((d, i) => (
          <div
            key={d.category}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #eee",
              fontSize: 14,
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

            <div>
              ₪{d.spent} · {(d.percent * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
