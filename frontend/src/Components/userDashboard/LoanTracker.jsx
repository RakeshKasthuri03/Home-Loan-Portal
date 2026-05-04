import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../utils/auth";
import "../../Styles/LoanTracker.css";

const MOCK_LOAN = {
  id: "HLP-2025-00142",
  type: "Home Purchase Loan",
  sanctionedAmount: 5000000,
  interestRate: 8.5,
  startDate: "01 Jan 2024",
  endDate: "01 Jan 2054",
  tenureMonths: 360,
  completedMonths: 16,
  nextEMIDate: "05 Jun 2025",
  nextEMIAmount: 38446,
  principalPaid: 198420,
  interestPaid: 416516,
  principalRemaining: 4801580,
  status: "Active",
  officer: "Priya Sharma",
};

const MOCK_TRANSACTIONS = [
  { id: "TXN-0016", date: "05 May 2025", amount: 38446, principal: 4892,  interest: 33554, balance: 4801580, status: "Paid" },
  { id: "TXN-0015", date: "05 Apr 2025", amount: 38446, principal: 4927,  interest: 33519, balance: 4806472, status: "Paid" },
  { id: "TXN-0014", date: "05 Mar 2025", amount: 38446, principal: 4962,  interest: 33484, balance: 4811399, status: "Paid" },
  { id: "TXN-0013", date: "05 Feb 2025", amount: 38446, principal: 4997,  interest: 33449, balance: 4816361, status: "Paid" },
  { id: "TXN-0012", date: "05 Jan 2025", amount: 38446, principal: 5032,  interest: 33414, balance: 4821358, status: "Paid" },
  { id: "TXN-0011", date: "05 Dec 2024", amount: 38446, principal: 5068,  interest: 33378, balance: 4826390, status: "Paid" },
];

const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");
const pct = (a, b) => Math.round((a / b) * 100);

