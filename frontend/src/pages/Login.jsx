import { useState } from "react";
import { login } from "../api";
import AuthLayout from "../components/AuthLayout";

export default function Login({ onSuccess }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
        onSuccess();
      } else {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            full_name: fullName,
          }),
        });

        if (!res.ok) throw new Error("Register failed");
        setMode("login");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #43442b",
    background: "#bdb4a2",
    fontSize: 14,
  };

  return (
    <AuthLayout>
      <h1 style={{ textAlign: "center", marginBottom: 24, color: "#43442b" }}>
        {mode === "login" ? "Sign in to Spendly" : "Create your account"}
      </h1>

      <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
        {mode === "register" && (
          <input
            style={inputStyle}
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        )}

        <input
          style={inputStyle}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          style={inputStyle}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <div style={{ color: "#7f1d1d" }}>{error}</div>}

        <button
          disabled={loading}
          style={{
            marginTop: 8,
            padding: 12,
            borderRadius: 12,
            border: "1px solid #43442b",
            background: "transparent",
            color: "#43442b",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Sign in"
            : "Create account"}
        </button>
      </form>

      <div style={{ marginTop: 16, textAlign: "center" }}>
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          style={{
            background: "none",
            border: "none",
            color: "#43442b",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {mode === "login"
            ? "Create an account"
            : "Already have an account?"}
        </button>
      </div>
    </AuthLayout>
  );
}
