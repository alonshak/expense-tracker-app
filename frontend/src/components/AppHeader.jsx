import logo from "../assets/logo.png";

export default function AppHeader({ showLogout = false, onLogout }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
        height: 64,
        background: "#D0C7B2",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      }}
    >
      {/* Logo */}
      <img
        src={logo}
        alt="Spendly"
        style={{
          height: 48,
          objectFit: "contain",
        }}
      />

      {/* Logout – רק אם מחובר */}
      {showLogout && (
        <button
          onClick={onLogout}
          style={{
            background: "transparent",
            border: "1px solid #43442c",
            color: "#43442b",
            padding: "8px 14px",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      )}
    </header>
  );
}
