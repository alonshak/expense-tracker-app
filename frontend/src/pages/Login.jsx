import { useState } from "react";
import { login } from "../api";
import AuthLayout from "../components/AuthLayout";

export default function Login({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);
      localStorage.setItem("token", res.access_token);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>
        Sign in to Spendly
      </h1>

      <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {error && <div style={{ color: "crimson" }}>{error}</div>}

        <button disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
}
