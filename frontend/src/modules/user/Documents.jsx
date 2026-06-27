import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getToken, getUser } from "../../utils/auth";
import { getMyApplications, getApplicationById, uploadLoanDocument, resubmitDocument } from "../../utils/loanApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DOC_LABELS = {
  panDoc: "PAN Card", aadharDoc: "Aadhaar Card", photoDoc: "Passport Photo",
  salarySlip: "Salary Slips (3 months)", bankStatement: "Bank Statement (6 months)",
  itr: "ITR / Form 16", propertyDoc: "Property Documents", plotDoc: "Plot Documents",
  encumbrance: "Encumbrance Certificate", passportDoc: "Passport Copy",
  visaDoc: "Visa / Residency Proof", poaDoc: "Power of Attorney",
  renovationQuote: "Renovation Quote / Estimate", loanStatement: "Existing Loan Statement",
  foreclosureLetter: "Foreclosure Letter",
};

const STATUS_CONFIG = {
  pending:  { bg: "#fef9c3", color: "#92400e", label: "⏳ Pending",  icon: "⏳" },
  verified: { bg: "#dcfce7", color: "#15803d", label: "✅ Verified", icon: "✅" },
  rejected: { bg: "#fee2e2", color: "#dc2626", label: "❌ Rejected", icon: "❌" },
};

const LOAN_TYPE_LABELS = {
  PURCHASE: "Home Purchase Loan", PLOT: "Plot Loan", NRI: "NRI Home Loan",
  RENOVATION: "Home Renovation Loan", BALANCE_TRANSFER: "Balance Transfer",
};

