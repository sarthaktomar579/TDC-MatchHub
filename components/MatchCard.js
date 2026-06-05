"use client";

import { useState } from "react";
import Toast from "./Toast";

export default function MatchCard({ match }) {
  const [showToast, setShowToast] = useState(false);
  const aiData = match.aiMatchData;
  
  const handleSendMatch = () => {
    // In a real app, this would hit an API endpoint to log the action or send the email
    setShowToast(true);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "var(--success)";
    if (score >= 75) return "var(--warning)";
    return "var(--text-secondary)";
  };

  return (
    <div className="card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>{match.firstName} {match.lastName}</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            {match.age} yrs • {match.height} • {match.city}
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            {match.designation} at {match.currentCompany}
          </p>
        </div>
        
        {aiData && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: "700", color: getScoreColor(aiData.score) }}>
              {aiData.score}%
            </div>
            <span className="badge badge-blue">{aiData.label}</span>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.875rem" }}>
        <div><strong>Income:</strong> ₹{match.income.toLocaleString()}</div>
        <div><strong>Religion:</strong> {match.religion}</div>
        <div><strong>Diet:</strong> {match.diet}</div>
        <div><strong>Kids:</strong> {match.wantKids}</div>
      </div>

      {aiData && aiData.explanation && (
        <div style={{ backgroundColor: "#f8fafc", padding: "1rem", borderRadius: "var(--radius-md)", fontSize: "0.875rem" }}>
          <strong>AI Analysis:</strong> {aiData.explanation}
        </div>
      )}

      {aiData && aiData.introEmail && (
        <div style={{ border: "1px solid var(--border-color)", padding: "1rem", borderRadius: "var(--radius-md)", fontSize: "0.875rem" }}>
          <strong style={{ display: "block", marginBottom: "0.5rem" }}>Suggested Intro:</strong>
          <p style={{ whiteSpace: "pre-wrap", color: "var(--text-secondary)" }}>{aiData.introEmail}</p>
        </div>
      )}

      <button className="btn btn-primary" onClick={handleSendMatch} style={{ width: "100%", marginTop: "auto" }}>
        Send Match
      </button>

      {showToast && (
        <Toast message={`Match proposal sent to ${match.firstName} successfully!`} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}
