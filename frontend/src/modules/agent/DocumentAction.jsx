import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";
import "../../styles/LeadDetails.css";
import { agentGetApplications, getApplicationById, agentVerifyDoc } from "../../utils/loanApi";

const STATUS_COLOR = {
  pending:   { bg: "#fef9c3", color: "#92400e" },
  verified:  { bg: "#dcfce7", color: "#16a34a" },
  rejected:  { bg: "#fee2e2", color: "#dc2626" },
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

  // Fetch documents on mount
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await agentGetApplications();
        const applications = Array.isArray(response) ? response : response?.data || [];
        
        // Transform applications into document format
        const documents = applications.flatMap((app) => {
          const docList = [];
          const docFields = [
            { key: 'panDoc', name: 'PAN Card' },
            { key: 'aadharDoc', name: 'Aadhaar Card' },
            { key: 'photoDoc', name: 'Passport Photo' },
            { key: 'salarySlip', name: 'Salary Slip' },
            { key: 'bankStatement', name: 'Bank Statement' },
            { key: 'itr', name: 'ITR / Form 16' },
            { key: 'propertyDoc', name: 'Property Documents' },
            { key: 'plotDoc', name: 'Plot Documents' },
            { key: 'encumbrance', name: 'Encumbrance Certificate' },
            { key: 'passportDoc', name: 'Passport Copy' },
            { key: 'visaDoc', name: 'Visa Copy' },
            { key: 'poaDoc', name: 'Power of Attorney' },
            { key: 'renovationQuote', name: 'Renovation Quote' },
            { key: 'loanStatement', name: 'Loan Statement' },
            { key: 'foreclosureLetter', name: 'Foreclosure Letter' },
          ];

          docFields.forEach(({ key, name }) => {
            if (app[key]) {
              docList.push({
                id: `${app.id}-${key}`,
                customer: app.applicantName || 'N/A',
                loanId: app.loanId || 'N/A',
                doc: name,
                status: app[`${key}Status`] || 'pending',
                file: typeof app[key] === 'string' ? { name: name, url: app[key] } : app[key],
                fileUrl: typeof app[key] === 'string' ? app[key] : app[key]?.url,
                applicationId: app.id,
                docKey: key,
              });
            }
          });
          return docList;
        });

        setDocs(documents);
      } catch (err) {
        console.error('Failed to fetch documents:', err);
        setDocs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleUpload = (id, file) => {
    if (!file) return;

    const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
    const uploadUrl = `${base}/api/upload`;
    const formData = new FormData();
    const doc = docs.find((d) => d.id === id);
    formData.append('file', file);
    formData.append('docName', doc?.doc || file.name);
    formData.append('purpose', 'agent_document');

    const token = getToken();
    axios.post(uploadUrl, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        'Content-Type': 'multipart/form-data',
      },
    }).then((response) => {
      const fileUrl = response.data?.url || response.data?.file?.url || response.data?.doc?.url;
      setDocs(prev => prev.map(d => d.id === id ? {
        ...d,
        file: fileUrl ? { name: file.name, url: fileUrl } : { name: file.name },
        fileUrl: fileUrl,
        status: 'pending'
      } : d));
    }).catch((error) => {
      console.error('Document upload failed:', error);
      setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'pending' } : d));
    });
  };

  const handleVerify = async (doc) => {
    try {
      setActionLoading(doc.id);
      await agentVerifyDoc(doc.applicationId, doc.docKey);
      setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'verified' } : d));
    } catch (err) {
      console.error('Failed to verify document:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (doc) => {
    try {
      setActionLoading(doc.id);
      // Assuming there's a reject endpoint or we can pass a status
      await agentVerifyDoc(doc.applicationId, doc.docKey, 'rejected');
      setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'rejected' } : d));
    } catch (err) {
      console.error('Failed to reject document:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = docs.filter(d => {
    const matchFilter = filter === "All" || d.status === filter;
    const matchSearch = d.customer.toLowerCase().includes(search.toLowerCase()) ||
                        d.loanId.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    All: docs.length,
    Pending: docs.filter((d) => d.status === "pending").length,
    Verified: docs.filter((d) => d.status === "verified").length,
    Rejected: docs.filter((d) => d.status === "rejected").length,
  };

  if (loading) {
    return (
      <div style={{ padding: "28px", fontFamily: "Inter, Poppins, sans-serif" }}>
        <p>Loading documents...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "28px", fontFamily: "Inter, Poppins, sans-serif" }}>
      {/* Page header */}
      <div style={{ marginBottom: "24px" }}>
        <h4 style={{ margin: "0 0 4px", fontWeight: 700, color: "#0f2557" }}>Document Action</h4>
        <p style={{ margin: 0, fontSize: "0.88rem", color: "#6b7280" }}>
          Review, verify and manage customer documents
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "24px" }}>
        {Object.entries(counts).map(([label, count]) => (
          <div
            key={label}
            onClick={() => setFilter(label)}
            style={{
              background: filter === label ? "#0f4c8a" : "#fff",
              color: filter === label ? "#fff" : "#0f2557",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "16px 20px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{count}</div>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, opacity: 0.8 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by customer or loan ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%", maxWidth: "360px", padding: "9px 14px",
          border: "1.5px solid #d1d5db", borderRadius: "8px",
          fontSize: "0.88rem", marginBottom: "16px", fontFamily: "inherit", outline: "none",
        }}
      />

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.87rem" }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              {["Customer", "Loan ID", "Document", "Status", "File", "Actions"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((doc) => (
              <tr key={doc.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "12px 16px", fontWeight: 600, color: "#0f2557" }}>{doc.customer}</td>
                <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: "0.8rem", color: "#6b7280" }}>{doc.loanId}</td>
                <td style={{ padding: "12px 16px" }}>{doc.doc}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    background: STATUS_COLOR[doc.status]?.bg || "#f3f4f6",
                    color: STATUS_COLOR[doc.status]?.color || "#6b7280",
                    padding: "3px 10px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 600,
                  }}>
                    {doc.status}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  {doc.fileUrl ? (
                    <a href={doc.fileUrl} target="_blank" rel="noreferrer" style={{ fontSize: "0.78rem", color: "#2771e2", fontWeight: 600 }}>
                      📎 View File
                    </a>
                  ) : (
                    <label style={{ fontSize: "0.78rem", color: "#2771e2", fontWeight: 600, cursor: "pointer" }}>
                      📤 Upload
                      <input
                        type="file"
                        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                        onChange={(e) => handleUpload(doc.id, e.target.files[0])}
                        style={{ display: "none" }}
                      />
                    </label>
                  )}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  {actionLoading === doc.id ? (
                    <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>...</span>
                  ) : (
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        onClick={() => handleVerify(doc)}
                        disabled={doc.status === "verified"}
                        style={{
                          padding: "5px 12px",
                          background: doc.status === "verified" ? "#f3f4f6" : "#dcfce7",
                          color: doc.status === "verified" ? "#9ca3af" : "#16a34a",
                          border: "none", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 600,
                          cursor: doc.status === "verified" ? "default" : "pointer",
                        }}
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => handleReject(doc)}
                        disabled={doc.status === "rejected"}
                        style={{
                          padding: "5px 12px",
                          background: doc.status === "rejected" ? "#f3f4f6" : "#fee2e2",
                          color: doc.status === "rejected" ? "#9ca3af" : "#dc2626",
                          border: "none", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 600,
                          cursor: doc.status === "rejected" ? "default" : "pointer",
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "#9ca3af" }}>
                  No documents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
