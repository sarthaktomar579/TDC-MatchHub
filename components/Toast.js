"use client";

import { useEffect } from 'react';

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "var(--success)" : "var(--error)";

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      backgroundColor: bgColor,
      color: "white",
      padding: "1rem 1.5rem",
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-lg)",
      zIndex: 9999,
      animation: "slideIn 0.3s ease-out forwards",
      fontWeight: "500"
    }}>
      {message}
    </div>
  );
}
