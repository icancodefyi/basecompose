"use client";

import { useState } from "react";

export default function DemoPage() {
  const [status, setStatus] = useState<string | null>(null);

  const callHealthAPI = async () => {
    const res = await fetch("/api/health");
    const data = await res.json();
    setStatus(JSON.stringify(data));
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Layered Starter</h1>
      <p>This is your generated Next.js app with demo addon.</p>
      <button
        onClick={callHealthAPI}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Call Demo API
      </button>
      {status && <p>Status: {status}</p>}
    </main>
  );
}
