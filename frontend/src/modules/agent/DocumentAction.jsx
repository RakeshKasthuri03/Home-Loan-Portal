import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";
import "../../styles/LeadDetails.css";
import { agentGetApplications, agentVerifyDoc, agentRequestDocs, agentRecommend, agentGetStats, agentStartReview } from "../../utils/loanApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const STATUS_COLOR = {
  pending: { bg: "#fef9c3", color: "#92400e" },
  verified: { bg: "#dcfce7", color: "#16a34a" },
  rejected: { bg: "#fee2e2", color: "#dc2626" },
};

const DOC_NAMES = {
  panDoc: "PAN Card",
  aadharDoc: "Aadhaar Card",
  photoDoc: "Passport Photo",
  salarySlip: "Salary Slip",
  bankStatement: "Bank Statement",
  itr: "ITR / Form 16",
  propertyDoc: "Property Documents",
  plotDoc: "Plot Documents",
  encumbrance: "Encumbrance Certificate",
  passportDoc: "Passport Copy",
  visaDoc: "Visa Copy",
  poaDoc: "Power of Attorney",
  renovationQuote: "Renovation Quote",
  loanStatement: "Loan Statement",
  foreclosureLetter: "Foreclosure Letter",
};

export default function DocumentAction() {
  const [docs, setDocs] = useState([]);
  const [appStatuses, setAppStatuses] = useState({}); // track per-app status
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [requestDocModal, setRequestDocModal] = useState(null); // applicationId
  const [requestDocRemark, setRequestDocRemark] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await agentGetApplications();

        console.log("RAW RESPONSE:", response);

        // ✅ HANDLE ALL POSSIBLE API STRUCTURES
        let applications = [];

        if (Array.isArray(response?.data)) {
          applications = response.data;
        } else if (Array.isArray(response?.data?.data)) {
          applications = response.data.data;
        } else if (Array.isArray(response?.data?.applications)) {
          applications = response.data.applications;
        } else if (response?.data) {
          applications = [response.data];
        }

        console.log("APPLICATIONS:", applications);

        const base =
          import.meta.env.VITE_API_BASE || "";

        const documents = [];
        const statuses = {};

        applications.forEach((app) => {
          if (!app) return;
          statuses[app._id] = app.status;
          const docObj = app.documents || {};

          Object.keys(DOC_NAMES).forEach((key) => {
            const docData = docObj[key];

            // ✅ Allow showing even if no file (optional)
            if (docData && docData.url) {
              let fileUrl = docData.url;

              // ✅ FIX localhost issue
              if (fileUrl.includes("localhost")) {
                fileUrl = fileUrl.replace(
                  "",
                  base
                );
              }

              documents.push({
                id: `${app._id}-${key}`,
                customer:
                  app.basicDetails?.fullName || "N/A",
                loanId: app.applicationId || "N/A",
                doc: DOC_NAMES[key],
                status: (docData.status || "pending").toLowerCase(),
                fileUrl: fileUrl,
                applicationId: app._id,
                docKey: key,
              });
            }
          });
        });

        console.log("FINAL DOCS:", documents);
        setDocs(documents);
        setAppStatuses(statuses);
      } catch (err) {
        console.error("Fetch error:", err);
        setDocs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleUpload = (id, file) => {
    if (!file) return;

    const base =
      import.meta.env.VITE_API_BASE || "";

    const formData = new FormData();
    const doc = docs.find((d) => d.id === id);

    formData.append("file", file);
    formData.append("docName", doc?.doc || file.name);

    axios
      .post(`${base}/api/upload`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((res) => {
        const fileUrl =
          res.data?.file?.url ||
          res.data?.url ||
          res.data?.doc?.url;

        setDocs((prev) =>
          prev.map((d) =>
            d.id === id
              ? { ...d, fileUrl: fileUrl, status: "pending" }
              : d
          )
        );
      })
      .catch(console.error);
  };

  const handleVerify = async (doc) => {
    setActionLoading(doc.id);
    const res = await agentVerifyDoc(doc.applicationId, doc.docKey, 'verified');
    if (res && res.success === false) {
      toast.error('Failed to verify document');
    } else {
      setDocs((prev) => prev.map((d) => (d.id === doc.id ? { ...d, status: "verified" } : d)));
      toast.success('Document verified');
    }
    setActionLoading(null);
  };

  const handleReject = async (doc) => {
    setActionLoading(doc.id);
    const res = await agentVerifyDoc(doc.applicationId, doc.docKey, 'rejected');
    if (res && res.success === false) {
      toast.error('Failed to reject document');
    } else {
      setDocs((prev) => prev.map((d) => (d.id === doc.id ? { ...d, status: "rejected" } : d)));
      toast.warning('Document rejected');
    }
    setActionLoading(null);
  };

  // Start review on application
  const handleStartReview = async (applicationId) => {
    setActionLoading(applicationId);
    const res = await agentStartReview(applicationId);
    if (res?.success) {
      setAppStatuses(prev => ({ ...prev, [applicationId]: 'under_review' }));
      toast.success('Review started — application is now under review');
    } else {
      toast.error(res?.error || 'Failed to start review');
    }
    setActionLoading(null);
  };

  // Recommend application to admin
  const handleRecommend = async (applicationId) => {
    setActionLoading(applicationId);
    const res = await agentRecommend(applicationId, 'Agent Recommendation: All documents verified. Recommended for approval.');
    if (res?.success) {
      toast.success('Recommendation sent to admin for approval');
    } else {
      toast.error(res?.error || 'Failed to send recommendation');
    }
    setActionLoading(null);
  };

  // Submit request docs modal
  const handleRequestMoreDocsSubmit = async () => {
    setActionLoading(requestDocModal);
    const res = await agentRequestDocs(requestDocModal, requestDocRemark.trim() || 'Additional documents requested by agent');
    if (res?.success) {
      toast.success('Document request sent to applicant');
      setAppStatuses(prev => ({ ...prev, [requestDocModal]: 'documents_pending' }));
    } else {
      toast.error(res?.error || 'Failed to send document request');
    }
    setRequestDocModal(null);
    setRequestDocRemark("");
    setActionLoading(null);
  };

  const filtered = docs.filter((d) => {
    const matchFilter =
      filter === "All" ||
      d.status === filter.toLowerCase();

    const matchSearch =
      d.customer.toLowerCase().includes(search.toLowerCase()) ||
      d.loanId.toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  if (loading) return <div style={{ padding:28 }}>Loading documents...</div>;

  // Group filtered docs by applicationId
  const apps = {};
  filtered.forEach((d) => {
    if (!apps[d.applicationId]) apps[d.applicationId] = { applicationId: d.applicationId, customer: d.customer, loanId: d.loanId, docs: [] };
    apps[d.applicationId].docs.push(d);
  });
  const appList = Object.values(apps);

  return (
    <div style={{ padding:"28px" }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h4 style={{ margin:0 }}>Document Action</h4>
        <div style={{ display:"flex", gap:8 }}>
          <input type="text" placeholder="Search name / loan ID..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding:"7px 12px", border:"1.5px solid #d1d5db", borderRadius:8, fontSize:"0.88rem", width:220 }} />
          {["All","pending","verified","rejected"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding:"6px 14px", borderRadius:8, border:"1.5px solid #d1d5db", cursor:"pointer", fontWeight:600, background:filter===f?"#0f2557":"#fff", color:filter===f?"#fff":"#374151", fontSize:"0.82rem" }}>
              {f==="All"?"All":f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {appList.length === 0 && <div style={{ color:"#6b7280", textAlign:"center", padding:40 }}>No document records to display.</div>}

      {appList.map((app) => {
        const total      = app.docs.length;
        const verifiedCt = app.docs.filter(x => x.status==='verified').length;
        const rejectedCt = app.docs.filter(x => x.status==='rejected').length;
        const pendingCt  = app.docs.filter(x => x.status==='pending').length;
        const allVerified = total > 0 && verifiedCt === total;
        const appStatus   = appStatuses[app.applicationId];
        const isSubmitted   = appStatus === 'submitted';
        const isUnderReview = appStatus === 'under_review';

        return (
          <div key={app.applicationId} style={{ marginBottom:18, background:'#fff', padding:16, borderRadius:10, border:'1px solid #eef2f7', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div>
                <strong style={{ fontSize:"1rem" }}>{app.customer}</strong>
                <span style={{ color:'#6b7280', marginLeft:8, fontSize:"0.88rem" }}>{app.loanId}</span>
                <div style={{ marginTop:6, display:"flex", gap:8, flexWrap:"wrap", fontSize:13 }}>
                  <span style={{ background:"#f3f4f6", padding:"2px 8px", borderRadius:12 }}>Total: {total}</span>
                  <span style={{ background:"#dcfce7", color:"#15803d", padding:"2px 8px", borderRadius:12 }}>✓ {verifiedCt}</span>
                  <span style={{ background:"#fef9c3", color:"#92400e", padding:"2px 8px", borderRadius:12 }}>⏳ {pendingCt}</span>
                  {rejectedCt > 0 && <span style={{ background:"#fee2e2", color:"#dc2626", padding:"2px 8px", borderRadius:12 }}>✗ {rejectedCt}</span>}
                  {appStatus && <span style={{ background:"#eff6ff", color:"#1d4ed8", padding:"2px 8px", borderRadius:12 }}>{appStatus.replace(/_/g," ")}</span>}
                </div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                {actionLoading === app.applicationId ? <span style={{ color:"#6b7280" }}>Processing...</span> : <>
                  {isSubmitted && (
                    <button style={{ background:"#eff6ff", color:"#1d4ed8", padding:"8px 14px", borderRadius:8, border:"1px solid #bfdbfe", fontWeight:700, cursor:"pointer" }} onClick={() => handleStartReview(app.applicationId)}>▶ Start Review</button>
                  )}
                  {isUnderReview && allVerified && (
                    <button style={{ background:"#dcfce7", color:"#15803d", padding:"8px 14px", borderRadius:8, border:"none", fontWeight:700, cursor:"pointer" }} onClick={() => handleRecommend(app.applicationId)}>✓ Request Approval</button>
                  )}
                  {(isUnderReview || isSubmitted) && !allVerified && (
                    <button style={{ background:"#fff7ed", color:"#92400e", padding:"8px 14px", borderRadius:8, border:"1px solid #fde68a", fontWeight:700, cursor:"pointer" }} onClick={() => { setRequestDocModal(app.applicationId); setRequestDocRemark(""); }}>📋 Request More Docs</button>
                  )}
                </>}
              </div>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:"#f9fafb" }}>
                {["Document","Status","File","Actions"].map(h => <th key={h} style={{ padding:"8px 12px", textAlign:"left", fontSize:"0.8rem", color:"#6b7280", fontWeight:600 }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {app.docs.map((doc) => (
                  <tr key={doc.id} style={{ borderTop:"1px solid #f3f4f6" }}>
                    <td style={{ padding:"10px 12px", fontWeight:500 }}>{doc.doc}</td>
                    <td style={{ padding:"10px 12px" }}><span style={{ background:STATUS_COLOR[doc.status]?.bg, color:STATUS_COLOR[doc.status]?.color, padding:"3px 10px", borderRadius:12, fontSize:"0.82rem", fontWeight:600 }}>{doc.status}</span></td>
                    <td style={{ padding:"10px 12px" }}>
                      {doc.fileUrl
                        ? doc.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                          ? <img src={doc.fileUrl} style={{ width:80, height:60, objectFit:"cover", borderRadius:4, cursor:"pointer" }} onClick={() => window.open(doc.fileUrl)} />
                          : <a href={doc.fileUrl} target="_blank" rel="noreferrer" style={{ color:"#0f4c8a", fontWeight:600 }}>📎 View</a>
                        : <input type="file" onChange={(e) => handleUpload(doc.id, e.target.files[0])} style={{ fontSize:"0.8rem" }} />
                      }
                    </td>
                    <td style={{ padding:"10px 12px" }}>
                      {actionLoading===doc.id ? <span style={{ color:"#6b7280" }}>...</span> : (
                        <div style={{ display:"flex", gap:6 }}>
                          {doc.status!=='verified' && <button className="approve" onClick={() => handleVerify(doc)}>Verify</button>}
                          {doc.status!=='rejected' && <button className="reject"  onClick={() => handleReject(doc)}>Reject</button>}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}

      {requestDocModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
          <div style={{ background:"#fff", borderRadius:12, padding:"28px 32px", width:"100%", maxWidth:440, boxShadow:"0 8px 32px rgba(0,0,0,0.15)" }}>
            <h3 style={{ margin:"0 0 8px", color:"#0f2557" }}>Request Additional Documents</h3>
            <p style={{ color:"#6b7280", fontSize:"0.85rem", marginBottom:16 }}>The applicant will be notified to upload the missing documents.</p>
            <textarea value={requestDocRemark} onChange={e => setRequestDocRemark(e.target.value)}
              placeholder="e.g. Please upload latest salary slips and 6-month bank statement"
              style={{ width:"100%", padding:"8px 12px", border:"1.5px solid #d1d5db", borderRadius:8, minHeight:80, resize:"vertical", fontSize:"0.9rem", boxSizing:"border-box" }} />
            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              <button onClick={() => setRequestDocModal(null)} style={{ flex:1, padding:10, border:"1.5px solid #d1d5db", borderRadius:8, background:"#fff", cursor:"pointer", fontWeight:600 }}>Cancel</button>
              <button onClick={handleRequestMoreDocsSubmit} disabled={actionLoading===requestDocModal}
                style={{ flex:2, padding:10, border:"none", borderRadius:8, background:"#92400e", color:"#fff", cursor:"pointer", fontWeight:700 }}>
                {actionLoading===requestDocModal ? "Sending..." : "📋 Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
