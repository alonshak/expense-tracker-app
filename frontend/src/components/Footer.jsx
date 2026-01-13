export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 64,
        padding: "24px 0",
        textAlign: "center",
        color: "#6b7280",
        fontSize: 13,
      }}
    >
      <div style={{ marginBottom: 4 }}>
        <strong style={{ color: "#111827" }}>Spendly</strong> · Personal expense tracker
      </div>
      <div>© {new Date().getFullYear()}</div>
    </footer>
  );
}
