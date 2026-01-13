import Logo from "./Logo";

export default function Header() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        marginBottom: 24,
      }}
    >
      <Logo size={40} />
      <span
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: "#111827",
          letterSpacing: "-0.4px",
        }}
      >
        spendly
      </span>
    </div>
  );
}
