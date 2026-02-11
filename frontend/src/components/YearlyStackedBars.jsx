import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from "recharts";

const MONTHS_SHORT = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const COLORS = [
  "#C08A5B",
  "#8B6F5A",
  "#6E7D5B",
  "#4B5D73",
  "#2F2A26",
];

function buildColorMap(categories) {
  const map = {};
  (categories || []).forEach((c, i) => (map[c] = COLORS[i % COLORS.length]));
  return map;
}

function money(n) {
  const v = Number(n) || 0;
  return `₪${v.toFixed(0)}`;
}

// Path: rounded TOP corners only, bottom corners sharp
function roundedTopRectPath(x, y, w, h, r) {
  const rr = Math.max(0, Math.min(r, w / 2, h)); // safe radius
  if (rr === 0) return `M${x},${y}h${w}v${h}h-${w}Z`;

  const right = x + w;
  const bottom = y + h;

  return [
    `M${x},${bottom}`,
    `V${y + rr}`,
    `Q${x},${y} ${x + rr},${y}`,
    `H${right - rr}`,
    `Q${right},${y} ${right},${y + rr}`,
    `V${bottom}`,
    `H${x}`,
    "Z",
  ].join(" ");
}

function SegmentShape(props) {
  const { x, y, width, height, fill, payload, dataKey } = props;

  if (!width || !height) return null;

  const isTop = payload?.__topKey === dataKey;
  const r = isTop ? 10 : 0;

  return (
    <path d={roundedTopRectPath(x, y, width, height, r)} fill={fill} />
  );
}

function TotalLabel(props) {
  const { x, y, width, payload, dataKey } = props;
  const isTop = payload?.__topKey === dataKey;
  if (!isTop) return null;

  const total = Number(payload?.total) || 0;
  if (total <= 0) return null;

  return (
    <text
      x={x + width / 2}
      y={y - 8}
      textAnchor="middle"
      fontSize="12"
      fontWeight="800"
      fill="#3f3f3f"
    >
      {money(total)}
    </text>
  );
}

function CustomTooltip({ active, payload, label, categories, colorMap }) {
  if (!active || !payload || payload.length === 0) return null;
  const row = payload[0]?.payload;
  if (!row) return null;

  const monthIndex = (Number(label) || 1) - 1;
  const monthName = MONTHS_SHORT[monthIndex] || `M${label}`;

  const lines = (categories || [])
    .map((cat) => ({
      category: cat,
      value: Number(row[cat]) || 0,
      color: colorMap[cat],
    }))
    .filter((x) => x.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 13,
        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        color: "#3f3f3f",
        minWidth: 220,
      }}
    >
      <div style={{ fontWeight: 800, marginBottom: 6 }}>
        {monthName} · Total {money(row.total)}
      </div>

      {lines.length === 0 ? (
        <div style={{ color: "#6b7280" }}>No expenses</div>
      ) : (
        <div style={{ display: "grid", gap: 6 }}>
          {lines.map((x) => (
            <div
              key={x.category}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: x.color,
                  }}
                />
                <span style={{ fontWeight: 700 }}>{x.category}</span>
              </div>
              <div>{money(x.value)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function YearlyStackedBars({ yearlyMonths }) {
  const categories = yearlyMonths?.categories || [];
  const months = yearlyMonths?.months || [];

  if (!Array.isArray(months) || months.length === 0) return null;

  const colorMap = buildColorMap(categories);

  // mark which category is the TOP non-zero segment per month (for rounded top + label)
  const monthsWithTop = months.map((m) => {
    let topKey = null;
    for (let i = categories.length - 1; i >= 0; i--) {
      const k = categories[i];
      if ((Number(m[k]) || 0) > 0) {
        topKey = k;
        break;
      }
    }
    return { ...m, __topKey: topKey };
  });

  // ✅ month -> total (for X axis second line)
  const totalByMonth = Object.fromEntries(
    monthsWithTop.map((m) => [m.month, Number(m.total) || 0])
  );

  function XTick({ x, y, payload }) {
    const m = payload?.value; // 1..12
    const total = totalByMonth[m] || 0;
    const monthLabel = MONTHS_SHORT[(Number(m) || 1) - 1] || m;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={12}
          textAnchor="middle"
          fill="#3f3f3f"
          fontSize="12"
          fontWeight="700"
        >
          {monthLabel}
        </text>

        <text
          x={0}
          y={0}
          dy={28}
          textAnchor="middle"
          fill="#6b7280"
          fontSize="11"
          fontWeight="800"
        >
          ₪{Math.round(total).toLocaleString("en-US")}
        </text>
      </g>
    );
  }

  return (
    <div style={{ width: "100%", height: 290 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={monthsWithTop}
          barCategoryGap={18}
          margin={{ top: 10, right: 10, left: 10, bottom: 28 }}
        >
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={<XTick />}
          />
          <YAxis hide />

          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
            content={(props) => (
              <CustomTooltip {...props} categories={categories} colorMap={colorMap} />
            )}
          />

          {categories.map((cat) => (
            <Bar
              key={cat}
              dataKey={cat}
              stackId="month"
              fill={colorMap[cat]}
              shape={<SegmentShape />}
              isAnimationActive={true}
            >
              <LabelList content={<TotalLabel />} />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
