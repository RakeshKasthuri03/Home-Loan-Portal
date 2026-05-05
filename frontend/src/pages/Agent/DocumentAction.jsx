import { useState } from "react";
import AgentHeader from "./AgentHeader";
import "../../Styles/LeadDetails.css";

const INITIAL_DOCS = [
  { id: 1, customer: "Rahul Nani",   loanId: "#HLP-0142", doc: "PAN Card",        status: "Pending",  file: null },
  { id: 2, customer: "Rahul Nani",   loanId: "#HLP-0142", doc: "Aadhar Card",     status: "Verified", file: null },
  { id: 3, customer: "Ananya Rao",   loanId: "#HLP-0141", doc: "Salary Slip",     status: "Pending",  file: null },
  { id: 4, customer: "Ananya Rao",   loanId: "#HLP-0141", doc: "Bank Statement",  status: "Rejected", file: null },
  { id: 5, customer: "Vijay Kumar",  loanId: "#HLP-0140", doc: "ITR / Form 16",   status: "Pending",  file: null },
  { id: 6, customer: "Preethi M.",   loanId: "#HLP-0139", doc: "Passport Copy",   status: "Verified", file: null },
];

const STATUS_COLOR = {
  Verified: { bg: "#dcfce7", color: "#16a34a" },
  Pending:  { bg: "#fef9c3", color: "#92400e" },
  Rejected: { bg: "#fee2e2", color: "#dc2626" },
};

export default function DocumentAction() {
  const [docs, setDocs]       = useState(INITIAL_DOCS);
  const [filter, setFilter]   = useState("All");
  const [search, setSearch]   = useState("");

  const updateStatus = (id, status) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const handleUpload = (id, file) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, file, status: "Pending" } : d));
  };

  const filtered = docs.filter(d => {
    const matchFilter = filter === "All" || d.status === filter;
    const matchSearch = d.customer.toLowerCase().includes(search.toLowerCase()) ||
                        d.loanId.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    All:      docs.length,
    Pending:  docs.filter(d => d.status === "Pending").length,
    Verified: docs.filter(d => d.status === "Verified").length,
    Rejected: docs.filter(d => d.status === "Rejected").length,
  };

  return (
    <>
      <div style={{ padding: "28px", fontFamily: "Inter, Poppins, sans-serif" }}>

        {/* Page header */}
        <div style={{ marginBottom: "24px" }}>
          <h4 style={{ margin: "0 0 4px", fontWeight: 700, color: "#0f2557" }}>Document Action</h4>
          <p style={{ margin: 0, fontSize: "0.88rem", color: "#6b7280" }}>Review, verify and manage customer documents</p>
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
          onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", maxWidth: "360px", padding: "9px 14px", border: "1.5px solid #d1d5db", borderRadius: "8px", fontSize: "0.88rem", marginBottom: "16px", fontFamily: "inherit", outline: "none" }}
        />

        {/* Table */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.87rem" }}>
            <thead>
              <tr style={{ background: "#f8f9fa" }}>
                {["Customer", "Loan ID", "Document", "Status", "File", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(doc => (
                <tr key={doc.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: "#0f2557" }}>{doc.customer}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: "0.8rem", color: "#6b7280" }}>{doc.loanId}</td>
                  <td style={{ padding: "12px 16px" }}>{doc.doc}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: STATUS_COLOR[doc.status]?.bg, color: STATUS_COLOR[doc.status]?.color, padding: "3px 10px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 600 }}>
                      {doc.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {doc.file ? (
                      <span style={{ fontSize: "0.78rem", color: "#16a34a", fontWeight: 600 }}>✓ {doc.file.name}</span>
                    ) : (
                      <label style={{ cursor: "pointer", fontSize: "0.78rem", color: "#2771e2", fontWeight: 600 }}>
                        📎 Upload
                        <input type="file" style={{ display: "none" }} onChange={e => handleUpload(doc.id, e.target.files[0])} />
                      </label>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        onClick={() => updateStatus(doc.id, "Verified")}
                        disabled={doc.status === "Verified"}
                        style={{ padding: "5px 12px", background: doc.status === "Verified" ? "#f3f4f6" : "#dcfce7", color: doc.status === "Verified" ? "#9ca3af" : "#16a34a", border: "none", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 600, cursor: doc.status === "Verified" ? "default" : "pointer" }}
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => updateStatus(doc.id, "Rejected")}
                        disabled={doc.status === "Rejected"}
                        style={{ padding: "5px 12px", background: doc.status === "Rejected" ? "#f3f4f6" : "#fee2e2", color: doc.status === "Rejected" ? "#9ca3af" : "#dc2626", border: "none", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 600, cursor: doc.status === "Rejected" ? "default" : "pointer" }}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "#9ca3af" }}>No documents found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}
