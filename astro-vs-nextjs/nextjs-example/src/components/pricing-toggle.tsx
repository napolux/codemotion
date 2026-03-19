"use client";

import { useState } from "react";

const plans = [
  { name: "Starter", monthly: 9, annual: 7 },
  { name: "Pro", monthly: 29, annual: 23 },
  { name: "Enterprise", monthly: 99, annual: 79 },
];

export default function PricingToggle() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: "2rem" }}>
        <button
          onClick={() => setIsAnnual(false)}
          style={{
            padding: "0.5rem 1.5rem",
            border: "2px solid #333",
            background: !isAnnual ? "#333" : "#fff",
            color: !isAnnual ? "#fff" : "#333",
            cursor: "pointer",
            borderRadius: "4px 0 0 4px",
            fontSize: "1rem",
          }}
        >
          Mensile
        </button>
        <button
          onClick={() => setIsAnnual(true)}
          style={{
            padding: "0.5rem 1.5rem",
            border: "2px solid #333",
            borderLeft: "none",
            background: isAnnual ? "#333" : "#fff",
            color: isAnnual ? "#fff" : "#333",
            cursor: "pointer",
            borderRadius: "0 4px 4px 0",
            fontSize: "1rem",
          }}
        >
          Annuale
        </button>
      </div>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
        {plans.map((plan) => (
          <div
            key={plan.name}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "2rem",
              minWidth: "200px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ margin: "0 0 1rem" }}>{plan.name}</h3>
            <p style={{ fontSize: "2.5rem", fontWeight: "bold", margin: "0" }}>
              €{isAnnual ? plan.annual : plan.monthly}
            </p>
            <p style={{ color: "#666", margin: "0.5rem 0 0" }}>
              {isAnnual ? "/mese (fatturato annualmente)" : "/mese"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
