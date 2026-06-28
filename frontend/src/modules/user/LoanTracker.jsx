import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../utils/auth";
import { getMyApplications, getApplicationById, requestClosure } from "../../utils/loanApi";
import { FIELD_VALIDATORS } from "../../Validations/LoanValidation";
import "../../styles/LoanTracker.css";
import CustomSelect from "../../components/CustomSelect";

const fmt = (n) => n ? "₹" + Number(n).toLocaleString("en-IN") : "—";

const LOAN_TYPE_LABELS = {
  PURCHASE: "Home Purchase Loan", PLOT: "Plot Loan", NRI: "NRI Home Loan",
  RENOVATION: "Home Renovation Loan", BALANCE_TRANSFER: "Balance Transfer",
};

// Parse tenure — handles "5", "5 years", "20 years", "60 months"
const parseTenure = (val) => {
  if (!val) return { months: 0, label: "—" };
  const str = String(val).trim();
  const num = parseInt(str);
  if (!num) return { months: 0, label: str };
  if (str.toLowerCase().includes("month")) return { months: num, label: `${num} months` };
  // Default: treat bare number or "X years" as years
  return { months: num * 12, label: `${num} years` };
};

// EMI formula
const calcEMI = (p, annualRate, months) => {
  if (!p || !annualRate || !months) return 0;
  const r = annualRate / 12 / 100;
  return Math.round(p * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1));
};

