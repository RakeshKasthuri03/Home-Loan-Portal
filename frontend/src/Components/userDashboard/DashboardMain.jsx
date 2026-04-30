import { useNavigate } from "react-router-dom";

export default function DashboardMain({ dashboardData }) {
  const { user, stats, activeApplication, activities } = dashboardData;
  const navigate = useNavigate();

  return (
    <div className="dashboard-main">


      {/* Stats */}
      <div className="stats">
        {stats.map((item, index) => (
          <div className="user-stat-card" key={index}>
            <h4>{item.title}</h4>
            <p className={`stat-number ${item.color ?? ""}`}>
              {item.value}
            </p>
            <span>{item.note}</span>
          </div>
        ))}
      </div>

      {/* Active Application */}
      <div className="application-card">
        <h3>Active application</h3>
        {activeApplication ? (
          <>
            <p><strong>Application #{activeApplication.id}</strong></p>
            <p>{activeApplication.loanType} — {activeApplication.amount}</p>
            <p>Officer: {activeApplication.officer} · Agent: {activeApplication.agent}</p>
            <div className="steps">
              {activeApplication.steps.map((step, index) => (
                <span
                  key={index}
                  className={step.status === "done" ? "done" : step.status === "current" ? "current" : ""}
                >
                  {step.step ? `${step.step} ` : ""}{step.label}
                </span>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#6b7280" }}>
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📋</div>
            <p style={{ margin: 0, fontWeight: 600 }}>No active applications yet</p>
            <p style={{ margin: "4px 0 16px", fontSize: "0.85rem" }}>Start your home loan journey today</p>
          </div>
        )}
      </div>

    </div>
  );
}
