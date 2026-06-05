"use client";

import { useState } from "react";
import MatchCard from "./MatchCard";

export default function PotentialMatches({ customerId }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);

  const fetchMatches = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setMatches(data.matches);
        setHasFetched(true);
      } else {
        setError(data.message || "Failed to fetch matches");
      }
    } catch (err) {
      setError("An error occurred while fetching matches");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2>Potential Matches</h2>
        <button className="btn btn-primary" onClick={fetchMatches} disabled={loading}>
          {loading ? "Finding Matches..." : hasFetched ? "Refresh Matches" : "Find Matches"}
        </button>
      </div>

      {error && <div style={{ color: "var(--error)", marginBottom: "1rem" }}>{error}</div>}

      {hasFetched && matches.length === 0 && (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)", backgroundColor: "white", borderRadius: "var(--radius-lg)" }}>
          No highly compatible matches found at the moment.
        </div>
      )}

      {matches.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
          {matches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