export default function LoanTracker() {
  const navigate = useNavigate();
  const user     = getUser();

  const [loading, setLoading]       = useState(true);
  const [loan, setLoan]             = useState(null);
  const [allApps, setAllApps]       = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab]   = useState("overview");
  const [closureMsg, setClosureMsg] = useState("");
  const [closureDate, setClosureDate] = useState("");
  const [closureReason, setClosureReason] = useState("");
  const [closureError, setClosureError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await getMyApplications();
      if (res.success) {
        const apps = res.data.applications || [];
        setAllApps(apps);
        // Pick highest-priority status
        const priority = ["disbursed","approved","under_review","documents_pending","submitted","draft"];
        let best = null;
        for (const s of priority) { best = apps.find(a => a.status === s); if (best) break; }
        if (best) { setSelectedId(best._id); await loadFull(best._id); }
      }
      setLoading(false);
    };
    load();
  }, []);

  const loadFull = async (id) => {
    const res = await getApplicationById(id);
    if (res.success) setLoan(res.data.application);
  };

  const handleSelectApp = async (id) => {
    setSelectedId(id);
    setLoading(true);
    await loadFull(id);
    setLoading(false);
    setActiveTab("overview");
  };

  const handleClosure = (e) => {
    e.preventDefault();
    (async () => {
      try {
        const reason = closureReason || e.target[0]?.value || '';
        // prefer controlled state if present
        const preferredDate = closureDate || e.target[1]?.value || null;

        // Validate preferredDate using Yup helper
        if (preferredDate) {
          const err = FIELD_VALIDATORS.closureDate(preferredDate);
          if (err) {
            setClosureError(err);
            return;
          }
        }
        setClosureError('');

        const res = await requestClosure(loan._id, { reason, preferredDate: preferredDate || null });
        if (res.success) {
          setClosureMsg("✅ Closure request submitted. Our team will contact you within 3 business days with the foreclosure statement.");
          setClosureDate('');
        } else {
          setClosureMsg(`❌ ${res.error || 'Failed to submit closure request'}`);
        }
      } catch (err) {
        console.error('Closure submission failed', err);
        setClosureMsg('❌ Failed to submit closure request');
      }
    })();
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="lt-page" style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:300 }}>
      <p style={{ color:"#6b7280" }}>Loading your loan details...</p>
    </div>
  );

  // ── No apps ──────────────────────────────────────────────────────────────
  if (allApps.length === 0) return (
    <div className="lt-page">
      <div className="lt-header"><div><h2>Loan Tracker</h2><p>No loan applications found.</p></div></div>
      <div style={{ textAlign:"center", padding:"60px 20px" }}>
        <div style={{ fontSize:48, marginBottom:16 }}>📋</div>
        <h3 style={{ color:"#0f2557" }}>No Applications Yet</h3>
        <p style={{ color:"#6b7280", marginBottom:24 }}>Apply for a home loan to start tracking here.</p>
        <button className="lt-btn lt-btn--primary" onClick={() => navigate("/loan-types")}>Apply for a Loan</button>
      </div>
    </div>
  );

  // ── Not yet approved — show status screen ────────────────────────────────
  const isApprovedOrDisbursed = loan && (loan.status === "approved" || loan.status === "disbursed" || loan.status === "closed");

  if (!isApprovedOrDisbursed) {
    const app = allApps.find(a => a._id === selectedId) || allApps[0];
    const statusColor = { draft:"#6b7280", submitted:"#2563eb", under_review:"#d97706", documents_pending:"#dc2626", approved:"#16a34a", rejected:"#dc2626", disbursed:"#0f2557", closed:"#374151" };
    const statusIcon  = { draft:"📝", submitted:"📬", under_review:"🔍", documents_pending:"📋", approved:"✅", rejected:"❌", disbursed:"💸", closed:"🔒" };
    return (
      <div className="lt-page">
        <div className="lt-header">
          <div><h2>Loan Tracker</h2><p>Welcome, {user?.firstname || "User"}</p></div>
          <button className="lt-btn lt-btn--primary" onClick={() => navigate("/loan-types")}>+ New Application</button>
        </div>
        {allApps.length > 1 && (
          <div className="app-selector-wrap">
            <label className="app-selector-label">Application:</label>
            <CustomSelect
              value={selectedId}
              onChange={handleSelectApp}
              options={allApps.map(a => ({
                value: a._id,
                label: `${a.applicationId} — ${LOAN_TYPE_LABELS[a.loanType] || a.loanType}`
              }))}
            />
          </div>
        )}
        <div style={{ background:"#fff", borderRadius:12, padding:32, boxShadow:"0 2px 8px rgba(0,0,0,0.07)", textAlign:"center" }}>
          <div style={{ fontSize:52, marginBottom:12 }}>{statusIcon[app?.status] || "📋"}</div>
          <h3 style={{ color:"#0f2557", margin:"0 0 6px" }}>{LOAN_TYPE_LABELS[app?.loanType] || app?.loanType}</h3>
          <p style={{ color: statusColor[app?.status] || "#374151", fontWeight:700, fontSize:"1.05rem", margin:"0 0 16px", textTransform:"capitalize" }}>
            {app?.status?.replace(/_/g," ")}
          </p>
          <p style={{ color:"#6b7280", marginBottom:6 }}>Application ID: <strong style={{ fontFamily:"monospace" }}>{app?.applicationId}</strong></p>
          {app?.financialDetails?.loanAmount && <p style={{ color:"#374151", marginBottom:6 }}>Requested: <strong>{fmt(app.financialDetails.loanAmount)}</strong></p>}
          {app?.processing?.submittedAt && <p style={{ color:"#9ca3af", fontSize:"0.85rem", marginBottom:16 }}>Submitted {new Date(app.processing.submittedAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</p>}
          {app?.processing?.remarks?.length > 0 && (
            <div style={{ background:"#f9fafb", borderRadius:8, padding:"12px 16px", textAlign:"left", marginBottom:16 }}>
              <strong style={{ color:"#374151", fontSize:"0.85rem" }}>Latest Update</strong>
              <p style={{ margin:"6px 0 0", color:"#374151" }}>{[...app.processing.remarks].reverse()[0]?.text}</p>
            </div>
          )}
          <div style={{ background:"#eff6ff", borderRadius:8, padding:"12px 16px", fontSize:"0.85rem", color:"#1d4ed8" }}>
            {app?.status === "draft" && "Complete your application to submit for review."}
            {app?.status === "submitted" && "Application submitted — our team will review it shortly."}
            {app?.status === "under_review" && "Your application is under review. We'll update you soon."}
            {app?.status === "documents_pending" && "Please upload the requested documents to continue."}
            {app?.status === "rejected" && <span style={{ color:"#dc2626" }}>Application not approved. Contact support for details.</span>}
          </div>
        </div>
      </div>
    );
  }

  // ── Approved / Disbursed — full tracker with real data ───────────────────
  const s   = loan.sanctionedDetails  || {};
  const fin = loan.financialDetails   || {};
  const dis = loan.disbursement       || {};
  const pro = loan.processing         || {};
  const bd  = loan.basicDetails       || {};

  const sanctionedAmount = s.sanctionedAmount || fin.loanAmount || 0;
  const interestRate     = s.interestRate || 0;
  const { months: tenureMonths, label: tenureLabel } = parseTenure(s.sanctionedTenure || fin.loanTenure);
  const emiAmount        = s.emiAmount || calcEMI(sanctionedAmount, interestRate, tenureMonths);
  const processingFee    = s.processingFee || 0;
  const sanctionDate     = s.sanctionDate ? new Date(s.sanctionDate) : null;
  const endDate          = sanctionDate && tenureMonths
    ? new Date(sanctionDate.getTime() + tenureMonths * 30.44 * 24 * 3600 * 1000) : null;

  return (
    <div className="lt-page">

      {/* Header */}
      <div className="lt-header">
        <div>
          <h2>Loan Tracker</h2>
          <p>Welcome, {bd.fullName?.split(" ")[0] || user?.firstname || "User"} — your loan at a glance</p>
        </div>
        <button className="lt-btn lt-btn--primary" onClick={() => navigate("/loan-types")}>+ New Application</button>
      </div>

      {/* App selector */}
      {allApps.length > 1 && (
        <div className="app-selector-wrap">
          <label className="app-selector-label">Application:</label>
          <CustomSelect
            value={selectedId}
            onChange={handleSelectApp}
            options={allApps.map(a => ({
              value: a._id,
              label: `${a.applicationId} — ${LOAN_TYPE_LABELS[a.loanType] || a.loanType}`
            }))}
          />
        </div>
      )}

      {/* Summary card */}
      <div className="lt-summary-card">
        <div className="lt-summary-top">
          <div>
            <span className="lt-loan-id">{loan.applicationId}</span>
            <h3>{LOAN_TYPE_LABELS[loan.loanType] || loan.loanType}</h3>
            <span style={{ display:"inline-block", marginTop:6, padding:"3px 12px", borderRadius:12, fontSize:"0.82rem", fontWeight:700,
              background: loan.status==="approved"?"#dbeafe": loan.status==="disbursed"?"#dcfce7":"#f3f4f6",
              color:       loan.status==="approved"?"#1d4ed8": loan.status==="disbursed"?"#15803d":"#374151" }}>
              {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
            </span>
          </div>
          <div className="lt-summary-amount">
            <span className="lt-amount-label">Sanctioned Amount</span>
            <span className="lt-amount-value">{fmt(sanctionedAmount)}</span>
          </div>
        </div>
        <div className="lt-summary-grid">
          <div className="lt-summary-item"><span className="lt-item-label">Interest Rate</span><span className="lt-item-value">{interestRate ? `${interestRate}% p.a.` : "—"}</span></div>
          <div className="lt-summary-item"><span className="lt-item-label">Tenure</span><span className="lt-item-value">{tenureLabel}</span></div>
          <div className="lt-summary-item"><span className="lt-item-label">EMI Amount</span><span className="lt-item-value">{fmt(emiAmount)}</span></div>
          <div className="lt-summary-item"><span className="lt-item-label">Processing Fee</span><span className="lt-item-value">{processingFee ? fmt(processingFee) : "NIL"}</span></div>
          {sanctionDate && <div className="lt-summary-item"><span className="lt-item-label">Sanction Date</span><span className="lt-item-value">{sanctionDate.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</span></div>}
          {endDate && <div className="lt-summary-item"><span className="lt-item-label">Loan End Date</span><span className="lt-item-value">{endDate.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</span></div>}
        </div>
      </div>

      {/* Disbursement banner */}
      {loan.status === "disbursed" && dis.disbursedAmount && (
        <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"14px 20px", marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div>
            <strong style={{ color:"#15803d" }}>💸 Loan Disbursed</strong>
            <p style={{ margin:"4px 0 0", color:"#374151", fontSize:"0.88rem" }}>
              {fmt(dis.disbursedAmount)} disbursed on {dis.disbursementDate ? new Date(dis.disbursementDate).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—"}
            </p>
            {/* UTR / transaction reference removed */}
          </div>
          {dis.accountNumber && (
            <div style={{ textAlign:"right", color:"#374151", fontSize:"0.88rem" }}>
              <div>A/C: <strong>••••{dis.accountNumber.slice(-4)}</strong></div>
              {dis.ifscCode && <div style={{ color:"#6b7280" }}>{dis.ifscCode}</div>}
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="lt-tabs">
        {["overview","details","closure"].map(tab => (
          <button key={tab} className={`lt-tab ${activeTab===tab?"lt-tab--active":""}`} onClick={() => setActiveTab(tab)}>
            {{overview:"📊 Overview", details:"📋 Loan Details", closure:"🔒 Loan Closure"}[tab]}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="lt-section">
          {/* Key numbers */}
          <div className="lt-stats-grid">
            <div className="lt-stat-card"><span className="lt-stat-icon">🏦</span><span className="lt-stat-label">Sanctioned Amount</span><span className="lt-stat-value green">{fmt(sanctionedAmount)}</span></div>
            <div className="lt-stat-card"><span className="lt-stat-icon">📈</span><span className="lt-stat-label">Interest Rate</span><span className="lt-stat-value">{interestRate ? `${interestRate}% p.a.` : "—"}</span></div>
            <div className="lt-stat-card"><span className="lt-stat-icon">💳</span><span className="lt-stat-label">Monthly EMI</span><span className="lt-stat-value">{fmt(emiAmount)}</span></div>
            <div className="lt-stat-card"><span className="lt-stat-icon">📅</span><span className="lt-stat-label">Loan Tenure</span><span className="lt-stat-value">{tenureLabel}</span></div>
          </div>

          {/* Activity timeline */}
          {pro.remarks?.length > 0 && (
            <div style={{ background:"#fff", borderRadius:10, padding:20, border:"1px solid #eef2f7", marginTop:16 }}>
              <h4 style={{ margin:"0 0 16px", color:"#0f2557" }}>Activity Timeline</h4>
              {[...pro.remarks].reverse().map((r, i) => (
                <div key={i} style={{ display:"flex", gap:12, paddingBottom:12, marginBottom:12, borderBottom: i < pro.remarks.length-1 ? "1px solid #f3f4f6" : "none" }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:"#0f4c8a", marginTop:6, flexShrink:0 }} />
                  <div>
                    <p style={{ margin:0, color:"#374151" }}>{r.text}</p>
                    {r.date && <p style={{ margin:"2px 0 0", color:"#9ca3af", fontSize:"0.78rem" }}>{new Date(r.date).toLocaleString("en-IN")}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="lt-cibil-card">
            <div className="lt-cibil-left"><span style={{ fontSize:"1.8rem" }}>📊</span><div><div className="lt-cibil-title">CIBIL Score Check</div><div className="lt-cibil-sub">Monitor your credit score regularly</div></div></div>
            <span className="lt-coming-soon">Coming Soon</span>
          </div>
        </div>
      )}

      {/* Loan Details Tab */}
      {activeTab === "details" && (
        <div className="lt-section">
          {/* Applicant */}
          <div style={{ background:"#fff", borderRadius:10, padding:20, border:"1px solid #eef2f7", marginBottom:16 }}>
            <h4 style={{ margin:"0 0 16px", color:"#0f2557" }}>Applicant Details</h4>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              {[
                ["Full Name",      bd.fullName],
                ["Mobile",         bd.mobile],
                ["Email",          bd.email],
                ["Gender",         bd.gender],
                ["PAN",            bd.panCard],
                ["City",           bd.city],
                ["State",          bd.state],
                ["PIN Code",       bd.pinCode],
                ["Marital Status", bd.maritalStatus],
              ].filter(([,v]) => v).map(([label, val]) => (
                <div key={label}>
                  <span style={{ fontSize:"0.75rem", color:"#9ca3af", fontWeight:600, textTransform:"uppercase" }}>{label}</span>
                  <p style={{ margin:"3px 0 0", color:"#1f2937", fontWeight:500 }}>{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sanctioned details */}
          <div style={{ background:"#f0fdf4", borderRadius:10, padding:20, border:"1px solid #bbf7d0", marginBottom:16 }}>
            <h4 style={{ margin:"0 0 16px", color:"#15803d" }}>✅ Sanctioned Details</h4>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              {[
                ["Sanctioned Amount", fmt(sanctionedAmount)],
                ["Interest Rate",     interestRate ? `${interestRate}% p.a.` : "—"],
                ["Tenure",            tenureLabel],
                ["Monthly EMI",       fmt(emiAmount)],
                ["Processing Fee",    processingFee ? fmt(processingFee) : "NIL"],
                ["Sanction Date",     sanctionDate ? sanctionDate.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—"],
              ].map(([label, val]) => (
                <div key={label}>
                  <span style={{ fontSize:"0.75rem", color:"#6b7280", fontWeight:600, textTransform:"uppercase" }}>{label}</span>
                  <p style={{ margin:"3px 0 0", color:"#1f2937", fontWeight:600 }}>{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Employment */}
          {loan.employmentDetails?.employmentType && (
            <div style={{ background:"#fff", borderRadius:10, padding:20, border:"1px solid #eef2f7", marginBottom:16 }}>
              <h4 style={{ margin:"0 0 16px", color:"#0f2557" }}>Employment</h4>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                {[
                  ["Type",           loan.employmentDetails.employmentType],
                  ["Company",        loan.employmentDetails.companyName],
                  ["Designation",    loan.employmentDetails.designation],
                  ["Experience",     loan.employmentDetails.workExperience],
                  ["Monthly Income", fmt(loan.employmentDetails.monthlyIncome)],
                ].filter(([,v]) => v).map(([label, val]) => (
                  <div key={label}>
                    <span style={{ fontSize:"0.75rem", color:"#9ca3af", fontWeight:600, textTransform:"uppercase" }}>{label}</span>
                    <p style={{ margin:"3px 0 0", color:"#1f2937", fontWeight:500 }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Property */}
          {loan.propertyDetails?.propertyType && (
            <div style={{ background:"#fff", borderRadius:10, padding:20, border:"1px solid #eef2f7" }}>
              <h4 style={{ margin:"0 0 16px", color:"#0f2557" }}>Property</h4>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                {[
                  ["Type",     loan.propertyDetails.propertyType],
                  ["Location", loan.propertyDetails.propertyLocation],
                  ["Value",    fmt(loan.propertyDetails.propertyValue)],
                  ["Builder",  loan.propertyDetails.builderName],
                  ["Status",   loan.propertyDetails.possessionStatus],
                ].filter(([,v]) => v).map(([label, val]) => (
                  <div key={label}>
                    <span style={{ fontSize:"0.75rem", color:"#9ca3af", fontWeight:600, textTransform:"uppercase" }}>{label}</span>
                    <p style={{ margin:"3px 0 0", color:"#1f2937", fontWeight:500 }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loan Closure Tab */}
      {activeTab === "closure" && (
        <div className="lt-section">
          <h4>Loan Closure</h4>
          <p className="lt-section-desc">Request a foreclosure statement to close your loan early. No pre-closure charges apply for floating rate loans.</p>
          <div className="lt-info-grid">
            <div className="lt-info-item"><span className="lt-info-label">Outstanding Amount</span><span className="lt-info-value">{fmt(dis.disbursedAmount || sanctionedAmount)}</span></div>
            <div className="lt-info-item"><span className="lt-info-label">Foreclosure Charges</span><span className="lt-info-value green">NIL</span></div>
            <div className="lt-info-item"><span className="lt-info-label">Processing Time</span><span className="lt-info-value">3–5 business days</span></div>
          </div>
          <div className="lt-closure-note">⚠️ Once submitted, our team will send you a foreclosure statement with the exact payoff amount including accrued interest.</div>
          {closureMsg ? (
            <div className="lt-success-msg">{closureMsg}</div>
          ) : (() => {
            const foreclosure = loan.documents?.foreclosureLetter;
            if (foreclosure && foreclosure.status === 'pending') {
              return (
                <div style={{ background: '#fff7ed', border: '1px solid #fde68a', padding: 16, borderRadius: 8 }}>
                  <strong style={{ color: '#92400e' }}>Closure Requested</strong>
                  <p style={{ margin: '8px 0 0', color: '#6b7280' }}>Your closure request is pending. Requested on: {foreclosure.requestedAt ? new Date(foreclosure.requestedAt).toLocaleString() : '—'}</p>
                  {foreclosure.preferredDate && <p style={{ margin: '6px 0 0', color: '#6b7280' }}>Preferred date: {foreclosure.preferredDate}</p>}
                  {foreclosure.reason && <p style={{ margin: '6px 0 0', color: '#6b7280' }}>Reason: {foreclosure.reason}</p>}
                </div>
              );
            }
            if (foreclosure && foreclosure.status === 'processed') {
              return (
                <div style={{ background: '#e6f0ff', border: '1px solid #c7e0ff', padding: 16, borderRadius: 8 }}>
                  <strong style={{ color: '#075985' }}>Closure Processed</strong>
                  <p style={{ margin: '8px 0 0', color: '#6b7280' }}>Your closure was processed on {foreclosure.processedAt ? new Date(foreclosure.processedAt).toLocaleDateString() : '—'}.</p>
                </div>
              );
            }
            return (
              <form className="lt-form" onSubmit={handleClosure}>
                <div className="lt-form-group"><label>Reason for Closure</label>
                  <CustomSelect
                    value={closureReason}
                    onChange={setClosureReason}
                    placeholder="Select reason"
                    options={[
                      { value: "Selling the property",          label: "Selling the property" },
                      { value: "Refinancing with another bank", label: "Refinancing with another bank" },
                      { value: "Have surplus funds",            label: "Have surplus funds" },
                      { value: "Other",                         label: "Other" },
                    ]}
                  />
                </div>
                <div className="lt-form-group"><label>Preferred Closure Date</label>
                  <input
                    type="date"
                    className="lt-input"
                    required
                    value={closureDate}
                    onChange={(ev) => { setClosureDate(ev.target.value); if (closureError) setClosureError(''); }}
                  />
                  {closureError && (
                    <div style={{ color: 'red', fontSize: '0.9rem', marginTop: 6 }}>{closureError}</div>
                  )}
                </div>
                <button type="submit" className="lt-btn lt-btn--danger">Request Loan Closure</button>
              </form>
            );
          })()}
        </div>
      )}

    </div>
  );
}
