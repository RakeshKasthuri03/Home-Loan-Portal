import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import AgentUserDetails from "./AgentUserdetails";
import "../../styles/Agentheader.css";
import "../../styles/LeadDetails.css";
import { agentGetStats, agentGetApplications, getApplicationById, agentRecommend, agentRequestDocs } from "../../utils/loanApi";

const LOAN_LABELS = {
  PURCHASE: "Home Loan",
  PLOT: "Plot Loan",
  RENOVATION: "Renovation Loan",
  NRI: "NRI Loan",
  BALANCE_TRANSFER: "Balance Transfer",
};

const STATUS_COLORS = {
  draft: { bg: "#f3f4f6", color: "#6b7280" },
  submitted: { bg: "#fef3c7", color: "#92400e" },
  under_review: { bg: "#dbeafe", color: "#1e40af" },
  documents_pending: { bg: "#fce7f3", color: "#9d174d" },
  approved: { bg: "#dcfce7", color: "#166534" },
  rejected: { bg: "#fee2e2", color: "#991b1b" },
  disbursed: { bg: "#d1fae5", color: "#065f46" },
};

function LeadsDetails() {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLoanType, setFilterLoanType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const fetchData = async () => {
    setLoading(true);
    const [statsRes, appsRes] = await Promise.all([
      agentGetStats(),
      agentGetApplications(),
    ]);
    if (statsRes.success) setStats(statsRes.data);
    if (appsRes.success) setApplications(appsRes.data.applications || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const formatAmount = (amt) => {
    if (!amt) return "—";
    if (amt >= 10000000) return `₹${(amt / 10000000).toFixed(2)} Cr`;
    if (amt >= 100000) return `₹${(amt / 100000).toFixed(2)} L`;
    return `₹${Number(amt).toLocaleString("en-IN")}`;
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const handleViewDetails = async (app) => {
    const fullRes = await getApplicationById(app._id);
    setSelectedApp(fullRes.success ? fullRes.data.application : app);
    setShowUserModal(true);
  };

  const handleRecommendFromList = async (e, application) => {
    e.stopPropagation();
    if (!window.confirm('Recommend this application for admin approval?')) return;
    const res = await agentRecommend(application._id, 'Recommended from list');
    if (res?.success) {
      await fetchData();
      alert('Recommendation sent to admin');
    } else {
      alert(res?.error || 'Failed to recommend');
    }
  };

  const handleRequestDocsFromList = async (e, application) => {
    e.stopPropagation();
    const remarks = window.prompt('Enter remark for applicant (optional):', 'Please provide additional documents');
    if (remarks === null) return;
    const res = await agentRequestDocs(application._id, remarks || 'Additional documents required');
    if (res?.success) {
      await fetchData();
      alert('Document request sent');
    } else {
      alert(res?.error || 'Failed to request documents');
    }
  };

  // Filtering & Sorting
  const filtered = applications
    .filter((app) => {
      if (filterStatus !== "all" && app.status !== filterStatus) return false;
      if (filterLoanType !== "all" && app.loanType !== filterLoanType) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const name = (app.basicDetails?.fullName || `${app.user?.firstname || ""} ${app.user?.lastname || ""}`).toLowerCase();
        const id = (app.applicationId || "").toLowerCase();
        const mobile = (app.basicDetails?.mobile || "").toLowerCase();
        if (!name.includes(q) && !id.includes(q) && !mobile.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "amount_high") return (b.financialDetails?.loanAmount || 0) - (a.financialDetails?.loanAmount || 0);
      if (sortBy === "amount_low") return (a.financialDetails?.loanAmount || 0) - (b.financialDetails?.loanAmount || 0);
      return 0;
    });

  const statusStats = stats?.statusStats || {};
  const totalAssigned = stats?.totalAssigned || 0;
  const pendingReview = stats?.pendingReview || 0;
  const approvedCount = statusStats.approved || 0;
  const underReviewCount = statusStats.under_review || 0;
  const rejectedCount = statusStats.rejected || 0;
  const totalLoanValue = applications.reduce((sum, app) => sum + (app.financialDetails?.loanAmount || 0), 0);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <p style={{ color: "#6b7280" }}>Loading agent dashboard...</p>
      </Container>
    );
  }

  return (
    <div style={{ fontFamily: "Inter, Poppins, sans-serif", background: "#f8f9fc", minHeight: "100vh" }}>
      {/* Stats */}
      <Container className="pt-4">
        <Row className="g-3">
          {[
            { label: "Total Assigned", value: totalAssigned, bg: "#eff6ff", accent: "#1e40af" },
            { label: "Pending Review", value: pendingReview, bg: "#fef3c7", accent: "#92400e" },
            { label: "Under Review", value: underReviewCount, bg: "#dbeafe", accent: "#1e40af" },
            { label: "Approved", value: approvedCount, bg: "#dcfce7", accent: "#166534" },
            { label: "Rejected", value: rejectedCount, bg: "#fee2e2", accent: "#991b1b" },
            { label: "Portfolio Value", value: formatAmount(totalLoanValue), bg: "#f3e8ff", accent: "#6b21a8" },
          ].map((s, i) => (
            <Col md={2} sm={4} xs={6} key={i}>
              <Card style={{ border: "none", borderRadius: "10px", background: s.bg }}>
                <Card.Body style={{ padding: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: s.accent }}>{s.value}</div>
                  <div style={{ fontSize: "0.73rem", fontWeight: 600, color: "#6b7280" }}>{s.label}</div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Filters */}
      <Container className="mt-4">
        <Card style={{ border: "1px solid #e5e7eb", borderRadius: "10px" }}>
          <Card.Body style={{ padding: "16px 20px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
              <input
                type="text"
                placeholder="Search name, ID, mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: "8px 14px", border: "1.5px solid #d1d5db", borderRadius: "6px", fontSize: "0.84rem", width: "220px", outline: "none" }}
              />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                style={{ padding: "8px 12px", border: "1.5px solid #d1d5db", borderRadius: "6px", fontSize: "0.84rem", outline: "none" }}>
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="documents_pending">Docs Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="disbursed">Disbursed</option>
              </select>
              <select value={filterLoanType} onChange={(e) => setFilterLoanType(e.target.value)}
                style={{ padding: "8px 12px", border: "1.5px solid #d1d5db", borderRadius: "6px", fontSize: "0.84rem", outline: "none" }}>
                <option value="all">All Loan Types</option>
                <option value="PURCHASE">Home Loan</option>
                <option value="PLOT">Plot Loan</option>
                <option value="RENOVATION">Renovation</option>
                <option value="NRI">NRI Loan</option>
                <option value="BALANCE_TRANSFER">Balance Transfer</option>
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                style={{ padding: "8px 12px", border: "1.5px solid #d1d5db", borderRadius: "6px", fontSize: "0.84rem", outline: "none" }}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount_high">Amount: High to Low</option>
                <option value="amount_low">Amount: Low to High</option>
              </select>
              <div style={{ marginLeft: "auto", display: "flex", gap: "0" }}>
                <button onClick={() => setViewMode("table")}
                  style={{ padding: "7px 14px", border: "1.5px solid #d1d5db", borderRadius: "6px 0 0 6px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", background: viewMode === "table" ? "#0f2557" : "#fff", color: viewMode === "table" ? "#fff" : "#374151" }}>
                  Table
                </button>
                <button onClick={() => setViewMode("cards")}
                  style={{ padding: "7px 14px", border: "1.5px solid #d1d5db", borderRadius: "0 6px 6px 0", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", background: viewMode === "cards" ? "#0f2557" : "#fff", color: viewMode === "cards" ? "#fff" : "#374151" }}>
                  Cards
                </button>
              </div>
            </div>
            <div style={{ marginTop: "8px", fontSize: "0.78rem", color: "#6b7280" }}>
              Showing {filtered.length} of {applications.length} applications
            </div>
          </Card.Body>
        </Card>
      </Container>

      {/* Application List */}
      <Container className="mt-3 pb-5">
        {filtered.length === 0 ? (
          <Card style={{ border: "1px solid #e5e7eb", borderRadius: "10px" }}>
            <Card.Body className="text-center" style={{ padding: "60px", color: "#9ca3af" }}>
              <p style={{ fontSize: "1rem", fontWeight: 600 }}>No applications found</p>
              <p style={{ fontSize: "0.84rem" }}>Try adjusting your filters or search query</p>
            </Card.Body>
          </Card>
        ) : viewMode === "table" ? (
          <Card style={{ border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
            <Table responsive hover style={{ margin: 0, fontSize: "0.84rem" }}>
              <thead style={{ background: "#f8f9fa" }}>
                <tr>
                  {["Applicant", "Application ID", "Loan Type", "Amount", "Status", "Applied", "CIBIL", "Action"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", fontWeight: 700, color: "#374151" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => {
                  const appName = app.basicDetails?.fullName || `${app.user?.firstname || ""} ${app.user?.lastname || ""}`.trim() || "—";
                  // compute doc stats from application.documents
                  const docsObj = app.documents || {};
                  const docEntries = Object.entries(docsObj).filter(([k,v])=> v && (v.url || typeof v === 'string'));
                  const totalDocs = docEntries.length;
                  const verifiedDocs = docEntries.filter(([k,v]) => (v.status === 'verified')).length;
                  const allVerified = totalDocs > 0 && verifiedDocs === totalDocs;
                  return (
                    <tr key={app._id} style={{ cursor: "pointer" }} onClick={() => handleViewDetails(app)}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontWeight: 600, color: "#1f2937" }}>{appName}</div>
                        <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{app.basicDetails?.mobile || "—"}</div>
                      </td>
                      <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: "0.78rem", color: "#6b7280" }}>{app.applicationId}</td>
                      <td style={{ padding: "12px 16px", fontWeight: 600 }}>{LOAN_LABELS[app.loanType] || app.loanType}</td>
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: "#0f2557" }}>{formatAmount(app.financialDetails?.loanAmount)}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ padding: "4px 10px", borderRadius: "100px", fontSize: "0.72rem", fontWeight: 700, background: STATUS_COLORS[app.status]?.bg || "#f3f4f6", color: STATUS_COLORS[app.status]?.color || "#6b7280" }}>
                          {app.status?.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#6b7280" }}>{formatDate(app.createdAt)}</td>
                      <td style={{ padding: "12px 16px", fontWeight: 600 }}>{app.financialDetails?.cibilScore || "—"}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={(e) => { e.stopPropagation(); handleViewDetails(app); }}
                            style={{ padding: "5px 12px", background: "#0f2557", color: "#fff", border: "none", borderRadius: "5px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>
                            View Details
                          </button>
                          {allVerified ? (
                            <button onClick={(e) => handleRecommendFromList(e, app)} style={{ padding: '5px 12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 5, fontSize: '0.75rem', fontWeight: 600 }}>Recommend</button>
                          ) : (
                            <button onClick={(e) => handleRequestDocsFromList(e, app)} style={{ padding: '5px 12px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 5, fontSize: '0.75rem', fontWeight: 600 }}>Request Docs</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card>
        ) : (
          <Row className="g-3">
            {filtered.map((app) => {
              const appName = app.basicDetails?.fullName || `${app.user?.firstname || ""} ${app.user?.lastname || ""}`.trim() || "—";
              return (
                <Col lg={4} md={6} xs={12} key={app._id}>
                  <Card style={{ border: "1px solid #e5e7eb", borderRadius: "10px", cursor: "pointer" }} className="h-100 shadow-sm" onClick={() => handleViewDetails(app)}>
                    <Card.Body style={{ padding: "20px" }}>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "1rem", color: "#1f2937" }}>{appName}</div>
                          <div style={{ fontSize: "0.78rem", color: "#6b7280" }}>{app.basicDetails?.mobile || "—"}</div>
                        </div>
                        <span style={{ padding: "4px 10px", borderRadius: "100px", fontSize: "0.7rem", fontWeight: 700, background: STATUS_COLORS[app.status]?.bg || "#f3f4f6", color: STATUS_COLORS[app.status]?.color || "#6b7280" }}>
                          {app.status?.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.8rem", marginBottom: "12px" }}>
                        <div><div style={{ color: "#9ca3af", fontSize: "0.7rem", fontWeight: 600 }}>LOAN TYPE</div><div style={{ fontWeight: 600, color: "#374151" }}>{LOAN_LABELS[app.loanType] || app.loanType}</div></div>
                        <div><div style={{ color: "#9ca3af", fontSize: "0.7rem", fontWeight: 600 }}>AMOUNT</div><div style={{ fontWeight: 700, color: "#0f2557" }}>{formatAmount(app.financialDetails?.loanAmount)}</div></div>
                        <div><div style={{ color: "#9ca3af", fontSize: "0.7rem", fontWeight: 600 }}>CIBIL</div><div style={{ fontWeight: 600, color: "#374151" }}>{app.financialDetails?.cibilScore || "—"}</div></div>
                        <div><div style={{ color: "#9ca3af", fontSize: "0.7rem", fontWeight: 600 }}>APPLIED</div><div style={{ fontWeight: 600, color: "#374151" }}>{formatDate(app.createdAt)}</div></div>
                      </div>
                      <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.72rem", color: "#9ca3af", fontFamily: "monospace" }}>{app.applicationId}</span>
                        <span style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 700 }}>VIEW DETAILS</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>

      {/* Detail Modal */}
      <AgentUserDetails
        show={showUserModal}
        application={selectedApp}
        onClose={() => setShowUserModal(false)}
        onRefresh={async () => {
          if (selectedApp?._id) {
            const fullRes = await getApplicationById(selectedApp._id);
            if (fullRes.success) setSelectedApp(fullRes.data.application);
          }
          fetchData();
        }}
      />
    </div>
  );
}

export default LeadsDetails;
