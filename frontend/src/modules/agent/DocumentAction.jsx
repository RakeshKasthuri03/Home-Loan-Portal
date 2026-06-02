import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";
import "../../styles/LeadDetails.css";
import { agentGetApplications, agentVerifyDoc, agentRequestDocs, agentRecommend, agentGetStats } from "../../utils/loanApi";

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
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

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
          import.meta.env.VITE_API_BASE || "http://localhost:5000";

        const documents = [];

        applications.forEach((app) => {
          if (!app) return;

          const docObj = app.documents || {};

          Object.keys(DOC_NAMES).forEach((key) => {
            const docData = docObj[key];

            // ✅ Allow showing even if no file (optional)
            if (docData && docData.url) {
              let fileUrl = docData.url;

              // ✅ FIX localhost issue
              if (fileUrl.includes("localhost")) {
                fileUrl = fileUrl.replace(
                  "http://localhost:5000",
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
      import.meta.env.VITE_API_BASE || "http://localhost:5000";

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
      console.error('Verify failed', res.error);
    } else {
      setDocs((prev) =>
        prev.map((d) => (d.id === doc.id ? { ...d, status: "verified" } : d))
      );
      // refresh agent stats on server/UI
      agentGetStats().catch(() => {});
    }
    setActionLoading(null);
  };

  const handleReject = async (doc) => {
    setActionLoading(doc.id);
    const res = await agentVerifyDoc(doc.applicationId, doc.docKey, 'rejected');
    if (res && res.success === false) {
      console.error('Reject failed', res.error);
    } else {
      setDocs((prev) => prev.map((d) => (d.id === doc.id ? { ...d, status: "rejected" } : d)));
      // refresh agent stats
      agentGetStats().catch(() => {});
    }
    setActionLoading(null);
  };

  // Request approval to admin (recommend)
  const handleRecommend = async (applicationId) => {
    if (!window.confirm('Recommend this application for admin approval?')) return;
    setActionLoading(applicationId);
    const res = await agentRecommend(applicationId, 'Recommended by agent');
    if (res && res.success) {
      // Optionally refresh stats or applications
      await agentGetStats();
      // mark UI - we won't change document statuses here
      alert('Recommendation sent to admin');
    } else {
      console.error('Recommend failed', res.error);
      alert('Failed to recommend application');
    }
    setActionLoading(null);
  };

  // Request additional documents from applicant
  const handleRequestMoreDocs = async (applicationId) => {
    const remarks = window.prompt('Enter remark for applicant (optional):', 'Please provide additional documents');
    if (remarks === null) return; // cancelled
    setActionLoading(applicationId);
    const res = await agentRequestDocs(applicationId, remarks || 'Additional documents requested by agent');
    if (res && res.success) {
      alert('Document request sent to applicant');
    } else {
      console.error('Request docs failed', res.error);
      alert('Failed to send document request');
    }
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

  if (loading) return <div>Loading documents...</div>;

  // Group filtered docs by applicationId
  const apps = {};
  filtered.forEach((d) => {
    if (!apps[d.applicationId]) apps[d.applicationId] = { applicationId: d.applicationId, customer: d.customer, loanId: d.loanId, docs: [] };
    apps[d.applicationId].docs.push(d);
  });

  const appList = Object.values(apps);

  return (
    <div style={{ padding: "28px" }}>
      <h4>Document Action</h4>

      {appList.length === 0 && <div>No document records to display.</div>}

      {appList.map((app) => {
        const total = app.docs.length;
        const verified = app.docs.filter((x) => x.status === 'verified').length;
        const rejected = app.docs.filter((x) => x.status === 'rejected').length;
        const pending = app.docs.filter((x) => x.status === 'pending').length;
        const allVerified = total > 0 && verified === total;

        return (
          <div key={app.applicationId} style={{ marginBottom: 18, background: '#fff', padding: 12, borderRadius: 8, border: '1px solid #eef2f7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div>
                <strong>{app.customer}</strong> — <span style={{ color: '#6b7280' }}>{app.loanId}</span>
                <div style={{ marginTop: 6, fontSize: 13, color: '#374151' }}>
                  Documents: {total} · Verified: {verified} · Pending: {pending} · Rejected: {rejected}
                </div>
              </div>

              <div>
                {actionLoading === app.applicationId ? (
                  <span>Processing...</span>
                ) : allVerified ? (
                  <button style={{ background: '#dcfce7', color: '#15803d', padding: '8px 12px', borderRadius: 8, border: 'none', fontWeight: 700 }} onClick={() => handleRecommend(app.applicationId)}>Request Approval</button>
                ) : (
                  <button style={{ background: '#fff7ed', color: '#92400e', padding: '8px 12px', borderRadius: 8, border: '1px solid #fde68a', fontWeight: 700 }} onClick={() => handleRequestMoreDocs(app.applicationId)}>Request More Docs</button>
                )}
              </div>
            </div>

            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Status</th>
                  <th>File</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {app.docs.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.doc}</td>
                    <td>
                      <span style={{ background: STATUS_COLOR[doc.status]?.bg, color: STATUS_COLOR[doc.status]?.color, padding: '4px 8px' }}>{doc.status}</span>
                    </td>
                    <td>
                      {doc.fileUrl ? (
                        doc.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <img src={doc.fileUrl} style={{ width: 80, height: 60 }} onClick={() => window.open(doc.fileUrl)} />
                        ) : (
                          <a href={doc.fileUrl} target="_blank" rel="noreferrer">📎 View File</a>
                        )
                      ) : (
                        <input type="file" onChange={(e) => handleUpload(doc.id, e.target.files[0])} />
                      )}
                    </td>
                    <td>
                      {actionLoading === doc.id ? '...' : (
                        <>
                          <button className="approve" onClick={() => handleVerify(doc)}>Verify</button>
                          <button className="reject" onClick={() => handleReject(doc)}>Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
