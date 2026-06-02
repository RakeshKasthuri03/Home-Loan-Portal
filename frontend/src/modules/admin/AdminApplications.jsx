import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/AdminDashboard.css";
import { getToken } from "../../utils/auth";
import {
  adminGetAllApplications,
  adminAssignAgent,
  adminApproveApplication,
  adminRejectApplication,
} from "../../utils/loanApi";

function AdminApplications() {
  const [activeTab, setActiveTab] = useState("All");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [agents, setAgents] = useState([]);
  const [assignModal, setAssignModal] = useState(null); // applicationId to assign
  const [selectedApplication, setSelectedApplication] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    const res = await adminGetAllApplications();
    if (res.success) {
      setApplications(res.data.applications || []);
    }
    setLoading(false);
  };

  useEffect(() => { 
    fetchApplications(); 
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:5000/api/agent", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgents(Array.isArray(res.data) ? res.data : res.data.agents || []);
    } catch (err) {
      console.error("Failed to fetch agents:", err);
    }
  };

  const statusMap = {
    All: null,
    Draft: "draft",
    Submitted: "submitted",
    "Under Review": "under_review",
    "Docs Pending": "documents_pending",
    Approved: "approved",
    Rejected: "rejected",
    Disbursed: "disbursed",
    Closed: "closed",
  };

  const tabStatuses = ["All", "Draft", "Submitted", "Under Review", "Docs Pending", "Approved", "Rejected", "Disbursed", "Closed"];

  // Count per tab
  const getCount = (tab) => {
    if (tab === "All") return applications.length;
    return applications.filter((a) => a.status === statusMap[tab]).length;
  };

  const filteredApplications = applications.filter((app) => {
    const matchTab = activeTab === "All" || app.status === statusMap[activeTab];
    const matchSearch = !searchTerm || 
      (app.applicationId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.basicDetails?.fullName || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchTab && matchSearch;
  });

  const loanTypeLabels = {
    PURCHASE: "Home Loan",
    PLOT: "Plot Loan",
    RENOVATION: "Renovation Loan",
    NRI: "NRI Loan",
    BALANCE_TRANSFER: "Balance Transfer",
  };

  const formatAmount = (amt) => {
    if (!amt) return "—";
    if (amt >= 10000000) return `₹${(amt / 10000000).toFixed(1)} Cr`;
    if (amt >= 100000) return `₹${(amt / 100000).toFixed(1)} L`;
    return `₹${amt.toLocaleString()}`;
  };

  const handleApprove = async (id) => {
    const remarks = prompt("Enter approval remarks (optional):");
    setActionLoading(id);
    const res = await adminApproveApplication(id, remarks || "");
    setActionLoading(null);
    if (res.success) fetchApplications();
    else alert(res.error);
  };

  const handleReject = async (id) => {
    const remarks = prompt("Enter rejection reason:");
    if (!remarks) return;
    setActionLoading(id);
    const res = await adminRejectApplication(id, remarks);
    setActionLoading(null);
    if (res.success) fetchApplications();
    else alert(res.error);
  };

  const handleAssign = async (appId, agentId) => {
    setActionLoading(appId);
    const res = await adminAssignAgent(appId, agentId);
    setActionLoading(null);
    setAssignModal(null);
    if (res.success) fetchApplications();
    else alert(res.error);
  };

  return (
    <div className="UserDashboard">
      <div className="dashboard-layout">
        <main className="dashboard-content">
          {/* Search */}
          <div className="admin-app-header">
            <input
              type="text"
              className="apps-search"
              placeholder="Search by name / ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <div className="apps-tabs">
            {tabStatuses.map((tab) => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab} ({getCount(tab)})
              </button>
            ))}
          </div>

          {/* Applications Table */}
          {loading ? (
            <p>Loading applications...</p>
          ) : (
            <table className="apps-table">
              <thead>
                <tr>
                  <th>App ID</th>
                  <th>Applicant</th>
                  <th>Loan Type</th>
                  <th>Amount</th>
                  <th>Agent</th>
                  <th>Agent Note</th>
                  <th>Applied</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length === 0 ? (
                  <tr><td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>No applications found</td></tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr key={app._id}>
                      <td className="link">{app.applicationId}</td>
                      <td>{app.basicDetails?.fullName || "—"}</td>
                      <td>{loanTypeLabels[app.loanType] || app.loanType}</td>
                      <td>{formatAmount(app.financialDetails?.loanAmount)}</td>
                      <td>
                        {app.assignedAgent ? (
                          `${app.assignedAgent.firstname || ""} ${app.assignedAgent.lastname || ""}`.trim() || app.assignedAgent.agentid || app.assignedAgent._id
                        ) : (
                          <span style={{ color: "#9ca3af" }}>Unassigned</span>
                        )}
                      </td>
                      <td>
                        {app.processing?.remarks && app.processing.remarks.length > 0 ? (
                          (() => {
                            const rec = [...app.processing.remarks].reverse().find(r => typeof r.text === 'string' && r.text.toLowerCase().includes('agent recommendation'));
                            if (rec) return <div style={{ fontSize: '0.85rem', color: '#0f2557', fontWeight: 600 }}>{rec.text}</div>;
                            return <span style={{ color: '#6b7280' }}>—</span>;
                          })()
                        ) : (
                          <span style={{ color: '#6b7280' }}>—</span>
                        )}
                      </td>
                      <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status ${app.status}`}>
                          {app.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td>
                        {actionLoading === app._id ? (
                          <span>...</span>
                        ) : app.status === "submitted" || app.status === "under_review" ? (
                          <>
                            <button className="approve" onClick={() => handleApprove(app._id)}>Approve</button>
                            <button className="reject" onClick={() => handleReject(app._id)}>Reject</button>
                            {!app.assignedAgent && (
                              <span className="link-only" onClick={() => setAssignModal(app._id)}>Assign</span>
                            )}
                          </>
                        ) : app.status === "draft" ? (
                          <span style={{ color: "#9ca3af" }}>Draft</span>
                        ) : (
                            <span className="link-only" onClick={() => setSelectedApplication(app)}>View</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </main>
      </div>

          {/* View Application Modal */}
          {selectedApplication && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '28px 32px', width: '100%', maxWidth: '700px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f2557' }}>Application Details</h3>
                    <p style={{ margin: '6px 0 0', color: '#6b7280' }}>{selectedApplication.applicationId}</p>
                  </div>
                  <button onClick={() => setSelectedApplication(null)} style={{ border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}>×</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <strong>Applicant</strong>
                    <p style={{ margin: '6px 0 0' }}>{selectedApplication.basicDetails?.fullName || '—'}</p>
                  </div>
                  <div>
                    <strong>Loan Type</strong>
                    <p style={{ margin: '6px 0 0' }}>{loanTypeLabels[selectedApplication.loanType] || selectedApplication.loanType || '—'}</p>
                  </div>
                  <div>
                    <strong>Amount</strong>
                    <p style={{ margin: '6px 0 0' }}>{formatAmount(selectedApplication.financialDetails?.loanAmount)}</p>
                  </div>
                  <div>
                    <strong>Agent</strong>
                    <p style={{ margin: '6px 0 0' }}>
                      {selectedApplication.assignedAgent ? `${selectedApplication.assignedAgent.firstname || ''} ${selectedApplication.assignedAgent.lastname || ''}`.trim() || selectedApplication.assignedAgent.agentid || selectedApplication.assignedAgent._id : 'Unassigned'}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <strong>Status</strong>
                    <p style={{ margin: '6px 0 0' }}>{selectedApplication.status.replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <strong>Applied</strong>
                    <p style={{ margin: '6px 0 0' }}>{new Date(selectedApplication.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <strong>Phone</strong>
                    <p style={{ margin: '6px 0 0' }}>{selectedApplication.basicDetails?.mobile || '—'}</p>
                  </div>
                  <div>
                    <strong>Email</strong>
                    <p style={{ margin: '6px 0 0' }}>{selectedApplication.basicDetails?.email || '—'}</p>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '18px' }}>
                  <strong>Processing Remarks</strong>
                  {selectedApplication.processing?.remarks?.length > 0 ? (
                    <ul style={{ marginTop: '10px', paddingLeft: '18px', color: '#374151' }}>
                      {selectedApplication.processing.remarks.map((remark, index) => (
                        <li key={index} style={{ marginBottom: '8px' }}>
                          {remark.text} {remark.date ? `(${new Date(remark.date).toLocaleString()})` : ''}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ margin: '10px 0 0', color: '#6b7280' }}>No remarks yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

      {/* Assign Agent Modal */}
      {assignModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", borderRadius: "12px", padding: "28px 32px", width: "100%", maxWidth: "420px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "1.1rem", color: "#0f2557" }}>Assign Agent</h3>
            {agents.length === 0 ? (
              <p style={{ color: "#6b7280" }}>No agents available. Please add agents first.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {agents.map((agent) => (
                  <button
                    key={agent._id}
                    onClick={() => handleAssign(assignModal, agent._id)}
                    disabled={actionLoading === assignModal}
                    style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", border: "1.5px solid #e5e7eb", borderRadius: "8px", background: "#f9fafb", cursor: "pointer", textAlign: "left", fontSize: "0.9rem" }}
                  >
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#0f2557", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8rem" }}>
                      {(agent.name || agent.agentid || "A")[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: "#1f2937" }}>{agent.name || agent.agentid}</div>
                      <div style={{ fontSize: "0.78rem", color: "#6b7280" }}>{agent.email || agent.agentid}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => setAssignModal(null)}
              style={{ marginTop: "18px", width: "100%", padding: "10px", border: "1.5px solid #d1d5db", borderRadius: "8px", background: "#fff", cursor: "pointer", fontWeight: 600, color: "#374151" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminApplications;
