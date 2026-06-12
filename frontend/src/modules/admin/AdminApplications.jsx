import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import "../../styles/AdminDashboard.css";
import { getToken } from "../../utils/auth";
import {
  adminGetAllApplications,
  adminAssignAgent,
  adminApproveApplication,
  adminRejectApplication,
  adminDisburseApplication,
  adminCloseApplication,
  adminGetClosureRequests,
} from "../../utils/loanApi";

const loanTypeLabels = {
  PURCHASE: "Home Loan", PLOT: "Plot Loan", RENOVATION: "Renovation Loan",
  NRI: "NRI Loan", BALANCE_TRANSFER: "Balance Transfer",
};

const formatAmount = (amt) => {
  if (!amt) return "—";
  if (amt >= 10000000) return `₹${(amt / 10000000).toFixed(1)} Cr`;
  if (amt >= 100000)   return `₹${(amt / 100000).toFixed(1)} L`;
  return `₹${amt.toLocaleString()}`;
};

const ModalWrap = ({ children, onClose }) => (
  <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex",
    alignItems:"center", justifyContent:"center", zIndex:1000 }}>
    <div style={{ background:"#fff", borderRadius:12, padding:"28px 32px", width:"100%",
      maxWidth:500, boxShadow:"0 8px 32px rgba(0,0,0,0.18)", maxHeight:"90vh", overflowY:"auto",
      position:"relative" }}>
      <button onClick={onClose} style={{ position:"absolute", top:12, right:16, border:"none",
        background:"transparent", fontSize:"1.4rem", cursor:"pointer", color:"#6b7280" }}>×</button>
      {children}
    </div>
  </div>
);

