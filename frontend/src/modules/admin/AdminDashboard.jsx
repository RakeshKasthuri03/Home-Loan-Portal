import React, { useState, useEffect, useRef } from "react";
import "../../styles/AdminDashboard.css";
import { adminGetStats, adminGetClosureRequests, adminCloseApplication } from "../../utils/loanApi";
import notify from '../../utils/notify';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [closureRequests, setClosureRequests] = useState([]);
  const prevClosureCountRef = useRef(0);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await adminGetStats();
      if (res.success) setStats(res.data);
      setLoading(false);
    };
    fetchStats();
    // Also fetch closure requests and notify admin (deduped)
    (async () => {
      try {
        const r = await adminGetClosureRequests();
        if (r.success) {
          const apps = r.data?.applications || [];
          setClosureRequests(apps);
          const prev = prevClosureCountRef.current || 0;
          if (apps.length > prev) {
            notify.warn(`⚠️ ${apps.length} loan closure request(s) received`, { id: 'closure-requests', position: 'top-right', duration: 7000 });
          }
          prevClosureCountRef.current = apps.length;
        }
      } catch (err) {
        console.error('Failed to fetch closure requests', err);
      }
    })();
  }, []);

  if (loading) return <div className="UserDashboard"><div className="dashboard-layout"><main className="dashboard-content"><p>Loading dashboard...</p></main></div></div>;

  const statusStats = stats?.statusStats || {};
  const loanTypeStats = stats?.loanTypeStats || {};
  const totalApplications = stats?.totalApplications || 0;
  const pendingCount = (statusStats.submitted || 0) + (statusStats.under_review || 0);
  const docsPendingCount = statusStats.documents_pending || 0;
  const approvedCount = statusStats.approved || 0;
  const rejectedCount = statusStats.rejected || 0;
  const disbursedCount = statusStats.disbursed || 0;
  const draftCount = statusStats.draft || 0;

  const formatAmount = (amt) => {
    if (!amt) return "₹0";
    if (amt >= 10000000) return `₹${(amt / 10000000).toFixed(1)} Cr`;
    if (amt >= 100000) return `₹${(amt / 100000).toFixed(1)} L`;
    return `₹${amt.toLocaleString()}`;
  };

  const loanTypeConfig = {
    PURCHASE: { label: "Home Loan", dot: "blue", rate: "8.5% p.a.", max: "₹5 Cr", tenure: "30 years" },
    PLOT: { label: "Plot Loan", dot: "green", rate: "9.0% p.a.", max: "₹3 Cr", tenure: "20 years" },
    RENOVATION: { label: "Renovation Loan", dot: "orange", rate: "9.5% p.a.", max: "₹50 L", tenure: "15 years" },
    NRI: { label: "NRI Loan", dot: "purple", rate: "8.8% p.a.", max: "₹5 Cr", tenure: "25 years" },
    BALANCE_TRANSFER: { label: "Balance Transfer", dot: "blue", rate: "8.3% p.a.", max: "₹5 Cr", tenure: "30 years" },
  };

  return (
    <div className="UserDashboard">
      <div className="dashboard-layout">
        <main className="dashboard-content">
          {/* STATS CARDS */}
          <div className="stats admin-stats">
            <div className="user-stat-card admin-stat-card">
              <h4>Total Applications</h4>
              <div className="stat-number">{totalApplications}</div>
            </div>
            <div className="user-stat-card admin-stat-card">
              <h4>Drafts</h4>
              <div className="stat-number" style={{ color: "#6b7280" }}>{draftCount}</div>
            </div>
            <div className="user-stat-card admin-stat-card">
              <h4>Pending Review</h4>
              <div className="stat-number orange">{pendingCount}</div>
            </div>
            <div className="user-stat-card admin-stat-card">
              <h4>Docs Pending</h4>
              <div className="stat-number" style={{ color: "#d97706" }}>{docsPendingCount}</div>
            </div>
            <div className="user-stat-card admin-stat-card">
              <h4>Approved</h4>
              <div className="stat-number green">{approvedCount}</div>
            </div>
            <div className="user-stat-card admin-stat-card">
              <h4>Rejected</h4>
              <div className="stat-number red">{rejectedCount}</div>
            </div>
            <div className="user-stat-card admin-stat-card">
              <h4>Disbursed</h4>
              <div className="stat-number" style={{ color: "#0f4c8a" }}>{disbursedCount}</div>
            </div>
          </div>

          {/* LOAN TYPE CONFIGURATION */}
          <div className="loan-config-section">
            <div className="loan-config-header">
              <h3>Loan Type Overview</h3>
            </div>
            <div className="admin-table-scroll">
            <table className="loan-config-table">
              <thead>
                <tr>
                  <th>Loan Type</th>
                  <th>Interest Rate</th>
                  <th>Max Amount</th>
                  <th>Max Tenure</th>
                  <th>Applications</th>
                  <th>Total Disbursed</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(loanTypeConfig).map(([key, cfg]) => (
                  <tr key={key}>
                    <td><span className={`loan-dot ${cfg.dot}`}></span> {cfg.label}</td>
                    <td>{cfg.rate}</td>
                    <td>{cfg.max}</td>
                    <td>{cfg.tenure}</td>
                    <td>{loanTypeStats[key]?.count || 0}</td>
                    <td>{formatAmount(loanTypeStats[key]?.totalAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          {/* USER ACTIONS: Closure Requests */}
          {closureRequests?.length > 0 && (
            <div className="loan-config-section">
              <div className="loan-config-header">
                <h3>User Actions</h3>
                <p className="muted">Pending closure requests from users</p>
              </div>
              <div className="admin-table-scroll">
              <table className="loan-config-table">
                <thead>
                  <tr>
                    <th>Application ID</th>
                    <th>Applicant</th>
                    <th>Requested At</th>
                    <th>Preferred Date</th>
                    <th>Reason</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {closureRequests.map((app) => (
                    <tr key={app._id}>
                      <td>{app.applicationId || app._id}</td>
                      <td>{app.basicDetails?.fullName || '—'}</td>
                      <td>{app.documents?.foreclosureLetter?.requestedAt ? new Date(app.documents.foreclosureLetter.requestedAt).toLocaleString() : '—'}</td>
                      <td>{app.documents?.foreclosureLetter?.preferredDate || '—'}</td>
                      <td style={{ maxWidth: 300 }}>{app.documents?.foreclosureLetter?.reason || '—'}</td>
                      <td>
                        <a className="btn small" href={`/admin/applications?openClose=${app._id}`}>Open</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          )}

          {/* RECENT APPLICATIONS */}
          {stats?.recentApplications?.length > 0 && (
            <div className="loan-config-section">
              <div className="loan-config-header">
                <h3>Recent Applications</h3>
              </div>
              <div className="admin-table-scroll">
              <table className="loan-config-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Applicant</th>
                    <th>Loan Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentApplications.map((app) => (
                    <tr key={app._id}>
                      <td>{app.applicationId}</td>
                      <td>{app.basicDetails?.fullName || "—"}</td>
                      <td>{loanTypeConfig[app.loanType]?.label || app.loanType}</td>
                      <td>{formatAmount(app.financialDetails?.loanAmount)}</td>
                      <td><span className={`status ${app.status}`}>{app.status.replace(/_/g, ' ')}</span></td>
                      <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
