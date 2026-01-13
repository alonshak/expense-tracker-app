import Logo from "./Logo";

export default function AuthLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#939474",
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
          background: "#D0C7B3",
          borderRadius: 18,
          padding: 32,
          border: "1px solid #bdb4a2",
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
