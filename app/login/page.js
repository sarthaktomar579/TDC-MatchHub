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
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh",
      backgroundImage: "url('https://images.unsplash.com/photo-1518104593124-ac2e82a5eb9b?q=80&w=2070&auto=format&fit=crop')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative"
    }}>
      {/* Dark overlay for better text readability */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)" }}></div>

      <div className="card animate-fade-in" style={{ padding: "3rem", width: "100%", maxWidth: "420px", position: "relative", zIndex: 1, backgroundColor: "rgba(255, 255, 255, 0.85)" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 style={{ color: "var(--primary)", fontSize: "2.5rem", marginBottom: "0.5rem", letterSpacing: "-0.05em" }}>MatchHub</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>Elevate your matchmaking</p>
        </div>

        {error && (
          <div style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "var(--error)", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "0.75rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem", fontSize: "0.875rem", textAlign: "center", fontWeight: "500" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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
            style={{ padding: "0.875rem", fontSize: "1.1rem", marginTop: "1rem", borderRadius: "var(--radius-xl)" }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ marginTop: "2.5rem", textAlign: "center", fontSize: "0.875rem", color: "var(--text-secondary)", backgroundColor: "rgba(255, 255, 255, 0.5)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
          <p style={{ marginBottom: "0.25rem" }}><strong>Demo Credentials</strong></p>
          <p>Username: admin | Password: password</p>
        </div>
      </div>
    </div>
  );
}
