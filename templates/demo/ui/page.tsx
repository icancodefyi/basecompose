"use client";

import { useEffect, useState } from "react";

export function DemoHero() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("/api/health");
        const data = await res.json();
        setStatus(data);
      } catch (err) {
        setStatus({ error: "Failed to load" });
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, []);

  return (
    <section style={{
      padding: "4rem 2rem",
      textAlign: "center",
      backgroundColor: "#f5f5f5",
      borderRadius: "8px",
      marginBottom: "2rem"
    }}>
      <h1 style={{ marginBottom: "1rem" }}>Welcome to BaseCompose</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        Your complete, runnable stack is ready.
      </p>

      {loading ? (
        <p>Loading stack info...</p>
      ) : status?.features ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginTop: "2rem"
        }}>
          <FeatureCard label="Frontend" enabled={status.features.nextjs} icon="⚛️" />
          <FeatureCard label="Database" enabled={status.features.database} icon="🗄️" />
          <FeatureCard label="Authentication" enabled={status.features.auth} icon="🔐" />
        </div>
      ) : null}

      <p style={{ fontSize: "0.9rem", color: "#999", marginTop: "2rem" }}>
        Start editing to build your application.
      </p>
    </section>
  );
}

function FeatureCard({ label, enabled, icon }: { label: string; enabled: boolean; icon: string }) {
  return (
    <div style={{
      padding: "1.5rem",
      backgroundColor: enabled ? "#e8f5e9" : "#f5f5f5",
      borderRadius: "8px",
      border: `2px solid ${enabled ? "#4caf50" : "#ddd"}`
    }}>
      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{icon}</div>
      <div style={{ fontWeight: "bold" }}>{label}</div>
      <div style={{ fontSize: "0.9rem", color: enabled ? "#4caf50" : "#999" }}>
        {enabled ? "✓ Enabled" : "○ Not configured"}
      </div>
    </div>
  );
}
