import React, { useEffect, useState } from "react";

type Metrics = {
  cash: number;
  receivables: number;
  payables: number;
};

type Invoice = any;
type Bill = any;
type Item = any;
type User = any;

function App() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [users, setUsers] = useState<User[]>([]);
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

  const fetchList = async (endpoint: string, setter: (data: any[]) => void) => {
    try {
      const res = await fetch(`http://localhost:5000/api/${endpoint}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setter(data);
      }
    } catch {}
  };

  useEffect(() => {
    fetchMetrics();
    fetchList("invoices", setInvoices);
    fetchList("bills", setBills);
    fetchList("items", setItems);
    fetchList("users", setUsers);
  }, []);

  const handleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/login";
  };

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "40px auto",
        fontFamily: "sans-serif",
        color: "#fff",
        background: "#222",
        padding: 32,
        borderRadius: 12,
      }}
    >
      <h1>Zoho Metrics Dashboard</h1>
      <button
        onClick={handleLogin}
        style={{ padding: "10px 20px", fontSize: 16, marginBottom: 20 }}
      >
        Connect to Zoho
      </button>
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
      <div style={{ marginTop: 40 }}>
        <h2>Invoices</h2>
        <ul style={{ background: "#333", padding: 16, borderRadius: 8 }}>
          {invoices.length === 0 && <li>No invoices found.</li>}
          {invoices.map((inv: any) => (
            <li key={inv.invoice_id} style={{ marginBottom: 8 }}>
              <strong>{inv.invoice_number}</strong> - {inv.customer_name} - $
              {inv.total} - Status: {inv.status}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ marginTop: 40 }}>
        <h2>Bills</h2>
        <ul style={{ background: "#333", padding: 16, borderRadius: 8 }}>
          {bills.length === 0 && <li>No bills found.</li>}
          {bills.map((bill: any) => (
            <li key={bill.bill_id} style={{ marginBottom: 8 }}>
              <strong>{bill.bill_number}</strong> - {bill.vendor_name} - $
              {bill.total} - Status: {bill.status}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ marginTop: 40 }}>
        <h2>Items</h2>
        <ul style={{ background: "#333", padding: 16, borderRadius: 8 }}>
          {items.length === 0 && <li>No items found.</li>}
          {items.map((item: any) => (
            <li key={item.item_id} style={{ marginBottom: 8 }}>
              <strong>{item.name}</strong> - SKU: {item.sku || "N/A"} - Price: $
              {item.rate}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ marginTop: 40 }}>
        <h2>Users</h2>
        <ul style={{ background: "#333", padding: 16, borderRadius: 8 }}>
          {users.length === 0 && <li>No users found.</li>}
          {users.map((user: any) => (
            <li key={user.user_id} style={{ marginBottom: 8 }}>
              <strong>{user.name}</strong> - {user.email} - Role:{" "}
              {user.role_name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
