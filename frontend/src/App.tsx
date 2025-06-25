import React, { useEffect, useState } from "react";

type Metrics = {
  cash: number;
  receivables: number;
  payables: number;
};

function App() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/metrics", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Not authenticated");
      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      setError("Please connect to Zoho first.");
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/login";
  };

  return (
    <div
      style={{ maxWidth: 400, margin: "40px auto", fontFamily: "sans-serif" }}
    >
      <h1>Zoho Metrics Dashboard</h1>
      {!metrics && (
        <button
          onClick={handleLogin}
          style={{ padding: "10px 20px", fontSize: 16 }}
        >
          Connect to Zoho
        </button>
      )}
      {error && <div style={{ color: "red", marginTop: 20 }}>{error}</div>}
      {metrics && (
        <div style={{ marginTop: 30 }}>
          <h2>Key Metrics</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <strong>Cash:</strong> ${metrics.cash.toLocaleString()}
            </li>
            <li>
              <strong>Accounts Receivable:</strong> $
              {metrics.receivables.toLocaleString()}
            </li>
            <li>
              <strong>Accounts Payable:</strong> $
              {metrics.payables.toLocaleString()}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
