"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div className="card" style={{ padding: "2.5rem", width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ color: "var(--primary)", fontSize: "2rem", marginBottom: "0.5rem" }}>TDC MatchHub</h1>
          <p style={{ color: "var(--text-secondary)" }}>Sign in to manage your clients</p>
        </div>

        {error && (
          <div style={{ backgroundColor: "var(--error)", color: "white", padding: "0.75rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem", fontSize: "0.875rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="input-group">
            <label className="input-label" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="e.g. password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ padding: "0.75rem", fontSize: "1rem", marginTop: "0.5rem" }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          <p>Demo Credentials:</p>
          <p>Username: <strong>admin</strong> | Password: <strong>password</strong></p>
        </div>
      </div>
    </div>
  );
}
