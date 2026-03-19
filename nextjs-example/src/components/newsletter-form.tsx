"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "1rem" }}>
        <p style={{ color: "green", fontSize: "1.2rem" }}>
          Grazie per l&apos;iscrizione!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="La tua email"
        required
        style={{
          padding: "0.75rem 1rem",
          border: "2px solid #ddd",
          borderRadius: "4px",
          fontSize: "1rem",
          minWidth: "280px",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "0.75rem 2rem",
          background: "#333",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        Iscriviti
      </button>
    </form>
  );
}
