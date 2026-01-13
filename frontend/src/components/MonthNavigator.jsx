const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function MonthNavigator({ month, year, onPrev, onNext, canGoNext }) {
  return (
    <div style={styles.wrapper}>
      <button onClick={onPrev} style={styles.btn}>◀</button>

      <div style={styles.label}>
        {MONTHS[month]} {year}
      </div>

      <button
        onClick={onNext}
        disabled={!canGoNext}
        style={{
          ...styles.btn,
          opacity: canGoNext ? 1 : 0.3,
          cursor: canGoNext ? "pointer" : "default",
        }}
      >
        ▶
      </button>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  label: {
    minWidth: 160,
    textAlign: "center",
    fontWeight: 600,
    fontSize: 16,
    color: "#111827",
  },
  btn: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: "6px 10px",
    background: "white",
    fontSize: 14,
  },
};