function AdminApplications() {
  const [activeTab, setActiveTab]       = useState("All");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm]     = useState("");
  const [agents, setAgents]             = useState([]);
  const [closureRequests, setClosureRequests] = useState([]);

  // Modals
  const [approveModal, setApproveModal]   = useState(null);
  const [rejectModal, setRejectModal]     = useState(null);
  const [disburseModal, setDisburseModal] = useState(null);
  const [closeModal, setCloseModal]       = useState(null);
  const [assignModal, setAssignModal]     = useState(null);
  const [viewModal, setViewModal]         = useState(null);

  // Form state
  const [approveForm, setApproveForm] = useState({ sanctionedAmount:"", interestRate:"", emiAmount:"", processingFee:"", sanctionedTenure:"" });
  const [rejectReason, setRejectReason]   = useState("");
  const [disburseForm, setDisburseForm]   = useState({ accountNumber:"", ifscCode:"" });
  const [closeReason, setCloseReason]     = useState("");

  const fetchApplications = async () => {
    setLoading(true);
    const [appsRes, closureRes] = await Promise.all([
      adminGetAllApplications(),
      adminGetClosureRequests(),
    ]);
    if (appsRes.success) setApplications(appsRes.data.applications || []);
    if (closureRes.success) setClosureRequests(closureRes.data?.applications || []);
    setLoading(false);
  };

  const fetchAgents = async () => {
    try {
      const token = getToken();
      const res = await axios.get("/api/agent", { headers: { Authorization: `Bearer ${token}` } });
      setAgents(Array.isArray(res.data) ? res.data : res.data.agents || []);
    } catch (err) { console.error("Failed to fetch agents:", err); }
  };

  useEffect(() => { fetchApplications(); fetchAgents(); }, []);

  // Open close modal if query param provided (reused from AdminDashboard link)
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const openClose = params.get('openClose');
    if (openClose) {
      // Ensure applications are loaded first, then open modal
      const timer = setTimeout(() => setCloseModal(openClose), 400);
      return () => clearTimeout(timer);
    }
  }, [location.search]);

  const statusMap = {
    All:null, Draft:"draft", Submitted:"submitted", "Under Review":"under_review",
    "Docs Pending":"documents_pending", Approved:"approved", Rejected:"rejected",
    Disbursed:"disbursed", Closed:"closed",
  };
  const tabStatuses = ["All","Draft","Submitted","Under Review","Docs Pending","Approved","Rejected","Disbursed","Closed"];
  const getCount = (tab) => tab === "All" ? applications.length : applications.filter(a => a.status === statusMap[tab]).length;

  const filteredApplications = applications.filter((app) => {
    const matchTab    = activeTab === "All" || app.status === statusMap[activeTab];
    const matchSearch = !searchTerm ||
      (app.applicationId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.basicDetails?.fullName || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchTab && matchSearch;
  });

  // ── APPROVE ──────────────────────────────────────────────────────────────────
  const handleApproveSubmit = async () => {
    if (!approveForm.interestRate) {
      alert("Interest rate is required.");
      return;
    }
    setActionLoading(approveModal._id);
    const res = await adminApproveApplication(approveModal._id, {
      interestRate:     Number(approveForm.interestRate),
      emiAmount:        Number(approveForm.emiAmount) || undefined,
      processingFee:    Number(approveForm.processingFee) || undefined,
      sanctionedTenure: approveForm.sanctionedTenure || undefined,
    });
    setActionLoading(null);
    setApproveModal(null);
    setApproveForm({ sanctionedAmount:"", interestRate:"", emiAmount:"", processingFee:"", sanctionedTenure:"" });
    if (res.success) fetchApplications();
    else alert(res.error);
  };

  // ── REJECT ────────────────────────────────────────────────────────────────────
  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) { alert("Rejection reason is required."); return; }
    setActionLoading(rejectModal);
    const res = await adminRejectApplication(rejectModal, rejectReason.trim());
    setActionLoading(null);
    setRejectModal(null);
    setRejectReason("");
    if (res.success) fetchApplications();
    else alert(res.error);
  };

  // ── DISBURSE ──────────────────────────────────────────────────────────────────
  const handleDisburseSubmit = async () => {
    setActionLoading(disburseModal._id);
    const res = await adminDisburseApplication(disburseModal._id, {
      accountNumber:   disburseForm.accountNumber || undefined,
      ifscCode:        disburseForm.ifscCode || undefined,
    });
    setActionLoading(null);
    setDisburseModal(null);
    setDisburseForm({ accountNumber:"", ifscCode:"" });
    if (res.success) fetchApplications();
    else alert(res.error);
  };

  // ── CLOSE ─────────────────────────────────────────────────────────────────────
  const handleCloseSubmit = async () => {
    setActionLoading(closeModal);
    const res = await adminCloseApplication(closeModal, closeReason.trim() || "Loan closed");
    setActionLoading(null);
    setCloseModal(null);
    setCloseReason("");
    if (res.success) fetchApplications();
    else alert(res.error);
  };

  // ── ASSIGN AGENT ──────────────────────────────────────────────────────────────
  const handleAssign = async (appId, agentId) => {
    setActionLoading(appId);
    const res = await adminAssignAgent(appId, agentId);
    setActionLoading(null);
    setAssignModal(null);
    if (res.success) fetchApplications();
    else alert(res.error);
  };

  // ── ACTION BUTTONS per status ─────────────────────────────────────────────────
  const renderActions = (app) => {
    if (actionLoading === app._id) return <span style={{color:"#6b7280"}}>Processing...</span>;

    const btns = [];

    if (app.status === "submitted" || app.status === "under_review") {
      btns.push(<button key="approve" className="approve" onClick={() => { setApproveForm({ sanctionedAmount: app.sanctionedDetails?.sanctionedAmount || app.financialDetails?.loanAmount || "", interestRate:"", emiAmount:"", processingFee: app.sanctionedDetails?.processingFee || "", sanctionedTenure: app.sanctionedDetails?.sanctionedTenure || app.financialDetails?.loanTenure || "" }); setApproveModal(app); }}>Approve</button>);
      btns.push(<button key="reject"  className="reject"  onClick={() => setRejectModal(app._id)}>Reject</button>);
      if (!app.assignedAgent)
        btns.push(<span key="assign" className="link-only" onClick={() => setAssignModal(app._id)}>Assign</span>);
    }

    if (app.status === "approved") {
      btns.push(<button key="disburse" className="approve" onClick={() => { setDisburseForm({ accountNumber: app.financialDetails?.accountNumber || app.disbursement?.accountNumber || "", ifscCode: app.financialDetails?.ifscCode || app.disbursement?.ifscCode || "" }); setDisburseModal(app); }}>Disburse</button>);
      btns.push(<button key="reject" className="reject" onClick={() => setRejectModal(app._id)}>Reject</button>);
    }

    if (app.status === "disbursed") {
      btns.push(<button key="close" style={{ background:"#f3f4f6", color:"#374151", border:"1px solid #d1d5db", borderRadius:6, padding:"4px 10px", cursor:"pointer", fontSize:"0.82rem", fontWeight:600 }} onClick={() => setCloseModal(app._id)}>Close</button>);
    }

    if (app.status === "draft") {
      btns.push(<span key="draft" style={{ color:"#9ca3af" }}>Draft</span>);
    }

    btns.push(<span key="view" className="link-only" onClick={() => setViewModal(app)} style={{ marginLeft: btns.length > 0 ? 4 : 0 }}>View</span>);

    return btns;
  };

  const inputStyle = { width:"100%", padding:"8px 12px", border:"1.5px solid #d1d5db", borderRadius:8, fontSize:"0.9rem", marginTop:6, boxSizing:"border-box" };
  const labelStyle = { display:"block", fontSize:"0.82rem", fontWeight:600, color:"#374151", marginBottom:2 };
  const rowStyle   = { marginBottom:14 };

  return (
    <div className="UserDashboard">
      <div className="dashboard-layout">
        <main className="dashboard-content" style={{ padding:"20px 16px" }}>

          {/* Closure Requests Banner */}
          {closureRequests.length > 0 && (
            <div style={{ background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:10, padding:"14px 18px", marginBottom:20 }}>
              <strong style={{ color:"#92400e" }}>🔒 {closureRequests.length} Pending Loan Closure Request{closureRequests.length > 1 ? "s" : ""}</strong>
              <div style={{ marginTop:10, display:"flex", flexDirection:"column", gap:8 }}>
                {closureRequests.map(app => (
                  <div key={app._id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"#fff", borderRadius:8, padding:"10px 14px", border:"1px solid #fde68a", flexWrap:"wrap", gap:8 }}>
                    <div>
                      <strong style={{ color:"#0f2557", fontSize:"0.9rem" }}>{app.basicDetails?.fullName || "—"}</strong>
                      <span style={{ color:"#6b7280", fontSize:"0.82rem", marginLeft:8 }}>{app.applicationId}</span>
                      {app.documents?.foreclosureLetter?.reason && (
                        <p style={{ margin:"3px 0 0", color:"#78350f", fontSize:"0.82rem" }}>Reason: {app.documents.foreclosureLetter.reason}</p>
                      )}
                    </div>
                    <button
                      onClick={() => { setCloseModal(app._id); setCloseReason("Loan closure processed"); }}
                      style={{ padding:"6px 14px", borderRadius:7, border:"none", background:"#374151", color:"#fff", fontWeight:700, fontSize:"0.82rem", cursor:"pointer" }}>
                      Process Closure
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search + filter header */}
          <div style={{ display:"flex", gap:12, marginBottom:16, flexWrap:"wrap", alignItems:"center", justifyContent:"space-between" }}>
            <input type="text" placeholder="🔍 Search by name or application ID..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              style={{ padding:"9px 14px", border:"1.5px solid #d1d5db", borderRadius:9, fontSize:"0.9rem", width:280, outline:"none" }} />
            <span style={{ color:"#6b7280", fontSize:"0.85rem" }}>{filteredApplications.length} application{filteredApplications.length !== 1 ? "s" : ""}</span>
          </div>

          {/* Status tabs */}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20 }}>
            {tabStatuses.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding:"5px 14px", borderRadius:20, border:"1.5px solid", cursor:"pointer", fontWeight:600, fontSize:"0.8rem", whiteSpace:"nowrap",
                  borderColor: activeTab===tab ? "#0f2557" : "#e5e7eb",
                  background:  activeTab===tab ? "#0f2557" : "#fff",
                  color:       activeTab===tab ? "#fff" : "#374151" }}>
                {tab} <span style={{ opacity:0.7, fontSize:"0.75rem" }}>({getCount(tab)})</span>
              </button>
            ))}
          </div>

          {/* Cards grid */}
          {loading ? (
            <div style={{ textAlign:"center", padding:40, color:"#6b7280" }}>Loading applications...</div>
          ) : filteredApplications.length === 0 ? (
            <div style={{ textAlign:"center", padding:40, background:"#f9fafb", borderRadius:12, color:"#6b7280" }}>
              <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
              <p>No applications found for this filter.</p>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))", gap:14 }}>
              {filteredApplications.map(app => (
                <div key={app._id} style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:18, boxShadow:"0 2px 6px rgba(0,0,0,0.05)", display:"flex", flexDirection:"column", gap:12 }}>
                  {/* Top row: ID + status */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div>
                      <div style={{ fontFamily:"monospace", fontSize:"0.8rem", color:"#6b7280" }}>{app.applicationId}</div>
                      <div style={{ fontWeight:700, color:"#0f2557", fontSize:"1rem", marginTop:2 }}>{app.basicDetails?.fullName || "—"}</div>
                      <div style={{ fontSize:"0.82rem", color:"#6b7280", marginTop:2 }}>{loanTypeLabels[app.loanType] || app.loanType}</div>
                    </div>
                    <span style={{
                      padding:"4px 10px", borderRadius:20, fontSize:"0.75rem", fontWeight:700, whiteSpace:"nowrap",
                      background: app.status==="approved"?"#dbeafe": app.status==="disbursed"?"#dcfce7": app.status==="rejected"?"#fee2e2": app.status==="under_review"?"#fef9c3": app.status==="documents_pending"?"#fff7ed": app.status==="closed"?"#e5e7eb":"#f3f4f6",
                      color:      app.status==="approved"?"#1d4ed8": app.status==="disbursed"?"#15803d": app.status==="rejected"?"#dc2626": app.status==="under_review"?"#92400e": app.status==="documents_pending"?"#c2410c": app.status==="closed"?"#374151":"#6b7280",
                    }}>
                      {app.status.replace(/_/g," ")}
                    </span>
                  </div>

                  {/* Info row */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, fontSize:"0.82rem" }}>
                    <div><span style={{ color:"#9ca3af" }}>Amount</span><div style={{ fontWeight:700, color:"#0f2557" }}>{formatAmount(app.financialDetails?.loanAmount)}</div></div>
                    <div><span style={{ color:"#9ca3af" }}>Applied</span><div style={{ fontWeight:600, color:"#374151" }}>{new Date(app.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</div></div>
                    <div><span style={{ color:"#9ca3af" }}>Agent</span><div style={{ fontWeight:600, color:"#374151" }}>
                      {app.assignedAgent ? (`${app.assignedAgent.firstname||""} ${app.assignedAgent.lastname||""}`.trim() || app.assignedAgent.agentid) : <span style={{ color:"#f97316" }}>Unassigned</span>}
                    </div></div>
                    <div><span style={{ color:"#9ca3af" }}>Mobile</span><div style={{ fontWeight:600, color:"#374151" }}>{app.basicDetails?.mobile || "—"}</div></div>
                  </div>

                  {/* Agent recommendation */}
                  {(() => {
                    const rec = [...(app.processing?.remarks||[])].reverse().find(r => r.text?.toLowerCase().includes("agent recommendation"));
                    return rec ? <div style={{ background:"#eff6ff", borderRadius:8, padding:"8px 12px", fontSize:"0.8rem", color:"#1d4ed8" }}>💬 {rec.text}</div> : null;
                  })()}

                  {/* Closure request indicator */}
                  {app.documents?.foreclosureLetter?.status === "pending" && (
                    <div style={{ background:"#fff7ed", borderRadius:8, padding:"8px 12px", fontSize:"0.8rem", color:"#92400e" }}>
                      🔒 Loan closure requested by user
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", paddingTop:4, borderTop:"1px solid #f3f4f6" }}>
                    {renderActions(app)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── APPROVE MODAL ─────────────────────────────────────────────────── */}
      {approveModal && (
        <ModalWrap onClose={() => setApproveModal(null)}>
          <h3 style={{ margin:"0 0 4px", color:"#0f2557" }}>Approve Application</h3>
          <p style={{ color:"#6b7280", fontSize:"0.85rem", marginBottom:18 }}>{approveModal.applicationId} — {approveModal.basicDetails?.fullName}</p>
          <div style={rowStyle}><label style={labelStyle}>Sanctioned Amount (₹)</label><input style={inputStyle} type="number" value={approveForm.sanctionedAmount} readOnly /></div>
          <div style={rowStyle}><label style={labelStyle}>Interest Rate (% p.a.) *</label><input style={inputStyle} type="number" step="0.1" value={approveForm.interestRate} onChange={e => setApproveForm(f => ({...f, interestRate: e.target.value}))} placeholder="e.g. 8.5" /></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div style={rowStyle}><label style={labelStyle}>EMI Amount (₹)</label><input style={inputStyle} type="number" value={approveForm.emiAmount} onChange={e => setApproveForm(f => ({...f, emiAmount: e.target.value}))} placeholder="Monthly EMI" /></div>
            <div style={rowStyle}><label style={labelStyle}>Processing Fee (₹)</label><input style={inputStyle} type="number" value={approveForm.processingFee} onChange={e => setApproveForm(f => ({...f, processingFee: e.target.value}))} placeholder="e.g. 10000" /></div>
          </div>
          <div style={rowStyle}><label style={labelStyle}>Sanctioned Tenure</label><input style={inputStyle} type="text" value={approveForm.sanctionedTenure} onChange={e => setApproveForm(f => ({...f, sanctionedTenure: e.target.value}))} placeholder="e.g. 20 years" /></div>
          <div style={{ display:"flex", gap:10, marginTop:8 }}>
            <button onClick={() => setApproveModal(null)} style={{ flex:1, padding:"10px", border:"1.5px solid #d1d5db", borderRadius:8, background:"#fff", cursor:"pointer", fontWeight:600 }}>Cancel</button>
            <button onClick={handleApproveSubmit} disabled={actionLoading === approveModal._id} style={{ flex:2, padding:"10px", border:"none", borderRadius:8, background:"#16a34a", color:"#fff", cursor:"pointer", fontWeight:700 }}>
              {actionLoading === approveModal._id ? "Approving..." : "✓ Approve & Sanction"}
            </button>
          </div>
        </ModalWrap>
      )}

      {/* ── REJECT MODAL ──────────────────────────────────────────────────── */}
      {rejectModal && (
        <ModalWrap onClose={() => { setRejectModal(null); setRejectReason(""); }}>
          <h3 style={{ margin:"0 0 4px", color:"#dc2626" }}>Reject Application</h3>
          <p style={{ color:"#6b7280", fontSize:"0.85rem", marginBottom:18 }}>Please provide a reason for rejection. The applicant will be notified.</p>
          <div style={rowStyle}><label style={labelStyle}>Rejection Reason *</label><textarea style={{ ...inputStyle, minHeight:80, resize:"vertical" }} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="e.g. Insufficient income, low CIBIL score..." /></div>
          <div style={{ display:"flex", gap:10, marginTop:8 }}>
            <button onClick={() => { setRejectModal(null); setRejectReason(""); }} style={{ flex:1, padding:"10px", border:"1.5px solid #d1d5db", borderRadius:8, background:"#fff", cursor:"pointer", fontWeight:600 }}>Cancel</button>
            <button onClick={handleRejectSubmit} disabled={actionLoading === rejectModal} style={{ flex:2, padding:"10px", border:"none", borderRadius:8, background:"#dc2626", color:"#fff", cursor:"pointer", fontWeight:700 }}>
              {actionLoading === rejectModal ? "Rejecting..." : "✗ Reject Application"}
            </button>
          </div>
        </ModalWrap>
      )}

      {/* ── DISBURSE MODAL ────────────────────────────────────────────────── */}
      {disburseModal && (
        <ModalWrap onClose={() => setDisburseModal(null)}>
          <h3 style={{ margin:"0 0 4px", color:"#0f2557" }}>Disburse Loan</h3>
          <p style={{ color:"#6b7280", fontSize:"0.85rem", marginBottom:18 }}>{disburseModal.applicationId} — {disburseModal.basicDetails?.fullName}</p>
          {(() => {
            const sanctioned = disburseModal.sanctionedDetails?.sanctionedAmount || disburseModal.financialDetails?.loanAmount || 0;
            const processingFee = disburseModal.sanctionedDetails?.processingFee || 0;
            const computed = Math.max(0, Number(sanctioned) - Number(processingFee));
            return (
              <div style={rowStyle}><label style={labelStyle}>Disbursed Amount (₹)</label><input style={inputStyle} type="text" value={computed} readOnly /></div>
            );
          })()}
          <div style={rowStyle}><label style={labelStyle}>Account Number</label><input style={inputStyle} type="text" value={disburseForm.accountNumber} onChange={e => setDisburseForm(f => ({...f, accountNumber: e.target.value}))} placeholder="Beneficiary account number" /></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div style={rowStyle}><label style={labelStyle}>IFSC Code</label><input style={inputStyle} type="text" value={disburseForm.ifscCode} onChange={e => setDisburseForm(f => ({...f, ifscCode: e.target.value}))} placeholder="e.g. HDFC0001234" /></div>
            <div style={rowStyle}><label style={labelStyle}>&nbsp;</label><div /></div>
          </div>
          <div style={{ display:"flex", gap:10, marginTop:8 }}>
            <button onClick={() => setDisburseModal(null)} style={{ flex:1, padding:"10px", border:"1.5px solid #d1d5db", borderRadius:8, background:"#fff", cursor:"pointer", fontWeight:600 }}>Cancel</button>
            <button onClick={handleDisburseSubmit} disabled={actionLoading === disburseModal._id} style={{ flex:2, padding:"10px", border:"none", borderRadius:8, background:"#0f4c8a", color:"#fff", cursor:"pointer", fontWeight:700 }}>
              {actionLoading === disburseModal._id ? "Disbursing..." : "💸 Confirm Disbursement"}
            </button>
          </div>
        </ModalWrap>
      )}

      {/* ── CLOSE MODAL ───────────────────────────────────────────────────── */}
      {closeModal && (
        <ModalWrap onClose={() => { setCloseModal(null); setCloseReason(""); }}>
          <h3 style={{ margin:"0 0 4px", color:"#374151" }}>Close Application</h3>
          <p style={{ color:"#6b7280", fontSize:"0.85rem", marginBottom:18 }}>Mark this disbursed loan as fully closed.</p>
          <div style={rowStyle}><label style={labelStyle}>Reason (optional)</label><input style={inputStyle} type="text" value={closeReason} onChange={e => setCloseReason(e.target.value)} placeholder="e.g. Loan fully repaid" /></div>
          <div style={{ display:"flex", gap:10, marginTop:8 }}>
            <button onClick={() => { setCloseModal(null); setCloseReason(""); }} style={{ flex:1, padding:"10px", border:"1.5px solid #d1d5db", borderRadius:8, background:"#fff", cursor:"pointer", fontWeight:600 }}>Cancel</button>
            <button onClick={handleCloseSubmit} disabled={actionLoading === closeModal} style={{ flex:2, padding:"10px", border:"none", borderRadius:8, background:"#374151", color:"#fff", cursor:"pointer", fontWeight:700 }}>
              {actionLoading === closeModal ? "Closing..." : "🔒 Close Application"}
            </button>
          </div>
        </ModalWrap>
      )}

      {/* ── ASSIGN AGENT MODAL ────────────────────────────────────────────── */}
      {assignModal && (
        <ModalWrap onClose={() => setAssignModal(null)}>
          <h3 style={{ margin:"0 0 16px", color:"#0f2557" }}>Assign Agent</h3>
          {agents.length === 0
            ? <p style={{ color:"#6b7280" }}>No agents available. Please add agents first.</p>
            : <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {agents.map((agent) => (
                  <button key={agent._id} onClick={() => handleAssign(assignModal, agent._id)} disabled={actionLoading === assignModal}
                    style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", border:"1.5px solid #e5e7eb", borderRadius:8, background:"#f9fafb", cursor:"pointer", textAlign:"left" }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", background:"#0f2557", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:"0.8rem" }}>
                      {((agent.firstname || agent.agentid || "A")[0]).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight:600, color:"#1f2937" }}>{agent.firstname ? `${agent.firstname} ${agent.lastname || ""}`.trim() : agent.agentid}</div>
                      <div style={{ fontSize:"0.78rem", color:"#6b7280" }}>{agent.email} · {agent.agentid}</div>
                    </div>
                  </button>
                ))}
              </div>
          }
          <button onClick={() => setAssignModal(null)} style={{ marginTop:18, width:"100%", padding:10, border:"1.5px solid #d1d5db", borderRadius:8, background:"#fff", cursor:"pointer", fontWeight:600 }}>Cancel</button>
        </ModalWrap>
      )}

      {/* ── VIEW MODAL ────────────────────────────────────────────────────── */}
      {viewModal && (
        <ModalWrap onClose={() => setViewModal(null)}>
          <h3 style={{ margin:"0 0 4px", color:"#0f2557" }}>Application Details</h3>
          <p style={{ color:"#6b7280", marginBottom:18 }}>{viewModal.applicationId}</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
            {[
              ["Applicant",  viewModal.basicDetails?.fullName || "—"],
              ["Loan Type",  loanTypeLabels[viewModal.loanType] || viewModal.loanType],
              ["Amount",     formatAmount(viewModal.financialDetails?.loanAmount)],
              ["Status",     viewModal.status.replace(/_/g, " ")],
              ["Mobile",     viewModal.basicDetails?.mobile || "—"],
              ["Email",      viewModal.basicDetails?.email || "—"],
              ["Applied",    new Date(viewModal.createdAt).toLocaleDateString()],
              ["Agent",      viewModal.assignedAgent ? (`${viewModal.assignedAgent.firstname || ""} ${viewModal.assignedAgent.lastname || ""}`.trim() || viewModal.assignedAgent.agentid) : "Unassigned"],
            ].map(([label, val]) => (
              <div key={label}><strong style={{ fontSize:"0.8rem", color:"#6b7280", textTransform:"uppercase" }}>{label}</strong><p style={{ margin:"4px 0 0", color:"#1f2937" }}>{val}</p></div>
            ))}
          </div>
          {viewModal.sanctionedDetails?.sanctionedAmount && (
            <div style={{ background:"#f0fdf4", borderRadius:8, padding:"12px 16px", marginBottom:16 }}>
              <strong style={{ color:"#15803d" }}>Sanctioned Details</strong>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:8 }}>
                <span>Amount: <strong>{formatAmount(viewModal.sanctionedDetails.sanctionedAmount)}</strong></span>
                <span>Rate: <strong>{viewModal.sanctionedDetails.interestRate}% p.a.</strong></span>
                <span>EMI: <strong>{formatAmount(viewModal.sanctionedDetails.emiAmount)}</strong></span>
                <span>Tenure: <strong>{viewModal.sanctionedDetails.sanctionedTenure}</strong></span>
              </div>
            </div>
          )}
          <div style={{ borderTop:"1px solid #e5e7eb", paddingTop:14 }}>
            <strong>Remarks</strong>
            {viewModal.processing?.remarks?.length > 0
              ? <ul style={{ marginTop:8, paddingLeft:18, color:"#374151" }}>
                  {viewModal.processing.remarks.map((r, i) => (
                    <li key={i} style={{ marginBottom:6 }}>{r.text} {r.date ? `(${new Date(r.date).toLocaleString()})` : ""}</li>
                  ))}
                </ul>
              : <p style={{ color:"#6b7280", marginTop:8 }}>No remarks yet.</p>
            }
          </div>
        </ModalWrap>
      )}

    </div>
  );
}

export default AdminApplications;
