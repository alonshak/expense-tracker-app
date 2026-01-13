import Logo from "./Logo";

export default function AuthLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "white",
          borderRadius: 16,
          padding: 32,
          border: "1px solid #e7e5e4",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <Logo size={48} />
        </div>

        {children}
      </div>
    </div>
  );
}