export default function LoanTracker() {
  const navigate = useNavigate();
  const user = getUser();
  const loan = MOCK_LOAN;

  const [activeTab, setActiveTab]       = useState("overview");
  const [prepayAmount, setPrepayAmount] = useState("");
  const [prepayMsg, setPrepayMsg]       = useState("");
  const [closureMsg, setClosureMsg]     = useState("");

  // Pay EMI state
  const [payMethod, setPayMethod]   = useState("upi");
  const [payStep, setPayStep]       = useState("form"); // "form" | "confirm" | "success"
  const [payDetails, setPayDetails] = useState({ upiId: "", cardNumber: "", cardName: "", expiry: "", cvv: "", bank: "" });
  const [txnId]                     = useState("TXN-" + Date.now().toString().slice(-8));

  const paidPct      = pct(loan.completedMonths, loan.tenureMonths);
  const principalPct = pct(loan.principalPaid, loan.sanctionedAmount);

  const handlePrepay = (e) => {
    e.preventDefault();
    setPrepayMsg(`✅ Pre-payment request of ${fmt(prepayAmount)} submitted. Our team will process it within 2 business days.`);
    setPrepayAmount("");
  };

  const handleClosure = (e) => {
    e.preventDefault();
    setClosureMsg("✅ Loan closure request submitted. Our team will contact you within 3 business days with the foreclosure statement.");
  };

  return (
    <div className="lt-page">

      {/* Header */}
      <div className="lt-header">
        <div>
          <h2>Loan Tracker</h2>
          <p>Welcome, {user?.name?.split(" ")[0] || "User"} — here's your loan at a glance</p>
        </div>
        <button className="lt-btn lt-btn--primary" onClick={() => navigate("/loan-types")}>
          + New Application
        </button>
      </div>

      {/* Loan Summary */}
      <div className="lt-summary-card">
        <div className="lt-summary-top">
          <div>
            <span className="lt-loan-id">{loan.id}</span>
            <h3>{loan.type}</h3>
            <span className="lt-status lt-status--active">{loan.status}</span>
          </div>
          <div className="lt-summary-amount">
            <span className="lt-amount-label">Sanctioned Amount</span>
            <span className="lt-amount-value">{fmt(loan.sanctionedAmount)}</span>
          </div>
        </div>
        <div className="lt-summary-grid">
          <div className="lt-summary-item"><span className="lt-item-label">Interest Rate</span><span className="lt-item-value">{loan.interestRate}% p.a.</span></div>
          <div className="lt-summary-item"><span className="lt-item-label">Start Date</span><span className="lt-item-value">{loan.startDate}</span></div>
          <div className="lt-summary-item"><span className="lt-item-label">End Date</span><span className="lt-item-value">{loan.endDate}</span></div>
          <div className="lt-summary-item"><span className="lt-item-label">Loan Officer</span><span className="lt-item-value">{loan.officer}</span></div>
        </div>
      </div>

      {/* Next EMI Alert */}
      <div className="lt-emi-alert">
        <div className="lt-emi-left">
          <span className="lt-emi-icon">📅</span>
          <div>
            <div className="lt-emi-title">Next EMI Due</div>
            <div className="lt-emi-date">{loan.nextEMIDate}</div>
          </div>
        </div>
        <div className="lt-emi-amount">{fmt(loan.nextEMIAmount)}</div>
      </div>

      {/* Tabs */}
      <div className="lt-tabs">
        {["overview", "pay", "history", "prepayment", "closure"].map((tab) => (
          <button key={tab} className={`lt-tab ${activeTab === tab ? "lt-tab--active" : ""}`} onClick={() => setActiveTab(tab)}>
            {{ overview: "📊 Overview", pay: "💳 Pay EMI", history: "🧾 Payment History", prepayment: "💰 Pre-payment", closure: "🔒 Loan Closure" }[tab]}
          </button>
        ))}
      </div>

      {/* Pay EMI */}
      {activeTab === "pay" && (
        <div className="lt-section">

          {payStep === "success" ? (
            /* ── SUCCESS SCREEN ── */
            <div className="lt-pay-success">
              <div className="lt-pay-success-icon">✅</div>
              <h3>Payment Successful!</h3>
              <p>Your EMI of <strong>{fmt(loan.nextEMIAmount)}</strong> has been paid successfully.</p>
              <div className="lt-pay-txn-box">
                <span className="lt-pay-txn-label">Transaction ID</span>
                <span className="lt-pay-txn-id">{txnId}</span>
              </div>
              <div className="lt-pay-txn-box">
                <span className="lt-pay-txn-label">Date & Time</span>
                <span className="lt-pay-txn-id">{new Date().toLocaleString("en-IN")}</span>
              </div>
              <p style={{ fontSize: "0.82rem", color: "#6b7280", marginTop: "12px" }}>
                A confirmation will be sent to your registered email and mobile.
              </p>
              <button className="lt-btn lt-btn--outline" onClick={() => { setPayStep("form"); setActiveTab("history"); }}>
                View Payment History
              </button>
            </div>

          ) : payStep === "confirm" ? (
            /* ── CONFIRM SCREEN ── */
            <div>
              <h4>Confirm Payment</h4>
              <p className="lt-section-desc">Please review your payment details before confirming.</p>
              <div className="lt-pay-confirm-card">
                <div className="lt-pay-confirm-row"><span>Loan ID</span><strong>{loan.id}</strong></div>
                <div className="lt-pay-confirm-row"><span>EMI Amount</span><strong style={{ color: "#0f4c8a", fontSize: "1.1rem" }}>{fmt(loan.nextEMIAmount)}</strong></div>
                <div className="lt-pay-confirm-row"><span>Due Date</span><strong>{loan.nextEMIDate}</strong></div>
                <div className="lt-pay-confirm-row"><span>Payment Method</span><strong style={{ textTransform: "uppercase" }}>{payMethod}</strong></div>
                {payMethod === "upi" && <div className="lt-pay-confirm-row"><span>UPI ID</span><strong>{payDetails.upiId}</strong></div>}
                {payMethod === "card" && <div className="lt-pay-confirm-row"><span>Card</span><strong>**** **** **** {payDetails.cardNumber.slice(-4)}</strong></div>}
                {payMethod === "netbanking" && <div className="lt-pay-confirm-row"><span>Bank</span><strong>{payDetails.bank}</strong></div>}
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button className="lt-btn lt-btn--outline" onClick={() => setPayStep("form")}>← Back</button>
                <button className="lt-btn lt-btn--primary" onClick={() => setPayStep("success")}>
                  Confirm & Pay {fmt(loan.nextEMIAmount)}
                </button>
              </div>
            </div>

          ) : (
            /* ── PAYMENT FORM ── */
            <div>
              <h4>Pay EMI</h4>
              <p className="lt-section-desc">Pay your monthly EMI securely using your preferred payment method.</p>

              {/* EMI summary */}
              <div className="lt-pay-summary">
                <div className="lt-pay-summary-item">
                  <span>EMI Amount</span>
                  <strong>{fmt(loan.nextEMIAmount)}</strong>
                </div>
                <div className="lt-pay-summary-item">
                  <span>Due Date</span>
                  <strong>{loan.nextEMIDate}</strong>
                </div>
                <div className="lt-pay-summary-item">
                  <span>Loan ID</span>
                  <strong style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{loan.id}</strong>
                </div>
              </div>

              {/* Payment method selector */}
              <div className="lt-pay-methods">
                {[
                  { key: "upi",        label: "UPI",         icon: "📱" },
                  { key: "card",       label: "Debit/Credit Card", icon: "💳" },
                  { key: "netbanking", label: "Net Banking",  icon: "🏦" },
                ].map(m => (
                  <div
                    key={m.key}
                    className={`lt-pay-method ${payMethod === m.key ? "lt-pay-method--active" : ""}`}
                    onClick={() => setPayMethod(m.key)}
                  >
                    <span>{m.icon}</span>
                    <span>{m.label}</span>
                  </div>
                ))}
              </div>

              {/* UPI */}
              {payMethod === "upi" && (
                <form className="lt-form" onSubmit={e => { e.preventDefault(); setPayStep("confirm"); }}>
                  <div className="lt-form-group">
                    <label>UPI ID</label>
                    <input className="lt-input" type="text" placeholder="yourname@upi" value={payDetails.upiId} onChange={e => setPayDetails(p => ({ ...p, upiId: e.target.value }))} required />
                  </div>
                  <button type="submit" className="lt-btn lt-btn--primary">Proceed to Pay {fmt(loan.nextEMIAmount)}</button>
                </form>
              )}

              {/* Card */}
              {payMethod === "card" && (
                <form className="lt-form" onSubmit={e => { e.preventDefault(); setPayStep("confirm"); }}>
                  <div className="lt-form-group">
                    <label>Card Number</label>
                    <input className="lt-input" type="text" placeholder="1234 5678 9012 3456" maxLength={16} value={payDetails.cardNumber} onChange={e => setPayDetails(p => ({ ...p, cardNumber: e.target.value }))} required />
                  </div>
                  <div className="lt-form-group">
                    <label>Cardholder Name</label>
                    <input className="lt-input" type="text" placeholder="Name on card" value={payDetails.cardName} onChange={e => setPayDetails(p => ({ ...p, cardName: e.target.value }))} required />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <div className="lt-form-group">
                      <label>Expiry (MM/YY)</label>
                      <input className="lt-input" type="text" placeholder="MM/YY" maxLength={5} value={payDetails.expiry} onChange={e => setPayDetails(p => ({ ...p, expiry: e.target.value }))} required />
                    </div>
                    <div className="lt-form-group">
                      <label>CVV</label>
                      <input className="lt-input" type="password" placeholder="•••" maxLength={3} value={payDetails.cvv} onChange={e => setPayDetails(p => ({ ...p, cvv: e.target.value }))} required />
                    </div>
                  </div>
                  <button type="submit" className="lt-btn lt-btn--primary">Proceed to Pay {fmt(loan.nextEMIAmount)}</button>
                </form>
              )}

              {/* Net Banking */}
              {payMethod === "netbanking" && (
                <form className="lt-form" onSubmit={e => { e.preventDefault(); setPayStep("confirm"); }}>
                  <div className="lt-form-group">
                    <label>Select Bank</label>
                    <select className="lt-input" value={payDetails.bank} onChange={e => setPayDetails(p => ({ ...p, bank: e.target.value }))} required>
                      <option value="">Choose your bank</option>
                      <option>State Bank of India</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                      <option>Punjab National Bank</option>
                      <option>Bank of Baroda</option>
                      <option>Canara Bank</option>
                    </select>
                  </div>
                  <button type="submit" className="lt-btn lt-btn--primary">Proceed to Pay {fmt(loan.nextEMIAmount)}</button>
                </form>
              )}

              <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "12px" }}>
                🔒 This is a simulated payment. No real money will be deducted.
              </p>
            </div>
          )}

        </div>
      )}

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="lt-section">
          <div className="lt-progress-card">
            <h4>Repayment Progress</h4>
            <div className="lt-progress-item">
              <div className="lt-progress-label"><span>Tenure Completed</span><span>{loan.completedMonths} / {loan.tenureMonths} months ({paidPct}%)</span></div>
              <div className="lt-bar-track"><div className="lt-bar-fill lt-bar--blue" style={{ width: `${paidPct}%` }} /></div>
            </div>
            <div className="lt-progress-item">
              <div className="lt-progress-label"><span>Principal Repaid</span><span>{fmt(loan.principalPaid)} / {fmt(loan.sanctionedAmount)} ({principalPct}%)</span></div>
              <div className="lt-bar-track"><div className="lt-bar-fill lt-bar--green" style={{ width: `${principalPct}%` }} /></div>
            </div>
          </div>
          <div className="lt-stats-grid">
            <div className="lt-stat-card"><span className="lt-stat-icon">🏦</span><span className="lt-stat-label">Principal Paid</span><span className="lt-stat-value green">{fmt(loan.principalPaid)}</span></div>
            <div className="lt-stat-card"><span className="lt-stat-icon">📈</span><span className="lt-stat-label">Interest Paid</span><span className="lt-stat-value">{fmt(loan.interestPaid)}</span></div>
            <div className="lt-stat-card"><span className="lt-stat-icon">💳</span><span className="lt-stat-label">Principal Remaining</span><span className="lt-stat-value red">{fmt(loan.principalRemaining)}</span></div>
            <div className="lt-stat-card"><span className="lt-stat-icon">📅</span><span className="lt-stat-label">EMIs Remaining</span><span className="lt-stat-value">{loan.tenureMonths - loan.completedMonths}</span></div>
          </div>
          <div className="lt-cibil-card">
            <div className="lt-cibil-left"><span style={{ fontSize: "1.8rem" }}>📊</span><div><div className="lt-cibil-title">CIBIL Score Check</div><div className="lt-cibil-sub">Monitor your credit score regularly</div></div></div>
            <span className="lt-coming-soon">Coming Soon</span>
          </div>
        </div>
      )}

      {/* Payment History */}
      {activeTab === "history" && (
        <div className="lt-section">
          <div className="lt-section-header">
            <h4>Payment History</h4>
            <button className="lt-btn lt-btn--outline">⬇ Download Statement</button>
          </div>
          <div className="lt-table-wrap">
            <table className="lt-table">
              <thead><tr><th>Txn ID</th><th>Date</th><th>EMI Amount</th><th>Principal</th><th>Interest</th><th>Balance</th><th>Status</th></tr></thead>
              <tbody>
                {MOCK_TRANSACTIONS.map((t) => (
                  <tr key={t.id}>
                    <td className="lt-txn-id">{t.id}</td>
                    <td>{t.date}</td>
                    <td>{fmt(t.amount)}</td>
                    <td>{fmt(t.principal)}</td>
                    <td>{fmt(t.interest)}</td>
                    <td>{fmt(t.balance)}</td>
                    <td><span className="lt-paid-badge">{t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pre-payment */}
      {activeTab === "prepayment" && (
        <div className="lt-section">
          <h4>Pre-payment / Part Payment</h4>
          <p className="lt-section-desc">Making a pre-payment reduces your principal outstanding, which lowers your interest burden and can shorten your tenure.</p>
          <div className="lt-info-grid">
            <div className="lt-info-item"><span className="lt-info-label">Outstanding Principal</span><span className="lt-info-value">{fmt(loan.principalRemaining)}</span></div>
            <div className="lt-info-item"><span className="lt-info-label">Pre-payment Charges</span><span className="lt-info-value green">NIL (Floating Rate)</span></div>
            <div className="lt-info-item"><span className="lt-info-label">Minimum Pre-payment</span><span className="lt-info-value">₹10,000</span></div>
          </div>
          {prepayMsg ? (
            <div className="lt-success-msg">{prepayMsg}</div>
          ) : (
            <form className="lt-form" onSubmit={handlePrepay}>
              <div className="lt-form-group"><label>Pre-payment Amount (₹)</label><input type="number" className="lt-input" placeholder="Enter amount (min ₹10,000)" min={10000} value={prepayAmount} onChange={(e) => setPrepayAmount(e.target.value)} required /></div>
              <div className="lt-form-group"><label>Preferred Date</label><input type="date" className="lt-input" required /></div>
              <button type="submit" className="lt-btn lt-btn--primary">Submit Pre-payment Request</button>
            </form>
          )}
        </div>
      )}

      {/* Closure */}
      {activeTab === "closure" && (
        <div className="lt-section">
          <h4>Loan Closure</h4>
          <p className="lt-section-desc">Request a foreclosure statement to close your loan before the tenure ends. No pre-closure charges apply for floating rate loans.</p>
          <div className="lt-info-grid">
            <div className="lt-info-item"><span className="lt-info-label">Outstanding Principal</span><span className="lt-info-value">{fmt(loan.principalRemaining)}</span></div>
            <div className="lt-info-item"><span className="lt-info-label">Foreclosure Charges</span><span className="lt-info-value green">NIL</span></div>
            <div className="lt-info-item"><span className="lt-info-label">Processing Time</span><span className="lt-info-value">3–5 business days</span></div>
          </div>
          <div className="lt-closure-note">⚠️ Once you submit a closure request, our team will send you a foreclosure statement with the exact payoff amount including any accrued interest.</div>
          {closureMsg ? (
            <div className="lt-success-msg">{closureMsg}</div>
          ) : (
            <form className="lt-form" onSubmit={handleClosure}>
              <div className="lt-form-group"><label>Reason for Closure</label><select className="lt-input" required><option value="">Select reason</option><option>Selling the property</option><option>Refinancing with another bank</option><option>Have surplus funds</option><option>Other</option></select></div>
              <div className="lt-form-group"><label>Preferred Closure Date</label><input type="date" className="lt-input" required /></div>
              <button type="submit" className="lt-btn lt-btn--danger">Request Loan Closure</button>
            </form>
          )}
        </div>
      )}

    </div>
  );
}
