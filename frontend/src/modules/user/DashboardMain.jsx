import { useNavigate } from "react-router-dom";

export default function DashboardMain({ dashboardData }) {
  const { user, stats, activeApplication, activities } = dashboardData;
  const navigate = useNavigate();

  return (
    <div className="dashboard-main">

      {/* Welcome */}
      <div className="welcome-card">
        <div>
          <h2>Welcome back, {user.name} 👋</h2>
          <p>Manage your home loan applications and track your progress here.</p>
        </div>
        <div>
          <button className="outline-btn" onClick={() => navigate("/dashboard/loan-tracker")}>
            Track Loan
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats">
        {stats.map((item, index) => (
          <div className="user-stat-card" key={index}>
            <h4>{item.title}</h4>
            <p className={`stat-number ${item.color ?? ""}`}>{item.value}</p>
            <span>{item.note}</span>
          </div>
        ))}
      </div>

      {/* Active Application */}
      <div className="application-card">
        <h3>Active application</h3>
        {activeApplication ? (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div>
                <p style={{ margin:0 }}><strong>Application #{activeApplication.id}</strong></p>
                <p style={{ margin:"4px 0 0", color:"#6b7280", fontSize:"0.88rem" }}>{activeApplication.loanType} — {activeApplication.amount}</p>
                <p style={{ margin:"4px 0 0", color:"#6b7280", fontSize:"0.85rem" }}>Agent: {activeApplication.officer}</p>
              </div>
              <span style={{
                padding:"3px 12px", borderRadius:12, fontSize:"0.8rem", fontWeight:700,
                background: activeApplication.status==="approved"?"#dbeafe": activeApplication.status==="disbursed"?"#dcfce7": activeApplication.status==="documents_pending"?"#fee2e2":"#fef9c3",
                color:      activeApplication.status==="approved"?"#1d4ed8": activeApplication.status==="disbursed"?"#15803d": activeApplication.status==="documents_pending"?"#dc2626":"#92400e",
              }}>
                {activeApplication.status.replace(/_/g," ")}
              </span>
              {activeApplication.foreclosureStatus && (
                <div style={{ marginTop: 8 }}>
                  <span style={{ padding:"4px 10px", borderRadius:10, fontSize:"0.72rem", fontWeight:700, background: activeApplication.foreclosureStatus === 'pending' ? '#fef9c3' : '#e6f0ff', color: activeApplication.foreclosureStatus === 'pending' ? '#92400e' : '#075985' }}>
                    {activeApplication.foreclosureStatus.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="steps">
              {activeApplication.steps.map((step, index) => (
                <span key={index} className={step.status === "done" ? "done" : step.status === "current" ? "current" : ""}>
                  {step.label}
                </span>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#6b7280" }}>
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📋</div>
            <p style={{ margin: 0, fontWeight: 600 }}>No active applications yet</p>
            <p style={{ margin: "4px 0 16px", fontSize: "0.85rem" }}>Start your home loan journey today</p>
            <button className="primary-btn" onClick={() => navigate("/loan-types")}>
              Apply for a loan →
            </button>
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="bottom-grid">
        <div>
          <h3>Quick actions</h3>
          <ul>
            <li style={{ cursor: "pointer" }} onClick={() => navigate("/loan-types")}>🏠 Apply for a loan</li>
            <li style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard/mydocuments")}>📄 Upload documents</li>
            <li style={{ cursor: "pointer" }} onClick={() => navigate("/calculator/emi")}>🧮 EMI calculator</li>
            <li style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard/loan-tracker")}>🔁 Track my loan</li>
          </ul>
        </div>
        <div>
          <h3>Recent activity</h3>
          <ul className="activity">
            {activities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}