export default function Documents({ user }) {
  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [appDocs, setAppDocs] = useState({});   // { docKey: { url, status, uploadedAt } }
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({});// { docKey: true }
  const fileInputRefs = useRef({});

  // Load all user applications on mount
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await getMyApplications();
      if (res.success) {
        const apps = res.data.applications || [];
        // Only show non-draft apps that have been submitted
        const active = apps.filter(a => a.status !== "draft");
        setApplications(active);
        if (active.length > 0) {
          const priority = ["documents_pending","under_review","submitted","approved","disbursed","rejected","closed"];
          const best = priority.map(s => active.find(a => a.status === s)).find(Boolean) || active[0];
          await loadAppDocs(best._id);
          setSelectedAppId(best._id);
        }
      }
      setLoading(false);
    };
    load();
  }, []);

  const loadAppDocs = async (appId) => {
    const res = await getApplicationById(appId);
    if (res.success) {
      setAppDocs(res.data.application?.documents || {});
    }
  };

  const handleSelectApp = async (id) => {
    setSelectedAppId(id);
    setLoading(true);
    await loadAppDocs(id);
    setLoading(false);
  };

  // Upload & resubmit a rejected/missing doc
  const handleReupload = async (docKey, file) => {
    if (!file || !selectedAppId) return;
    setUploading(p => ({ ...p, [docKey]: true }));

    const uploadRes = await uploadLoanDocument(file, docKey);
    if (!uploadRes.success) {
      toast.error(`Upload failed: ${uploadRes.error}`);
      setUploading(p => ({ ...p, [docKey]: false }));
      return;
    }

    const fileUrlRaw = uploadRes.data?.url || uploadRes.data?.file?.url || uploadRes.data?.doc?.url;
    const fileUrl = (typeof fileUrlRaw === 'string' && fileUrlRaw.startsWith('/http')) ? fileUrlRaw.slice(1) : fileUrlRaw;
    if (!fileUrl) {
      toast.error("Upload failed — no URL returned");
      setUploading(p => ({ ...p, [docKey]: false }));
      return;
    }

    const resubRes = await resubmitDocument(selectedAppId, docKey, fileUrl);
    if (resubRes.success) {
      // Update local state immediately
      setAppDocs(prev => ({
        ...prev,
        [docKey]: { url: fileUrl, status: "pending", uploadedAt: new Date().toISOString() }
      }));
      toast.success(`${DOC_LABELS[docKey] || docKey} resubmitted — pending agent verification`);
    } else {
      toast.error(`Resubmit failed: ${resubRes.error}`);
    }
    setUploading(p => ({ ...p, [docKey]: false }));
  };

  // Get the list of doc keys expected for this app
  const selectedApp = applications.find(a => a._id === selectedAppId);
  const getExpectedDocs = (app) => {
    if (!app) return Object.keys(DOC_LABELS);
    const type = app.loanType;
    const base = ["panDoc","aadharDoc","photoDoc","salarySlip","bankStatement","itr"];
    const extras = {
      PURCHASE: ["propertyDoc"], PLOT: ["plotDoc","encumbrance"],
      NRI: ["passportDoc","visaDoc","poaDoc"], RENOVATION: ["propertyDoc","renovationQuote"],
      BALANCE_TRANSFER: ["loanStatement","foreclosureLetter","propertyDoc"],
    };
    return [...base, ...(extras[type] || [])];
  };

  const expectedDocs = getExpectedDocs(selectedApp);
  const hasRejected = expectedDocs.some(k => appDocs[k]?.status === "rejected");
  const allVerified = expectedDocs.length > 0 && expectedDocs.every(k => appDocs[k]?.status === "verified");

  if (loading) return (
    <div className="dashboard-main">
      <p style={{ color:"#6b7280", padding:20 }}>Loading documents...</p>
    </div>
  );

  if (applications.length === 0) return (
    <div className="dashboard-main">
      <h2>My Documents</h2>
      <div style={{ textAlign:"center", padding:"48px 20px", background:"#f9fafb", borderRadius:12, marginTop:20 }}>
        <div style={{ fontSize:48, marginBottom:12 }}>📄</div>
        <h3 style={{ color:"#0f2557" }}>No Active Applications</h3>
        <p style={{ color:"#6b7280" }}>Submit a loan application to manage documents here.</p>
      </div>
    </div>
  );

  return (
    <div className="dashboard-main">
      <ToastContainer position="top-right" autoClose={4000} />
      <h2>My Documents</h2>
      <p style={{ color:"#6b7280", marginBottom:20 }}>Upload and manage documents for your loan applications.</p>

      {/* Application selector */}
      {applications.length > 1 && (
        <div className="app-selector-wrap">
          <label className="app-selector-label">Application:</label>
          <select
            value={selectedAppId}
            onChange={e => handleSelectApp(e.target.value)}
            className="app-selector-select"
          >
            {applications.map(a => (
              <option key={a._id} value={a._id}>
                {a.applicationId} — {LOAN_TYPE_LABELS[a.loanType] || a.loanType}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Status banner */}
      {selectedApp?.status === "documents_pending" && (
        <div style={{ background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:10, padding:"14px 18px", marginBottom:20, display:"flex", gap:12, alignItems:"flex-start" }}>
          <span style={{ fontSize:22 }}>📋</span>
          <div>
            <strong style={{ color:"#92400e" }}>Documents Required</strong>
            <p style={{ margin:"4px 0 0", color:"#78350f", fontSize:"0.88rem" }}>
              Your agent has requested additional or corrected documents. Please reupload the rejected documents below.
            </p>
          </div>
        </div>
      )}
      {allVerified && (
        <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"14px 18px", marginBottom:20 }}>
          <strong style={{ color:"#15803d" }}>✅ All documents verified!</strong>
          <p style={{ margin:"4px 0 0", color:"#166534", fontSize:"0.88rem" }}>Your agent has verified all documents and will proceed with the review.</p>
        </div>
      )}

      {/* Documents table */}
      <div className="docs-table-scroll">
        <table className="docs-table">
          <thead>
            <tr>
              <th>Document</th>
              <th>Status</th>
              <th>File</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {expectedDocs.map((docKey, i) => {
              const docData  = appDocs[docKey];
              const status   = docData?.status || "pending";
              const rawUrl   = docData?.url;
              const fileUrl  = (typeof rawUrl === 'string' && rawUrl.startsWith('/http')) ? rawUrl.slice(1) : rawUrl;
              const cfg      = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
              const isRejected  = status === "rejected";
              const isUploading = uploading[docKey];

              return (
                <tr key={docKey} className={isRejected ? "docs-row-rejected" : ""}>
                  {/* Doc name */}
                  <td className="docs-td">
                    <div className="docs-doc-name">{DOC_LABELS[docKey] || docKey}</div>
                    {isRejected && <div className="docs-rejected-hint">⚠️ Rejected — please reupload</div>}
                  </td>

                  {/* Status pill */}
                  <td className="docs-td">
                    <span className="docs-status-pill" style={{ background: cfg.bg, color: cfg.color }}>
                      {cfg.label}
                    </span>
                    {docData?.uploadedAt && (
                      <div className="docs-date">
                        {new Date(docData.uploadedAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}
                      </div>
                    )}
                  </td>

                  {/* File preview/link */}
                  <td className="docs-td">
                    {fileUrl ? (
                      fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                        ? <img src={fileUrl} alt={docKey} className="docs-preview-img" onClick={() => window.open(fileUrl)} />
                        : <a href={fileUrl} target="_blank" rel="noreferrer" className="docs-file-link">📎 View File</a>
                    ) : (
                      <span className="docs-no-file">No file</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="docs-td">
                    {status === "verified" ? (
                      <span className="docs-verified-text">✓ Verified</span>
                    ) : (
                      <>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                          ref={el => fileInputRefs.current[docKey] = el}
                          style={{ display: "none" }}
                          onChange={e => handleReupload(docKey, e.target.files[0])}
                        />
                        <button
                          onClick={() => fileInputRefs.current[docKey]?.click()}
                          disabled={isUploading}
                          className="docs-upload-btn"
                          style={{ background: isRejected ? "#dc2626" : "#0f4c8a", opacity: isUploading ? 0.6 : 1 }}>
                          {isUploading ? "Uploading..." : isRejected ? "🔄 Reupload" : fileUrl ? "🔄 Replace" : "📤 Upload"}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary counts */}
      <div className="docs-summary-pills">
        {[
          ["Total", expectedDocs.length, "#f3f4f6", "#374151"],
          ["Verified", expectedDocs.filter(k => appDocs[k]?.status==="verified").length, "#dcfce7", "#15803d"],
          ["Pending",  expectedDocs.filter(k => !appDocs[k] || appDocs[k]?.status==="pending").length, "#fef9c3", "#92400e"],
          ["Rejected", expectedDocs.filter(k => appDocs[k]?.status==="rejected").length, "#fee2e2", "#dc2626"],
        ].map(([label, count, bg, color]) => (
          <div key={label} style={{ background:bg, color }}>
            {label}: {count}
          </div>
        ))}
      </div>
    </div>
  );
}
