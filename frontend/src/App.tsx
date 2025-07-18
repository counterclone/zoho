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
type PurchaseOrder = any;
type Contact = any;
type Estimate = any;
type SalesOrder = any;
type CreditNote = any;
type CustomerPayment = any;
type VendorPayment = any;
type Expense = any;
type Project = any;
type Task = any;
type TimeEntry = any;
type BankAccount = any;
type BankTransaction = any;
type ChartOfAccount = any;
type Journal = any;
type Tax = any;
type Currency = any;
type VendorCredit = any;

function App() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([]);
  const [customerPayments, setCustomerPayments] = useState<CustomerPayment[]>(
    []
  );
  const [vendorPayments, setVendorPayments] = useState<VendorPayment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>(
    []
  );
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccount[]>([]);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [vendorCredits, setVendorCredits] = useState<VendorCredit[]>([]);
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
    fetchList("purchaseorders", setPurchaseOrders);
    fetchList("contacts", setContacts);
    fetchList("estimates", setEstimates);
    fetchList("salesorders", setSalesOrders);
    fetchList("creditnotes", setCreditNotes);
    fetchList("customerpayments", setCustomerPayments);
    fetchList("vendorpayments", setVendorPayments);
    fetchList("expenses", setExpenses);
    fetchList("projects", setProjects);
    fetchList("tasks", setTasks);
    fetchList("timeentries", setTimeEntries);
    fetchList("bankaccounts", setBankAccounts);
    fetchList("banktransactions", setBankTransactions);
    fetchList("chartofaccounts", setChartOfAccounts);
    fetchList("journals", setJournals);
    fetchList("taxes", setTaxes);
    fetchList("currencies", setCurrencies);
    fetchList("vendorcredits", setVendorCredits);
  }, []);

  const handleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/login";
  };

  const DataSection = ({
    title,
    data,
    renderItem,
  }: {
    title: string;
    data: any[];
    renderItem: (item: any) => React.ReactNode;
  }) => (
    <div style={{ marginTop: 40 }}>
      <h2>{title}</h2>
      <ul style={{ background: "#333", padding: 16, borderRadius: 8 }}>
        {data.length === 0 && <li>No {title.toLowerCase()} found.</li>}
        {data.map(renderItem)}
      </ul>
    </div>
  );

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "40px auto",
        fontFamily: "sans-serif",
        color: "#fff",
        background: "#222",
        padding: 32,
        borderRadius: 12,
      }}
    >
      <h1>Zoho Books Dashboard</h1>
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

      <DataSection
        title="Invoices"
        data={invoices}
        renderItem={(inv) => (
          <li key={inv.invoice_id} style={{ marginBottom: 8 }}>
            <strong>{inv.invoice_number}</strong> - {inv.customer_name} - $
            {inv.total} - Status: {inv.status}
          </li>
        )}
      />

      <DataSection
        title="Bills"
        data={bills}
        renderItem={(bill) => (
          <li key={bill.bill_id} style={{ marginBottom: 8 }}>
            <strong>{bill.bill_number}</strong> - {bill.vendor_name} - $
            {bill.total} - Status: {bill.status}
          </li>
        )}
      />

      <DataSection
        title="Purchase Orders"
        data={purchaseOrders}
        renderItem={(po) => (
          <li key={po.purchaseorder_id} style={{ marginBottom: 8 }}>
            <strong>{po.purchaseorder_number}</strong> - {po.vendor_name} - $
            {po.total} - Status: {po.status}
          </li>
        )}
      />

      <DataSection
        title="Estimates"
        data={estimates}
        renderItem={(est) => (
          <li key={est.estimate_id} style={{ marginBottom: 8 }}>
            <strong>{est.estimate_number}</strong> - {est.customer_name} - $
            {est.total} - Status: {est.status}
          </li>
        )}
      />

      <DataSection
        title="Sales Orders"
        data={salesOrders}
        renderItem={(so) => (
          <li key={so.salesorder_id} style={{ marginBottom: 8 }}>
            <strong>{so.salesorder_number}</strong> - {so.customer_name} - $
            {so.total} - Status: {so.status}
          </li>
        )}
      />

      <DataSection
        title="Credit Notes"
        data={creditNotes}
        renderItem={(cn) => (
          <li key={cn.creditnote_id} style={{ marginBottom: 8 }}>
            <strong>{cn.creditnote_number}</strong> - {cn.customer_name} - $
            {cn.total} - Status: {cn.status}
          </li>
        )}
      />

      <DataSection
        title="Customer Payments"
        data={customerPayments}
        renderItem={(cp) => (
          <li key={cp.payment_id} style={{ marginBottom: 8 }}>
            <strong>{cp.payment_number}</strong> - {cp.customer_name} - $
            {cp.amount} - Date: {cp.date}
          </li>
        )}
      />

      <DataSection
        title="Vendor Payments"
        data={vendorPayments}
        renderItem={(vp) => (
          <li key={vp.payment_id} style={{ marginBottom: 8 }}>
            <strong>{vp.payment_number}</strong> - {vp.vendor_name} - $
            {vp.amount} - Date: {vp.date}
          </li>
        )}
      />

      <DataSection
        title="Vendor Credits"
        data={vendorCredits}
        renderItem={(vc) => (
          <li key={vc.vendorcredit_id} style={{ marginBottom: 8 }}>
            <strong>{vc.vendorcredit_number}</strong> - {vc.vendor_name} - $
            {vc.total} - Status: {vc.status}
          </li>
        )}
      />

      <DataSection
        title="Expenses"
        data={expenses}
        renderItem={(exp) => (
          <li key={exp.expense_id} style={{ marginBottom: 8 }}>
            <strong>{exp.expense_number}</strong> - {exp.account_name} - $
            {exp.amount} - Date: {exp.expense_date}
          </li>
        )}
      />

      <DataSection
        title="Projects"
        data={projects}
        renderItem={(proj) => (
          <li key={proj.project_id} style={{ marginBottom: 8 }}>
            <strong>{proj.name}</strong> - Status: {proj.status} - Start:{" "}
            {proj.start_date}
          </li>
        )}
      />

      <DataSection
        title="Tasks"
        data={tasks}
        renderItem={(task) => (
          <li key={task.task_id} style={{ marginBottom: 8 }}>
            <strong>{task.name}</strong> - Project: {task.project_name} -
            Status: {task.status}
          </li>
        )}
      />

      <DataSection
        title="Time Entries"
        data={timeEntries}
        renderItem={(te) => (
          <li key={te.time_entry_id} style={{ marginBottom: 8 }}>
            <strong>{te.task_name}</strong> - Hours: {te.hours} - Date:{" "}
            {te.date}
          </li>
        )}
      />

      <DataSection
        title="Bank Accounts"
        data={bankAccounts}
        renderItem={(ba) => (
          <li key={ba.account_id} style={{ marginBottom: 8 }}>
            <strong>{ba.account_name}</strong> - Balance: ${ba.balance} - Type:{" "}
            {ba.account_type}
          </li>
        )}
      />

      <DataSection
        title="Bank Transactions"
        data={bankTransactions}
        renderItem={(bt) => (
          <li key={bt.transaction_id} style={{ marginBottom: 8 }}>
            <strong>{bt.transaction_type}</strong> - Amount: ${bt.amount} -
            Date: {bt.date}
          </li>
        )}
      />

      <DataSection
        title="Chart of Accounts"
        data={chartOfAccounts}
        renderItem={(coa) => (
          <li key={coa.account_id} style={{ marginBottom: 8 }}>
            <strong>{coa.account_name}</strong> - Type: {coa.account_type} -
            Balance: ${coa.balance}
          </li>
        )}
      />

      <DataSection
        title="Journals"
        data={journals}
        renderItem={(journal) => (
          <li key={journal.journal_id} style={{ marginBottom: 8 }}>
            <strong>{journal.journal_number}</strong> - Date: {journal.date} -
            Status: {journal.status}
          </li>
        )}
      />

      <DataSection
        title="Contacts"
        data={contacts}
        renderItem={(contact) => (
          <li key={contact.contact_id} style={{ marginBottom: 8 }}>
            <strong>{contact.name}</strong> - Type: {contact.contact_type} -
            Email: {contact.email}
          </li>
        )}
      />

      <DataSection
        title="Items"
        data={items}
        renderItem={(item) => (
          <li key={item.item_id} style={{ marginBottom: 8 }}>
            <strong>{item.name}</strong> - SKU: {item.sku || "N/A"} - Price: $
            {item.rate}
          </li>
        )}
      />

      <DataSection
        title="Users"
        data={users}
        renderItem={(user) => (
          <li key={user.user_id} style={{ marginBottom: 8 }}>
            <strong>{user.name}</strong> - {user.email} - Role: {user.role_name}
          </li>
        )}
      />

      <DataSection
        title="Taxes"
        data={taxes}
        renderItem={(tax) => (
          <li key={tax.tax_id} style={{ marginBottom: 8 }}>
            <strong>{tax.tax_name}</strong> - Rate: {tax.tax_percentage}% -
            Type: {tax.tax_type}
          </li>
        )}
      />

      <DataSection
        title="Currencies"
        data={currencies}
        renderItem={(currency) => (
          <li key={currency.currency_id} style={{ marginBottom: 8 }}>
            <strong>{currency.currency_code}</strong> - {currency.currency_name}{" "}
            - Symbol: {currency.currency_symbol}
          </li>
        )}
      />
    </div>
  );
}

export default App;
