import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const COLORS = [
 "#87756a",
"#56453a",
"#553d2c",
"#3f2813",
"#0f0704",

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
      <div style={{ fontWeight: 600, marginBottom: 2 }}>
        {d.category}
      </div>
      <div>₪{d.spent}</div>
      <div style={{ color: "#6b7280" }}>
        {(d.percent * 100).toFixed(1)}%
      </div>
    </div>
  );
}

export default function PieWithLegend({ data }) {
  const safeData = Array.isArray(data) ? data : [];
  if (safeData.length === 0) return null;

  return (
    <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
      {/* Pie */}
      <PieChart width={260} height={260}>
        <Pie
          data={safeData}
          dataKey="spent"
          nameKey="category"
          cx={120}
          cy={130}
          innerRadius={70}
          outerRadius={100}
          paddingAngle={3}      // ✅ מרווחים בין הפרוסות
          stroke="none"         // ❌ בלי בורדר
          strokeWidth={0}
        >
          {safeData.map((_, i) => (
            <Cell
              key={i}
              fill={COLORS[i % COLORS.length]}
              stroke="none"
            />
          ))}
        </Pie>

        <Tooltip content={<CustomTooltip />} />
      </PieChart>

      {/* Legend */}
      <div style={{ flex: 1 }}>
        <h3 style={{ marginBottom: 12, color: "#3f3f3f" }}>
          By Category
        </h3>

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

            <div>
              ₪{d.spent} · {(d.percent * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
